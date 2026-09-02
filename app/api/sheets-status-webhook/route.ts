import { getOrderById, updateOrderSync, type OrderSyncFields } from "@/lib/orders";
import type { OrderStatus } from "@/lib/db/schema";

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "delivered", "cancelled"];

/**
 * Called by the Google Apps Script's onEdit trigger when someone edits the
 * Status / Support Manager / Summary / Courier ID columns in the order sheet
 * — the reverse direction of the checkout webhook. Only orders placed after
 * the appOrderId column existed can be matched; older rows have nothing to
 * match against and are silently no-ops.
 */
export async function POST(request: Request) {
  let payload: {
    secret?: string;
    appOrderId?: number;
    status?: string;
    supportManager?: string;
    summary?: string;
    courierId?: string;
  };

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
  if (!Number.isInteger(appOrderId)) {
    return Response.json({ error: "Invalid appOrderId." }, { status: 400 });
  }

  const order = await getOrderById(appOrderId);
  if (!order) {
    // Not an error — likely a row from before this sync existed.
    return Response.json({ ok: true, matched: false });
  }

  // Every field is optional per-request — an edit to just the Courier ID
  // column, say, shouldn't require (or be able to clobber) the others.
  const fields: OrderSyncFields = {};
  const status = String(payload.status || "").toLowerCase().trim() as OrderStatus;
  if (VALID_STATUSES.includes(status)) fields.status = status;
  if (typeof payload.supportManager === "string") fields.supportManager = payload.supportManager;
  if (typeof payload.summary === "string") fields.summary = payload.summary;
  if (typeof payload.courierId === "string") fields.courierId = payload.courierId;

  if (Object.keys(fields).length > 0) {
    await updateOrderSync(appOrderId, fields);
  }

  return Response.json({ ok: true, matched: true });
}
