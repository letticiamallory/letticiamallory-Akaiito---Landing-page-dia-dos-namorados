const fs = require("fs");
const svg = fs.readFileSync("public/chocolate/components.svg", "utf8");

const cols = [
  { name: "classico", id: 0, label: "Clássico", x0: 58, x1: 128, cropW: 72, cropH: 58 },
  { name: "coracao", id: 1, label: "Coração", x0: 136, x1: 208, cropW: 70, cropH: 55 },
  { name: "listrado", id: 2, label: "Listrado", x0: 217, x1: 285, cropW: 68, cropH: 50 },
  { name: "especial", id: 3, label: "Especial", x0: 294, x1: 366, cropW: 70, cropH: 58 },
  { name: "redondo", id: 4, label: "Redondo", x0: 375, x1: 443, cropW: 68, cropH: 58 },
  { name: "gourmet", id: 5, label: "Gourmet", x0: 452, x1: 520, cropW: 68, cropH: 58 },
];

function pathStarts(tag) {
  const starts = [];
  const re = /d="[^"]*?M\s*([\d.]+)\s+([\d.]+)/g;
  let m;
  while ((m = re.exec(tag))) starts.push({ x: +m[1], y: +m[2] });
  return starts;
}

const tags = svg.match(/<(path|g|rect|ellipse|circle)[^>]*(?:\/>|>[\s\S]*?<\/\1>)/g) || [];

function clusterRows(ys, minGap = 30) {
  const sorted = [...new Set(ys.map((y) => Math.round(y)))].sort((a, b) => a - b);
  const rows = [];
  let group = [sorted[0]];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] - group[group.length - 1] >= minGap) {
      rows.push(Math.round(group.reduce((a, b) => a + b, 0) / group.length));
      group = [sorted[i]];
    } else {
      group.push(sorted[i]);
    }
  }
  if (group.length) rows.push(Math.round(group.reduce((a, b) => a + b, 0) / group.length));
  return rows;
}

const catalog = [];

for (const col of cols) {
  const ys = [];
  for (const tag of tags) {
    if (tag.includes("stroke-dasharray")) continue;
    for (const s of pathStarts(tag)) {
      if (s.x >= col.x0 && s.x <= col.x1 && s.y >= 100 && s.y <= 510) ys.push(s.y);
    }
    const rectM = tag.match(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/);
    if (rectM) {
      const x = +rectM[1],
        y = +rectM[2],
        w = +rectM[3],
        h = +rectM[4];
      const cx = x + w / 2;
      if (cx >= col.x0 && cx <= col.x1 && y >= 100 && y <= 510 && w >= 15 && h >= 15) ys.push(y);
    }
  }
  const rows = clusterRows(ys);
  const stages = rows.map((y) => [col.x0, y - 8, col.cropW, col.cropH]);
  catalog.push({ id: col.id, name: col.label, stages });
  console.log(`\n${col.label} (${stages.length} stages):`);
  stages.forEach((s, i) => console.log(`  ${i}: [${s.join(", ")}]`));
}

fs.writeFileSync("public/chocolate/bite-catalog.json", JSON.stringify(catalog, null, 2));
