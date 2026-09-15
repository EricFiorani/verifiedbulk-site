# verifiedbulk.app

Marketing site + guide engine for VerifiedBulk. GitHub Pages, custom domain
`verifiedbulk.app` (CNAME in the repo root), built by Eleventy 3 in GitHub
Actions on every push to `main`.

- `index.html`, `privacy.html` — hand-authored pages, copied through as-is.
- `guides/<slug>/index.md` — one guide per folder, markdown + front matter.
- `guides/<slug>/images/*.png` — screenshots for that guide (see Images).
- `guides/_template.md` — copy this to start a guide.
- `guides/TOPICS.md` — topic backlog.
- `_includes/` — layouts and partials (head/SEO/schema, GA4, nav, footer).
- `assets/site.css` — shared tokens + chrome + guide typography.

## Adding a guide (target: under 30 minutes of mechanics)

1. `cp -r guides/_template.md guides/<slug>/index.md` (create the folder;
   the slug is the URL: `/guides/<slug>/`).
2. Fill the front matter: `title`, `description` (≤160 chars — the build
   fails otherwise), `slug`, `date`, `updated`, `related` (slugs of two
   other guides). Add `howto:` steps only if the page IS a how-to; add
   `faq:` only if you have real questions. Leave `draft: true` while
   writing.
3. Write the body in markdown. Bold exact admin labels (**Products** →
   **Bulk edit**). Cite the Shopify doc you verified against in an HTML
   comment at the top.
4. Screenshots: drop PNGs into `guides/<slug>/images/`, then place them with
   `{% img "file.png", "Alt text that says what the reader should see", "Optional caption" %}`.
   The build converts to WebP + JPEG fallback, emits width/height (no
   layout shift), loads the first image eagerly and the rest lazily.
5. App Store links only via `{% cta "Button text" %}` — it appends
   `utm_source=verifiedbulk-site&utm_medium=referral&utm_campaign=guide-<slug>`
   so installs attribute per guide.
6. Preview locally: `npm install` once, then `PREVIEW_DRAFTS=1 npm run dev`
   → http://localhost:8080/guides/<slug>/ (drafts render locally with that
   variable; the deploy never sets it, so `draft: true` can't leak).
7. Publish: delete the `draft: true` line, commit, push `main`. The Action
   builds, checks the CNAME survived, and deploys. Sitemap, OG card,
   canonical, structured data, and the guides index update on their own.
8. Then: Search Console → URL inspection → request indexing for the new
   URL (the sitemap is already submitted).

## Images

- Everything is ours: admin and app screenshots captured in the dev store;
  diagrams are inline SVG in the design language. No stock, nothing from
  Shopify's docs.
- Filenames describe the content: `bulk-editor-price-column.png`, not
  `Screenshot 2026-09-15.png`. Capture at 2× (retina) if possible; the
  build makes 720 and 1440 widths.
- Alt text is drafted with each guide; keep it descriptive of what the
  reader should notice.
- Social cards (`/og/<slug>.png`) are rendered at build from
  `assets/og-template.svg` — nothing to do per guide.
- `npm run icons` regenerates `assets/apple-touch-icon.png` and the default
  OG image from `assets/icons/mark.svg` (only after changing the mark).

## Analytics and SEO (what the layout does for every page)

Unique title + description, canonical, OG/Twitter tags, `Article` JSON-LD
(+ `HowTo` / `FAQPage` only when the front matter has steps / faq),
`sitemap.xml` with `lastmod`, `robots.txt`, `404.html`, apple-touch-icon,
and the GA4 tag with the consent-mode defaults (EEA/UK/CH denied by
default, ads features off). Measurement ID `G-VSD3KEVY5Z`.

## Deploy mechanics

`.github/workflows/pages.yml`: `npm ci` → `npm run build` → custom-domain
survival check (CNAME, index, guides index present in `_site`) → upload →
`actions/deploy-pages`. Repo Settings → Pages → Source must be **GitHub
Actions**. Dependabot opens one grouped PR a month for npm and one for
Actions; merge when green.

If a build fails, the previous deploy stays live. Fix, push again.

## Search Console (one-time, then per guide)

Property type: **Domain** (`verifiedbulk.app`), verified by a DNS TXT record
at Porkbun. A domain property covers http/https and www in one place, and
DNS verification survives site rebuilds (an HTML-file token would have to be
carried through the build forever).

1. https://search.google.com/search-console → **Add property** → **Domain**
   → enter `verifiedbulk.app` → **Continue**.
2. Copy the TXT record value (`google-site-verification=…`).
3. Porkbun → Domain Management → `verifiedbulk.app` → **DNS Records** → add
   type **TXT**, host blank (root), answer = the value → save. Wait a few
   minutes (Porkbun TTL is short).
4. Back in Search Console click **Verify**. If it fails, wait ten minutes
   and retry — propagation, not a mistake.
5. Left nav **Sitemaps** → enter the full URL
   `https://verifiedbulk.app/sitemap.xml` → **Submit** (a Domain property
   has no URL prefix to fill in, so the bare filename is rejected). Status
   should read Success with 6 discovered URLs.
6. For each new guide: top search bar → paste the full URL → **Request
   indexing** (the URL inspection tool). Do this for the three guides now
   and for every guide you publish later. Indexing typically follows within
   days; ranking follows in weeks.
