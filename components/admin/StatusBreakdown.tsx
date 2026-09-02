import type { OrderStatus } from "@/lib/db/schema";

const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Pending",
    color: "#fab219",
    icon: (
      <path
        d="M12 6v6l4 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="#fab219"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  confirmed: {
    label: "Confirmed",
    color: "#2a78d6",
    icon: (
      <path
        d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="#2a78d6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  delivered: {
    label: "Delivered",
    color: "#0ca30c",
    icon: (
      <path
        d="M5 13l4 4L19 7"
        stroke="#0ca30c"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
  cancelled: {
    label: "Cancelled",
    color: "#d03b3b",
    icon: (
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="#d03b3b"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    ),
  },
};

export default function StatusBreakdown({
  counts,
}: {
  counts: Record<OrderStatus, number>;
}) {
  return (
    <div className="rounded-xl border border-surface-line bg-white p-5">
      <p className="mb-4 text-sm font-semibold text-ink">Orders by status</p>
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(STATUS_META) as OrderStatus[]).map((status) => {
          const meta = STATUS_META[status];
          return (
            <div
              key={status}
              className="flex items-center gap-2.5 rounded-lg border border-surface-line px-3 py-2.5"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
                {meta.icon}
              </svg>
              <div className="min-w-0">
                <p className="text-xs text-ink/50">{meta.label}</p>
                <p className="font-semibold text-ink">{counts[status]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
