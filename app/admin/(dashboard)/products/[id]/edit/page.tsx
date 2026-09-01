import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { updateProductAction } from "@/app/admin/actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) notFound();

  const boundUpdate = updateProductAction.bind(null, product.id);

  return (
    <div className="px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-lg font-bold text-ink">Edit product</h1>
        <ProductForm action={boundUpdate} product={product} submitLabel="Save changes" />
      </div>
    </div>
  );
}
