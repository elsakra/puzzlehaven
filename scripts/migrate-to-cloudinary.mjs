/**
 * One-time migration script: uploads all 103 curated puzzle images from
 * Unsplash to Cloudinary under the folder `jigsaws/puzzles/`.
 *
 * Usage:  node scripts/migrate-to-cloudinary.mjs
 *
 * Re-running is safe — `overwrite: false` skips images already on Cloudinary.
 * Credentials are read from .env.local in the project root.
 */
import { readFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const { v2: cloudinary } = require("cloudinary");

// ── Load .env.local ──────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
} catch {
  console.error("Could not read .env.local — set CLOUDINARY_* env vars manually.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Puzzle manifest (slug → Unsplash photo ID) ───────────────────────────────
const PUZZLES = [
  // Animals
  ["cute-orange-cat",        "1574158622682-e40e69881006"],
  ["golden-retriever-puppy", "1587300003388-59208cc962cb"],
  ["colorful-parrot",        "1552728089-57bdde30beb3"],
  ["butterfly-on-flower",    "1559564484-e48b3e040ff4"],
  ["underwater-sea-turtle",  "1544551763-46a013bb70d5"],
  ["two-kittens-playing",    "1526336024174-e58f5cdd8e13"],
  ["majestic-lion",          "1546182990-dffeafbe841d"],
  ["hummingbird-in-flight",  "1444464666168-49d633b86797"],
  ["rabbits-in-garden",      "1585110396000-c9ffd4e4b308"],
  ["african-elephants",      "1518717758536-85ae29035b6d"],
  ["white-horse-field",      "1425082661705-1834bfd09dca"],
  ["polar-bear-cub",         "1508215885820-4585e56135c8"],
  ["glowing-jellyfish",      "1548247416-ec66f4900b2e"],
  ["meerkat-family",         "1560743641-3914f2c45636"],
  ["white-swan-lake",        "1476231682828-37e571bc172f"],
  ["flamingo-flock-pink",    "1516690561799-46d8f74f9abf"],
  ["arctic-fox-snow",        "1474511320723-9a56873867b5"],

  // Nature
  ["cherry-blossoms",           "1522383225653-ed111181a951"],
  ["autumn-forest-path",        "1507003211169-0a1dd7228f2d"],
  ["sunflower-field",           "1470509037663-253afd7f0f51"],
  ["lavender-fields",           "1499002238440-d264edd596ec"],
  ["tropical-beach-palms",      "1507525428034-b723cf961d3e"],
  ["forest-stream",             "1441974231531-c6227db76b6e"],
  ["snowy-pine-trees",          "1418985991508-e47386d96a71"],
  ["aurora-over-mountains",     "1501854140801-50d01698950b"],
  ["lotus-lily-pond",           "1500534314209-a25ddb2bd429"],
  ["bamboo-forest",             "1473773508845-188df298d2d1"],
  ["frozen-lake-winter",        "1482938289607-e9573fc25ebb"],
  ["jungle-waterfall-tropics",  "1449824913935-59a10b8d2000"],
  ["majestic-oak-tree",         "1518020382113-a7e8fc38eac9"],
  ["desert-cactus-bloom",       "1426604966848-d7adac402bff"],
  ["spring-cherry-tree",        "1518780664697-55e3ad937233"],
  ["redwood-forest-tall",       "1448375240586-882707db888b"],
  ["water-lily-pond-close",     "1556909114-44e3e70034e2"],
  ["daffodil-field-spring",     "1519985176271-adb1088fa94c"],
  ["thunderstorm-lightning-sky","1455218873509-8097305ee378"],

  // Landscapes
  ["mountain-lake-reflection",       "1506905925346-21bda4d32df4"],
  ["tuscan-rolling-hills",           "1523531294919-4bcd7c65e216"],
  ["ocean-sunset",                   "1507400492013-162706c8c05e"],
  ["northern-lights",                "1531366936337-7c912a4589a7"],
  ["desert-dunes",                   "1509316785289-025f5b846b35"],
  ["coastal-cliffs",                 "1506929562872-bb421503ef21"],
  ["lofoten-islands",                "1469474968028-56623f02e42e"],
  ["canadian-rockies-moraine-lake",  "1454496522488-7a8e488e8606"],
  ["kerala-backwaters-india",        "1602216056096-3b40cc0c9944"],

  // Art
  ["starry-night-inspired",      "1543722530-d2c3201371e7"],
  ["colorful-abstract-painting", "1541701494587-cb58502866ab"],
  ["stained-glass-window",       "1507608616759-54f48f0af0ee"],
  ["oil-painting-landscape",     "1579783901586-d88db74b4fe4"],
  ["watercolor-bird-branch",     "1492725764893-90b379c2b6e7"],
  ["pop-art-portrait",           "1578662996442-48f60103fc96"],
  ["charcoal-drawing-still-life","1507679799987-c73779587ccf"],
  ["cubist-face-painting",       "1536746803623-cef87080bfc8"],
  ["digital-art-galaxy",         "1462331940025-496dfbfc7564"],
  ["japanese-woodblock-wave",    "1518770660439-4636190af475"],
  ["kinetic-sculpture-chrome",   "1513475382585-d06e58bcb0e0"],
  ["studio-pottery-ceramic",     "1565193566173-7a0ee3dbe261"],
  ["oil-paint-close-texture",    "1513364776144-60967b0f800f"],

  // Food
  ["fresh-fruit-arrangement", "1490474418585-ba9bad8fd0ea"],
  ["bakery-pastries",         "1509440159596-0249088772ff"],
  ["colorful-macarons",       "1569864358642-9d1684040f43"],
  ["cozy-coffee-scene",       "1495474472287-4d71bcdd2085"],
  ["farmers-market-vegetables","1488459716781-31db52582fe9"],
  ["strawberry-shortcake",    "1488477181946-6428a0291777"],
  ["hot-chocolate-cozy",      "1517487881594-2787fef5ebf7"],
  ["avocado-toast-brunch",    "1546069901-ba9599a7e63c"],
  ["wood-fired-pizza",        "1513104890138-7c749659a591"],
  ["ice-cream-scoops",        "1501443762994-82bd5dace89a"],
  ["ramen-bowl-japanese",     "1569050467447-ce54b3bbc37d"],
  ["breakfast-acai-bowl",     "1590301157890-4810ed352733"],
  ["seafood-paella",          "1534080564583-6be75777b70a"],
  ["chocolate-fondue",        "1511381939415-e44015466834"],
  ["french-cheese-wine",      "1506377247377-2a5b3b417ebb"],
  ["sashimi-platter-fish",    "1534482421-64566f976cfa"],
  ["donuts-glazed-colorful",  "1558961363-fa8fdf82db35"],
  ["garden-salad-fresh",      "1490645935967-10de6ba17061"],
  ["tacos-street-food",       "1565299585323-38d6b0865b47"],
  ["sushi-platter-colorful",  "1553621042-f6e147245754"],
  ["hot-chocolate-marshmallows","1542990253-0d0f5be5f0ed"],

  // Travel
  ["venetian-canals",          "1523906834658-6e24ef2386f9"],
  ["japanese-temple",          "1478436127897-769e1b3f0f36"],
  ["santorini-greece",         "1570077188670-e3a8d69ac5ff"],
  ["new-york-skyline",         "1534430480872-3498386e7856"],
  ["rome-colosseum",           "1552832230-c0197dd311b5"],
  ["barcelona-sagrada-familia","1539037116277-4db20889f2d4"],
  ["london-big-ben",           "1513635269975-59663e0ac1ad"],
  ["dubai-skyline-night",      "1512453979798-5ea266f8880c"],
  ["taj-mahal-india",          "1524492412937-b28074a5d7da"],
  ["maui-beach-hawaii",        "1505118380757-91f5f5632de0"],
  ["berlin-wall-art",          "1528360983277-13d401cdc186"],
  ["lisbon-tram-streets",      "1555881400-74d7acaacd8b"],
  ["hong-kong-skyline-night",  "1532498551838-b7a1cfac622e"],

  // Holidays
  ["autumn-pumpkins",       "1509622905150-fa66d3906e09"],
  ["spring-easter-eggs",    "1457301353672-324d6d14f471"],
  ["back-to-school-supplies","1503676260728-1c00da094a0b"],

  // Abstract
  ["rainbow-gradient",           "1557672172-298e090bd0f1"],
  ["geometric-shapes",           "1558591710-4b4a1ae0f04d"],
  ["neon-lights",                "1550684376-efcbd6e3f031"],
  ["fluid-blue-ocean-abstract",  "1557804506-669a67965ba0"],
  ["fractal-nature-spiral",      "1557683311-eac922347aa1"],
  ["colorful-smoke-art",         "1513542789411-b6a5d4f31634"],
  ["ink-in-water-abstract",      "1580927752452-89d86da3fa0a"],
  ["concentric-circles-abstract","1553356084-58ef4a67b2a7"],
];

// ── Upload helper ─────────────────────────────────────────────────────────────
async function uploadPuzzle(slug, unsplashId) {
  const sourceUrl = `https://images.unsplash.com/photo-${unsplashId}?w=1200&h=900&fit=crop&auto=format&q=80`;
  const publicId = `jigsaws/puzzles/${slug}`;
  try {
    const result = await cloudinary.uploader.upload(sourceUrl, {
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    console.log(`  ✓  ${slug}  →  ${result.secure_url}`);
    return { slug, ok: true };
  } catch (err) {
    const msg = err?.message ?? String(err);
    // "already exists" with overwrite:false is fine
    if (msg.includes("already exists") || err?.http_code === 409) {
      console.log(`  –  ${slug}  (already uploaded)`);
      return { slug, ok: true };
    }
    console.error(`  ✗  ${slug}  ERROR: ${msg}`);
    return { slug, ok: false, error: msg };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\nMigrating ${PUZZLES.length} puzzle images to Cloudinary...\n`);

  const CONCURRENCY = 5; // stay within Cloudinary free-tier rate limits
  const failures = [];

  for (let i = 0; i < PUZZLES.length; i += CONCURRENCY) {
    const batch = PUZZLES.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(([slug, id]) => uploadPuzzle(slug, id)));
    failures.push(...results.filter((r) => !r.ok));
  }

  console.log("\n── Summary ──────────────────────────────────────────────────");
  console.log(`  Total:    ${PUZZLES.length}`);
  console.log(`  Success:  ${PUZZLES.length - failures.length}`);
  console.log(`  Failed:   ${failures.length}`);
  if (failures.length) {
    console.log("\nFailed slugs:");
    failures.forEach((f) => console.log(`  • ${f.slug}: ${f.error}`));
    process.exit(1);
  }
  console.log("\nAll images are on Cloudinary. Update puzzles.ts to use cloudinary URLs.\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
