/**
 * Normaliza Default + mordidas do Listrado para canvas 25×25 (mesmo tamanho).
 *
 *   node scripts/import-listrado-figma.js "<pasta-figma>"
 *   node scripts/normalize-listrado-svgs.js
 */
const fs = require("fs");
const path = require("path");

const DIR = "public/chocolate/chocolates/listrado";
const THUMB = "public/chocolate/chocolates/listrado.svg";

/** Slot do bombom no export Default (canvas 55×53) */
const SLOT_X = 13.3343;
const SLOT_Y = 18.35;
const SLOT_SIZE = 23.5;
const OUT = 25;
const vb = `0 0 ${OUT} ${OUT}`;
/** Mordidas Figma 25×25 → slot 25×25; Default 23.5×23.5 → escala até 25 */
const BITE_SCALE = OUT / 25;
const DEFAULT_SCALE = OUT / SLOT_SIZE;

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

function normalizeBite(file, raw) {
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

function normalizeDefault(file, raw) {
  const { defs, body } = cleanContent(raw);
  writeSvg(file, {
    defs,
    body: `<g transform="translate(${-SLOT_X} ${-SLOT_Y}) scale(${DEFAULT_SCALE})">\n${body}\n</g>`,
  });
}

function normalizeLargeCanvas(file, raw) {
  const { defs, body } = cleanContent(raw);
  writeSvg(file, {
    defs,
    body: `<g transform="translate(${-SLOT_X} ${-SLOT_Y}) scale(${DEFAULT_SCALE})">\n${body}\n</g>`,
  });
}

function normalizeFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  const { w } = parseViewBox(raw);
  if (w > 30) normalizeLargeCanvas(file, raw);
  else normalizeBite(file, raw);
}

for (const file of fs.readdirSync(DIR)) {
  if (!file.endsWith(".svg") || file === "00-default.svg") continue;
  normalizeFile(path.join(DIR, file));
}

for (const file of [THUMB, path.join(DIR, "00-default.svg")]) {
  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file, "utf8");
    normalizeDefault(file, raw);
  }
}

console.log(
  `Listrado SVGs → viewBox="${vb}", default scale ${DEFAULT_SCALE}, bite scale ${BITE_SCALE}`
);
