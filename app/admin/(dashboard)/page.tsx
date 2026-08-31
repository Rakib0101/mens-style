import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { deleteProductAction, setFlagshipAction } from "@/app/admin/actions";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";

export default async function AdminDashboardPage() {
  const allProducts = await getAllProducts();

  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold text-ink">Products</h1>
        <Link
          href="/admin/products/new"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-dark"
        >
          + Add product
        </Link>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="grid gap-4">
          {allProducts.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-xl border border-surface-line bg-white p-4"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-bold text-ink">{product.title}</p>
                  {product.isFlagship ? (
                    <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                      Flagship
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-ink/60">{formatPrice(product.price)}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {!product.isFlagship ? (
                  <form action={setFlagshipAction.bind(null, product.id)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-surface-line px-3 py-1.5 text-xs font-medium text-ink/70 hover:bg-surface-muted"
                    >
                      Make flagship
                    </button>
                  </form>
                ) : null}
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="rounded-lg border border-surface-line px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-muted"
                >
                  Edit
                </Link>
                <form action={deleteProductAction.bind(null, product.id)}>
                  <ConfirmSubmitButton
                    confirmMessage="Delete this product? This cannot be undone."
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}

          {allProducts.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink/50">
              No products yet. Click &ldquo;Add product&rdquo; to create your first one.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
