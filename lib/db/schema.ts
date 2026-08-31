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
