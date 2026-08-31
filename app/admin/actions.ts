"use server";

import { eq, count } from "drizzle-orm";
import { put } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { products, users } from "@/lib/db/schema";
import {
  createSession,
  destroySession,
  hashPassword,
  requireAdminRole,
  requireUser,
  verifyCredentials,
} from "@/lib/auth";

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
  };
}

export async function createProductAction(formData: FormData) {
  await requireUser();
  const db = getDb();

  const fields = readProductFields(formData);
  const newImages = await uploadNewImages(formData.getAll("images"));
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
  });

  revalidatePath("/");
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
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteProductAction(id: number) {
  await requireUser();
  await getDb().delete(products).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function setFlagshipAction(id: number) {
  await requireUser();
  const db = getDb();
  await db.update(products).set({ isFlagship: false }).where(eq(products.isFlagship, true));
  await db.update(products).set({ isFlagship: true }).where(eq(products.id, id));
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}
