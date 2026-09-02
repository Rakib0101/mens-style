export default function FulfillmentMeter({
  delivered,
  total,
}: {
  delivered: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((delivered / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-surface-line bg-white p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-ink">Fulfillment rate</p>
        <p className="text-xs text-ink/40">
          {delivered} of {total} delivered
        </p>
      </div>
      <p className="mt-3 text-3xl font-semibold text-ink">{pct}%</p>
      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#cde2fb]">
        <div
          className="h-full rounded-full bg-[#2a78d6] transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
