/**
 * Generates icon-192.png and icon-512.png in public/ using the SVG icon
 * as the source. Requires the `sharp` package.
 *
 * Usage: node scripts/generate-icons.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

let sharp;
try {
  const mod = await import("sharp");
  sharp = mod.default;
} catch {
  console.error(
    "sharp not installed. Run: npm install -D sharp\nThen re-run this script."
  );
  process.exit(1);
}

const svgPath = path.join(root, "public", "icon.svg");
const svgBuffer = readFileSync(svgPath);

for (const size of [192, 512]) {
  const outPath = path.join(root, "public", `icon-${size}.png`);
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(outPath);
  console.log(`✓ Generated ${outPath}`);
}
