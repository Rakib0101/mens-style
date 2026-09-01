"use client";

import Image from "next/image";
import { useState } from "react";

export interface GalleryItem {
	id: string;
	thumb: string;
	full: string;
	alt: string;
}

export default function HeroGallery({
	images,
	alt,
}: {
	images?: string[];
	alt: string;
}) {
	const [active, setActive] = useState(0);

	// Each photo doubles as its own thumbnail and full-size view.
	const items: GalleryItem[] = (images && images.length > 0 ? images : []).map(
		(img, idx) => ({
			id: `img-${idx}`,
			thumb: img,
			full: img,
			alt: `${alt} ${idx + 1}`,
		}),
	);

	const activeItem = items[active] || items[0];
	if (!activeItem) return null;

	return (
		<div className="mx-auto flex w-full flex-col items-center">
			{/* Active Image Showcase: wide presentation independent of thumbnail grid */}
			<div className="w-full max-w-155 sm:max-w-175 md:max-w-190 lg:max-w-200">
				<div className="overflow-hidden border-8 sm:border-10 md:border-12 border-white bg-ink-soft shadow-2xl">
					<div className="relative aspect-900/670 w-full">
						<Image
							src={activeItem.full}
							alt={activeItem.alt || alt}
							fill
							sizes="(max-width: 768px) 95vw, 800px"
							className="object-cover"
							priority
						/>
					</div>
				</div>
			</div>

			{/* Thumbnails Row: narrower centered grid below active image */}
			{items.length > 1 ? (
				<div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 sm:gap-3">
					{items.map((item, i) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setActive(i)}
							aria-label={item.alt}
							className={`group relative h-14 w-14 sm:h-16 sm:w-16 md:h-18 md:w-18 overflow-hidden rounded-xs cursor-pointer transition-all duration-150 ${
								i === active
									? "border-2 border-brand"
									: "border border-white/20 opacity-75 hover:opacity-100 hover:border-white/50"
							}`}
						>
							<Image
								src={item.thumb}
								alt={item.alt}
								fill
								sizes="80px"
								className="object-cover transition-transform duration-200 group-hover:scale-105"
							/>
						</button>
					))}
				</div>
			) : null}
		</div>
	);
}
