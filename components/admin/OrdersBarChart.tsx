"use client";

import { useState } from "react";

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function OrdersBarChart({
  data,
}: {
  data: { date: string; count: number }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="rounded-xl border border-surface-line bg-white p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-semibold text-ink">Orders — last {data.length} days</p>
        <p className="text-xs text-ink/40">{total} total</p>
      </div>

      <div className="mt-6 flex h-36 items-end gap-1">
        {data.map((d, i) => {
          const isHovered = hovered === i;
          const heightPct = d.count === 0 ? 0 : Math.max((d.count / max) * 100, 6);
          return (
            <div
              key={d.date}
              className="relative flex h-full flex-1 items-end justify-center"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              tabIndex={0}
            >
              {isHovered ? (
                <div className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-xs font-medium text-white shadow-lg">
                  <span className="font-bold">{d.count}</span> order{d.count === 1 ? "" : "s"}
                  <span className="ml-1.5 text-white/60">{formatShortDate(d.date)}</span>
                </div>
              ) : null}
              <div
                className={`w-full max-w-6 rounded-t transition-colors ${
                  d.count === 0
                    ? "bg-surface-line"
                    : isHovered
                      ? "bg-[#1c5cab]"
                      : "bg-[#2a78d6]"
                }`}
                style={{ height: d.count === 0 ? "3px" : `${heightPct}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between border-t border-surface-line pt-1.5 text-[10px] text-ink/40">
        <span>{formatShortDate(data[0]?.date)}</span>
        <span>{formatShortDate(data[data.length - 1]?.date)}</span>
      </div>
    </div>
  );
}
