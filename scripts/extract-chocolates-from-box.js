/**
 * Build chocolate box assets:
 * - box-empty.svg = compartments + fixed white liners
 * - chocolates/*.svg = stage-0 crops from components.svg
 */
const fs = require("fs");
const path = require("path");

const boxSvg = fs.readFileSync("public/chocolate/box.svg", "utf8");
const outDir = "public/chocolate/chocolates";
const SHEET_W = 578;
const SHEET_H = 648;

const pathTagRegex = /<path[^>]*\/>|<path[^>]*>[\s\S]*?<\/path>/g;

function getPaths(svg) {
  return [...svg.matchAll(pathTagRegex)].map((m) => m[0]);
}

function getFill(tag) {
  const m = tag.match(/fill="([^"]+)"/);
  return m ? m[1] : null;
}

function pathStart(tag) {
  const m = tag.match(/d="M\s*([\d.]+)\s+([\d.]+)/);
  return m ? { x: +m[1], y: +m[2] } : null;
}

function writeCropSvg(filename, x, y, w, h) {
  fs.writeFileSync(
    path.join(outDir, filename),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}">
  <image href="/chocolate/components.svg" x="${-x}" y="${-y}" width="${SHEET_W}" height="${SHEET_H}"/>
</svg>`
  );
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const allPaths = getPaths(boxSvg);
const linerPaths = allPaths.filter((p) => {
  const f = getFill(p);
  return f === "#FFF8DC" || f === "#D0C3A1";
});

const refLinerOuter = linerPaths.find((p) => {
  const s = pathStart(p);
  return s && Math.abs(s.x - 565) < 5 && getFill(p) === "#FFF8DC" && s.y < 100;
});
const refLinerInner = linerPaths.find((p) => {
  const s = pathStart(p);
  return s && Math.abs(s.x - 565) < 5 && getFill(p) === "#D0C3A1" && s.y < 100;
});

const SLOT_CENTERS = [
  [155, 145], [360, 145], [565, 145], [770, 145],
  [155, 355], [360, 355], [565, 355], [770, 355],
  [155, 565], [360, 565], [565, 565], [770, 565],
];

const refStart = pathStart(refLinerOuter);

function linerGroupForSlot(cx, cy) {
  const dx = cx - refStart.x;
  const dy = cy - refStart.y - 75;
  return `<g transform="translate(${dx} ${dy})">\n${refLinerOuter}\n${refLinerInner}\n</g>`;
}

const baseEnd = boxSvg.indexOf('<path d="M565 485');
const defsStart = boxSvg.indexOf("<defs>");
const baseSvg = boxSvg.slice(0, baseEnd);
const defsSvg = boxSvg.slice(defsStart);
const allLiners = SLOT_CENTERS.map(([cx, cy]) => linerGroupForSlot(cx, cy)).join("\n");

fs.writeFileSync("public/chocolate/box-empty.svg", baseSvg + allLiners + "\n" + defsSvg);

const CHOCOLATE_ITEMS = [
  { file: "0-classico.svg", name: "Clássico", crop: [78, 107, 40, 36] },
  { file: "1-coracao.svg", name: "Coração", crop: [160, 119, 40, 36] },
  { file: "2-listrado.svg", name: "Listrado", crop: [237, 108, 30, 30] },
  { file: "3-especial.svg", name: "Especial", crop: [318, 120, 40, 36] },
  { file: "4-redondo.svg", name: "Redondo", crop: [398, 121, 30, 30] },
  { file: "5-gourmet.svg", name: "Gourmet", crop: [475, 121, 30, 30] },
];

const catalog = [];

for (const item of CHOCOLATE_ITEMS) {
  const [x, y, w, h] = item.crop;
  writeCropSvg(item.file, x, y, w, h);
  catalog.push({ id: catalog.length, name: item.name, file: `/chocolate/chocolates/${item.file}` });
}

fs.writeFileSync("public/chocolate/catalog.json", JSON.stringify(catalog, null, 2));
console.log(`box-empty: ${SLOT_CENTERS.length} liner slots`);
console.log(`catalog: ${catalog.length} types`);
