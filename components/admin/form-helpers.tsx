"use client";

import { useRef, useState } from "react";

export const inputCls =
  "w-full rounded-lg border border-surface-line px-3.5 py-2.5 text-sm outline-none focus:border-ink";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink/70">{label}</span>
      {children}
    </label>
  );
}

export function useRows(initialCount: number) {
  const nextId = useRef(initialCount);
  const [ids, setIds] = useState<number[]>(() =>
    Array.from({ length: initialCount }, (_, i) => i),
  );
  return {
    ids,
    add: () => setIds((r) => [...r, nextId.current++]),
    remove: (id: number) => setIds((r) => r.filter((x) => x !== id)),
  };
}

export function RowSection({
  title,
  ids,
  onAdd,
  onRemove,
  addLabel,
  renderRow,
}: {
  title: string;
  ids: number[];
  onAdd: () => void;
  onRemove: (id: number) => void;
  addLabel: string;
  renderRow: (index: number) => React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-surface-line bg-white p-6">
      <h2 className="font-bold text-ink">{title}</h2>
      <div className="space-y-2">
        {ids.map((id, index) => (
          <div key={id} className="flex items-center gap-2">
            <div className="flex-1">{renderRow(index)}</div>
            <button
              type="button"
              onClick={() => onRemove(id)}
              className="shrink-0 rounded-md border border-surface-line px-2.5 py-2 text-xs text-ink/60 hover:bg-surface-muted"
              aria-label="Remove row"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="rounded-lg border border-dashed border-surface-line px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-surface-muted"
      >
        {addLabel}
      </button>
    </section>
  );
}
