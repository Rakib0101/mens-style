import { notFound } from "next/navigation";
import ProductLandingPage from "@/components/landing/ProductLandingPage";
import { getFlagshipProduct, getOtherProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";

export default async function Home() {
  const flagship = await getFlagshipProduct();
  if (!flagship) notFound();

  const [otherProducts, settings] = await Promise.all([
    getOtherProducts(flagship.slug),
    getSiteSettings(),
  ]);

  return (
    <ProductLandingPage
      product={flagship}
      otherProducts={otherProducts}
      deliveryZones={settings.deliveryZones}
    />
  );
}
