const fs = require("fs");
const svg = fs.readFileSync("public/chocolate/components.svg", "utf8");

const columns = [
  { id: 0, name: "classico", minX: 55, maxX: 130, minY: 100, maxY: 160 },
  { id: 1, name: "coracao", minX: 130, maxX: 210, minY: 100, maxY: 170 },
  { id: 2, name: "listrado", minX: 210, maxX: 290, minY: 100, maxY: 170 },
  { id: 3, name: "estrela", minX: 290, maxX: 370, minY: 100, maxY: 170 },
  { id: 4, name: "redondo", minX: 370, maxX: 450, minY: 100, maxY: 180 },
  { id: 5, name: "coracao-2", minX: 450, maxX: 530, minY: 100, maxY: 180 },
];

const tagRegex = /<(path|rect|circle|ellipse|polygon)[^>]*\/>|<(path|rect)[^>]*>[\s\S]*?<\/\2>/g;

function nums(tag) {
  return (tag.match(/-?\d+\.?\d*/g) || []).map(Number);
}

function inBox(tag, box) {
  if (tag.includes("#9747FF") || tag.includes("stroke-dasharray")) return false;
  const n = nums(tag);
  for (let i = 0; i < n.length - 1; i += 2) {
    const x = n[i];
    const y = n[i + 1];
    if (x >= box.minX && x <= box.maxX && y >= box.minY && y <= box.maxY) return true;
  }
  return false;
}

for (const col of columns) {
  const tags = [...svg.matchAll(tagRegex)].map((m) => m[0]).filter((t) => inBox(t, col));
  console.log(`${col.name}: ${tags.length} tags`);
}
