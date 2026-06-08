/**
 * Normaliza Default + mordidas do Gourmet para canvas 25×25 (mesmo tamanho).
 *
 * Default/Variant3: 32×32; Variant5: 25×25; Variant8: 24×25 — todos escala 25/32
 *
 *   node scripts/import-gourmet-figma.js "<pasta-figma>"
 *   node scripts/normalize-gourmet-svgs.js
 */
const fs = require("fs");
const path = require("path");

const DIR = "public/chocolate/chocolates/gourmet";
const THUMB = "public/chocolate/chocolates/gourmet.svg";
const OUT = 25;
const vb = `0 0 ${OUT} ${OUT}`;
const SCALE = OUT / 32;

function stripSvg(raw) {
  return raw
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();
}

function splitDefs(inner) {
  const match = inner.match(/<defs[\s\S]*?<\/defs>/);
  if (!match) return { defs: "", body: inner.trim() };
  return {
    defs: match[0],
    body: inner.replace(match[0], "").trim(),
  };
}

function writeSvg(file, parts) {
  fs.writeFileSync(
    file,
    `<svg width="${OUT}" height="${OUT}" viewBox="${vb}" fill="none" xmlns="http://www.w3.org/2000/svg">
${parts.defs ? `${parts.defs}\n` : ""}${parts.body}
</svg>
`
  );
}

function cleanContent(raw) {
  let { defs, body } = splitDefs(stripSvg(raw));
  body = body.replace(/\s*filter="url\(#filter[^"]+\)"/g, "");
  defs = defs
    .replace(/<filter[\s\S]*?<\/filter>\s*/g, "")
    .replace(/<defs>\s*<\/defs>/, "");
  return { defs, body };
}

function normalizeFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  const wrapped = raw.match(
    /<g transform="translate[^"]+" scale\([^)]+\)">\s*([\s\S]*?)\s*<\/g>/
  );

  if (wrapped) {
    writeSvg(file, {
      defs: "",
      body: `<g transform="scale(${SCALE})">\n${wrapped[1].trim()}\n</g>`,
    });
    return;
  }

  const { defs, body } = cleanContent(raw);
  writeSvg(file, {
    defs,
    body: `<g transform="scale(${SCALE})">\n${body}\n</g>`,
  });
}

for (const file of fs.readdirSync(DIR)) {
  if (!file.endsWith(".svg") || file === "00-default.svg") continue;
  normalizeFile(path.join(DIR, file));
}

for (const file of [THUMB, path.join(DIR, "00-default.svg")]) {
  if (fs.existsSync(file)) normalizeFile(file);
}

console.log(`Gourmet SVGs → viewBox="${vb}", scale ${SCALE}`);
