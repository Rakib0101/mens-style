import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductLandingPage from "@/components/landing/ProductLandingPage";
import { getOtherProducts, getProductBySlug } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";
import content from "@/data/site.json";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.title} | ${content.brand.name}`,
    description: product.subtitle,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.title,
      description: product.subtitle,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [otherProducts, settings] = await Promise.all([
    getOtherProducts(product.slug),
    getSiteSettings(),
  ]);

  return (
    <ProductLandingPage
      product={product}
      otherProducts={otherProducts}
      deliveryZones={settings.deliveryZones}
    />
  );
}
