import { requireAdmin } from "@/lib/auth";
import { createProductAction } from "@/app/admin/actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-surface-muted px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-lg font-bold text-ink">Add product</h1>
        <ProductForm action={createProductAction} submitLabel="Create product" />
      </div>
    </div>
  );
}
