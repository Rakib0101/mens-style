import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Inter } from "next/font/google";
import "./globals.css";
import content from "@/data/site.json";

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
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
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${inter.variable} h-full`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${hindSiliguri.className} font-sans min-h-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
