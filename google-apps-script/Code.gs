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
 */

var SECRET = "mens_style_secret_key_2026";

function setSharedSecret() {
  PropertiesService.getScriptProperties().setProperty("SHARED_SECRET", SECRET);
}

// Allows checking if the webhook is accessible in any browser tab
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

    // Checks script properties first; falls back to SECRET variable if setSharedSecret was not run
    var expected = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET") || SECRET;
    if (!expected || data.secret !== expected) {
      return ContentService
        .createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized: Invalid Secret" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    sheet.appendRow([
      new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
      data.productTitle || "",
      data.size || "",
      data.color || "",
      data.qty || 1,
      data.unitPrice || 0,
      data.deliveryZoneLabel || "",
      data.deliveryCharge || 0,
      data.totalPrice || 0,
      data.name || "",
      data.phone || "",
      data.address || "",
      "Pending",
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
