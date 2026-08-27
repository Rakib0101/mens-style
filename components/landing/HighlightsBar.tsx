import content from "@/data/site.json";

export default function HighlightsBar() {
	return (
		<div className="bg-brand text-white">
			<div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-sm sm:text-3xl font-medium">
				{content.highlights.map((item) => (
					<span key={item.label} className="flex items-center gap-2">
						<svg
							width="40"
							height="40"
							viewBox="0 0 40 40"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M0 19.6994C13.7195 19.6994 19.6994 13.9275 19.6994 0C19.6994 13.9275 25.6376 19.6994 39.3987 19.6994C25.6376 19.6994 19.6994 25.6376 19.6994 39.3987C19.6994 25.6376 13.7195 19.6994 0 19.6994Z"
								fill="white"
							/>
						</svg>
						{item.label}
					</span>
				))}
			</div>
		</div>
	);
}
