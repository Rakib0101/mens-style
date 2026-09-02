import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  jsonb,
  real,
  timestamp,
} from "drizzle-orm/pg-core";
import type { ColorOption } from "@/lib/types";

export type Spec = { label: string; value: string };
export type SizeChartRow = { size: string; chest: string; length: string; shoulder: string };
export type WhyChooseItem = { number: string; title: string; desc: string };

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  price: integer("price").notNull(),
  comparePrice: integer("compare_price"),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
  colors: jsonb("colors").$type<ColorOption[]>().notNull().default([]),
  specs: jsonb("specs").$type<Spec[]>().notNull().default([]),
  sizeChart: jsonb("size_chart").$type<SizeChartRow[]>().notNull().default([]),
  ratingValue: real("rating_value").notNull().default(4.9),
  ratingCount: integer("rating_count").notNull().default(0),
  isFlagship: boolean("is_flagship").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  // Per-product landing page content
  heroCtaLabel: text("hero_cta_label").notNull().default("অফার প্রাইস এ অর্ডার করুন"),
  whyChooseUs: jsonb("why_choose_us").$type<WhyChooseItem[]>().notNull().default([]),
  qualityBannerTitle: text("quality_banner_title").notNull().default(""),
  qualityBannerDesc: text("quality_banner_desc").notNull().default(""),
  qualityBannerBadges: jsonb("quality_banner_badges").$type<string[]>().notNull().default([]),
  qualityBannerImage: text("quality_banner_image").notNull().default(""),
  showQualityBanner: boolean("show_quality_banner").notNull().default(true),
  showRelatedProducts: boolean("show_related_products").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["admin", "staff"] }).notNull().default("staff"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Role = "admin" | "staff";
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  productSlug: text("product_slug").notNull(),
  productTitle: text("product_title").notNull(),
  size: text("size").notNull(),
  color: text("color").notNull(),
  qty: integer("qty").notNull(),
  unitPrice: integer("unit_price").notNull(),
  deliveryZoneLabel: text("delivery_zone_label").notNull(),
  deliveryCharge: integer("delivery_charge").notNull(),
  totalPrice: integer("total_price").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerAddress: text("customer_address").notNull(),
  status: text("status", {
    enum: ["pending", "confirmed", "delivered", "cancelled"],
  })
    .notNull()
    .default("pending"),
  // Synced one-way from the Google Sheet (Support Manager / Summary / Courier
  // ID columns) — staff manage these in the Sheet, the app just mirrors them.
  supportManager: text("support_manager").notNull().default(""),
  summary: text("summary").notNull().default(""),
  courierId: text("courier_id").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type DeliveryZone = { label: string; charge: number };

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  phones: jsonb("phones").$type<string[]>().notNull().default([]),
  address: text("address").notNull().default(""),
  facebookUrl: text("facebook_url").notNull().default(""),
  deliveryZones: jsonb("delivery_zones").$type<DeliveryZone[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SiteSettings = typeof siteSettings.$inferSelect;
