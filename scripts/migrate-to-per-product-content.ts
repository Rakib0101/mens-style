import { getDb } from "@/lib/db";
import { products } from "@/lib/db/schema";

// One-time migration: seed every product with the content that used to live
// as one global site setting, so pages don't go blank after the schema
// change. Admin can then differentiate each product's page from here.
const WHY_CHOOSE_US = [
  {
    number: "01",
    title: "প্রিমিয়াম ফেব্রিক",
    desc: "নরম, শ্বাসযোগ্য এবং দীর্ঘস্থায়ী কাপড় দিয়ে তৈরি যা সারাদিন আরাম দেয়।",
  },
  {
    number: "02",
    title: "রিল্যাক্সড ফিট",
    desc: "আধুনিক কাটিং যা প্রতিটি শরীরের গঠনে মানানসই ও স্বাচ্ছন্দ্যময়।",
  },
  {
    number: "03",
    title: "দীর্ঘস্থায়ী রঙ",
    desc: "বিশেষ ডাইং প্রক্রিয়ায় রঙ দীর্ঘদিন উজ্জ্বল ও অক্ষুণ্ণ থাকে।",
  },
  {
    number: "04",
    title: "স্মার্ট ফিটিং",
    desc: "ফরমাল কিংবা ক্যাজুয়াল—যেকোনো অনুষঙ্গে মানানসই স্মার্ট লুক।",
  },
];

async function main() {
  const db = getDb();

  await db.update(products).set({
    whyChooseUs: WHY_CHOOSE_US,
    qualityBannerTitle: "শুধু পোশাক নয়, আপনার প্রতিদিনের স্টাইল।",
    qualityBannerDesc:
      "Mens Style তৈরি হয়েছে আধুনিক পুরুষের দৈনন্দিন প্রয়োজনকে সামনে রেখে—যেখানে ভালো ডিজাইন, আরাম এবং মান একসাথে আসে।",
    qualityBannerBadges: ["Premium Quality", "Modern Fit", "Everyday Comfort"],
    qualityBannerImage: "/images/products/t-shirt/banner.png",
    showQualityBanner: true,
    showRelatedProducts: true,
  });

  console.log("Seeded per-product hero/banner/why-choose-us content for all products.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
