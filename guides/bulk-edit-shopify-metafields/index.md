---
layout: guide.njk
title: "How to bulk edit product metafields on Shopify (without wrecking them)"
description: "Shopify's bulk editor and CSV can update metafields — exactly how far each goes, where they stop, and how to change typed values across many products safely."
slug: bulk-edit-shopify-metafields
date: 2026-09-24
updated: 2026-09-24
related: [bulk-edit-prices-shopify, deleted-shopify-products-recovery]
draft: true
howto:
  name: "Bulk edit product metafields with Shopify's built-in editor"
  steps:
    - name: "Make sure a definition exists"
      text: "Settings → Custom data → Products. A metafield only appears as an editable column once it has a definition (name, namespace.key, type)."
    - name: "Select the products"
      text: "Go to Products, tick the products to change, then click Edit products (labelled Bulk edit in some stores)."
    - name: "Add the metafield column"
      text: "Click Columns and pick the definition from the Metafields section."
    - name: "Type the values"
      text: "Enter a value per row in the definition's format — a date as a date, true or false for booleans. Drag the fill handle to copy one value down."
    - name: "Save, then check"
      text: "Click Save. Open a few products afterwards and confirm the metafield shows the value you meant; the editor doesn't verify for you."
faq:
  - q: "Can Shopify's bulk editor edit metafields?"
    a: "Yes. From the Products list, select products, open the bulk editor, click Columns, and the Metafields section lists every product definition. You type values cell by cell. It can't find and replace, apply a change relative to the current value, or undo."
  - q: "Can I find and replace inside a metafield?"
    a: "Not natively. The bulk editor and the CSV import both take final values. Find and replace on text metafields is an app operation: VerifiedBulk does it with the same literal-match rules it uses for titles, previews every result, and skips any product whose result would break the definition's rules."
  - q: "What happens to products that don't have the metafield yet?"
    a: "Setting a value creates the metafield on those products; clearing or find-and-replacing leaves them alone (there's nothing to change). Undoing a set removes the metafield again rather than leaving an empty one behind."
  - q: "Does deleting a metafield definition delete the values?"
    a: "It can. When a definition is deleted with the option to remove its metafields, every product's value for it is deleted too. Deleting only the definition turns the values into untyped, unstructured metafields the admin can no longer edit as a column."
  - q: "Can I edit list metafields in bulk?"
    a: "In the bulk editor, yes, for the list types it supports, one product at a time. VerifiedBulk doesn't edit list metafields yet — they show in the picker as not yet supported — because adding or removing one item across many ordered lists needs undo rules we haven't built to our verification standard."
---

<!-- Verified 2026-09-24 against:
     https://help.shopify.com/en/manual/custom-data/metafields/bulk-edit-metafields (Products → Edit products → Columns → Metafields section; products, variants, collections, customers; Edge URL-length caveat)
     https://help.shopify.com/en/manual/shopify-admin/productivity-tools/bulk-editing (Bulk edit, Columns, Save, fill handle — the general page uses the older "Bulk edit" label; confirm the current label in your admin)
     https://help.shopify.com/en/manual/products/import-export/using-csv (product metafield columns appear as "NAME (product.metafields.namespace.key)" once a definition exists; variant metafields not supported in the product CSV; blank non-required column overwrites as blank)
     https://help.shopify.com/en/manual/products/import-export/import-products (Overwrite products with matching handles; imports can't be canceled)
     https://shopify.dev/docs/apps/build/metafields/metafield-limits (64 KB per text value; lists max 128 items)
     https://shopify.dev/docs/apps/build/metafields/list-of-validation-options (min/max length, regex, choices; number min/max; date min/max)
     https://shopify.dev/docs/api/admin-graphql/2026-07/mutations/metafieldsSet (compare-and-set via compareDigest: the write is refused if the value changed) -->

Metafields are where the real product data lives: care instructions, materials, fit notes, launch dates, "ships in" lead times, the true/false flags your theme reads. They are also the data most likely to be wrong after a bulk change, because unlike a price a metafield has a **type** and often **rules** — a maximum length, a list of allowed choices, a pattern — and nothing in the built-in tools tells you when a change quietly broke one. This guide covers what Shopify gives you for changing metafields across many products, exactly where each tool is enough, and where you need something that checks its own work.

## What you're editing

A product metafield has four parts: a **namespace** and **key** that identify it (`custom.care_guide`), a **type** (single-line text, multi-line text, integer, decimal, true/false, date, date and time, plus list and reference types), and a **definition** created under **Settings → Custom data → Products** that carries the name, the type, and any validation rules. Values without a definition exist too, but the admin can't edit them in bulk; the first move for any messy store is giving each metafield a definition.

Two facts that shape everything below: a metafield either exists on a product with a value or **doesn't exist at all** — there is no "empty" state you can rely on, and text values are limited to 64 KB each.

## Way 1: Shopify's bulk editor, thoroughly

The built-in editor handles metafields, and for the common case it is the right tool.

1. In Shopify admin, go to **Settings → Custom data → Products** and confirm the metafield has a definition. If not, add one; pick the type carefully, it can't be changed later without recreating the values.
2. Go to **Products**, tick the products you want to change, and click **Edit products**. (Older documentation and some stores label this button **Bulk edit**; it opens the same editor.)
3. Click **Columns**. Scroll to the **Metafields** section and tick the definition. It appears as a column.
4. Type the value into each cell. Typed fields render typed controls: a date picker for dates, a true/false toggle for booleans, a dropdown when the definition has predefined choices. To apply one value down the column, type it once and drag the fill handle.
5. Click **Save**. Invalid values are flagged and nothing saves until they're fixed.

