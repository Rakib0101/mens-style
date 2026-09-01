"use server";

import { eq, count } from "drizzle-orm";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { products, users, type OrderStatus } from "@/lib/db/schema";
import { updateOrderStatus } from "@/lib/orders";
import { updateSiteSettings } from "@/lib/settings";
import {
  createSession,
  destroySession,
  hashPassword,
  requireAdminRole,
  requireUser,
  verifyCredentials,
} from "@/lib/auth";

const ORDER_STATUSES: OrderStatus[] = ["pending", "confirmed", "delivered", "cancelled"];

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  const user = await verifyCredentials(username, password);
  if (!user) {
    redirect("/admin/login?error=1");
  }

  await createSession(user);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function createUserAction(formData: FormData) {
  await requireAdminRole();
  const db = getDb();

  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const role = formData.get("role") === "admin" ? "admin" : "staff";

  if (!username || !password) {
    redirect("/admin/users?error=missing");
  }

  const existing = await db.select().from(users).where(eq(users.username, username)).limit(1);
  if (existing.length > 0) {
    redirect("/admin/users?error=exists");
  }

  await db.insert(users).values({
    username,
    passwordHash: await hashPassword(password),
    role,
  });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUserAction(id: number) {
  const session = await requireAdminRole();
  const db = getDb();

  if (session.userId === id) {
    redirect("/admin/users?error=self");
  }

  const target = await db.select().from(users).where(eq(users.id, id)).limit(1);
  if (target[0]?.role === "admin") {
    const [{ value: adminCount }] = await db
      .select({ value: count() })
      .from(users)
      .where(eq(users.role, "admin"));
    if (adminCount <= 1) {
      redirect("/admin/users?error=lastadmin");
    }
  }

  await db.delete(users).where(eq(users.id, id));
  revalidatePath("/admin/users");
  redirect("/admin/users");
}

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || `product-${Date.now()}`
  );
}

