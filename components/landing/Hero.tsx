import content from "@/data/site.json";
import { formatPrice } from "@/lib/format";
import HeroGallery from "./HeroGallery";

export default function Hero() {
  const p = content.flagshipProduct;
  const savings = p.comparePrice ? p.comparePrice - p.price : 0;

  return (
    <section className="bg-ink text-white">
      <div className="container-page grid gap-10 py-14 text-center sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{p.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70 sm:text-lg">{p.subtitle}</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            {p.comparePrice ? (
              <span className="text-lg text-white/50 line-through">
                {formatPrice(p.comparePrice)}
              </span>
            ) : null}
            <span className="text-3xl font-bold text-brand">{formatPrice(p.price)}</span>
            {savings > 0 ? (
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
                Save {formatPrice(savings)}
              </span>
            ) : null}
          </div>

          <a
            href="#order"
            className="mt-8 inline-block rounded-full bg-brand px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            {content.ctaLabel}
          </a>
        </div>

        <HeroGallery images={p.images} alt={p.title} />
      </div>
    </section>
  );
}
