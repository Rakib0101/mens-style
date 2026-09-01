import { requireAdminRole } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { updateSettingsAction } from "@/app/admin/actions";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  await requireAdminRole();
  const settings = await getSiteSettings();

  return (
    <div className="px-4 py-8 sm:px-8">
      <h1 className="text-lg font-bold text-ink">Site settings</h1>
      <p className="mb-6 max-w-2xl text-sm text-ink/50">
        Things that apply across the whole site. Each product&rsquo;s own page
        content — hero, banner, why-choose-us — is edited from that product&rsquo;s
        edit page instead.
      </p>
      <SettingsForm action={updateSettingsAction} settings={settings} />
    </div>
  );
}
