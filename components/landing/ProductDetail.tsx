import Image from "next/image";
import content from "@/data/site.json";

export default function ProductDetail() {
  const p = content.flagshipProduct;

  return (
    <section className="py-16 sm:py-24">
      <div className="container-page grid gap-10 lg:grid-cols-2 lg:items-center">
        <Image
          src="/images/detail-fabric.svg"
          alt=""
          width={900}
          height={900}
          className="aspect-square w-full rounded-lg object-cover"
        />

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            {content.productDetailSection.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            {content.productDetailSection.title}
          </h2>

          <dl className="mt-6 divide-y divide-surface-line border-y border-surface-line text-sm">
            {p.specs.map((spec) => (
              <div key={spec.label} className="flex justify-between py-3">
                <dt className="text-ink/60">{spec.label}</dt>
                <dd className="font-medium text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[360px] border-collapse text-sm">
              <thead>
                <tr className="bg-ink text-white">
                  <th className="px-3 py-2 text-left font-medium">সাইজ</th>
                  <th className="px-3 py-2 text-left font-medium">চেস্ট</th>
                  <th className="px-3 py-2 text-left font-medium">লেংথ</th>
                  <th className="px-3 py-2 text-left font-medium">শোল্ডার</th>
                </tr>
              </thead>
              <tbody>
                {p.sizeChart.map((row, i) => (
                  <tr
                    key={row.size}
                    className={i % 2 === 0 ? "bg-surface-muted" : "bg-white"}
                  >
                    <td className="px-3 py-2 font-medium">{row.size}</td>
                    <td className="px-3 py-2">{row.chest}</td>
                    <td className="px-3 py-2">{row.length}</td>
                    <td className="px-3 py-2">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
