import content from "@/data/site.json";
import Image from "next/image";
import HeroGallery from "./HeroGallery";

export default function Hero() {
	const p = content.flagshipProduct;
	const savings = p.comparePrice ? p.comparePrice - p.price : 0;

	return (
		<section className="relative overflow-hidden bg-ink text-white">
			{/* Brand pattern background */}
			<div className="pointer-events-none absolute inset-0 select-none" aria-hidden="true">
				<Image
					src="/images/hero-bg.png"
					alt=""
					fill
					sizes="100vw"
					priority
					className="object-cover object-center"
				/>
			</div>

			<div className="container-page relative z-10 py-12 text-center sm:py-16">
				<div className="mx-auto max-w-5xl">
					<h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-6xl">
						{p.title}
					</h1>
					<p className="mx-auto mt-3 text-sm sm:text-base md:text-[28px] text-white/75">
						{p.subtitle}
					</p>

					<div className="mt-4 flex items-center justify-center gap-2.5 text-sm sm:text-2xl">
						{p.comparePrice ? (
							<span className="text-white/50 line-through">
								{p.comparePrice} TK
							</span>
						) : null}
						<span className="text-lg sm:text-4xl! font-bold text-brand">
							{p.price} TK
						</span>
						{savings > 0 ? (
							<span className="font-medium text-white/80">
								Save {savings} TK
							</span>
						) : null}
					</div>

					<a
						href="#order"
						className="mt-5 inline-block rounded-xs bg-brand px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md transition-colors hover:bg-brand-dark"
					>
						অফার প্রাইস এ অর্ডার করুন
					</a>
				</div>

				<div className="mt-8 sm:mt-10">
					<HeroGallery images={p.images} alt={p.title} />
				</div>
			</div>
		</section>
	);
}
