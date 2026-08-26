# Mens Style — Landing Page

Single-product Facebook-ads landing page. No database, no admin panel — every order
is written straight to a Google Sheet, and the client manages orders (confirmation
calls, status) directly in that Sheet.

## Editing content

Everything on the page — product title/price/images/sizes/colors, spec table, size
chart, related products, delivery zones, all copy — lives in **`data/site.json`**.
Edit that file and redeploy; no component code needs to change for routine content
updates. `lib/types.ts` documents the expected shape.

Product photos go in `public/images/products` (flagship) and `public/images/related`
(the "See more styles" grid); reference their paths from `data/site.json`. The repo
ships with placeholder SVGs — swap them for real photos before launch.

## Local development

```bash
pnpm install
cp .env.local.example .env.local   # fill in the values below
pnpm dev
```

## Google Sheets setup (order storage)

1. Create a new Google Sheet. Add a header row:
   `Timestamp | Product | Size | Color | Qty | Unit Price | Delivery Zone | Delivery Charge | Total | Name | Phone | Address | Status`
2. Extensions ➔ Apps Script. Replace the contents with `google-apps-script/Code.gs`
   from this repo.
3. In `Code.gs`, set `SECRET` to a long random string, then run the
   `setSharedSecret` function once (▶ in the Apps Script toolbar) — this stores the
   secret in Script Properties so it isn't exposed anywhere else.
4. Deploy ➔ New deployment ➔ **Web app**. Execute as **Me**, access **Anyone**.
   Copy the deployment URL.
5. In `.env.local` (and in Vercel's Environment Variables), set:
   - `GOOGLE_SHEETS_WEBHOOK_URL` — the deployment URL from step 4
   - `GOOGLE_SHEETS_WEBHOOK_SECRET` — the same string you put in `SECRET`

Every order form submission is validated on the server, re-priced against
`data/site.json` (so a tampered client-side price is ignored), then forwarded to
this webhook, which appends one row per order with `Status` defaulting to
`Pending`. Update the `Status` column by hand as you confirm/ship each order.

## Optional: Meta (Facebook) Pixel

Set `NEXT_PUBLIC_FB_PIXEL_ID` to enable it — `PageView` fires automatically, and a
`Lead` event fires with the order total when a customer completes checkout. Leave it
blank to skip the pixel entirely.

## Deploy

Push to GitHub, import the repo in Vercel, paste in the env vars above, deploy.
# mens-style
