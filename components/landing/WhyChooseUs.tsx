import content from "@/data/site.json";
import type { WhyChooseItem } from "@/lib/db/schema";

export default function WhyChooseUs({ items }: { items: WhyChooseItem[] }) {
	return (
		<section id="why-choose-us" className="py-16 sm:py-24 bg-[#F7F7F5]">
			<div className="container-page text-center">
				<p className="text-xl font-semibold uppercase tracking-wide text-brand">
					{content.whyChooseSection.eyebrow}
				</p>
				<h2 className="mt-2 text-2xl font-bold sm:text-3xl md:text-[40px] text-ink">
					{content.whyChooseSection.title}
				</h2>
				<p className="mt-4 text-base text-ink/60">
					{content.whyChooseSection.description}
				</p>

				<div className="mt-10 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
					{items.map((item) => (
						<div
							key={item.number}
							className="border border-surface-line bg-white p-6"
						>
							<span className="text-3xl font-bold text-brand">
								{item.number}
							</span>
							<h3 className="mt-2 text-2xl font-semibold text-ink">
								{item.title}
							</h3>
							<p className="mt-2 text-base text-ink/60">{item.desc}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
