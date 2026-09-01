import content from "@/data/site.json";
import Image from "next/image";
import type { Product } from "@/lib/db/schema";

export default function ProductDetail({ product: p }: { product: Product }) {
	const detailImage = p.images[1] ?? p.images[0];

	return (
		<section className="py-16 sm:py-24">
			<div className="container-page grid gap-16 lg:grid-cols-2 lg:items-center">
				{detailImage ? (
					<Image
						src={detailImage}
						alt={
							content.productDetailSection.title ||
							"প্রিমিয়াম কটন ফেব্রিক টেক্সচার ডিটেইল"
						}
						width={900}
						height={900}
						className="aspect-square w-full object-cover"
					/>
				) : null}

				<div>
					<p className="text-sm md:text-xl font-semibold uppercase tracking-wide text-brand">
						{content.productDetailSection.eyebrow}
					</p>
					<h2 className="mt-2 text-2xl font-bold sm:text-3xl md:text-[40px] text-ink">
						{content.productDetailSection.title}
					</h2>

					<dl className="mt-6 divide-y divide-surface-line border-y border-surface-line text-sm">
						{p.specs.map((spec) => (
							<div
								key={spec.label}
								className="grid grid-cols-5 gap-4 py-3 sm:grid"
							>
								<dt className="text-ink/60">{spec.label}</dt>
								<dd className="font-medium text-ink col-span-4">
									{spec.value}
								</dd>
							</div>
						))}
					</dl>

					<div className="mt-8 overflow-x-auto rounded-xl border border-surface-line">
						<table className="w-full min-w-90 border-collapse text-sm">
							<thead>
								<tr className="bg-ink text-white">
									<th className="px-6 py-2 text-left font-medium">সাইজ</th>
									<th className="px-6 py-2 text-left font-medium">চেস্ট</th>
									<th className="px-6 py-2 text-left font-medium">লেংথ</th>
									<th className="px-6 py-2 text-left font-medium">শোল্ডার</th>
								</tr>
							</thead>
							<tbody>
								{p.sizeChart.map((row, i) => (
									<tr
										key={row.size}
										className={i % 2 === 0 ? "bg-surface-muted" : "bg-white"}
									>
										<td className="px-6 py-2 font-medium">{row.size}</td>
										<td className="px-6 py-2">{row.chest}</td>
										<td className="px-6 py-2">{row.length}</td>
										<td className="px-6 py-2">{row.shoulder}</td>
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
