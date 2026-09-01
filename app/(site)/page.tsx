import Hero from "@/components/landing/Hero";
import HighlightsBar from "@/components/landing/HighlightsBar";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import ProductDetail from "@/components/landing/ProductDetail";
import QualityBanner from "@/components/landing/QualityBanner";
import OrderExperience from "@/components/landing/OrderExperience";
import { getFlagshipProduct, getRelatedProducts } from "@/lib/products";
import { getSiteSettings } from "@/lib/settings";

export default async function Home() {
  const [flagship, related, settings] = await Promise.all([
    getFlagshipProduct(),
    getRelatedProducts(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Hero />
      <HighlightsBar />
      <WhyChooseUs items={settings.whyChooseUs} />
      {flagship ? <ProductDetail product={flagship} /> : null}
      {settings.showQualityBanner ? (
        <QualityBanner
          title={settings.qualityBannerTitle}
          desc={settings.qualityBannerDesc}
          badges={settings.qualityBannerBadges}
          image={settings.qualityBannerImage}
        />
      ) : null}
      {flagship ? (
        <OrderExperience
          flagship={flagship}
          related={related}
          deliveryZones={settings.deliveryZones}
          showRelated={settings.showRelatedProducts}
        />
      ) : null}
    </>
  );
}
