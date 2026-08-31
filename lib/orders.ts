import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { orders, type Order, type OrderStatus, type NewOrder } from "@/lib/db/schema";

export async function getAllOrders(): Promise<Order[]> {
  return getDb().select().from(orders).orderBy(desc(orders.createdAt));
}

export async function createOrder(order: Omit<NewOrder, "id" | "status" | "createdAt">) {
  await getDb().insert(orders).values(order);
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  await getDb().update(orders).set({ status }).where(eq(orders.id, id));
}
