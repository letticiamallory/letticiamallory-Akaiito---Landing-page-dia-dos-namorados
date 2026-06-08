/**
 * Importa sequência do Listrado (chocolate 3) a partir da pasta de export do Figma.
 *
 *   node scripts/import-listrado-figma.js "C:\...\Valentine's Day Box of Chocolates (Community) (6)"
 *
 * Ordem de clique após Default: Variant2 → Variant4 → Variant6 → Variant7
 */
const fs = require("fs");
const path = require("path");

const srcDir = process.argv[2];
if (!srcDir || !fs.existsSync(srcDir)) {
  console.error("Usage: node scripts/import-listrado-figma.js <figma-export-folder>");
  process.exit(1);
}

const OUT_CHOC = "public/chocolate/chocolates/listrado";
const OUT_THUMB = "public/chocolate/chocolates/listrado.svg";

const SEQUENCE = [
  { src: "Property 1=Default.svg", out: "00-default.svg", stage: "0-intact" },
  { src: "Property 1=Variant2.svg", out: "02-variant2.svg", stage: "click-1" },
  { src: "Property 1=Variant4.svg", out: "04-variant4.svg", stage: "click-2" },
  { src: "Property 1=Variant6.svg", out: "06-variant6.svg", stage: "click-3" },
  { src: "Property 1=Variant7.svg", out: "07-variant7.svg", stage: "click-4" },
];

fs.mkdirSync(OUT_CHOC, { recursive: true });

for (const { src, out, stage } of SEQUENCE) {
  const from = path.join(srcDir, src);
  if (!fs.existsSync(from)) {
    console.warn(`Missing: ${src}`);
    continue;
  }
  fs.copyFileSync(from, path.join(OUT_CHOC, out));
  console.log(`${stage}: ${out}`);
}

fs.copyFileSync(path.join(srcDir, "Property 1=Default.svg"), OUT_THUMB);
console.log("Sidebar thumbnail: listrado.svg");
