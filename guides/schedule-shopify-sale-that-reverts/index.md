---
layout: guide.njk
title: "How to schedule a Shopify sale that ends itself (and puts prices back)"
description: "Four ways to run a timed sale on Shopify — automatic discounts, compare-at prices, Launchpad, or a scheduled edit with a verified revert — and which fits."
slug: schedule-shopify-sale-that-reverts
date: 2026-09-15
updated: 2026-09-15
related: [bulk-edit-prices-shopify, deleted-shopify-products-recovery]
draft: true
howto:
  name: "Schedule a sale with a verified automatic revert"
  steps:
    - name: "Test on ten products first"
      text: "Filter to a small set, run the full schedule once with a revert time a few minutes out, and read the receipt before trusting the real dates."
    - name: "Filter the products the sale applies to"
      text: "Choose a collection, tag, vendor, or product type. The set is re-evaluated when the schedule fires, so products added later are included."
    - name: "Define the price change"
      text: "Decrease by percent or amount, or set a fixed price. Preview shows every variant's current and new price before anything is scheduled."
    - name: "Set the start and the auto-revert time"
      text: "Both in your store's timezone. The revert restores each item to the value it had when the sale started, not to a number you type."
    - name: "Read the receipts"
      text: "One email when the sale starts and one when it reverts, each listing every item re-read from Shopify and verified — and any item flagged because someone changed it during the sale."
faq:
  - q: "Does an automatic discount show the crossed-out price on my product page?"
    a: "No. Shopify applies automatic discounts in the cart and at checkout. The product page shows the regular price unless your theme has been customized to preview the discount. A strikethrough on the product page comes from the compare-at price, which a discount doesn't touch."
  - q: "Can Shopify schedule a compare-at price change natively?"
    a: "Not on Basic, Grow, or Advanced. Launchpad does it, but only on Shopify Plus. Shopify Flow has a scheduled trigger but no action that sets a variant's price. Everything else is a person, a CSV, or an app."
  - q: "What if I edit a price by hand during the sale?"
    a: "With a manual or CSV revert, your hand edit gets overwritten at the end. With a conflict-aware revert, that item is flagged instead of restored, and you decide. Either way, note what you changed so the end of the sale isn't a surprise."
  - q: "What timezone do schedules use?"
    a: "Shopify discounts use the timezone shown in your admin. VerifiedBulk schedules are entered and displayed in your store's timezone too. Daylight-saving changes are handled, but if a sale straddles the switch, check the revert time once more."
  - q: "Can I end a sale early?"
    a: "Automatic discounts: edit the end date. Launchpad: stop the event from its dashboard. Scheduled edits: cancel the pending schedule or run the revert as a normal undo from the job's report."
---

<!-- Verified 2026-09-15 against:
     https://help.shopify.com/en/manual/discounts/discount-types/percentage-fixed-amount (Active dates, Set end date, Applies to)
     https://help.shopify.com/en/manual/discounts/discount-methods/automatic-discounts (25 active max incl. apps; applied in cart and at checkout)
     https://help.shopify.com/en/manual/promoting-marketing/create-marketing/launchpad (Plus only) + /launchpad-examples ("After the event ends, your prices change back to their pre-sale values")
     https://help.shopify.com/en/manual/shopify-flow (free on Basic/Grow/Advanced/Plus) + /reference/triggers/scheduled-time
     Flow "no action sets a variant price": community.shopify.com thread 401489 (Shopify staff reply), stated as such below
     https://help.shopify.com/en/manual/shopify-admin/productivity-tools/bulk-editing (Bulk edit, Columns, Save)
     https://help.shopify.com/en/manual/products/import-export/import-products (Overwrite products with matching handles; can't be canceled) -->

You want three things from a sale: the sale price shows, the old price shows crossed out next to it, and on the morning it ends the prices go back on their own. Shopify gives you the first one easily, the second one with some work, and the third one only on its most expensive plan. This guide walks the four honest options, in order of how little they ask of you, and says plainly where each one stops.

## First, decide what "on sale" needs to look like

Two different mechanisms produce two different customer experiences, and most of the confusion in the community threads comes from mixing them up.

- **A discount** leaves your product prices alone and takes money off in the cart and at checkout. The product page keeps showing the regular price.
- **A compare-at price** is a real price edit: you lower **Price** and put the old number in **Compare-at price**. Themes render that as the strikethrough. Nothing is taken off at checkout, because the price already is the sale price.

