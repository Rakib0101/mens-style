/**
 * Mens Style — order webhook.
 * Paste this into the Google Sheet's Extensions > Apps Script editor.
 *
 * One-time setup:
 * 1. Run `setSharedSecret` once (▶ button, pick this function) after editing
 *    the SECRET value below — it stores the secret in Script Properties so it
 *    never lives in the row data or in a URL. Then you can delete/blank the
 *    SECRET constant if you like; the stored property is what's checked.
 * 2. Deploy ➔ New deployment ➔ Web app. Execute as "Me", access "Anyone".
 * 3. Copy the deployment URL into GOOGLE_SHEETS_WEBHOOK_URL, and the same
 *    secret into GOOGLE_SHEETS_WEBHOOK_SECRET, in the Next.js app's env vars.
 *
 * Order status is tracked independently in the admin dashboard (not synced
 * from this Sheet) — this script only handles new orders coming in.
 */

var SECRET = "mens_style_secret_key_2026";

function setSharedSecret() {
  PropertiesService.getScriptProperties().setProperty("SHARED_SECRET", SECRET);
}

// Health check endpoint
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "active",
      message: "Mens Style Order Webhook is running successfully!"
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Verify secret
    var expected = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET") || SECRET;
    if (!expected || data.secret !== expected) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized: Invalid Secret" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();

    // Calculate next Order ID based on previous row (Column B)
    var nextOrderId = 101;
    if (lastRow > 1) {
      var prevOrderId = sheet.getRange(lastRow, 2).getValue();
      var parsed = parseInt(prevOrderId, 10);
      if (!isNaN(parsed)) {
        nextOrderId = parsed + 1;
      } else {
        nextOrderId = lastRow;
      }
    }

    // Current date and time in Bangladesh (Asia/Dhaka) timezone
    var formattedDate = Utilities.formatDate(new Date(), "Asia/Dhaka", "yyyy-MM-dd HH:mm:ss");

    // Product Title with Color
    var productName = data.productTitle || "";
    if (data.color) {
      productName += " - " + data.color;
    }

    // Size formatting (e.g. "L size" or "M size")
    var sizeFormatted = data.size || "";
    if (sizeFormatted && !sizeFormatted.toLowerCase().includes("size")) {
      sizeFormatted += " size";
    }

    // Phone formatted as text to preserve leading zero
    var phoneFormatted = "'" + (data.phone || "").toString().trim();

    // Append row matching updated columns:
    // A: Date
    // B: Order Id
    // C: Status
    // D: Support Manager
    // E: Summary
    // F: Courier ID
    // G: Product Name
    // H: Size
    // I: Customer Name
    // J: Phone
    // K: Address
    // L: Qty
    // M: Price Amount
    // N: shipping method
    // O: Payment Method
    // P: App Order Id (internal reference to the dashboard's own record)
    sheet.appendRow([
      formattedDate,                  // A: Date
      nextOrderId,                    // B: Order Id
      "New",                          // C: Status
      "",                             // D: Support Manager
      "",                             // E: Summary
      "",                             // F: Courier ID
      productName,                    // G: Product Name
      sizeFormatted,                  // H: Size
      data.name || "",                // I: Customer Name
      phoneFormatted,                 // J: Phone
      data.address || "",             // K: Address
      data.qty || 1,                  // L: Qty
      data.totalPrice || 0,           // M: Price Amount
      data.deliveryZoneLabel || "ঢাকার ভিতরে", // N: shipping method
      "cod",                          // O: Payment Method
      data.appOrderId || ""           // P: App Order Id
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", orderId: nextOrderId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