<!-- IMAGE (I capture): images/bulk-editor-metafield-column.png — bulk editor with a metafield column added via Columns → Metafields, a few cells filled. Alt: "Shopify bulk editor showing a product metafield column". -->

**Where it suffices.** One definition, one page of products, values you type or copy down a column, and a habit of opening a couple of products afterwards. Setting "Ships in: 3–5 days" on twenty products is a two-minute job here.

**Where it runs out.**

- **Final values only.** No find and replace, no "change 3–5 days to 5–7 days everywhere it appears", no math on numbers. You type what the cell should become.
- **One page at a time.** The editor works on the products you selected in the list; large catalogs mean many passes.
- **No preview of the whole set and no undo.** Save is final, and the only record of the old values is your memory or an export you took first.
- **No verification.** Save reports that the request went through. It doesn't re-read each product and confirm the value landed.
- Microsoft Edge users can hit URL-length errors with many columns; Shopify's own page suggests Chrome, Firefox, or Safari.

## Way 2: CSV export and import

Once a product metafield has a definition, it shows up in the product CSV as its own column, headed like `Care guide (product.metafields.custom.care_guide)`. That makes the spreadsheet route workable for big catalogs.

1. **Products → Export**, choose **Products matching your search and filters** after filtering to the set you want.
2. Edit the metafield column in a spreadsheet. Keep the value format the type expects: `true`/`false` for booleans, `YYYY-MM-DD` for dates.
3. **Products → Import → Add file**, tick **Overwrite products with matching handles**, review, confirm.

**Where it suffices.** Hundreds or thousands of products, one-time repricing of data you already maintain in a sheet, teams with a review step.

**Where it runs out, in Shopify's own words and ours.**

- **A blank cell overwrites.** Shopify's import docs: a blank non-required column in the file overwrites the existing value as blank. Clear a metafield cell by accident and the store loses that value.
- **Variant metafields don't travel.** The product CSV carries product metafields only; variant metafields need the bulk editor.
- **Imports can't be canceled once started**, and find and replace is whatever your spreadsheet does before you import, with no check that each result still satisfies the definition.
- **No verification and no undo** beyond re-importing an older file, which puts back everything in that file, including changes made since.

## The gap, and where an app belongs

Both built-in paths stop at the same three places, and metafields make each one sharper than it is for prices.

**Find and replace, with rules enforced.** "Change *3–5 business days* to *5–7 business days* wherever it appears" is the daily request, and it's impossible in the bulk editor and hazardous in a spreadsheet. VerifiedBulk does it with the same literal, case-aware matching it uses for titles, then checks every result against the definition's rules before writing anything. A product whose result would exceed the maximum length, fall outside the allowed choices, or come out empty is marked **will be skipped** in the preview with the reason, left untouched, and listed in the report. The other products proceed normally.

**Preview and verification.** Before anything runs you see current → new for every product, including the ones that will be skipped and why. After the run, every product is re-read and compared to what you intended, and the report itemizes verified, failed, and conflicted.

**Undo that knows about absence.** If you set a metafield on 200 products that didn't have it, undo removes it from those 200 again rather than leaving 200 empty values behind. If a value was changed by someone else since your edit, that product is flagged with the three values instead of being overwritten.

**And one thing no bulk tool did before:** if a value changes between the moment you preview and the moment the write happens — a colleague fixing the same product — Shopify is told to refuse the write, and the report shows the value you previewed, the value you would have written, and the value that is there now, under the heading *Changed since preview*. Nothing is forced.

<!-- IMAGE (I capture): images/app-metafield-picker.png — the definition picker with a search typed, showing name, namespace.key and the type badge, one row marked not yet supported. Alt: "VerifiedBulk metafield definition picker with type badges". -->
<!-- IMAGE (I capture): images/app-metafield-preview-skipped.png — preview table for a find & replace with one row marked "will be skipped" and its reason. Alt: "Preview marking a product whose replacement would break the definition". -->

Honest limits, stated in the app too: seven scalar types today (single- and multi-line text, integer, decimal, true/false, date, date and time). List types, references, rich text, JSON, colors, ratings, and measurements appear in the picker as not yet supported. Metafields owned by another app are shown but read-only; another app's data model isn't ours to edit.

{% cta "Try verified metafield edits on the App Store" %}

## A safety routine for any of the three ways

- **Give it a definition first.** Everything downstream, from typed cells to CSV columns to validation, depends on it.
- **Export the set before you touch it.** The CSV is your only free snapshot of the old values.
- **One definition per pass.** Mixed passes are hard to check and hard to undo.
- **Test on ten**, open ten products, then run the rest with the same settings.
- **Read the result, or use something that reads it for you.** The built-in tools end at Save. The job ends when you know the value is on the product.

Metafields usually ride along with a price change or a cleanup; the same discipline applies in [how to bulk edit prices safely](/guides/bulk-edit-prices-shopify/), and the worst case is covered in [what's recoverable after a delete](/guides/deleted-shopify-products-recovery/).
