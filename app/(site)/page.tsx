import Hero from "@/components/landing/Hero";
import HighlightsBar from "@/components/landing/HighlightsBar";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import ProductDetail from "@/components/landing/ProductDetail";
import QualityBanner from "@/components/landing/QualityBanner";
import OrderExperience from "@/components/landing/OrderExperience";
import { getFlagshipProduct, getRelatedProducts } from "@/lib/products";

export default async function Home() {
  const [flagship, related] = await Promise.all([
    getFlagshipProduct(),
    getRelatedProducts(),
  ]);

  return (
    <>
      <Hero />
      <HighlightsBar />
      <WhyChooseUs />
      {flagship ? <ProductDetail product={flagship} /> : null}
      <QualityBanner />
      {flagship ? <OrderExperience flagship={flagship} related={related} /> : null}
    </>
  );
}
