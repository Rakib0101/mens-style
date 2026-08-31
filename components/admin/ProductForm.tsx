"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/db/schema";

const inputCls =
  "w-full rounded-lg border border-surface-line px-3.5 py-2.5 text-sm outline-none focus:border-ink";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-ink/70">{label}</span>
      {children}
    </label>
  );
}

function useRows(initialCount: number) {
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

function RowSection({
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

export default function ProductForm({
  action,
  product,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  product?: Product;
  submitLabel: string;
}) {
  const colors = useRows(product?.colors.length || 1);
  const specs = useRows(product?.specs.length || 0);
  const sizeChart = useRows(product?.sizeChart.length || 0);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const existingImages = product?.images || [];

  return (
    <form action={action} className="max-w-3xl space-y-6">
      <section className="space-y-4 rounded-xl border border-surface-line bg-white p-6">
        <h2 className="font-bold text-ink">Basic info</h2>
        <Field label="Title *">
          <input
            name="title"
            required
            defaultValue={product?.title}
            className={inputCls}
          />
        </Field>
        <Field label="Subtitle (shown when this is the main homepage product)">
          <input name="subtitle" defaultValue={product?.subtitle} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Price (৳) *">
            <input
              name="price"
              type="number"
              required
              min={0}
              defaultValue={product?.price}
              className={inputCls}
            />
          </Field>
          <Field label="Compare-at price (optional, shown crossed out)">
            <input
              name="comparePrice"
              type="number"
              min={0}
              defaultValue={product?.comparePrice ?? ""}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Sizes — comma separated (e.g. M, L, XL, XXL)">
          <input
            name="sizes"
            defaultValue={(product?.sizes || []).join(", ")}
            className={inputCls}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="isFlagship" defaultChecked={product?.isFlagship} />
          Show as the main product on the homepage
        </label>
      </section>

      <section className="space-y-4 rounded-xl border border-surface-line bg-white p-6">
        <h2 className="font-bold text-ink">Photos</h2>

        {existingImages.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {existingImages.map((url) => {
              const removed = removedImages.includes(url);
              return (
                <div key={url}>
                  <div
                    className={`relative aspect-square overflow-hidden rounded-lg bg-surface-muted ${removed ? "opacity-30" : ""}`}
                  >
                    <Image src={url} alt="" fill sizes="150px" className="object-cover" />
                  </div>
                  {!removed ? <input type="hidden" name="keepImages" value={url} /> : null}
                  <button
                    type="button"
                    onClick={() =>
                      setRemovedImages((r) =>
                        removed ? r.filter((u) => u !== url) : [...r, url],
                      )
                    }
                    className="mt-1 w-full rounded-md border border-surface-line py-1 text-xs font-medium hover:bg-surface-muted"
                  >
                    {removed ? "Undo" : "Remove"}
                  </button>
                </div>
              );
            })}
          </div>
        ) : null}

        <Field label="Add photos (the first photo overall is used as the cover)">
          <input type="file" name="images" accept="image/*" multiple className="text-sm" />
        </Field>
      </section>

      <RowSection
        title="Color options"
        ids={colors.ids}
        onAdd={colors.add}
        onRemove={colors.remove}
        addLabel="+ Add color"
        renderRow={(i) => (
          <div className="flex items-center gap-3">
            <input
              name="colorName"
              placeholder="Color name (e.g. কালো)"
              defaultValue={product?.colors[i]?.name}
              className={`${inputCls} flex-1`}
            />
            <input
              type="color"
              name="colorHex"
              defaultValue={product?.colors[i]?.hex || "#1c1c1c"}
              className="h-10 w-14 rounded-md border border-surface-line"
            />
          </div>
        )}
      />

      <RowSection
        title="Specs table (optional — shown in the product detail section)"
        ids={specs.ids}
        onAdd={specs.add}
        onRemove={specs.remove}
        addLabel="+ Add spec row"
        renderRow={(i) => (
          <div className="flex items-center gap-3">
            <input
              name="specLabel"
              placeholder="Label (e.g. মেটেরিয়াল)"
              defaultValue={product?.specs[i]?.label}
              className={`${inputCls} w-1/3`}
            />
            <input
              name="specValue"
              placeholder="Value"
              defaultValue={product?.specs[i]?.value}
              className={`${inputCls} flex-1`}
            />
          </div>
        )}
      />

      <RowSection
        title="Size chart (optional)"
        ids={sizeChart.ids}
        onAdd={sizeChart.add}
        onRemove={sizeChart.remove}
        addLabel="+ Add size row"
        renderRow={(i) => (
          <div className="grid grid-cols-4 gap-3">
            <input
              name="sizeChartSize"
              placeholder="Size"
              defaultValue={product?.sizeChart[i]?.size}
              className={inputCls}
            />
            <input
              name="sizeChartChest"
              placeholder="Chest"
              defaultValue={product?.sizeChart[i]?.chest}
              className={inputCls}
            />
            <input
              name="sizeChartLength"
              placeholder="Length"
              defaultValue={product?.sizeChart[i]?.length}
              className={inputCls}
            />
            <input
              name="sizeChartShoulder"
              placeholder="Shoulder"
              defaultValue={product?.sizeChart[i]?.shoulder}
              className={inputCls}
            />
          </div>
        )}
      />

      <section className="grid grid-cols-2 gap-4 rounded-xl border border-surface-line bg-white p-6">
        <Field label="Rating value (e.g. 4.9)">
          <input
            name="ratingValue"
            type="number"
            step="0.1"
            min={0}
            max={5}
            defaultValue={product?.ratingValue ?? 4.9}
            className={inputCls}
          />
        </Field>
        <Field label="Rating count">
          <input
            name="ratingCount"
            type="number"
            min={0}
            defaultValue={product?.ratingCount ?? 0}
            className={inputCls}
          />
        </Field>
      </section>

      <button
        type="submit"
        className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark"
      >
        {submitLabel}
      </button>
    </form>
  );
}