async function uploadNewImages(files: FormDataEntryValue[]) {
  const urls: string[] = [];
  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    const blob = await put(`products/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    });
    urls.push(blob.url);
  }
  return urls;
}

function readRows(
  formData: FormData,
  fields: string[],
): Record<string, string>[] {
  const columns = fields.map((f) => formData.getAll(f).map((v) => String(v)));
  const rowCount = Math.max(0, ...columns.map((c) => c.length));
  const rows: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row: Record<string, string> = {};
    let hasValue = false;
    fields.forEach((field, colIndex) => {
      const value = (columns[colIndex][i] || "").trim();
      row[field] = value;
      if (value) hasValue = true;
    });
    if (hasValue) rows.push(row);
  }
  return rows;
}

function readProductFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const subtitle = String(formData.get("subtitle") || "").trim();
  const price = Number(formData.get("price") || 0);
  const comparePriceRaw = String(formData.get("comparePrice") || "").trim();
  const sizes = String(formData.get("sizes") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const ratingValue = Number(formData.get("ratingValue") || 4.9);
  const ratingCount = Number(formData.get("ratingCount") || 0);
  const isFlagship = formData.get("isFlagship") === "on";

  const colors = readRows(formData, ["colorName", "colorHex"]).map((r) => ({
    name: r.colorName,
    hex: r.colorHex || "#1c1c1c",
  }));
  const specs = readRows(formData, ["specLabel", "specValue"]).map((r) => ({
    label: r.specLabel,
    value: r.specValue,
  }));
  const sizeChart = readRows(formData, [
    "sizeChartSize",
    "sizeChartChest",
    "sizeChartLength",
    "sizeChartShoulder",
  ]).map((r) => ({
    size: r.sizeChartSize,
    chest: r.sizeChartChest,
    length: r.sizeChartLength,
    shoulder: r.sizeChartShoulder,
  }));
  const whyChooseUs = readRows(formData, ["whyNumber", "whyTitle", "whyDesc"]).map((r) => ({
    number: r.whyNumber,
    title: r.whyTitle,
    desc: r.whyDesc,
  }));

  const heroCtaLabel = String(formData.get("heroCtaLabel") || "").trim();
  const qualityBannerTitle = String(formData.get("qualityBannerTitle") || "").trim();
  const qualityBannerDesc = String(formData.get("qualityBannerDesc") || "").trim();
  const qualityBannerBadges = String(formData.get("qualityBannerBadges") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const showQualityBanner = formData.get("showQualityBanner") === "on";
  const showRelatedProducts = formData.get("showRelatedProducts") === "on";

  return {
    title,
    subtitle,
    price,
    comparePrice: comparePriceRaw ? Number(comparePriceRaw) : null,
    sizes,
    ratingValue,
    ratingCount,
    isFlagship,
    colors,
    specs,
    sizeChart,
    whyChooseUs,
    heroCtaLabel,
    qualityBannerTitle,
    qualityBannerDesc,
    qualityBannerBadges,
    showQualityBanner,
    showRelatedProducts,
  };
}

export async function createProductAction(formData: FormData) {
  await requireUser();
  const db = getDb();

  const fields = readProductFields(formData);
  const newImages = await uploadNewImages(formData.getAll("images"));
  const qualityBannerImage = await uploadSingleImage(formData.get("qualityBannerImage"), "");
  const slug = slugify(fields.title);

  if (fields.isFlagship) {
    await db.update(products).set({ isFlagship: false }).where(eq(products.isFlagship, true));
  }

  await db.insert(products).values({
    slug,
    title: fields.title,
    subtitle: fields.subtitle,
    price: fields.price,
    comparePrice: fields.comparePrice,
    images: newImages,
    sizes: fields.sizes,
    colors: fields.colors,
    specs: fields.specs,
    sizeChart: fields.sizeChart,
    ratingValue: fields.ratingValue,
    ratingCount: fields.ratingCount,
    isFlagship: fields.isFlagship,
    whyChooseUs: fields.whyChooseUs,
    heroCtaLabel: fields.heroCtaLabel || undefined,
    qualityBannerTitle: fields.qualityBannerTitle,
    qualityBannerDesc: fields.qualityBannerDesc,
    qualityBannerBadges: fields.qualityBannerBadges,
    qualityBannerImage,
    showQualityBanner: fields.showQualityBanner,
    showRelatedProducts: fields.showRelatedProducts,
  });

  revalidatePath("/");
  revalidatePath("/products", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateProductAction(id: number, formData: FormData) {
  await requireUser();
  const db = getDb();

  const fields = readProductFields(formData);
  const keepImages = formData.getAll("keepImages").map((v) => String(v));
  const newImages = await uploadNewImages(formData.getAll("images"));
  const images = [...keepImages, ...newImages];
  const currentBannerImage = String(formData.get("currentQualityBannerImage") || "");
  const qualityBannerImage = await uploadSingleImage(
    formData.get("qualityBannerImage"),
    currentBannerImage,
  );

  if (fields.isFlagship) {
    await db
      .update(products)
      .set({ isFlagship: false })
      .where(eq(products.isFlagship, true));
  }

  await db
    .update(products)
    .set({
      title: fields.title,
      subtitle: fields.subtitle,
      price: fields.price,
      comparePrice: fields.comparePrice,
      images,
      sizes: fields.sizes,
      colors: fields.colors,
      specs: fields.specs,
      sizeChart: fields.sizeChart,
      ratingValue: fields.ratingValue,
      ratingCount: fields.ratingCount,
      isFlagship: fields.isFlagship,
      whyChooseUs: fields.whyChooseUs,
      heroCtaLabel: fields.heroCtaLabel || undefined,
      qualityBannerTitle: fields.qualityBannerTitle,
      qualityBannerDesc: fields.qualityBannerDesc,
      qualityBannerBadges: fields.qualityBannerBadges,
      qualityBannerImage,
      showQualityBanner: fields.showQualityBanner,
      showRelatedProducts: fields.showRelatedProducts,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/products", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProductAction(id: number) {
  await requireUser();
  await getDb().delete(products).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/products", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function setFlagshipAction(id: number) {
  await requireUser();
  const db = getDb();
  await db.update(products).set({ isFlagship: false }).where(eq(products.isFlagship, true));
  await db.update(products).set({ isFlagship: true }).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/products", "layout");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateOrderStatusAction(id: number, formData: FormData) {
  await requireUser();
  const status = String(formData.get("status") || "");
  if (!ORDER_STATUSES.includes(status as OrderStatus)) {
    redirect("/admin/orders");
  }
  await updateOrderStatus(id, status as OrderStatus);
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}

async function uploadSingleImage(file: FormDataEntryValue | null, fallback: string) {
  if (!(file instanceof File) || file.size === 0) return fallback;
  const blob = await put(`settings/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}

export async function updateSettingsAction(formData: FormData) {
  await requireAdminRole();

  const phones = String(formData.get("phones") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const address = String(formData.get("address") || "").trim();
  const facebookUrl = String(formData.get("facebookUrl") || "").trim();

  const deliveryZones = readRows(formData, ["zoneLabel", "zoneCharge"]).map((r) => ({
    label: r.zoneLabel,
    charge: Number(r.zoneCharge) || 0,
  }));

  await updateSiteSettings({
    phones,
    address,
    facebookUrl,
    deliveryZones,
  });

  revalidatePath("/");
  revalidatePath("/products", "layout");
  revalidatePath("/admin/settings");
  redirect("/admin/settings");
}
