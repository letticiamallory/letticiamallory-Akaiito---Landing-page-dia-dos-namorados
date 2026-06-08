const fs = require("fs");
const svg = fs.readFileSync("public/chocolate/components.svg", "utf8");

const cols = [
  { id: 0, name: "classico", minX: 60, maxX: 124, sampleY: 109 },
  { id: 1, name: "coracao", minX: 138, maxX: 205, sampleY: 110 },
  { id: 2, name: "redondo", minX: 219, maxX: 282, sampleY: 110 },
  { id: 3, name: "estrela", minX: 296, maxX: 363, sampleY: 110 },
  { id: 4, name: "flor", minX: 377, maxX: 440, sampleY: 110 },
  { id: 5, name: "coração", minX: 454, maxX: 517, sampleY: 110 },
];

for (const col of cols) {
  const paths = [...svg.matchAll(/<path[^>]*>/g)]
    .map((m) => m[0])
    .filter((p) => {
      const m = p.match(/\bd="M([\d.]+)\s+([\d.]+)/);
      if (!m) return false;
      const x = +m[1];
      const y = +m[2];
      return x >= col.minX && x <= col.maxX && y >= col.sampleY - 5 && y <= col.sampleY + 80;
    });
  console.log(`\n=== ${col.name} (${paths.length} paths) ===`);
  paths.slice(0, 3).forEach((p) => console.log(p.slice(0, 120) + "..."));
}
