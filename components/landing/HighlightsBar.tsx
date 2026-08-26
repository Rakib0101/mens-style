import content from "@/data/site.json";

export default function HighlightsBar() {
  return (
    <div className="bg-brand text-white">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-sm font-medium">
        {content.highlights.map((item) => (
          <span key={item.label} className="flex items-center gap-2">
            <svg viewBox="0 0 20 20" width="14" height="14" fill="currentColor" aria-hidden>
              <path d="M10 1l2.2 5.5L18 8l-5 3.6L14.5 18 10 14.5 5.5 18 7 11.6 2 8l5.8-1.5Z" />
            </svg>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
