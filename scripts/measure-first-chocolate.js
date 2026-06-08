/**
 * Find tight crop for first chocolate only in each column of components.svg
 */
const fs = require("fs");
const svg = fs.readFileSync("public/chocolate/components.svg", "utf8");

const cols = [
  { name: "classico", x0: 58, x1: 128 },
  { name: "coracao", x0: 136, x1: 208 },
  { name: "listrado", x0: 217, x1: 285 },
  { name: "especial", x0: 294, x1: 366 },
  { name: "redondo", x0: 375, x1: 443 },
  { name: "gourmet", x0: 452, x1: 520 },
];

// First row ends before ~y=145 (second row starts ~149+)
const FIRST_ROW_Y_MAX = 145;

function extractNumbersFromPath(d) {
  const nums = d.match(/-?\d+\.?\d*/g);
  return nums ? nums.map(Number) : [];
}

function bboxFromPath(d) {
  const nums = extractNumbersFromPath(d);
  if (nums.length < 2) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i], y = nums[i + 1];
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    if (x > 600 || y > 700) continue; // skip curve params mistaken as coords
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  if (!Number.isFinite(minX)) return null;
  return { minX, minY, maxX, maxY };
}

function inFirstRowCol(bbox, col) {
  const cx = (bbox.minX + bbox.maxX) / 2;
  return (
    cx >= col.x0 &&
    cx <= col.x1 &&
    bbox.minY >= 95 &&
    bbox.maxY <= FIRST_ROW_Y_MAX
  );
}

const pathRe = /<path[^>]*d="([^"]*)"[^>]*\/?>/g;
const rectRe = /<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g;

for (const col of cols) {
  const boxes = [];

  let m;
  while ((m = pathRe.exec(svg))) {
    const d = m[1];
    const tag = m[0];
    if (tag.includes("stroke-dasharray")) continue;
    const bbox = bboxFromPath(d);
    if (bbox && inFirstRowCol(bbox, col)) boxes.push(bbox);
  }

  while ((m = rectRe.exec(svg))) {
    const x = +m[1], y = +m[2], w = +m[3], h = +m[4];
    if (w < 10 || h < 10 || w > 50) continue;
    const bbox = { minX: x, minY: y, maxX: x + w, maxY: y + h };
    if (inFirstRowCol(bbox, col)) boxes.push(bbox);
  }

  if (!boxes.length) {
    console.log(col.name, "NO BOXES");
    continue;
  }

  const minX = Math.min(...boxes.map((b) => b.minX));
  const minY = Math.min(...boxes.map((b) => b.minY));
  const maxX = Math.max(...boxes.map((b) => b.maxX));
  const maxY = Math.max(...boxes.map((b) => b.maxY));

  const pad = 2;
  const crop = [
    Math.floor(minX - pad),
    Math.floor(minY - pad),
    Math.ceil(maxX - minX + pad * 2),
    Math.ceil(maxY - minY + pad * 2),
  ];
  console.log(`${col.name}: [${crop.join(", ")}]  (y ${minY.toFixed(0)}-${maxY.toFixed(0)})`);
}
