/**
 * Normaliza Default + mordidas do Coração para canvas 25×25 (mesmo tamanho visual).
 *
 * Default/Variant2: export 43×40 — recorta região 28×28 centrada no coração + escala 25/28
 * Variant4/Variant6: export 28×28 — escala 25/28 (igual mordidas do Clássico)
 *
 *   node scripts/import-coracao-figma.js "<pasta-figma>"
 *   node scripts/normalize-coracao-svgs.js
 */
const fs = require("fs");
const path = require("path");

const DIR = "public/chocolate/chocolates/coracao";
const THUMB = "public/chocolate/chocolates/coracao.svg";
const OUT = 25;
const vb = `0 0 ${OUT} ${OUT}`;
/** Mesma lógica do Clássico: export 28×28 → slot 25×25 */
const BITE_SCALE = OUT / 28;
/** Centro do coração no export 43×40 (Default) */
const HEART_CX = 20.266;
const HEART_CY = 19.489;
const CROP_SIZE = 28;
const CROP_X = HEART_CX - CROP_SIZE / 2;
const CROP_Y = HEART_CY - CROP_SIZE / 2;

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

function parseViewBox(raw) {
  const m = raw.match(/viewBox="([^"]+)"/);
  if (m) {
    const parts = m[1].trim().split(/\s+/).map(Number);
    return { w: parts[2], h: parts[3] };
  }
  const w = Number(raw.match(/\bwidth="([^"]+)"/)?.[1]);
  const h = Number(raw.match(/\bheight="([^"]+)"/)?.[1]);
  return { w, h };
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

function normalizeLarge(file, raw) {
  const { defs, body } = cleanContent(raw);
  writeSvg(file, {
    defs,
    body: `<g transform="translate(${-CROP_X} ${-CROP_Y}) scale(${BITE_SCALE})">\n${body}\n</g>`,
  });
}

function normalizeSmall(file, raw) {
  const wrapped = raw.match(
    /<g transform="translate[^"]+" scale\([^)]+\)">\s*([\s\S]*?)\s*<\/g>/
  );
  if (wrapped) {
    writeSvg(file, {
      defs: "",
      body: `<g transform="scale(${BITE_SCALE})">\n${wrapped[1].trim()}\n</g>`,
    });
    return;
  }
  const { defs, body } = cleanContent(raw);
  writeSvg(file, {
    defs,
    body: `<g transform="scale(${BITE_SCALE})">\n${body}\n</g>`,
  });
}

function normalizeFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  const { w } = parseViewBox(raw);
  if (w > 30) normalizeLarge(file, raw);
  else normalizeSmall(file, raw);
}

for (const file of fs.readdirSync(DIR)) {
  if (!file.endsWith(".svg") || file === "00-default.svg") continue;
  normalizeFile(path.join(DIR, file));
}

for (const file of [THUMB, path.join(DIR, "00-default.svg")]) {
  if (fs.existsSync(file)) normalizeFile(file);
}

console.log(
  `Coracao SVGs → viewBox="${vb}", scale ${BITE_SCALE}, crop large @ (${CROP_X}, ${CROP_Y})`
);
