/**
 * Importa sequência do Gourmet (chocolate 6) a partir da pasta de export do Figma.
 *
 *   node scripts/import-gourmet-figma.js "C:\...\Valentine's Day Box of Chocolates (Community) (10)"
 *
 * Ordem de clique após Default intacto: Variant3 → Variant5 → Variant8
 */
const fs = require("fs");
const path = require("path");

const srcDir = process.argv[2];
if (!srcDir || !fs.existsSync(srcDir)) {
  console.error("Usage: node scripts/import-gourmet-figma.js <figma-export-folder>");
  process.exit(1);
}

const OUT_CHOC = "public/chocolate/chocolates/gourmet";
const OUT_THUMB = "public/chocolate/chocolates/gourmet.svg";

const SEQUENCE = [
  { src: "Property 1=Default.svg", out: "00-default.svg", stage: "0-intact" },
  { src: "Property 1=Variant3.svg", out: "03-variant3.svg", stage: "click-1" },
  { src: "Property 1=Variant5.svg", out: "05-variant5.svg", stage: "click-2" },
  { src: "Property 1=Variant8.svg", out: "08-variant8.svg", stage: "click-3" },
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
console.log("Sidebar thumbnail: gourmet.svg");
