"use client";

import PasswordInput from "@/components/admin/PasswordInput";
import { inputCls, Field, SectionHeader } from "@/components/admin/form-helpers";

export default function ChangePasswordForm({
  action,
}: {
  action: (formData: FormData) => void;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-surface-line bg-white p-5">
      <SectionHeader
        title="Change password"
        description="Updates the password for the account you're currently logged in as."
      />
      <form action={action} className="space-y-3">
        <Field label="Current password">
          <PasswordInput name="currentPassword" required autoComplete="current-password" className={inputCls} />
        </Field>
        <Field label="New password">
          <PasswordInput name="newPassword" required autoComplete="new-password" className={inputCls} />
        </Field>
        <Field label="Confirm new password">
          <PasswordInput name="confirmPassword" required autoComplete="new-password" className={inputCls} />
        </Field>
        <button
          type="submit"
          className="rounded-lg bg-brand px-6 py-2.5 text-sm font-bold text-white hover:bg-brand-dark"
        >
          Update password
        </button>
      </form>
    </section>
  );
}
