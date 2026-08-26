"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import content from "@/data/site.json";
import { formatPrice } from "@/lib/format";
import type { OrderPayload } from "@/lib/types";

type BuyableProduct = {
  slug: string;
  title: string;
  price: number;
  comparePrice?: number | null;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  rating?: { value: number; count: number };
};

const FLAGSHIP = content.flagshipProduct as BuyableProduct;
const RELATED = content.relatedProducts as BuyableProduct[];
const ZONES = content.deliveryZones;
const T = content.orderSection;

const BD_PHONE_RE = /^01[3-9]\d{8}$/;

type FbqFn = (...args: unknown[]) => void;

function trackLead(value: number) {
  if (typeof window === "undefined") return;
  const fbq = (window as unknown as { fbq?: FbqFn }).fbq;
  fbq?.("track", "Lead", { value, currency: "BDT" });
}

export default function OrderExperience() {
  const router = useRouter();
  const [selected, setSelected] = useState<BuyableProduct>(FLAGSHIP);
  const [size, setSize] = useState(FLAGSHIP.sizes[0] ?? "");
  const [color, setColor] = useState(FLAGSHIP.colors[0]?.name ?? "");
  const [qty, setQty] = useState(1);
  const [zoneIndex, setZoneIndex] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function selectProduct(product: BuyableProduct) {
    setSelected(product);
    setSize(product.sizes[0] ?? "");
    setColor(product.colors[0]?.name ?? "");
    setQty(1);
    document
      .getElementById("order")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const zone = ZONES[zoneIndex];
  const subtotal = selected.price * qty;
  const total = subtotal + zone.charge;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (honeypot) return;

    if (!name.trim() || !BD_PHONE_RE.test(phone.trim()) || !address.trim()) {
      setErrorMsg("সব তথ্য সঠিকভাবে পূরণ করুন (সঠিক মোবাইল নম্বর দিন)।");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);

    const payload: OrderPayload = {
      productSlug: selected.slug,
      productTitle: selected.title,
      size,
      color,
      qty,
      unitPrice: selected.price,
      deliveryZoneLabel: zone.label,
      deliveryCharge: zone.charge,
      totalPrice: total,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      honeypot,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "failed");

      trackLead(total);
      router.push("/order-success");
    } catch {
      setStatus("error");
      setErrorMsg("দুঃখিত, অর্ডারটি সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।");
    }
  }

  return (
    <>
      <section id="related" className="bg-surface-muted py-16 sm:py-24">
        <div className="container-page text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            {content.relatedSection.eyebrow}
          </p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
            {content.relatedSection.title}
          </h2>

          <div className="mt-10 grid grid-cols-2 gap-4 text-left lg:grid-cols-4">
            {RELATED.map((product) => (
              <button
                key={product.slug}
                type="button"
                onClick={() => selectProduct(product)}
                className={`overflow-hidden rounded-lg border bg-white text-left transition-colors ${
                  selected.slug === product.slug
                    ? "border-brand"
                    : "border-surface-line hover:border-ink/30"
                }`}
              >
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  width={600}
                  height={750}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-medium text-ink">
                    {product.title}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-semibold text-brand">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice ? (
                      <span className="text-xs text-ink/40 line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-2 flex gap-1">
                    {product.colors.map((c) => (
                      <span
                        key={c.name}
                        className="h-3 w-3 rounded-full border border-black/10"
                        style={{ background: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="order" className="scroll-mt-20 py-16 sm:py-24">
        <div className="container-page">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">
              {T.eyebrow}
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{T.title}</h2>
            <p className="mx-auto mt-2 max-w-md text-ink/60">{T.subtitle}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-start"
          >
            <div className="rounded-lg border border-surface-line bg-white p-5 lg:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                {T.yourProductLabel}
              </p>

              <div className="mt-3 flex gap-4">
                <Image
                  src={selected.images[0]}
                  alt={selected.title}
                  width={160}
                  height={200}
                  className="aspect-[4/5] w-24 rounded-md object-cover sm:w-32"
                />
                <div>
                  <h3 className="font-semibold text-ink">{selected.title}</h3>
                  {selected.rating ? (
                    <p className="mt-1 text-sm text-ink/60">
                      ★ {selected.rating.value} ({selected.rating.count})
                    </p>
                  ) : null}
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-semibold text-brand">
                      {formatPrice(selected.price)}
                    </span>
                    {selected.comparePrice ? (
                      <span className="text-sm text-ink/40 line-through">
                        {formatPrice(selected.comparePrice)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-ink">{T.colorLabel}</p>
                <div className="mt-2 flex gap-2">
                  {selected.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                      className={`h-8 w-8 rounded-full border-2 ${
                        color === c.name ? "border-brand" : "border-transparent"
                      }`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-ink">{T.sizeLabel}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`rounded-md border px-4 py-1.5 text-sm font-medium ${
                        size === s
                          ? "border-brand bg-brand text-white"
                          : "border-surface-line text-ink/70"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium text-ink">{T.qtyLabel}</p>
                <div className="mt-2 inline-flex items-center rounded-md border border-surface-line">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 text-ink/70"
                    aria-label="decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(10, q + 1))}
                    className="px-3 py-1.5 text-ink/70"
                    aria-label="increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-6 border-t border-surface-line pt-6">
                <p className="text-sm font-semibold text-ink">{T.formTitle}</p>

                <div className="mt-3 grid gap-4">
                  <label className="block">
                    <span className="text-sm text-ink/70">{T.nameLabel}</span>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={T.namePlaceholder}
                      className="mt-1 w-full rounded-md border border-surface-line px-3 py-2.5 text-sm outline-none focus:border-brand"
                    />
                  </label>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-sm text-ink/70">{T.phoneLabel}</span>
                      <input
                        required
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder={T.phonePlaceholder}
                        className="mt-1 w-full rounded-md border border-surface-line px-3 py-2.5 text-sm outline-none focus:border-brand"
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm text-ink/70">{T.zoneLabel}</span>
                      <select
                        value={zoneIndex}
                        onChange={(e) => setZoneIndex(Number(e.target.value))}
                        className="mt-1 w-full rounded-md border border-surface-line bg-white px-3 py-2.5 text-sm outline-none focus:border-brand"
                      >
                        {ZONES.map((z, i) => (
                          <option key={z.label} value={i}>
                            {z.label} ({formatPrice(z.charge)})
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-sm text-ink/70">{T.addressLabel}</span>
                    <textarea
                      required
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={T.addressPlaceholder}
                      className="mt-1 w-full rounded-md border border-surface-line px-3 py-2.5 text-sm outline-none focus:border-brand"
                    />
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-surface-line bg-surface-muted p-5 lg:sticky lg:top-24">
              <p className="font-semibold text-ink">{T.summaryTitle}</p>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-ink/70">
                  <span>{T.subtotalLabel}</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink/70">
                  <span>{T.deliveryLabel}</span>
                  <span>{formatPrice(zone.charge)}</span>
                </div>
                <div className="flex justify-between border-t border-surface-line pt-2 font-semibold text-ink">
                  <span>{T.totalLabel}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <p className="mt-4 rounded-md border border-brand/30 bg-brand/5 px-3 py-2 text-xs text-brand">
                {T.codNote}
              </p>

              {status === "error" && errorMsg ? (
                <p className="mt-3 text-xs text-brand" role="alert">
                  {errorMsg}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-4 w-full rounded-full bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
              >
                {status === "submitting" ? T.submittingLabel : T.submitLabel}
              </button>

              <p className="mt-3 text-center text-xs text-ink/50">{T.afterSubmitNote}</p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
