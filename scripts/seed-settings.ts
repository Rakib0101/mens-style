import { getDb } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import content from "@/data/site.json";

async function main() {
  const db = getDb();

  await db
    .insert(siteSettings)
    .values({
      id: 1,
      phones: content.brand.phones,
      address: content.brand.address,
      facebookUrl: content.brand.social.facebook ?? "",
      deliveryZones: content.deliveryZones,
    })
    .onConflictDoNothing({ target: siteSettings.id });

  console.log("Seeded site settings.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
