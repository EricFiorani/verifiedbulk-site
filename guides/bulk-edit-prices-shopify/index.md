---
layout: guide.njk
title: "How to bulk edit prices on Shopify (safely)"
description: "Shopify's bulk editor, the CSV import, and when each is enough — plus the three things neither does: preview the blast radius, verify the result, undo cleanly."
slug: bulk-edit-prices-shopify
date: 2026-09-15
updated: 2026-09-15
related: [schedule-shopify-sale-that-reverts, deleted-shopify-products-recovery]
draft: true
howto:
  name: "Bulk edit prices with Shopify's built-in bulk editor"
  steps:
    - name: "Select the products"
      text: "In Shopify admin go to Products, tick the products you want to change, then click Bulk edit."
    - name: "Show the price columns"
      text: "Click Columns and select Price (and Compare-at price if you need it)."
    - name: "Enter the new prices"
      text: "Type into each cell, or type one value and drag the fill handle down the column to copy it. Percent changes are your arithmetic; the editor only takes final numbers."
    - name: "Save"
      text: "Click Save. If a value is invalid the editor shows an error and nothing is saved until it's fixed. Don't navigate away before saving — unsaved work is lost."
    - name: "Check the result"
      text: "Open a few of the products you changed and confirm the price you see is the price you meant. The editor doesn't do this for you."
faq:
  - q: "Does Shopify's bulk editor have an undo?"
    a: "No. Once you click Save the previous values are gone unless you wrote them down or exported a CSV first. Archived products and the Archived tab don't help here — that's for whole products, not values."
  - q: "Can I change prices by a percentage in Shopify?"
    a: "Not in the bulk editor or the CSV import — both take final numbers. You do the math in a spreadsheet or use an app that offers percent and amount operations with a preview of the resulting prices."
  - q: "Will a CSV import delete anything?"
    a: "It can. With Overwrite products with matching handles checked, a blank cell in a non-required column overwrites the existing value with blank. A file sorted in a spreadsheet can lose image links. Changing option values recreates variant IDs. Shopify's own import docs list all three."
  - q: "How do I change prices for one collection only?"
    a: "Filter the Products list by collection (or export Products that match your search and filters), then bulk edit or import that set. Apps let you pick the collection as a filter and show the count before you commit."
  - q: "Product price or variant price?"
    a: "Prices live on variants. A product with one variant looks like it has a product price, but it's still the variant's price. Any bulk edit of prices is a per-variant edit, which is why previews and verification should list variants, not products."
---

<!-- Verified 2026-09-15 against:
     https://help.shopify.com/en/manual/shopify-admin/productivity-tools/bulk-editing (Bulk edit button, Columns, Save, drag-fill, keyboard; no undo mentioned)
     https://help.shopify.com/en/manual/products/variants/edit-variants (product → Variants → checkboxes → Bulk edit)
     https://help.shopify.com/en/manual/products/import-export/export-products (Export scopes; emailed when a product has >100 variants)
     https://help.shopify.com/en/manual/products/import-export/import-products (Import → Add file; "Overwrite products with matching handles"; 15 MB; can't be canceled; sorted-CSV image loss; option changes recreate variant IDs)
     https://help.shopify.com/en/manual/products/import-export/using-csv (column names "Price", "Compare-at price", "Cost per item"; blank non-required column overwrites as blank)
     Bulk-editor selection ceiling: NOT stated in Shopify's docs — kept out of copy pending the dev-store check (see slot below). -->

There are three ways to change many prices on Shopify at once, and two of them are built in. Use the built-in ones when they fit; they are free and there is nothing to install. This guide shows exactly how each works, where each one is genuinely enough, and the three things neither of them does that will eventually cost you a morning: showing the full set of changes before you commit, checking that the changes actually landed, and putting things back when they didn't.

## The three ways at a glance

