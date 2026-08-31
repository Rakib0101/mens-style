import "server-only";
import { eq, asc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { products, type Product } from "@/lib/db/schema";

export async function getFlagshipProduct(): Promise<Product | null> {
  const rows = await getDb()
    .select()
    .from(products)
    .where(eq(products.isFlagship, true))
    .limit(1);
  return rows[0] ?? null;
}

export async function getRelatedProducts(): Promise<Product[]> {
  return getDb()
    .select()
    .from(products)
    .where(eq(products.isFlagship, false))
    .orderBy(asc(products.sortOrder));
}

export async function getAllProducts(): Promise<Product[]> {
  return getDb().select().from(products).orderBy(asc(products.sortOrder));
}

export async function getProductById(id: number): Promise<Product | null> {
  const rows = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await getDb().select().from(products).where(eq(products.slug, slug)).limit(1);
  return rows[0] ?? null;
}
