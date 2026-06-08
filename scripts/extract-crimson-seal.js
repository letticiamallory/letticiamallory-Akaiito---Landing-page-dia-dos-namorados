const sharp = require("sharp");
const { readFile, writeFile } = require("fs/promises");
const { join } = require("path");

const WAX_SVG = join(__dirname, "../public/letter/wax.svg");
const OUT = join(__dirname, "../public/letter/seals/crimson.webp");

async function main() {
  const svg = await readFile(WAX_SVG, "utf8");
  const match = svg.match(/id="image0_5_1538"[^>]*xlink:href="data:image\/png;base64,([^"]+)"/);
  if (!match) throw new Error("image0 (crimson) not found in wax.svg");

  const png = Buffer.from(match[1], "base64");
  const info = await sharp(png)
    .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(OUT);

  console.log(`crimson.webp → ${info.width}x${info.height} (${Math.round(info.size / 1024)} KB) from embedded PNG`);
}

main().catch(console.error);
