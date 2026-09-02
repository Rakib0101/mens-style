import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { updateOrderStatusAction } from "@/app/admin/actions";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

function Cell({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <td className={`whitespace-nowrap px-3 py-3 text-sm ${muted ? "text-ink/40" : "text-ink/80"}`}>
      {children ?? <span className="text-ink/30">—</span>}
    </td>
  );
}

export default async function OrdersPage() {
  await requireUser();
  const allOrders = await getAllOrders();

  return (
    <div className="px-4 py-8 sm:px-8">
      <h1 className="mb-1 text-lg font-bold text-ink">Orders</h1>
      <p className="mb-6 max-w-2xl text-sm text-ink/50">
        Every order placed on the site lands here automatically. Update the status as you
        process each one — this list is independent from Google Sheets.
      </p>

      <div className="overflow-x-auto rounded-xl border border-surface-line bg-white">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-surface-line bg-surface-muted/60">
              <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-ink/50">Date</th>
              <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-ink/50">Product</th>
              <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-ink/50">Customer</th>
              <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-ink/50">Phone</th>
              <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-ink/50">Address</th>
              <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-ink/50">Qty</th>
              <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-ink/50">Total</th>
              <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-ink/50">Status</th>
              <th className="whitespace-nowrap px-3 py-3 text-xs font-semibold text-ink/50"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-line">
            {allOrders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-muted/40">
                <Cell muted>
                  {new Date(order.createdAt).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Cell>
                <Cell>
                  <span className="font-medium text-ink">{order.productTitle}</span>
                  <span className="text-ink/40"> · {order.size}/{order.color}</span>
                </Cell>
                <Cell>{order.customerName}</Cell>
                <Cell>{order.customerPhone}</Cell>
                <td className="max-w-56 truncate px-3 py-3 text-sm text-ink/80" title={order.customerAddress}>
                  {order.customerAddress}
                </td>
                <Cell>{order.qty}</Cell>
                <Cell>
                  <span className="font-semibold text-ink">{formatPrice(order.totalPrice)}</span>
                </Cell>
                <td className="whitespace-nowrap px-3 py-3">
                  <OrderStatusSelect
                    status={order.status}
                    action={updateOrderStatusAction.bind(null, order.id)}
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="rounded-lg border border-surface-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allOrders.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/50">No orders yet.</p>
        ) : null}
      </div>
    </div>
  );
}
