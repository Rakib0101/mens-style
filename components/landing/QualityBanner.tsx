import content from "@/data/site.json";
import Image from "next/image";

export default function QualityBanner({
	title,
	desc,
	badges,
	image,
}: {
	title: string;
	desc: string;
	badges: string[];
	image: string;
}) {
	return (
		<section className="bg-ink text-white">
			<div className="container-page grid items-center gap-10 lg:grid-cols-2">
				<div>
					<p className="text-sm font-semibold uppercase tracking-wide text-brand">
						{content.qualityBanner.eyebrow}
					</p>
					<h2 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">
						{title}
					</h2>
					<p className="mt-4 max-w-md text-white/70">{desc}</p>

					<div className="mt-6 flex flex-wrap gap-3">
						{badges.map((badge) => (
							<span
								key={badge}
								className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80"
							>
								{badge}
							</span>
						))}
					</div>
				</div>

				<Image
					src={image}
					alt={title || "Mens Style Quality Polo Shirt"}
					width={710}
					height={584}
					className="w-full object-cover lg:order-last"
				/>
			</div>
		</section>
	);
}
