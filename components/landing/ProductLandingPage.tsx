import Hero from "@/components/landing/Hero";
import HighlightsBar from "@/components/landing/HighlightsBar";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import ProductDetail from "@/components/landing/ProductDetail";
import QualityBanner from "@/components/landing/QualityBanner";
import OrderExperience from "@/components/landing/OrderExperience";
import type { DeliveryZone, Product } from "@/lib/db/schema";

export default function ProductLandingPage({
  product,
  otherProducts,
  deliveryZones,
}: {
  product: Product;
  otherProducts: Product[];
  deliveryZones: DeliveryZone[];
}) {
  return (
    <>
      <Hero product={product} />
      <HighlightsBar />
      <WhyChooseUs items={product.whyChooseUs} />
      <ProductDetail product={product} />
      {product.showQualityBanner ? (
        <QualityBanner
          title={product.qualityBannerTitle}
          desc={product.qualityBannerDesc}
          badges={product.qualityBannerBadges}
          image={product.qualityBannerImage}
        />
      ) : null}
      <OrderExperience
        product={product}
        otherProducts={otherProducts}
        deliveryZones={deliveryZones}
        showRelated={product.showRelatedProducts}
      />
    </>
  );
}
