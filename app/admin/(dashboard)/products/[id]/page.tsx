import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById, getProductUrl } from "@/lib/products";
import { formatPrice } from "@/lib/format";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 py-2.5 text-sm">
      <span className="text-ink/50">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();

  const url = getProductUrl(product);

  return (
    <div className="px-4 py-8 sm:px-8">
      <Link href="/admin/products" className="text-sm text-ink/50 hover:text-ink">
        &larr; Back to products
      </Link>

      <div className="mx-auto mt-4 max-w-2xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-ink">{product.title}</h1>
            {product.isFlagship ? (
              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                Flagship
              </span>
            ) : null}
          </div>
          <div className="flex shrink-0 gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-surface-line px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-surface-muted"
            >
              Preview ↗
            </a>
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand-dark"
            >
              Edit
            </Link>
          </div>
        </div>

        {product.images.length > 0 ? (
          <div className="mb-5 grid grid-cols-4 gap-3">
            {product.images.map((src) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-lg bg-surface-muted"
              >
                <Image src={src} alt="" fill sizes="150px" className="object-cover" />
              </div>
            ))}
          </div>
        ) : null}

        <section className="mb-5 rounded-xl border border-surface-line bg-white p-6">
          <h2 className="mb-1 font-bold text-ink">Overview</h2>
          <p className="mb-4 text-sm text-ink/50">{product.subtitle || "No subtitle set."}</p>
          <div className="divide-y divide-surface-line">
            <Row label="URL" value={<a href={url} className="text-brand hover:underline">{url}</a>} />
            <Row label="Price" value={formatPrice(product.price)} />
            <Row
              label="Compare-at price"
              value={product.comparePrice ? formatPrice(product.comparePrice) : "—"}
            />
            <Row label="Sizes" value={product.sizes.join(", ") || "—"} />
            <Row label="Rating" value={`${product.ratingValue} (${product.ratingCount})`} />
          </div>
        </section>

        {product.colors.length > 0 ? (
          <section className="mb-5 rounded-xl border border-surface-line bg-white p-6">
            <h2 className="mb-3 font-bold text-ink">Colors</h2>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <div key={c.name} className="flex items-center gap-2 text-sm">
                  <span
                    className="h-5 w-5 rounded-full border border-surface-line"
                    style={{ backgroundColor: c.hex }}
                  />
                  {c.name}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {product.specs.length > 0 ? (
          <section className="mb-5 rounded-xl border border-surface-line bg-white p-6">
            <h2 className="mb-1 font-bold text-ink">Specs</h2>
            <div className="divide-y divide-surface-line">
              {product.specs.map((s, i) => (
                <Row key={i} label={s.label} value={s.value} />
              ))}
            </div>
          </section>
        ) : null}

        {product.whyChooseUs.length > 0 ? (
          <section className="mb-5 rounded-xl border border-surface-line bg-white p-6">
            <h2 className="mb-3 font-bold text-ink">Why choose us</h2>
            <div className="grid grid-cols-2 gap-4">
              {product.whyChooseUs.map((w, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-ink/40">{w.number}</p>
                  <p className="font-medium text-ink">{w.title}</p>
                  <p className="text-sm text-ink/60">{w.desc}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-xl border border-surface-line bg-white p-6">
          <h2 className="mb-1 font-bold text-ink">Page sections</h2>
          <div className="divide-y divide-surface-line">
            <Row label="Quality banner" value={product.showQualityBanner ? "Shown" : "Hidden"} />
            <Row label="Related products" value={product.showRelatedProducts ? "Shown" : "Hidden"} />
          </div>
        </section>
      </div>
    </div>
  );
}
