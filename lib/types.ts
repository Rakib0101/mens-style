export interface ColorOption {
  name: string;
  hex: string;
}

export interface ProductBase {
  slug: string;
  title: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
}

export interface FlagshipProduct extends ProductBase {
  subtitle: string;
  rating: { value: number; count: number };
  specs: { label: string; value: string }[];
  sizeChart: { size: string; chest: string; length: string; shoulder: string }[];
}

export interface DeliveryZone {
  label: string;
  charge: number;
}

export interface SiteContent {
  brand: {
    name: string;
    phones: string[];
    address: string;
    social: { facebook?: string; twitter?: string; instagram?: string };
  };
  nav: { label: string; href: string }[];
  ctaLabel: string;
  highlights: { label: string }[];
  whyChooseSection: { eyebrow: string; title: string };
  whyChooseUs: { number: string; title: string; desc: string }[];
  productDetailSection: { eyebrow: string; title: string };
  flagshipProduct: FlagshipProduct;
  qualityBanner: {
    eyebrow: string;
    title: string;
    desc: string;
    badges: string[];
    image: string;
  };
  relatedSection: { eyebrow: string; title: string };
  relatedProducts: ProductBase[];
  deliveryZones: DeliveryZone[];
  orderSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    yourProductLabel: string;
    sizeLabel: string;
    colorLabel: string;
    qtyLabel: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    zoneLabel: string;
    addressLabel: string;
    addressPlaceholder: string;
    summaryTitle: string;
    subtotalLabel: string;
    deliveryLabel: string;
    totalLabel: string;
    codNote: string;
    submitLabel: string;
    submittingLabel: string;
    afterSubmitNote: string;
  };
  orderSuccess: {
    title: string;
    body: string;
    backLabel: string;
  };
}

/** Order payload shared between the client form and the checkout API route. */
export interface OrderPayload {
  productSlug: string;
  productTitle: string;
  size: string;
  color: string;
  qty: number;
  unitPrice: number;
  deliveryZoneLabel: string;
  deliveryCharge: number;
  totalPrice: number;
  name: string;
  phone: string;
  address: string;
  /** Hidden field — filled means a bot filled the form. */
  honeypot: string;
}
