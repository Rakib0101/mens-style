"use client";

import Image from "next/image";
import type { SiteSettings } from "@/lib/db/schema";
import { Field, RowSection, SectionHeader, inputCls, useRows } from "@/components/admin/form-helpers";
import FilePreviewInput from "@/components/admin/FilePreviewInput";
import ToggleSwitch from "@/components/admin/ToggleSwitch";

export default function SettingsForm({
  action,
  settings,
}: {
  action: (formData: FormData) => void;
  settings: SiteSettings;
}) {
  const zones = useRows(settings.deliveryZones.length || 1);
  const whyItems = useRows(settings.whyChooseUs.length || 1);

  return (
    <form action={action} className="max-w-3xl space-y-6">
      <section className="space-y-4 rounded-xl border border-surface-line bg-white p-6">
        <SectionHeader
          title="Homepage sections"
          description="Turn optional sections on or off without losing their content."
        />
        <div className="space-y-3">
          <ToggleSwitch
            name="showQualityBanner"
            defaultChecked={settings.showQualityBanner}
            label="Quality banner"
            description="The dark banner with badges and a photo, shown below the product details."
          />
          <ToggleSwitch
            name="showRelatedProducts"
            defaultChecked={settings.showRelatedProducts}
            label="Related products"
            description="The “related styles” grid shown above the order form."
          />
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-surface-line bg-white p-6">
        <SectionHeader
          title="Contact info"
          description="Shown in the site footer and used for SEO metadata."
        />
        <Field label="Phone numbers — comma separated">
          <input
            name="phones"
            defaultValue={settings.phones.join(", ")}
            className={inputCls}
          />
        </Field>
        <Field label="Address">
          <textarea
            name="address"
            rows={2}
            defaultValue={settings.address}
            className={inputCls}
          />
        </Field>
        <Field label="Facebook page URL">
          <input name="facebookUrl" defaultValue={settings.facebookUrl} className={inputCls} />
        </Field>
      </section>

      <RowSection
        title="Delivery zones"
        description="First zone is treated as the “Dhaka” rate; the rest apply everywhere else."
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
              className={`${inputCls} flex-1`}
            />
            <input
              name="zoneCharge"
              type="number"
              min={0}
              placeholder="Charge (৳)"
              defaultValue={settings.deliveryZones[i]?.charge}
              className={`${inputCls} w-32`}
            />
          </div>
        )}
      />

      <RowSection
        title="Why choose us — bullets"
        description="The four-column feature grid on the homepage."
        ids={whyItems.ids}
        onAdd={whyItems.add}
        onRemove={whyItems.remove}
        addLabel="+ Add bullet"
        renderRow={(i) => (
          <div className="space-y-2">
            <div className="flex gap-3">
              <input
                name="whyNumber"
                placeholder="No. (e.g. 01)"
                defaultValue={settings.whyChooseUs[i]?.number}
                className={`${inputCls} w-20`}
              />
              <input
                name="whyTitle"
                placeholder="Title"
                defaultValue={settings.whyChooseUs[i]?.title}
                className={`${inputCls} flex-1`}
              />
            </div>
            <textarea
              name="whyDesc"
              rows={2}
              placeholder="Description"
              defaultValue={settings.whyChooseUs[i]?.desc}
              className={inputCls}
            />
          </div>
        )}
      />

      <section
        className={`space-y-4 rounded-xl border border-surface-line bg-white p-6 ${
          settings.showQualityBanner ? "" : "opacity-50"
        }`}
      >
        <SectionHeader
          title="Quality banner content"
          description={
            settings.showQualityBanner
              ? "Currently shown on the homepage."
              : "Currently hidden — turn it back on above to show it."
          }
        />
        <Field label="Title">
          <input
            name="qualityBannerTitle"
            defaultValue={settings.qualityBannerTitle}
            className={inputCls}
          />
        </Field>
        <Field label="Description">
          <textarea
            name="qualityBannerDesc"
            rows={2}
            defaultValue={settings.qualityBannerDesc}
            className={inputCls}
          />
        </Field>
        <Field label="Badges — comma separated">
          <input
            name="qualityBannerBadges"
            defaultValue={settings.qualityBannerBadges.join(", ")}
            className={inputCls}
          />
        </Field>
        <Field label="Banner image">
          {settings.qualityBannerImage ? (
            <div className="relative mb-3 h-32 w-48 overflow-hidden rounded-lg bg-surface-muted">
              <Image
                src={settings.qualityBannerImage}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
            </div>
          ) : null}
          <input
            type="hidden"
            name="currentQualityBannerImage"
            value={settings.qualityBannerImage}
          />
          <FilePreviewInput name="qualityBannerImage" />
        </Field>
      </section>

      <div className="sticky bottom-0 border-t border-surface-line bg-surface-muted/95 py-4 backdrop-blur">
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
