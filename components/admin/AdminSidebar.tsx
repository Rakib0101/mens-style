"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import type { Role } from "@/lib/db/schema";

const NAV_ITEMS = [
  { href: "/admin", label: "Products", exact: true, adminOnly: false },
  { href: "/admin/products/new", label: "Add product", exact: true, adminOnly: false },
  { href: "/admin/orders", label: "Orders", exact: false, adminOnly: false },
  { href: "/admin/users", label: "Users", exact: false, adminOnly: true },
  { href: "/admin/settings", label: "Settings", exact: false, adminOnly: true },
];

export default function AdminSidebar({
  username,
  role,
}: {
  username: string;
  role: Role;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-surface-line bg-white">
      <div className="border-b border-surface-line px-6 py-5">
        <p className="font-bold text-ink">Mens Style</p>
        <p className="text-xs text-ink/50">Admin dashboard</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.filter((item) => !item.adminOnly || role === "admin").map((item) => {
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

      <div className="border-t border-surface-line p-3">
        <p className="truncate px-1 pb-2 text-xs text-ink/50">
          {username} <span className="text-ink/30">&middot;</span> {role}
        </p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-lg border border-surface-line px-3 py-2 text-sm font-medium text-ink/70 hover:bg-surface-muted"
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
