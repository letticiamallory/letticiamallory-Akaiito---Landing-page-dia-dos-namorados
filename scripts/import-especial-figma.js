/**
 * Importa sequência do Especial (chocolate 4) a partir da pasta de export do Figma.
 *
 *   node scripts/import-especial-figma.js "C:\...\Valentine's Day Box of Chocolates (Community) (7)"
 *
 * Ordem de clique após Default intacto: Variant4 → Variant7
 */
const fs = require("fs");
const path = require("path");

const srcDir = process.argv[2];
if (!srcDir || !fs.existsSync(srcDir)) {
  console.error("Usage: node scripts/import-especial-figma.js <figma-export-folder>");
  process.exit(1);
}

const OUT_CHOC = "public/chocolate/chocolates/especial";
const OUT_THUMB = "public/chocolate/chocolates/especial.svg";

const SEQUENCE = [
  { src: "Property 1=Default.svg", out: "00-default.svg", stage: "0-intact" },
  { src: "Property 1=Variant4.svg", out: "04-variant4.svg", stage: "click-1" },
  { src: "Property 1=Variant7.svg", out: "07-variant7.svg", stage: "click-2" },
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
console.log("Sidebar thumbnail: especial.svg");
