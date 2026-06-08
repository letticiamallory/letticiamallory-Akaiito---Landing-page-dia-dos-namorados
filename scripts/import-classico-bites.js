/**
 * Import bite PNGs for Clássico (chocolate 1) from Figma exports.
 *
 * Usage: place PNGs in a folder, then:
 *   node scripts/import-classico-bites.js "C:\path\to\exports"
 *
 * Expected source filenames (any match):
 *   Better Bite 1, Heart Aches Bite 1, Variant7, Better, Variant9, HeartAches Last Bite
 */
const fs = require("fs");
const path = require("path");

const OUT = "public/chocolate/bites/classico";

const MAP = [
  { out: "01-bite.png", patterns: [/better.?bite.?1/i, /bite.?1.*better/i] },
  { out: "02-bite.png", patterns: [/heart.?aches.?bite.?1/i, /bite.?1.*heart/i] },
  { out: "03-bite.png", patterns: [/variant7/i, /variant.?7/i] },
  { out: "04-bite.png", patterns: [/^better/i, /property_1_better[^_]/i] },
  { out: "05-bite.png", patterns: [/variant9/i, /variant.?9/i] },
  { out: "06-bite.png", patterns: [/last.?bite/i, /heartaches.?last/i] },
];

/** Depois de importar PNGs, troque .svg por .png em src/data/chocolate-catalog.ts (CLASSICO_BITES) */

const srcDir = process.argv[2];
if (!srcDir || !fs.existsSync(srcDir)) {
  console.error("Usage: node scripts/import-classico-bites.js <folder-with-pngs>");
  process.exit(1);
}

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const files = fs.readdirSync(srcDir).filter((f) => /\.png$/i.test(f));

for (const { out, patterns } of MAP) {
  const match = files.find((f) => patterns.some((p) => p.test(f.replace(/=/g, "_"))));
  if (!match) {
    console.warn(`Missing: ${out} (patterns: ${patterns.map(String).join(", ")})`);
    continue;
  }
  fs.copyFileSync(path.join(srcDir, match), path.join(OUT, out));
  console.log(`${out} ← ${match}`);
}

console.log("Done.");
