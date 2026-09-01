import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { updateOrderStatusAction } from "@/app/admin/actions";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

const STATUS_BORDER: Record<string, string> = {
  pending: "border-l-amber-400",
  confirmed: "border-l-blue-400",
  delivered: "border-l-green-500",
  cancelled: "border-l-red-400",
};

export default async function OrdersPage() {
  await requireUser();
  const allOrders = await getAllOrders();

  return (
    <div className="px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-lg font-bold text-ink">Orders</h1>
      <p className="mb-6 max-w-2xl text-sm text-ink/50">
        Google Sheets remains where you manage orders day-to-day — this is just a local
        record and quick status tracker.
      </p>

      <div className="mx-auto max-w-5xl space-y-3">
        {allOrders.map((order) => (
          <div
            key={order.id}
            className={`rounded-xl border border-l-4 border-surface-line bg-white p-4 ${STATUS_BORDER[order.status] ?? ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-ink">{order.productTitle}</p>
                <p className="text-sm text-ink/60">
                  {order.size} / {order.color} &times; {order.qty}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="rounded-lg border border-surface-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted"
                >
                  View
                </Link>
                <OrderStatusSelect
                  status={order.status}
                  action={updateOrderStatusAction.bind(null, order.id)}
                />
              </div>
            </div>

            <div className="mt-3 grid gap-1 text-sm text-ink/70 sm:grid-cols-2">
              <p>
                {order.customerName} &mdash; {order.customerPhone}
              </p>
              <p>
                {order.deliveryZoneLabel} delivery &mdash; {formatPrice(order.deliveryCharge)}
              </p>
              <p className="sm:col-span-2">{order.customerAddress}</p>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-surface-line pt-3">
              <span className="text-xs text-ink/40">
                {new Date(order.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
              <span className="font-bold text-brand">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        ))}

        {allOrders.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/50">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
