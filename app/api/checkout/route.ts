import content from "@/data/site.json";
import type { OrderPayload } from "@/lib/types";

const PRODUCTS = [content.flagshipProduct, ...content.relatedProducts];
const BD_PHONE_RE = /^01[3-9]\d{8}$/;

export async function POST(request: Request) {
  let payload: OrderPayload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Bots that skip client-side JS still hit this route — silently "succeed"
  // without touching the Sheet instead of telling them what tripped the trap.
  if (payload.honeypot) {
    return Response.json({ ok: true });
  }

  const { productSlug, size, color, qty, name, phone, address, deliveryZoneLabel } = payload;

  // Re-derive price and delivery charge from the known catalog/zones rather
  // than trusting whatever the client sent — closes client-side price tampering.
  const product = PRODUCTS.find((p) => p.slug === productSlug);
  const zone = content.deliveryZones.find((z) => z.label === deliveryZoneLabel);

  if (
    !product ||
    !zone ||
    !name?.trim() ||
    !phone?.trim() ||
    !address?.trim() ||
    !size ||
    !color ||
    !Number.isInteger(qty) ||
    qty < 1 ||
    qty > 10
  ) {
    return Response.json(
      { error: "Please fill out all required fields correctly." },
      { status: 400 },
    );
  }

  if (!BD_PHONE_RE.test(phone.trim())) {
    return Response.json(
      { error: "Please enter a valid mobile number." },
      { status: 400 },
    );
  }

  const unitPrice = product.price;
  const deliveryCharge = zone.charge;
  const totalPrice = unitPrice * qty + deliveryCharge;

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.error(
      "Checkout: missing GOOGLE_SHEETS_WEBHOOK_URL/GOOGLE_SHEETS_WEBHOOK_SECRET env vars.",
    );
    return Response.json(
      { error: "Ordering is not configured yet. Please try again later." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: webhookSecret,
        productTitle: product.title,
        size,
        color,
        qty,
        unitPrice,
        deliveryZoneLabel: zone.label,
        deliveryCharge,
        totalPrice,
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      }),
    });

    const rawText = await res.text();
    let data: { status?: string; message?: string } | null = null;
    try {
      data = JSON.parse(rawText);
    } catch {
      // not json (e.g. Google html error page)
    }

    if (!res.ok || data?.status !== "success") {
      console.error(
        `Checkout: Google Sheet rejected with HTTP ${res.status}. Body:`,
        data || rawText.substring(0, 300),
      );
      throw new Error(data?.message || `Webhook rejected with HTTP ${res.status}`);
    }
  } catch (err) {
    console.error("Checkout: failed to write order to Google Sheet:", err);
    return Response.json(
      { error: "Failed to place order. Please check Google Sheets webhook." },
      { status: 500 },
    );
  }

  return Response.json({ ok: true });
}