If "customers see the deal on the product page" matters to you, you are in compare-at territory, and compare-at is where the ending gets hard.

<!-- IMAGE (you produce): inline SVG, two product cards side by side — left "Regular $40, discount applied at checkout", right "$32 with $40 struck through". Site colors. -->

## Option 1: an automatic discount with an end date

The cleanest native option, and enough for a lot of stores.

1. In Shopify admin go to **Discounts** and click **Create discount**.
2. Choose **Amount off products** (or **Amount off orders**).
3. Under **Method**, select **Automatic discount**.
4. Under **Applies to**, pick **Specific collections** or **Specific products**.
5. In **Active dates**, set the start date and time, then click **Set end date** and set when it ends. The times are in the timezone shown in your admin.

<!-- IMAGE (I capture): images/discount-active-dates.png — the Active dates panel of a new automatic discount with an end date set. Crop to the panel. Alt: "Shopify discount Active dates panel with a start and an end date set". -->

**Where it suffices.** Storewide or collection-wide percentages, "buy X get Y", free shipping weekends. It ends itself, nothing is written to your products, there is nothing to revert.

**Where it runs out.**
- No strikethrough on the product page (see the FAQ). Some themes and apps can preview the discount, but that is theme work, not a switch.
- A store can have at most **25 active automatic discounts**, and that count includes discounts created by apps. Twelve category-specific sales plus a few app promotions and you are at the ceiling.
- Different prices per product ("this jacket to $79, that one to $65") is not what discounts are for.

## Option 2: change compare-at prices yourself, and change them back yourself

This is what most non-Plus stores actually do for BFCM, and it works right up until the ending.

**Setting the sale.** From **Products**, select the products and click **Bulk edit**. Click **Columns** and add **Compare-at price** and **Price** if they aren't showing. Type the values, then click **Save**. (For a percentage across many products you do the arithmetic yourself, or use a spreadsheet.) The CSV route is the same idea at scale: **Products** → **Export**, edit the **Price** and **Compare-at price** columns, then **Products** → **Import** with **Overwrite products with matching handles** checked.

<!-- IMAGE (I capture): images/bulk-editor-compare-at.png — bulk editor with Price and Compare-at price columns visible on 4–5 products, one row mid-edit. Alt: "Shopify bulk editor showing Price and Compare-at price columns". -->

**Where it suffices.** A small set of products, a sale you are awake for, and a calendar reminder you trust.

**Where it runs out, and this is the whole reason this page exists.**
- The ending is a person. Someone has to open the bulk editor at the right hour, put every price back, and clear every compare-at. Sales end at midnight and on Mondays; people don't.
- A CSV re-import as the "revert" overwrites everything in the file. If a colleague fixed a typo in a price during the sale, the import puts the old typo back. Once started, an import can't be canceled.
- Nothing checks the result. The bulk editor and the CSV importer both report success when the request was accepted, not when every product actually shows the new value. On a large save, a few rows silently not taking is a known experience in this category.

## Option 3: Launchpad (Shopify Plus only)

Launchpad is Shopify's own scheduler for sales events, and it does the right thing: an event can change product prices at the start, and Shopify's own docs say that after the event ends, "your prices change back to their pre-sale values." It sets the compare-at price to the regular price during the event, so the strikethrough shows. Discount types are a percentage, a fixed amount off, or a new unit price.

The catch is one line in the docs: "The Launchpad app is available only to stores on the Shopify Plus plan." If you are on Basic, Grow, or Advanced, this option doesn't exist for you.

A related dead end: **Shopify Flow** is free on every plan and has a **Scheduled time** trigger, so it looks like it should be able to do this. It can't. Flow has no built-in action that sets a variant's price; the workarounds in the community forum go through raw Admin API requests, which is developer territory.

## Option 4: a scheduled edit with a verified revert

This is where an app earns its place, and it is what VerifiedBulk was built around. The shape is: schedule the price change and the revert together, snapshot the real prices at the moment the sale starts, restore from that snapshot at the end, and then re-read every product to prove it.

<!-- IMAGE (you produce): inline SVG timeline — "Schedule" → "Sale starts: snapshot + edit + verify + receipt" → "Sale ends: restore from snapshot + verify + receipt", with a side branch "changed during the sale → flagged, not overwritten". Site colors. -->

