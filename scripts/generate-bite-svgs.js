/**
 * Gera SVGs individuais por estágio de mordida (recorte limpo do components.svg).
 * Ignora a 1ª linha de cada coluna (thumbnail / chocolate inteiro no sheet).
 */
const fs = require("fs");
const path = require("path");

const SHEET_W = 578;
const SHEET_H = 648;
const COMPONENTS = "/chocolate/components.svg";

/** [x, y, w, h] — de measure-chocolate-rows.js, sem linha y≈117/126/etc. */
const BITES = {
  classico: [
    [77, 151, 58, 51],
    [77, 196, 58, 52],
    [81, 244, 43, 48],
    [77, 304, 58, 70],
    [83, 379, 41, 49],
    [87, 442, 34, 34],
  ],
  coracao: [
    [159, 168, 52, 43],
    [159, 216, 52, 43],
    [165, 262, 48, 44],
    [163, 309, 50, 44],
    [163, 361, 43, 35],
  ],
  listrado: [
    [236, 130, 46, 72],
    [239, 242, 43, 47],
    [239, 286, 43, 48],
    [256, 340, 34, 34],
    [260, 393, 34, 34],
  ],
  especial: [
    [317, 167, 52, 45],
    [317, 214, 44, 45],
    [319, 263, 52, 45],
    [320, 309, 51, 46],
    [326, 363, 34, 34],
  ],
  redondo: [
    [401, 164, 34, 34],
    [398, 205, 35, 38],
    [401, 243, 44, 43],
    [398, 287, 47, 44],
    [397, 330, 34, 34],
  ],
  gourmet: [
    [479, 166, 34, 34],
    [478, 204, 35, 41],
    [477, 287, 45, 48],
    [476, 375, 46, 46],
    [477, 437, 34, 34],
  ],
};

const TYPE_IDS = {
  classico: 0,
  coracao: 1,
  listrado: 2,
  especial: 3,
  redondo: 4,
  gourmet: 5,
};

function writeBiteSvg(outPath, x, y, w, h) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}">
  <image href="${COMPONENTS}" x="${-x}" y="${-y}" width="${SHEET_W}" height="${SHEET_H}"/>
</svg>`;
  fs.writeFileSync(outPath, svg);
}

const catalog = [];

for (const [name, stages] of Object.entries(BITES)) {
  const dir = path.join("public/chocolate/bites", name);
  fs.mkdirSync(dir, { recursive: true });

  const paths = stages.map((crop, i) => {
    const file = `${String(i + 1).padStart(2, "0")}-bite.svg`;
    const [x, y, w, h] = crop;
    writeBiteSvg(path.join(dir, file), x, y, w, h);
    return `/chocolate/bites/${name}/${file}`;
  });

  catalog.push({ id: TYPE_IDS[name], name, stages: paths });
  console.log(`${name}: ${paths.length} bites`);
}

fs.writeFileSync("public/chocolate/bite-paths.json", JSON.stringify(catalog, null, 2));
console.log("Wrote public/chocolate/bite-paths.json");
