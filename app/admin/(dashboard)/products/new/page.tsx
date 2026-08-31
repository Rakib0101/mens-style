import { createProductAction } from "@/app/admin/actions";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-lg font-bold text-ink">Add product</h1>
        <ProductForm action={createProductAction} submitLabel="Create product" />
      </div>
    </div>
  );
}
