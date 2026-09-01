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
    <div className="min-h-screen bg-surface-muted">
      <AdminSidebar username={session.username} role={session.role} />
      <main className="ml-64 min-h-screen">{children}</main>
    </div>
  );
}
