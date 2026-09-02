import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { orders, type Order, type OrderStatus, type NewOrder } from "@/lib/db/schema";

export async function getAllOrders(): Promise<Order[]> {
  return getDb().select().from(orders).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number): Promise<Order | null> {
  const rows = await getDb().select().from(orders).where(eq(orders.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createOrder(order: Omit<NewOrder, "id" | "status" | "createdAt">) {
  await getDb().insert(orders).values(order);
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  await getDb().update(orders).set({ status }).where(eq(orders.id, id));
}

export type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  statusCounts: Record<OrderStatus, number>;
  dailyOrders: { date: string; count: number }[];
  recentOrders: Order[];
};

export async function getOrderStats(days = 14): Promise<OrderStats> {
  const allOrders = await getAllOrders();

  const statusCounts: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 0,
    delivered: 0,
    cancelled: 0,
  };
  let totalRevenue = 0;
  for (const order of allOrders) {
    statusCounts[order.status]++;
    if (order.status !== "cancelled") totalRevenue += order.totalPrice;
  }

  const dailyOrders: { date: string; count: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyOrders.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  const bucketByDate = new Map(dailyOrders.map((b) => [b.date, b]));
  for (const order of allOrders) {
    const key = new Date(order.createdAt).toISOString().slice(0, 10);
    const bucket = bucketByDate.get(key);
    if (bucket) bucket.count++;
  }

  return {
    totalOrders: allOrders.length,
    totalRevenue,
    statusCounts,
    dailyOrders,
    recentOrders: allOrders.slice(0, 8),
  };
}
