import "server-only";
import { eq, ne, asc } from "drizzle-orm";
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

/** Every other product, for the "related styles" section on a product's own page. */
export async function getOtherProducts(excludeSlug: string): Promise<Product[]> {
  return getDb()
    .select()
    .from(products)
    .where(ne(products.slug, excludeSlug))
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
