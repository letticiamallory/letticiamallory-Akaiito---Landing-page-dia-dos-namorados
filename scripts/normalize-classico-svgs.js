/**
 * Normaliza Default + mordidas do Clássico para o mesmo canvas 25×25.
 *
 *   node scripts/import-classico-figma.js "<pasta-figma>"
 *   node scripts/normalize-classico-svgs.js
 */
const fs = require("fs");
const path = require("path");

const DIR = "public/chocolate/chocolates/classico";
const THUMB = "public/chocolate/chocolates/classico.svg";

/** Slot do bombom no export Default (canvas 55×53) */
const SLOT_X = 12.0707;
const SLOT_Y = 17.3752;
const OUT = 25;
const vb = `0 0 ${OUT} ${OUT}`;
const BITE_SCALE = OUT / 26;

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

function normalizeBite(file) {
  let raw = fs.readFileSync(file, "utf8");
  const wrapped = raw.match(
    /<g transform="translate[^"]+" scale\([^)]+\)">\s*([\s\S]*?)\s*<\/g>/
  );
  const inner = wrapped ? wrapped[1].trim() : stripSvg(raw);
  writeSvg(file, {
    defs: "",
    body: `<g transform="scale(${BITE_SCALE})">\n${inner}\n</g>`,
  });
}

function normalizeDefault(file) {
  const raw = fs.readFileSync(file, "utf8");
  let { defs, body } = splitDefs(stripSvg(raw));

  // Filtros do Figma usam userSpaceOnUse no canvas 55×53 — quebram após recorte
  body = body.replace(/\s*filter="url\(#filter[^"]+\)"/g, "");
  defs = defs
    .replace(/<filter[\s\S]*?<\/filter>\s*/g, "")
    .replace(/<defs>\s*<\/defs>/, "");

  writeSvg(file, {
    defs,
    body: `<g transform="translate(${-SLOT_X} ${-SLOT_Y})">\n${body}\n</g>`,
  });
}

for (const file of fs.readdirSync(DIR)) {
  if (!file.endsWith(".svg") || file === "00-default.svg") continue;
  normalizeBite(path.join(DIR, file));
}

for (const file of [THUMB, path.join(DIR, "00-default.svg")]) {
  if (fs.existsSync(file)) normalizeDefault(file);
}

console.log(`Classico SVGs → viewBox="${vb}" (slot ${OUT}×${OUT}, bite scale ${BITE_SCALE})`);
