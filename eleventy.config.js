import Image from "@11ty/eleventy-img";
import markdownIt from "markdown-it";
import sharp from "sharp";
import { readFileSync } from "node:fs";

/**
 * verifiedbulk.app guide engine (v1.5 S3).
 *
 * - Guides: guides/<slug>/index.md → /guides/<slug>/ (layout guide.njk).
 * - `draft: true` in front matter EXCLUDES a guide from the build entirely
 *   (no page, no sitemap, no index entry) — the mechanical hard stop
 *   between draft and publish.
 * - index.html / privacy.html / CNAME / assets are copied through untouched.
 * - Shortcodes: {% cta "text" %} (App Store link with per-guide UTM),
 *   {% img "file.png", "alt" %} (WebP + width/height + lazy below the fold),
 *   {% ogcard %} (1200×630 social card rendered from an SVG template).
 */

const SITE = "https://verifiedbulk.app";
const APP_STORE = "https://apps.shopify.com/verifiedbulk";

export default function (eleventyConfig) {
  eleventyConfig.setInputDirectory(".");
  eleventyConfig.setOutputDirectory("_site");
  eleventyConfig.setIncludesDirectory("_includes");
  eleventyConfig.setDataDirectory("_data");

  // Hand-authored pages are copied through, never processed as templates.
  eleventyConfig.ignores.add("index.html");
  eleventyConfig.ignores.add("privacy.html");
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("guides/TOPICS.md");
  eleventyConfig.ignores.add("guides/_template.md");
  eleventyConfig.ignores.add("scripts/**");
  eleventyConfig.ignores.add("node_modules/**");

  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("privacy.html");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("assets");

  // Markdown: typographic quotes off (copy is voiced by hand), HTML allowed
  // for callouts and comments.
  eleventyConfig.setLibrary("md", markdownIt({ html: true, linkify: true, typographer: false }));

  // Every guide: required front matter, draft gate, canonical + UTM slug.
  eleventyConfig.addGlobalData("site", { url: SITE, name: "VerifiedBulk" });
  // PREVIEW_DRAFTS=1 npm run dev — render drafts locally without touching
  // the front matter. Never set in the Actions workflow.
  const previewDrafts = process.env.PREVIEW_DRAFTS === "1";
  const isDraft = (data) => Boolean(data.draft) && !previewDrafts;
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      if (isDraft(data)) return false;
      if (data.layout === "guide.njk") return `/guides/${data.slug}/`;
      return data.permalink;
    },
    eleventyExcludeFromCollections: (data) => isDraft(data),
    canonical: (data) => {
      if (data.layout === "guide.njk") return `${SITE}/guides/${data.slug}/`;
      return data.canonical ?? (data.page?.url ? `${SITE}${data.page.url}` : SITE);
    },
    ctaUrl: (data) =>
      `${APP_STORE}?utm_source=verifiedbulk-site&utm_medium=referral&utm_campaign=${
        data.layout === "guide.njk" ? `guide-${data.slug}` : "site-page"
      }`,
  });

  eleventyConfig.addPreprocessor("guide-contract", "md", (data, content) => {
    if (data.layout !== "guide.njk") return;
    // Drafts in progress may be incomplete; the contract bites when a guide
    // is about to publish (or when previewing drafts locally).
    if (isDraft(data)) return content;
    for (const key of ["title", "description", "slug", "date"]) {
      if (!data[key]) throw new Error(`Guide ${data.page.inputPath} is missing front matter "${key}"`);
    }
    if (data.description.length > 160) {
      throw new Error(`Guide ${data.slug}: description is ${data.description.length} chars (max 160)`);
    }
    return content;
  });

  eleventyConfig.addCollection("guide", (api) =>
    api.getFilteredByGlob("guides/*/index.md").sort((a, b) => b.date - a.date),
  );

  // {% cta "Install VerifiedBulk" %} — the ONLY way guides link to the listing.
  eleventyConfig.addShortcode("cta", function (text) {
    // Derive the campaign from the page URL: inside markdown the shortcode
    // context doesn't carry computed data reliably, and the guide campaign
    // on the body CTA is the one S5 attributes installs by.
    const m = /^\/guides\/([^/]+)\/$/.exec(this.page?.url ?? "");
    const campaign = m ? `guide-${m[1]}` : "site-page";
    const url = `${APP_STORE}?utm_source=verifiedbulk-site&utm_medium=referral&utm_campaign=${campaign}`;
    return `<a class="btn btn-primary" href="${url}">${text}</a>`;
  });

  // {% img "screenshot.png", "alt text" %} — source lives next to the guide
  // (guides/<slug>/images/); first image on a page loads eagerly, the rest
  // lazily. Width/height are emitted so nothing shifts.
  const imgCount = new Map();
  eleventyConfig.addShortcode("img", async function (file, alt, caption) {
    if (!alt) throw new Error(`img "${file}": alt text is required`);
    const inputDir = this.page.inputPath.replace(/index\.md$/, "");
    const src = `${inputDir}images/${file}`;
    const n = (imgCount.get(this.page.url) ?? 0) + 1;
    imgCount.set(this.page.url, n);
    const metadata = await Image(src, {
      widths: [720, 1440],
      formats: ["webp", "jpeg"],
      outputDir: "_site/img/",
      urlPath: "/img/",
      filenameFormat: (id, s, width, format) => {
        const base = file.replace(/\.[^.]+$/, "");
        return `${this.ctx.slug}-${base}-${width}.${format}`;
      },
    });
    const html = Image.generateHTML(metadata, {
      alt,
      sizes: "(max-width: 760px) 100vw, 720px",
      loading: n === 1 ? "eager" : "lazy",
      decoding: "async",
      class: "guide-img",
    });
    return caption ? `<figure>${html}<figcaption>${caption}</figcaption></figure>` : `<figure>${html}</figure>`;
  });

  // {% ogcard %} — social card per guide from the SVG template.
  const ogTemplate = readFileSync("assets/og-template.svg", "utf8");
  eleventyConfig.addShortcode("ogcard", async function () {
    // Emits nothing; writes _site/og/<slug>.png as a side effect. The URL
    // is computed in base.njk so the head never depends on async output.
    if (this.ctx.layout !== "guide.njk") return "";
    const title = String(this.ctx.title);
    const lines = wrap(title, 26).slice(0, 3);
    const svg = ogTemplate
      .replace("{{LINE1}}", esc(lines[0] ?? ""))
      .replace("{{LINE2}}", esc(lines[1] ?? ""))
      .replace("{{LINE3}}", esc(lines[2] ?? ""));
    const out = `_site/og/${this.ctx.slug}.png`;
    await sharp(Buffer.from(svg)).png().toFile(out).catch(async (e) => {
      const { mkdirSync } = await import("node:fs");
      mkdirSync("_site/og", { recursive: true });
      await sharp(Buffer.from(svg)).png().toFile(out);
    });
    return "";
  });

  // Editorial HTML comments (source citations, image-slot specs) never ship:
  // stripped from every rendered page's output.
  eleventyConfig.addTransform("strip-comments", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    return content.replace(/<!--[\s\S]*?-->\n?/g, "");
  });

  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("humanDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }),
  );
  eleventyConfig.addFilter("jsonld", (obj) => JSON.stringify(obj).replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("bySlug", (guides, slugs) =>
    (slugs ?? []).map((s) => guides.find((g) => g.data.slug === s)).filter(Boolean),
  );

  eleventyConfig.setServerOptions({ showAllHosts: false });
}

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) {
      lines.push(line);
      line = w;
    } else line = (line + " " + w).trim();
  }
  if (line) lines.push(line);
  return lines;
}
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
