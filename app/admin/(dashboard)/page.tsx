import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getOrderStats } from "@/lib/orders";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import StatTile from "@/components/admin/StatTile";
import OrdersBarChart from "@/components/admin/OrdersBarChart";
import OrderStatusDonut from "@/components/admin/OrderStatusDonut";
import FulfillmentMeter from "@/components/admin/FulfillmentMeter";

const STATUS_PILL: Record<string, string> = {
  pending: "bg-[#fab219]/15 text-[#8a6100]",
  confirmed: "bg-[#2a78d6]/10 text-[#2a78d6]",
  delivered: "bg-[#0ca30c]/10 text-[#0ca30c]",
  cancelled: "bg-[#d03b3b]/10 text-[#d03b3b]",
};

export default async function AdminOverviewPage() {
  await requireUser();

  const [stats, allProducts] = await Promise.all([getOrderStats(14), getAllProducts()]);

  return (
    <div className="px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-lg font-bold text-ink">Dashboard</h1>

      <div className="mx-auto max-w-5xl space-y-5">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Total orders" value={String(stats.totalOrders)} />
          <StatTile
            label="Revenue"
            value={formatPrice(stats.totalRevenue)}
            sublabel="from delivered orders"
          />
          <StatTile label="Pending orders" value={String(stats.statusCounts.pending)} />
          <StatTile label="Products" value={String(allProducts.length)} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <OrdersBarChart data={stats.dailyOrders} />
          </div>
          <div className="space-y-5">
            <FulfillmentMeter
              delivered={stats.statusCounts.delivered}
              total={stats.totalOrders}
            />
            <OrderStatusDonut counts={stats.statusCounts} />
          </div>
        </div>

        <section className="rounded-xl border border-surface-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">Recent orders</p>
            <Link href="/admin/orders" className="text-xs font-medium text-brand hover:underline">
              View all
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink/50">No orders yet.</p>
          ) : (
            <div className="divide-y divide-surface-line">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 py-3 hover:bg-surface-muted"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{order.productTitle}</p>
                    <p className="truncate text-xs text-ink/50">
                      {order.customerName} &middot; {order.customerPhone}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_PILL[order.status] ?? ""}`}
                  >
                    {order.status}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-ink">
                    {formatPrice(order.totalPrice)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
