import content from "@/data/site.json";

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="py-16 sm:py-24">
      <div className="container-page text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          {content.whyChooseSection.eyebrow}
        </p>
        <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
          {content.whyChooseSection.title}
        </h2>

        <div className="mt-10 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          {content.whyChooseUs.map((item) => (
            <div
              key={item.number}
              className="rounded-lg border border-surface-line bg-surface-muted p-6"
            >
              <span className="text-sm font-bold text-brand">{item.number}</span>
              <h3 className="mt-2 font-semibold text-ink">{item.title}</h3>
              <p className="mt-2 text-sm text-ink/60">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
