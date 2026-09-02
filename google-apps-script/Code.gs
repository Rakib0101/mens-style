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
 * Sheet → dashboard sync — optional, one-time setup:
 * 4. APP_STATUS_WEBHOOK_URL below is already set to the staging site. If you
 *    later want status edits to reflect on the production site instead,
 *    change it there and redeploy (step 6).
 * 5. Run `installEditTrigger` once (▶ button, pick this function). It asks
 *    for permission the first time — that's normal, this is what lets the
 *    script call out to the site when you edit the Status / Support Manager /
 *    Summary / Courier ID columns.
 * 6. After pasting any code changes, redeploy: Deploy ➔ Manage deployments ➔
 *    the pencil icon ➔ Version: New version ➔ Deploy. Editing the code alone
 *    does not update the live webhook URL — this step does.
 *
 * Only orders placed AFTER step 4/5 are done carry the "App Order Id" this
 * sync matches on — older rows have nothing to match and are ignored.
 */

var SECRET = "mens_style_secret_key_2026";
var APP_STATUS_WEBHOOK_URL = "https://mens-style-git-staging-rakib0101s-projects.vercel.app/api/sheets-status-webhook";

var STATUS_COLUMN = 3; // C
var SUPPORT_MANAGER_COLUMN = 4; // D
var SUMMARY_COLUMN = 5; // E
var COURIER_COLUMN = 6; // F
var APP_ORDER_ID_COLUMN = 16; // P
var WATCHED_COLUMNS = [STATUS_COLUMN, SUPPORT_MANAGER_COLUMN, SUMMARY_COLUMN, COURIER_COLUMN];

function setSharedSecret() {
  PropertiesService.getScriptProperties().setProperty("SHARED_SECRET", SECRET);
}

// One-time: creates the installable trigger that lets onEditInstallable make
// network calls (a plain onEdit(e) simple trigger is not allowed to).
function installEditTrigger() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // Avoid creating duplicates if this is run more than once.
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "onEditInstallable") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger("onEditInstallable")
    .forSpreadsheet(ss)
    .onEdit()
    .create();
}

// Fires on every edit to the sheet. Only acts when one of the watched
// columns (Status / Support Manager / Summary / Courier ID) changed and the
// row has an App Order Id (P) to match against. Always sends the row's
// current values for all four so the app mirrors whatever is in the sheet,
// regardless of which single column triggered the edit.
function onEditInstallable(e) {
  try {
    if (!e || !e.range) return;
    if (WATCHED_COLUMNS.indexOf(e.range.getColumn()) === -1) return;

    var row = e.range.getRow();
    if (row === 1) return; // header row

    var sheet = e.range.getSheet();
    var appOrderId = sheet.getRange(row, APP_ORDER_ID_COLUMN).getValue();
    if (!appOrderId) return; // row predates the sync, or wasn't linked

    var status = normalizeStatus(sheet.getRange(row, STATUS_COLUMN).getValue());
    var supportManager = sheet.getRange(row, SUPPORT_MANAGER_COLUMN).getValue();
    var summary = sheet.getRange(row, SUMMARY_COLUMN).getValue();
    var courierId = sheet.getRange(row, COURIER_COLUMN).getValue();

    var secret = PropertiesService.getScriptProperties().getProperty("SHARED_SECRET") || SECRET;

    UrlFetchApp.fetch(APP_STATUS_WEBHOOK_URL, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        secret: secret,
        appOrderId: appOrderId,
        status: status, // may be null if the typed text didn't match a known status
        supportManager: String(supportManager || ""),
        summary: String(summary || ""),
        courierId: String(courierId || ""),
      }),
      muteHttpExceptions: true,
    });
  } catch (err) {
    // Never let a sync failure interrupt someone editing the sheet.
    console.error("Status sync failed: " + err);
  }
}

// Loose, case-insensitive match so small variations in what gets typed
// ("Delivered", "delivered ✓", "DELIVERED") still sync correctly.
function normalizeStatus(value) {
  var text = String(value || "").toLowerCase();
  if (text.indexOf("deliver") !== -1) return "delivered";
  if (text.indexOf("cancel") !== -1) return "cancelled";
  if (text.indexOf("confirm") !== -1) return "confirmed";
  if (text.indexOf("new") !== -1 || text.indexOf("pending") !== -1) return "pending";
  return null;
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
    // P: App Order Id (internal — links this row back to the dashboard)
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
