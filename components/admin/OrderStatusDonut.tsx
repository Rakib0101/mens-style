"use client";

import { useState } from "react";
import type { OrderStatus } from "@/lib/db/schema";

const STATUS_META: Record<OrderStatus, { label: string; color: string }> = {
  delivered: { label: "Delivered", color: "#0ca30c" },
  confirmed: { label: "Confirmed", color: "#2a78d6" },
  pending: { label: "Pending", color: "#fab219" },
  cancelled: { label: "Cancelled", color: "#d03b3b" },
};

const ORDER: OrderStatus[] = ["delivered", "confirmed", "pending", "cancelled"];

const SIZE = 148;
const STROKE = 24;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP_DEG = 3;

export default function OrderStatusDonut({
  counts,
}: {
  counts: Record<OrderStatus, number>;
}) {
  const [hovered, setHovered] = useState<OrderStatus | null>(null);
  const total = ORDER.reduce((sum, s) => sum + counts[s], 0);
  const gapLen = (GAP_DEG / 360) * CIRCUMFERENCE;

  let cumulative = 0;
  const segments = ORDER.filter((status) => counts[status] > 0).map((status) => {
    const fraction = counts[status] / total;
    const segLen = Math.max(fraction * CIRCUMFERENCE - gapLen, 0);
    const rotation = (cumulative / CIRCUMFERENCE) * 360 - 90;
    cumulative += fraction * CIRCUMFERENCE;
    return { status, segLen, rotation };
  });

  return (
    <div className="rounded-xl border border-surface-line bg-white p-5">
      <p className="mb-4 text-sm font-semibold text-ink">Orders by status</p>

      <div className="flex items-center gap-5">
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {total === 0 ? (
              <circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="#e7e5e1"
                strokeWidth={STROKE}
              />
            ) : (
              segments.map((seg) => (
                <circle
                  key={seg.status}
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={RADIUS}
                  fill="none"
                  stroke={STATUS_META[seg.status].color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                  strokeDasharray={`${seg.segLen} ${CIRCUMFERENCE - seg.segLen}`}
                  transform={`rotate(${seg.rotation} ${SIZE / 2} ${SIZE / 2})`}
                  opacity={hovered && hovered !== seg.status ? 0.35 : 1}
                  className="cursor-pointer transition-opacity"
                  onMouseEnter={() => setHovered(seg.status)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(seg.status)}
                  onBlur={() => setHovered(null)}
                  tabIndex={0}
                />
              ))
            )}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-semibold text-ink">
              {hovered ? counts[hovered] : total}
            </span>
            <span className="text-[10px] text-ink/40">
              {hovered ? STATUS_META[hovered].label : "orders"}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {ORDER.map((status) => {
            const count = counts[status];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div
                key={status}
                className="flex cursor-pointer items-center justify-between gap-2 text-sm"
                onMouseEnter={() => setHovered(status)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: STATUS_META[status].color }}
                  />
                  <span className="text-ink/70">{STATUS_META[status].label}</span>
                </span>
                <span className="font-medium text-ink">
                  {count} <span className="text-ink/40">({pct}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
