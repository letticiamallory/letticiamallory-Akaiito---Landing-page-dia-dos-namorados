/**
 * Remove o grupo de placeholder com filtro interno dos SVGs de quadro.
 * Mantém só a camada da moldura — a foto do usuário fica por baixo.
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "../public/museum");

for (let i = 1; i <= 9; i++) {
  const file = path.join(dir, `frame-${i}.svg`);
  let svg = fs.readFileSync(file, "utf8");

  const before = svg.length;
  svg = svg.replace(
    /<g filter="url\(#filter[^"]+\)">\s*<rect[^/]*\/>\s*<\/g>\s*/g,
    ""
  );

  if (svg.length === before) {
    console.warn(`frame-${i}: nenhum placeholder removido`);
  } else {
    fs.writeFileSync(file, svg);
    console.log(`frame-${i}: placeholder removido (${((before - svg.length) / 1024).toFixed(1)} KB)`);
  }
}
