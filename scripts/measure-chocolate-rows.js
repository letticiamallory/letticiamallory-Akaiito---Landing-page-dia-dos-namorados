/**
 * Measure bbox per row in each column (for bite stages + thumb)
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

function clusterRows(ys, minGap = 32) {
  const sorted = [...new Set(ys.map((y) => Math.round(y)))].sort((a, b) => a - b);
  const rows = [];
  let group = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - group[group.length - 1] >= minGap) {
      rows.push(Math.round(group.reduce((a, b) => a + b, 0) / group.length));
      group = [sorted[i]];
    } else group.push(sorted[i]);
  }
  if (group.length) rows.push(Math.round(group.reduce((a, b) => a + b, 0) / group.length));
  return rows;
}

function pathStarts(tag) {
  const starts = [];
  const re = /d="[^"]*?M\s*([\d.]+)\s+([\d.]+)/g;
  let m;
  while ((m = re.exec(tag))) starts.push({ x: +m[1], y: +m[2] });
  return starts;
}

const tags = svg.match(/<(path|rect|g|ellipse|circle)[^>]*(?:\/>|>[\s\S]*?<\/\1>)/g) || [];

for (const col of cols) {
  const rowYs = [];
  const elements = [];

  for (const tag of tags) {
    if (tag.includes("stroke-dasharray")) continue;

    const rectM = tag.match(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/);
    if (rectM) {
      const x = +rectM[1], y = +rectM[2], w = +rectM[3], h = +rectM[4];
      const cx = x + w / 2;
      if (cx >= col.x0 && cx <= col.x1 && y >= 100 && y <= 520 && w >= 12 && h >= 12 && w <= 40) {
        rowYs.push(y);
        elements.push({ kind: "rect", x, y, w, h, cx, cy: y + h / 2 });
      }
      continue;
    }

    for (const s of pathStarts(tag)) {
      if (s.x >= col.x0 && s.x <= col.x1 && s.y >= 100 && s.y <= 520) {
        rowYs.push(s.y);
        elements.push({ kind: "path", x: s.x, y: s.y, w: 28, h: 28, cx: s.x, cy: s.y });
      }
    }
  }

  const rows = clusterRows(rowYs, col.name === "classico" || col.name === "listrado" ? 28 : 32);
  console.log(`\n${col.name} — ${rows.length} rows:`);

  for (const rowY of rows) {
    const inRow = elements.filter((e) => Math.abs(e.cy - rowY) < 20);
    if (!inRow.length) continue;
    const minX = Math.min(...inRow.map((e) => e.x));
    const minY = Math.min(...inRow.map((e) => e.y));
    const maxX = Math.max(...inRow.map((e) => e.x + e.w));
    const maxY = Math.max(...inRow.map((e) => e.y + e.h));
    const pad = 3;
    const crop = [
      Math.floor(minX - pad),
      Math.floor(minY - pad),
      Math.ceil(maxX - minX + pad * 2),
      Math.ceil(maxY - minY + pad * 2),
    ];
    console.log(`  row y≈${rowY}: [${crop.join(", ")}]`);
  }
}
