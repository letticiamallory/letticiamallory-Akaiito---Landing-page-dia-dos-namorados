/**
 * Importa sequência do Clássico (chocolate 1) a partir da pasta de export do Figma.
 *
 *   node scripts/import-classico-figma.js "C:\...\Valentine's Day Box of Chocolates (Community) (4)"
 *
 * Ordem de clique após Default:
 *   Better Bite 1 → HeartAches Last Bite → Variant9
 *   (excluídos: Better, Heart Aches Bite 1, Variant7)
 */
const fs = require("fs");
const path = require("path");

const srcDir = process.argv[2];
if (!srcDir || !fs.existsSync(srcDir)) {
  console.error("Usage: node scripts/import-classico-figma.js <figma-export-folder>");
  process.exit(1);
}

const OUT_CHOC = "public/chocolate/chocolates/classico";
const OUT_THUMB = "public/chocolate/chocolates/classico.svg";

const SEQUENCE = [
  { src: "Property 1=Default.svg", out: "00-default.svg", stage: "0-intact" },
  { src: "Property 1=Better Bite 1.svg", out: "01-better-bite-1.svg", stage: "click-1" },
  { src: "Property 1=HeartAches Last Bite.svg", out: "04-heartaches-last-bite.svg", stage: "click-2" },
  { src: "Property 1=Variant9.svg", out: "06-variant9.svg", stage: "click-3" },
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
console.log("Sidebar thumbnail: classico.svg");
