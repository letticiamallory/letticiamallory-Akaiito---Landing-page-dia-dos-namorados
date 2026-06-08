const fs = require("fs");
const path = require("path");

const svgPath = process.argv[2];
const outDir = process.argv[3];
const svg = fs.readFileSync(svgPath, "utf8");

const columns = [
  { id: 0, name: "classico", x: 60, y: 89, w: 64, h: 55 },
  { id: 1, name: "coracao", x: 138, y: 89, w: 67, h: 80 },
  { id: 2, name: "redondo", x: 219, y: 90, w: 63, h: 55 },
  { id: 3, name: "estrela", x: 296, y: 90, w: 67, h: 80 },
  { id: 4, name: "flor", x: 377, y: 90, w: 63, h: 80 },
  { id: 5, name: "coracao-2", x: 454, y: 90, w: 63, h: 80 },
];

const tagRegex = /<(path|rect|circle|ellipse|polygon|polyline|line|g)[^>]*(?:\/>|>[\s\S]*?<\/\1>)/g;

function getNumbers(str) {
  return (str.match(/-?\d+\.?\d*/g) || []).map(Number);
}

function inColumn(nums, col) {
  if (nums.length < 2) return false;
  const px = nums[0];
  const py = nums[1];
  return px >= col.x - 2 && px <= col.x + col.w + 2 && py >= col.y - 2 && py <= col.y + col.h + 2;
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const col of columns) {
  const tags = [...svg.matchAll(tagRegex)].map((m) => m[0]).filter((tag) => {
    if (tag.includes("#9747FF") || tag.includes("stroke-dasharray")) return false;
    const nums = getNumbers(tag);
    return inColumn(nums, col);
  });

  const inner = tags.join("\n");
  const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${col.x} ${col.y} ${col.w} ${col.h}" width="${col.w}" height="${col.h}">\n${inner}\n</svg>`;
  fs.writeFileSync(path.join(outDir, `${col.id}-${col.name}.svg`), out);
  console.log(`Wrote ${col.name}: ${tags.length} elements`);
}
