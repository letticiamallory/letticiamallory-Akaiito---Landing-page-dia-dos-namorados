const fs = require("fs");

const svgPath = process.argv[2];
const svg = fs.readFileSync(svgPath, "utf8");

const columns = [
  { id: 0, x: 60.5, y: 89.5, w: 64, h: 469 },
  { id: 1, x: 138.5, y: 89.5, w: 67, h: 352.067 },
  { id: 2, x: 219.5, y: 90.5, w: 63, h: 371 },
  { id: 3, x: 296.5, y: 90.5, w: 67, h: 352 },
  { id: 4, x: 377.5, y: 90.5, w: 63, h: 327 },
  { id: 5, x: 454.5, y: 90.5, w: 63, h: 415 },
];

for (const col of columns) {
  const rects = [...svg.matchAll(/<rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"[^>]*>/g)]
    .filter((m) => {
      const x = +m[1];
      const y = +m[2];
      const w = +m[3];
      const h = +m[4];
      return x >= col.x && x <= col.x + col.w && y >= col.y && y <= col.y + col.h && w >= 15 && w <= 120;
    });
  console.log(`Column ${col.id}: ${rects.length} rects`);
  rects.slice(0, 5).forEach((m) => console.log(`  ${m[0].slice(0, 80)}`));
}

// count path elements per column region
for (const col of columns) {
  let count = 0;
  const pathRegex = /<path[^>]*d="([^"]+)"/g;
  let m;
  while ((m = pathRegex.exec(svg))) {
    const d = m[1];
    const nums = d.match(/[\d.]+/g)?.map(Number) ?? [];
    if (nums.length >= 2) {
      const px = nums[0];
      const py = nums[1];
      if (px >= col.x - 5 && px <= col.x + col.w + 5 && py >= col.y - 5 && py <= col.y + col.h + 5) count++;
    }
  }
  console.log(`Column ${col.id}: ~${count} paths`);
}
