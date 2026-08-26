import Hero from "@/components/landing/Hero";
import HighlightsBar from "@/components/landing/HighlightsBar";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import ProductDetail from "@/components/landing/ProductDetail";
import QualityBanner from "@/components/landing/QualityBanner";
import OrderExperience from "@/components/landing/OrderExperience";

export default function Home() {
  return (
    <>
      <Hero />
      <HighlightsBar />
      <WhyChooseUs />
      <ProductDetail />
      <QualityBanner />
      <OrderExperience />
    </>
  );
}
