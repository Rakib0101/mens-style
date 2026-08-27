import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import content from "@/data/site.json";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mensstyle.com";
const p = content.flagshipProduct;

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${content.brand.name} | ${p.title}`,
    template: `%s | ${content.brand.name}`,
  },
  description: p.subtitle,
  keywords: [
    content.brand.name,
    p.title,
    "প্রিমিয়াম পোলো শার্ট",
    "কটন পোলো শার্ট",
    "পোলো শার্ট বাংলাদেশ",
    "Cotton Polo Shirt",
    "Premium Menswear",
    "Men Fashion Bangladesh",
    "Polo T-shirt Online",
    "Cash on Delivery",
  ],
  authors: [{ name: content.brand.name }],
  creator: content.brand.name,
  publisher: content.brand.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "44x44" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: siteUrl,
    title: `${content.brand.name} | ${p.title}`,
    description: p.subtitle,
    siteName: content.brand.name,
    images: [
      {
        url: "/images/products/t-shirt/1.png",
        width: 900,
        height: 670,
        alt: `${content.brand.name} - ${p.title}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${content.brand.name} | ${p.title}`,
    description: p.subtitle,
    images: ["/images/products/t-shirt/1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
      telephone: content.brand.phones[0],
      contactType: "customer service",
      areaServed: "BD",
      availableLanguage: ["bn", "en"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: content.brand.address,
      addressCountry: "BD",
    },
  };

  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${inter.variable} h-full`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
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
      </body>
    </html>
  );
}
