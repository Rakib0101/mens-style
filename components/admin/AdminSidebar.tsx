"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";

const NAV_ITEMS = [
  { href: "/admin", label: "Products", exact: true },
  { href: "/admin/products/new", label: "Add product", exact: true },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-surface-line bg-white">
      <div className="border-b border-surface-line px-6 py-5">
        <p className="font-bold text-ink">Mens Style</p>
        <p className="text-xs text-ink/50">Admin dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-ink text-white"
                  : "text-ink/70 hover:bg-surface-muted hover:text-ink"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <form action={logoutAction} className="border-t border-surface-line p-3">
        <button
          type="submit"
          className="w-full rounded-lg border border-surface-line px-3 py-2 text-sm font-medium text-ink/70 hover:bg-surface-muted"
        >
          Log out
        </button>
      </form>
    </aside>
  );
}
