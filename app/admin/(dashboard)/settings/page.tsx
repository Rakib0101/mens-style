import { requireAdminRole } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { updateSettingsAction } from "@/app/admin/actions";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  await requireAdminRole();
  const settings = await getSiteSettings();

  return (
    <div className="px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-lg font-bold text-ink">Site settings</h1>
      <SettingsForm action={updateSettingsAction} settings={settings} />
    </div>
  );
}