| | Bulk editor | CSV export / import | Bulk editing app |
| --- | --- | --- | --- |
| Best for | A page of products, one-off changes | Large catalogs, spreadsheet-native teams | Repeated or scheduled changes, anything you'd want to undo |
| Percent / amount math | You do it | You do it in the spreadsheet | Built in, previewed |
| Shows every change before committing | Only what's on screen | Only what's in your file | Yes, old → new per variant, with the true total |
| Checks the result afterwards | No | No | Depends on the app; VerifiedBulk re-reads every item |
| Undo | No | Re-import an older file (overwrites everything in it) | Depends on the app; VerifiedBulk restores from a snapshot and flags conflicts |
| Cost | Free | Free | Free tier / paid |

## Way 1: Shopify's bulk editor

This is the right tool more often than app vendors admit. If you can see the products you want to change on one screen and you'll check the result yourself, use it.

1. In Shopify admin, go to **Products**.
2. Tick the checkbox on each product you want to change (or the header checkbox to select the page).
3. Click **Bulk edit**.
4. Click **Columns** and select **Price**. Add **Compare-at price** if you're setting a strikethrough.
5. Type the new price into each cell. To apply one value down a column, type it once and drag the fill handle. Arrow keys move between cells; Shift-click selects a range.
6. Click **Save**. The editor validates the values and shows an error if any is invalid; nothing is saved until you fix it.

<!-- IMAGE (I capture): images/products-select-bulk-edit.png — Products list with 5 products ticked and the "Bulk edit" button in the action bar. Crop to the top of the list. Alt: "Shopify Products list with products selected and the Bulk edit button". -->
<!-- IMAGE (I capture): images/bulk-editor-price-column.png — the bulk editor with the Price column showing, one cell being edited. Alt: "Shopify bulk editor with the Price column open for editing". -->

For variants of a single product, open the product, and in the **Variants** section tick the variants and click **Bulk edit**. Same editor, same behavior.

**Where it suffices.** A one-time change to a set you can eyeball. A price fix on twenty products. Anything where "I'll open a few afterwards and look" is a real plan.

**Where it runs out.**

- **It works on what you selected on the page, and the page is not your catalog.** The Products list paginates. Whatever your selection ceiling turns out to be, it is far below "the Sale collection".
  <!-- IMAGE (I capture) + FACT CHECK: in the dev store with 250+ seeded products, select all across pages and click Bulk edit. Note the exact behavior and any message. If Shopify states a number, we quote it here with a screenshot: images/bulk-editor-selection-limit.png. Until then this paragraph stays number-free. -->
- **No preview of the blast radius.** You see the rows in front of you, not "146 variants will change and here is each one".
- **Percent math is yours.** "15% off" means a spreadsheet, or a calculator and patience.
- **No undo.** Save is final. If you typed 1.99 instead of 19.99 on one row of forty, you find out when a customer does.
- **Navigate away and the edits are gone.** Unsaved work in the editor doesn't survive leaving the page.
- **No verification.** Save reports that the save request went through. It doesn't re-open each product and confirm the number.

## Way 2: export, edit in a spreadsheet, import

For big catalogs and teams that live in spreadsheets, the CSV path is the built-in way to change hundreds or thousands of prices.

**Export.**

1. Go to **Products** and click **Export**.
2. Choose what to export: **Current page**, **All products**, **Selected products**, or **Products matching your search and filters**. The last one is the useful one: filter to the collection or vendor first.
3. Choose **CSV for Excel, Numbers, or other spreadsheet programs**, then export. If any product has more than 100 variants, the file is emailed instead of downloaded.

**Edit.** Open the file. Prices are per row (one row per variant) in the **Price** column, with **Compare-at price** and **Cost per item** beside it. Change the numbers. Don't sort the sheet, don't delete columns you aren't changing, don't clear cells you don't mean to clear.

**Import.**

1. Go to **Products** and click **Import**, then **Add file** and pick your CSV (15 MB maximum).
2. Tick **Overwrite products with matching handles**. Without it, the import creates new products instead of updating existing ones.
3. Preview the import, then confirm.

