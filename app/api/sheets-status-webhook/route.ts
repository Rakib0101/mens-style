import { getOrderById, updateOrderStatus } from "@/lib/orders";
import type { OrderStatus } from "@/lib/db/schema";

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "delivered", "cancelled"];

/**
 * Called by the Google Apps Script's onEdit trigger when someone changes the
 * Status column in the order sheet — the reverse direction of the checkout
 * webhook. Only orders placed after the appOrderId column existed can be
 * matched; older rows have nothing to match against and are silently no-ops.
 */
export async function POST(request: Request) {
  let payload: { secret?: string; appOrderId?: number; status?: string };

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const expectedSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
  if (!expectedSecret || payload.secret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appOrderId = Number(payload.appOrderId);
  const status = String(payload.status || "").toLowerCase().trim() as OrderStatus;

  if (!Number.isInteger(appOrderId) || !VALID_STATUSES.includes(status)) {
    return Response.json({ error: "Invalid appOrderId or status." }, { status: 400 });
  }

  const order = await getOrderById(appOrderId);
  if (!order) {
    // Not an error — likely a row from before this sync existed.
    return Response.json({ ok: true, matched: false });
  }

  await updateOrderStatus(appOrderId, status);
  return Response.json({ ok: true, matched: true });
}
