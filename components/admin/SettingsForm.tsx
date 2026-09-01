"use client";

import type { SiteSettings } from "@/lib/db/schema";
import { Field, RowSection, SectionHeader, inputCls, useRows } from "@/components/admin/form-helpers";

export default function SettingsForm({
  action,
  settings,
}: {
  action: (formData: FormData) => void;
  settings: SiteSettings;
}) {
  const zones = useRows(settings.deliveryZones.length || 1);

  return (
    <form action={action} className="max-w-4xl">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="space-y-3 rounded-xl border border-surface-line bg-white p-5">
          <SectionHeader
            title="Contact info"
            description="Shown in the site footer and used for SEO metadata."
          />
          <Field label="Phone numbers — comma separated">
            <input
              name="phones"
              defaultValue={settings.phones.join(", ")}
              className={`${inputCls} w-full`}
            />
          </Field>
          <Field label="Address">
            <textarea
              name="address"
              rows={2}
              defaultValue={settings.address}
              className={`${inputCls} w-full`}
            />
          </Field>
          <Field label="Facebook page URL">
            <input
              name="facebookUrl"
              defaultValue={settings.facebookUrl}
              className={`${inputCls} w-full`}
            />
          </Field>
        </section>

        <RowSection
          title="Delivery zones"
          description="First zone is treated as the “Dhaka” rate; the rest apply everywhere else. Applies site-wide across all products."
          ids={zones.ids}
          onAdd={zones.add}
          onRemove={zones.remove}
          addLabel="+ Add zone"
          renderRow={(i) => (
            <div className="flex items-center gap-3">
              <input
                name="zoneLabel"
                placeholder="Zone label (e.g. ঢাকা)"
                defaultValue={settings.deliveryZones[i]?.label}
                className={`${inputCls} min-w-0 flex-1`}
              />
              <input
                name="zoneCharge"
                type="number"
                min={0}
                placeholder="Charge (৳)"
                defaultValue={settings.deliveryZones[i]?.charge}
                className={`${inputCls} !w-32`}
              />
            </div>
          )}
        />
      </div>

      <div className="sticky bottom-0 mt-5 border-t border-surface-line bg-surface-muted/95 py-4 backdrop-blur">
        <button
          type="submit"
          className="rounded-lg bg-brand px-6 py-3 font-bold text-white hover:bg-brand-dark"
        >
          Save settings
        </button>
      </div>
    </form>
  );
}
