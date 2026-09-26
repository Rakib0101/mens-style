import { requireAdminRole } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { changePasswordAction, updateSettingsAction } from "@/app/admin/actions";
import SettingsForm from "@/components/admin/SettingsForm";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

const PW_ERROR_MESSAGES: Record<string, string> = {
  missing: "All password fields are required.",
  mismatch: "New password and confirmation don't match.",
  short: "New password must be at least 8 characters.",
  wrong: "Current password is incorrect.",
};

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ pwerror?: string; pwsuccess?: string }>;
}) {
  await requireAdminRole();
  const settings = await getSiteSettings();
  const { pwerror, pwsuccess } = await searchParams;

  return (
    <div className="px-4 py-8 sm:px-8">
      <h1 className="text-lg font-bold text-ink">Site settings</h1>
      <p className="mb-6 max-w-2xl text-sm text-ink/50">
        Things that apply across the whole site. Each product&rsquo;s own page
        content — hero, banner, why-choose-us — is edited from that product&rsquo;s
        edit page instead.
      </p>
      <SettingsForm action={updateSettingsAction} settings={settings} />

      <div className="mt-6 max-w-4xl">
        {pwerror && PW_ERROR_MESSAGES[pwerror] ? (
          <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {PW_ERROR_MESSAGES[pwerror]}
          </p>
        ) : null}
        {pwsuccess ? (
          <p className="mb-3 rounded-md bg-green-50 px-3 py-2 text-sm text-green-700">
            Password updated.
          </p>
        ) : null}
        <ChangePasswordForm action={changePasswordAction} />
      </div>
    </div>
  );
}