<!-- IMAGE (I capture): images/export-dialog.png — the Export dialog with "Products matching your search and filters" selected. Alt: "Shopify product export dialog with the filtered-products option". -->
<!-- IMAGE (I capture): images/import-overwrite.png — the Import dialog with "Overwrite products with matching handles" checked. Alt: "Shopify product import dialog with the overwrite-matching-handles option checked". -->

**Where it suffices.** Large one-time repricing where you want the whole catalog in a spreadsheet anyway. Supplier price lists that arrive as spreadsheets. Teams with a review step in the sheet.

**Where it runs out, in Shopify's own words.**

- **A blank cell overwrites.** "If a non-required column in the import CSV file is blank, then the matching value in the product list is overwritten as blank." Clearing a compare-at cell you meant to leave alone clears it in the store.
- **Sorting the sheet can lose images.** Shopify warns that a CSV sorted in a spreadsheet editor can detach products from their image links, and the images are lost.
- **Changing option values recreates variants.** New variant IDs, which breaks anything that referenced the old ones.
- **It can't be canceled.** "Product imports started with a CSV file can't be canceled once they begin."
- **There is no verification** beyond the import summary. Whether every row landed as intended is something you check by hand or not at all.
- **The undo is another import.** Re-importing yesterday's export puts back everything in that file, including values a colleague changed since. That is a restore of a moment, not an undo of your edit.

## The gap, and where an app belongs

Neither built-in path gives you three things, and you notice their absence in the same order every time.

**A preview of exactly what will change.** Not the rows on screen or in your file, but every variant that matches your filter, with its current price and its new price, and the real total. The number is the first safety check: if "20% off the winter collection" previews 146 variants and you expected 40, you fix the filter before anything happens.

**Verification after the write.** Bulk operations against an API fail in pieces. A request is accepted, most rows change, a few don't, and the tool reports success because the request was accepted. Merchants describe exactly this in reviews of tools in this category: an edit that "said it did but really only changed half". The only honest definition of done is re-reading every product afterwards and comparing it to what you intended. That is what VerifiedBulk does after every job, and the report itemizes the three outcomes: verified, failed (the write didn't stick), or conflicted (the value changed outside the job and was not overwritten).

**An undo that respects what happened since.** Snapshot the old values before writing, and on undo restore each item only if it is still exactly as your edit left it. If someone hand-fixed a price after your edit, that item is flagged with all three values instead of being silently overwritten.

<!-- IMAGE (I capture): images/app-preview-prices.png — VerifiedBulk preview table for a "Decrease by percent 15" edit on a vendor filter: product, variant, current, new columns, banner with the exact total. Alt: "VerifiedBulk preview listing each variant's current and new price before the edit runs". -->
<!-- IMAGE (I capture): images/app-verification-report.png — the verification report after the run: "Every write verified — N of N". Alt: "VerifiedBulk verification report showing every item re-read and verified". -->

The workflow is the same loop as the built-in tools, with the missing pieces in the middle: filter by collection, tag, vendor, type, title, price range, or status; choose **Price** and an operation (set, increase or decrease by percent or amount); read the preview; run; read the report; undo from the report if you need to.

{% cta "Try a verified price edit on the App Store" %}

## A safety checklist that works with any of the three

- **Export first, every time.** A CSV of the set you're about to change is a free snapshot. Even if you never import it, it's the only record of the old prices the built-in tools will give you.
- **Test on ten.** Change ten products, look at ten product pages, then do the rest with the same settings.
- **Know your set before you touch it.** Filter the Products list and read the count. If you can't state how many variants will change, you aren't ready to change them.
- **Change one thing per pass.** Prices in one pass, compare-at in the next. Mixed edits are harder to check and harder to undo.
- **Look afterwards, or use something that looks for you.** The built-in tools end at "saved". Your job ends at "confirmed".

If the price change is a sale with an end date, the ending is its own problem: see [how to schedule a sale that reverts itself](/guides/schedule-shopify-sale-that-reverts/). And if a bulk edit ever goes badly enough that you consider deleting and re-creating products, read [what's recoverable after a delete](/guides/deleted-shopify-products-recovery/) first.
