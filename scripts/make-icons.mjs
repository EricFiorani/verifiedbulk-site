// One-off: rasterize the mark to apple-touch-icon.png (180×180) and the
// default OG image. Run `npm run icons` after changing assets/icons/mark.svg.
import sharp from "sharp";
import { readFileSync } from "node:fs";
const mark = readFileSync("assets/icons/mark.svg");
await sharp({ create: { width: 180, height: 180, channels: 4, background: "#FAFAF7" } })
  .composite([{ input: await sharp(mark).resize(132, 132).png().toBuffer(), gravity: "centre" }])
  .png().toFile("assets/apple-touch-icon.png");
const og = readFileSync("assets/og-template.svg", "utf8")
  .replace("{{LINE1}}", "Bulk editing on Shopify,")
  .replace("{{LINE2}}", "done carefully")
  .replace("{{LINE3}}", "");
await sharp(Buffer.from(og)).png().toFile("assets/og-default.png");
console.log("icons written");
