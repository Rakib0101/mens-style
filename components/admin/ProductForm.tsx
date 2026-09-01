"use client";

import type { Product } from "@/lib/db/schema";
import FilePreviewInput from "@/components/admin/FilePreviewInput";
import { Field, RowSection, inputCls, useRows } from "@/components/admin/form-helpers";
import { useState } from "react";
import Image from "next/image";

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
          <FilePreviewInput name="images" multiple />
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
              className={`${inputCls} min-w-0 flex-1`}
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
              className={`${inputCls} !w-1/3`}
            />
            <input
              name="specValue"
              placeholder="Value"
              defaultValue={product?.specs[i]?.value}
              className={`${inputCls} min-w-0 flex-1`}
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
