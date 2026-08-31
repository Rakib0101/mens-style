import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";
import content from "@/data/site.json";

async function main() {
  const db = getDb();

  const flagship = content.flagshipProduct;
  const related = content.relatedProducts;

  await db
    .insert(products)
    .values({
      slug: flagship.slug,
      title: flagship.title,
      subtitle: flagship.subtitle,
      price: flagship.price,
      comparePrice: flagship.comparePrice,
      images: flagship.images,
      sizes: flagship.sizes,
      colors: flagship.colors,
      specs: flagship.specs,
      sizeChart: flagship.sizeChart,
      ratingValue: flagship.rating.value,
      ratingCount: flagship.rating.count,
      isFlagship: true,
      sortOrder: 0,
    })
    .onConflictDoNothing({ target: products.slug });

  for (let i = 0; i < related.length; i++) {
    const p = related[i];
    await db
      .insert(products)
      .values({
        slug: p.slug,
        title: p.title,
        price: p.price,
        comparePrice: p.comparePrice,
        images: p.images,
        sizes: p.sizes,
        colors: p.colors,
        isFlagship: false,
        sortOrder: i + 1,
      })
      .onConflictDoNothing({ target: products.slug });
  }

  console.log(`Seeded ${1 + related.length} products.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
