import { requireAdminRole } from "@/lib/auth";
import { getAllUsers } from "@/lib/users";
import { createUserAction, deleteUserAction } from "@/app/admin/actions";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";

const ERROR_MESSAGES: Record<string, string> = {
  missing: "Username and password are required.",
  exists: "That username is already taken.",
  self: "You can't delete your own account.",
  lastadmin: "Can't delete the last remaining admin.",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await requireAdminRole();
  const { error } = await searchParams;
  const allUsers = await getAllUsers();

  return (
    <div className="px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-lg font-bold text-ink">Users</h1>

      <div className="mx-auto max-w-3xl space-y-6">
        {error && ERROR_MESSAGES[error] ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {ERROR_MESSAGES[error]}
          </p>
        ) : null}

        <section className="rounded-xl border border-surface-line bg-white p-4">
          <div className="divide-y divide-surface-line">
            {allUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-ink">
                    {u.username}{" "}
                    {u.id === session.userId ? (
                      <span className="text-xs text-ink/40">(you)</span>
                    ) : null}
                  </p>
                  <p className="text-xs capitalize text-ink/50">{u.role}</p>
                </div>
                {u.id !== session.userId ? (
                  <form action={deleteUserAction.bind(null, u.id)}>
                    <ConfirmSubmitButton
                      confirmMessage={`Delete user "${u.username}"? This cannot be undone.`}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </ConfirmSubmitButton>
                  </form>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-surface-line bg-white p-6">
          <h2 className="mb-4 font-bold text-ink">Add user</h2>
          <form action={createUserAction} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/70">
                Username
              </label>
              <input
                name="username"
                required
                className="w-full rounded-lg border border-surface-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/70">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                className="w-full rounded-lg border border-surface-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-ink/70">
                Role
              </label>
              <select
                name="role"
                defaultValue="staff"
                className="w-full rounded-lg border border-surface-line px-3.5 py-2.5 text-sm outline-none focus:border-ink"
              >
                <option value="staff">Staff — can manage products only</option>
                <option value="admin">Admin — can also manage users</option>
              </select>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark"
            >
              Create user
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
