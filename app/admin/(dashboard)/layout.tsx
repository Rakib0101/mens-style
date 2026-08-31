import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser();

  return (
    <div className="flex min-h-screen bg-surface-muted">
      <AdminSidebar username={session.username} role={session.role} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
