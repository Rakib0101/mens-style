import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import content from "@/data/site.json";
import { getSiteSettings } from "@/lib/settings";

const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mensstyle.com";
const p = content.flagshipProduct;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    image: [
      `${siteUrl}/images/products/t-shirt/1.png`,
      `${siteUrl}/images/products/t-shirt/banner.png`,
      `${siteUrl}/images/products/t-shirt/zoom.png`,
    ],
    description: p.subtitle,
    sku: p.slug,
    brand: {
      "@type": "Brand",
      name: content.brand.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/#order`,
      priceCurrency: "BDT",
      price: p.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: content.brand.name,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: p.rating.value,
      reviewCount: p.rating.count,
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: content.brand.name,
    url: siteUrl,
    logo: `${siteUrl}/images/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phones[0] ?? content.brand.phones[0],
      contactType: "customer service",
      areaServed: "BD",
      availableLanguage: ["bn", "en"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || content.brand.address,
      addressCountry: "BD",
    },
  };

  return (
    <div className="flex min-h-full flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer
        phones={settings.phones}
        address={settings.address}
        facebookUrl={settings.facebookUrl}
      />
      {fbPixelId ? (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${fbPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </div>
  );
}
