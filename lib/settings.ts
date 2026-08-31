import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { siteSettings, type SiteSettings } from "@/lib/db/schema";

const SETTINGS_ID = 1;

const FALLBACK: SiteSettings = {
  id: SETTINGS_ID,
  phones: [],
  address: "",
  facebookUrl: "",
  deliveryZones: [],
  whyChooseUs: [],
  qualityBannerTitle: "",
  qualityBannerDesc: "",
  qualityBannerBadges: [],
  qualityBannerImage: "",
  updatedAt: new Date(0),
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await getDb()
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, SETTINGS_ID))
    .limit(1);
  return rows[0] ?? FALLBACK;
}

export async function updateSiteSettings(values: Partial<Omit<SiteSettings, "id" | "updatedAt">>) {
  const db = getDb();
  const existing = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .where(eq(siteSettings.id, SETTINGS_ID))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(siteSettings).values({ id: SETTINGS_ID, ...values });
  } else {
    await db
      .update(siteSettings)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(siteSettings.id, SETTINGS_ID));
  }
}
