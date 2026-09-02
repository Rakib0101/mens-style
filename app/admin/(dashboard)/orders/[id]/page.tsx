import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getOrderById } from "@/lib/orders";
import { formatPrice } from "@/lib/format";
import { updateOrderStatusAction } from "@/app/admin/actions";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <span className="text-ink/50">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const order = await getOrderById(Number(id));
  if (!order) notFound();

  return (
    <div className="px-4 py-8 sm:px-8">
      <Link href="/admin/orders" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to orders
      </Link>

      <div className="mx-auto mt-4 max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-lg font-bold text-ink">Order #{order.id}</h1>
          <OrderStatusSelect
            status={order.status}
            action={updateOrderStatusAction.bind(null, order.id)}
          />
        </div>

        <section className="mb-5 rounded-xl border border-surface-line bg-white p-6">
          <h2 className="mb-1 font-bold text-ink">{order.productTitle}</h2>
          <p className="mb-4 text-sm text-ink/50">
            Placed{" "}
            {new Date(order.createdAt).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <div className="divide-y divide-surface-line">
            <Row label="Size" value={order.size} />
            <Row label="Color" value={order.color} />
            <Row label="Quantity" value={order.qty} />
            <Row label="Unit price" value={formatPrice(order.unitPrice)} />
            <Row
              label={`Delivery (${order.deliveryZoneLabel})`}
              value={formatPrice(order.deliveryCharge)}
            />
            <Row
              label="Total"
              value={<span className="text-brand">{formatPrice(order.totalPrice)}</span>}
            />
          </div>
        </section>

        <section className="rounded-xl border border-surface-line bg-white p-6">
          <h2 className="mb-4 font-bold text-ink">Customer</h2>
          <div className="divide-y divide-surface-line">
            <Row label="Name" value={order.customerName} />
            <Row label="Phone" value={order.customerPhone} />
            <Row label="Address" value={order.customerAddress} />
          </div>
        </section>
      </div>
    </div>
  );
}