<svg viewBox="0 0 720 200" role="img" aria-label="Timeline: schedule, sale starts with snapshot and verification, sale ends with restore and verification; items changed during the sale are flagged instead of overwritten" style="width:100%;height:auto;margin:8px 0 24px">
  <defs><marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10z" fill="#4A564F"/></marker></defs>
  <line x1="60" y1="70" x2="660" y2="70" stroke="#DDE1DA" stroke-width="3"/>
  <g font-family="Instrument Sans, system-ui, sans-serif" font-size="14" fill="#1C2622">
    <circle cx="80" cy="70" r="9" fill="#0E7B54"/><text x="80" y="42" text-anchor="middle" font-weight="600">Schedule</text><text x="80" y="104" text-anchor="middle" fill="#4A564F">start + revert times</text>
    <circle cx="340" cy="70" r="9" fill="#0E7B54"/><text x="340" y="42" text-anchor="middle" font-weight="600">Sale starts</text><text x="340" y="104" text-anchor="middle" fill="#4A564F">snapshot · edit · verify · receipt</text>
    <circle cx="620" cy="70" r="9" fill="#0E7B54"/><text x="620" y="42" text-anchor="middle" font-weight="600">Sale ends</text><text x="620" y="104" text-anchor="middle" fill="#4A564F">restore · verify · receipt</text>
    <path d="M480 76 Q480 150 560 150" fill="none" stroke="#A87508" stroke-width="2" marker-end="url(#a)"/>
    <text x="440" y="176" fill="#A87508" font-weight="600">changed during the sale → flagged, never overwritten</text>
  </g>
</svg>

**How it works, step by step.**

1. **Filter** the products the sale applies to: a collection, a tag, a vendor, a type, a price range. The live count tells you how many match right now.
2. **Define the edit**: decrease price by a percent or an amount, or set a price. The preview lists every variant with its current and new price before anything is scheduled.
3. **Schedule** the start time and the **auto-revert** time, in your store's timezone.
4. At the start, the app snapshots each variant's real current price, writes the sale price, re-reads every variant from Shopify, and emails you a receipt listing what was verified.
5. At the end, it restores each item to its snapshot value, re-reads everything again, and emails the second receipt.

<!-- IMAGE (I capture): images/app-schedule-revert.png — VerifiedBulk preview step with the "Or schedule it" section filled: start time and auto-revert time set. Alt: "Scheduling a price edit with an auto-revert time in VerifiedBulk". -->
<!-- IMAGE (I capture): images/app-revert-receipt.png — the emailed revert receipt, or the completed revert job's report, showing N of N restored and verified. Alt: "Verification report for an automatic revert: every item restored and verified". -->

**Two behaviors worth knowing before you rely on it.**

- The product set is re-evaluated when the schedule fires, not frozen when you create it. "20% off the Sale collection" includes products you add to the collection the night before. The preview says so.
- The revert is conflict-aware. If someone changed a price by hand during the sale, that item is not silently restored; it is flagged in the receipt with the three values (before the sale, during, now) and you choose. A sale that ends at 3 am should never overwrite a human's decision.

**Where it runs out.** It is an app, so it costs a plan (there is a free tier capped by products per edit). And it edits real prices, which is the point, but it means the product page shows the sale price to everyone, not just to customers who meet a discount condition.

{% cta "Schedule a verified sale with VerifiedBulk" %}

## The BFCM checklist

- **Test on ten.** Filter to ten products, schedule a start five minutes out and a revert five minutes after that. Read both receipts. Then schedule the real thing with the same edit.
- **Write the dates in the store's timezone,** and check them against your marketing calendar, which is probably in yours.
- **Decide compare-at behavior up front.** If the sale lowers **Price**, decide whether **Compare-at price** should be set to the old price (strikethrough) or left alone.
- **Freeze hand edits during the sale,** or at least tell the team. Every option on this page handles a mid-sale edit differently; the conflict-aware one is the only one that tells you it happened.
- **Keep the receipts.** The two emails are your record that the sale started and ended with the numbers you intended.

Prices are only one half of a safe bulk workflow; the other half is [bulk editing prices without breaking things](/guides/bulk-edit-prices-shopify/), and the worst case is covered in [what's recoverable after a delete](/guides/deleted-shopify-products-recovery/).
