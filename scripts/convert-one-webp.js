const sharp = require("sharp");
const { readFile, unlink } = require("fs/promises");
const { join } = require("path");

const HERO_DIR = join(__dirname, "../public/hero");
const file = process.argv[2] || "6.svg";

async function convertOne(filename) {
  const input = join(HERO_DIR, filename);
  const output = join(HERO_DIR, filename.replace(".svg", ".webp"));
  const svgContent = await readFile(input, "utf8");
  const match = svgContent.match(/xlink:href="data:image\/(png|jpeg|jpg|webp);base64,([^"]+)"/i);
  if (!match) throw new Error("Embedded image not found");

  const info = await sharp(Buffer.from(match[2], "base64"))
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(output);

  console.log(`${filename} → ${filename.replace(".svg", ".webp")} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
  await unlink(input).catch(() => {});
}

convertOne(file).catch(console.error);
