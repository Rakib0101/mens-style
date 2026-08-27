import content from "@/data/site.json";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
	return (
		<header className="sticky top-0 z-50 border-b border-surface-line bg-white/90 backdrop-blur">
			<div className="container-page flex h-16 items-center justify-between gap-4">
				<Link href="/" className="flex items-center gap-2">
					<Image src="/images/logo.png" alt="" width={224} height={44} />
				</Link>

				<nav className="hidden items-center gap-8 text-sm font-medium text-ink/70 md:flex">
					{content.nav.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className="transition-colors hover:text-ink"
						>
							{item.label}
						</a>
					))}
				</nav>

				<a
					href="#order"
					className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
				>
					{content.ctaLabel}
				</a>
			</div>
		</header>
	);
}
