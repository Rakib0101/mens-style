import Link from "next/link";
import content from "@/data/site.json";

export default function OrderSuccessPage() {
  const s = content.orderSuccess;

  return (
    <section className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 className="mt-6 text-2xl font-bold text-ink sm:text-3xl">{s.title}</h1>
      <p className="mx-auto mt-3 max-w-md text-ink/60">{s.body}</p>

      <Link
        href="/"
        className="mt-8 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        {s.backLabel}
      </Link>
    </section>
  );
}
