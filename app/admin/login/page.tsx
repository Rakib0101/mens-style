import type { Metadata } from "next";
import { loginAction } from "@/app/admin/actions";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <form
        action={loginAction}
        className="w-full max-w-sm space-y-4 rounded-xl border border-surface-line bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-bold text-ink">Admin Login</h1>

        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            Incorrect password. Please try again.
          </p>
        ) : null}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-ink/70">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="w-full rounded-lg border border-surface-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-ink py-2.5 text-sm font-bold text-white transition-colors hover:bg-ink/90"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
