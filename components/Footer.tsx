import Image from "next/image";
import content from "@/data/site.json";

const SOCIAL_ICON_PATHS: Record<string, string> = {
  facebook:
    "M13.5 21v-7.5h2.5l.5-3H13.5V8.5c0-.9.25-1.5 1.6-1.5H16.5V4.3C16.2 4.26 15.2 4.17 14.05 4.17c-2.4 0-4.05 1.46-4.05 4.15V10.5H7.5v3H10V21h3.5Z",
  twitter:
    "M18.9 6.6c-.5.2-1 .4-1.6.5.6-.35 1-.9 1.2-1.55-.55.32-1.15.55-1.8.68A2.83 2.83 0 0 0 14.5 5c-1.56 0-2.83 1.26-2.83 2.83 0 .22.02.44.07.65-2.35-.12-4.44-1.25-5.84-2.95a2.8 2.8 0 0 0-.38 1.42c0 .98.5 1.85 1.26 2.35-.46-.02-.9-.14-1.28-.35v.03c0 1.37.98 2.51 2.27 2.77-.24.06-.49.1-.75.1-.18 0-.36-.02-.53-.05.36 1.12 1.4 1.94 2.64 1.96A5.68 5.68 0 0 1 5 15.42a8 8 0 0 0 4.34 1.27c5.2 0 8.05-4.31 8.05-8.05v-.37c.55-.4 1.03-.9 1.51-1.47Z",
  instagram:
    "M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Zm0 6.1a2.4 2.4 0 1 1 0-4.8 2.4 2.4 0 0 1 0 4.8Zm4.7-6.25a.86.86 0 1 1-1.72 0 .86.86 0 0 1 1.72 0ZM20 8c-.06-1.2-.33-2.26-1.2-3.13C17.93 4 16.87 3.73 15.67 3.67 14.44 3.6 9.56 3.6 8.33 3.67 7.13 3.73 6.07 4 5.2 4.87 4.33 5.74 4.06 6.8 4 8c-.07 1.23-.07 6.11 0 7.34.06 1.2.33 2.26 1.2 3.13.87.87 1.93 1.14 3.13 1.2 1.23.07 6.11.07 7.34 0 1.2-.06 2.26-.33 3.13-1.2.87-.87 1.14-1.93 1.2-3.13.07-1.23.07-6.1 0-7.34ZM18.5 16.5a3.1 3.1 0 0 1-1.75 1.75c-1.21.48-4.08.37-5.75.37s-4.54.11-5.75-.37a3.1 3.1 0 0 1-1.75-1.75c-.48-1.21-.37-4.08-.37-5.75s-.11-4.54.37-5.75A3.1 3.1 0 0 1 5.25 3.25C6.46 2.77 9.33 2.88 11 2.88s4.54-.11 5.75.37a3.1 3.1 0 0 1 1.75 1.75c.48 1.21.37 4.08.37 5.75s.11 4.54-.37 5.75Z",
};

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-page flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Image src="/images/logo-mark.svg" alt="" width={32} height={32} />
          <span className="text-lg font-semibold">{content.brand.name}</span>
        </div>

        <div className="flex flex-col gap-1 text-sm text-white/70 sm:items-end">
          <span>{content.brand.phones.join(" · ")}</span>
          <span>{content.brand.address}</span>
        </div>

        <div className="flex items-center gap-3">
          {Object.entries(content.brand.social).map(([key, href]) => {
            const d = SOCIAL_ICON_PATHS[key];
            if (!d || !href) return null;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={key}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-brand"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d={d} />
                </svg>
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
