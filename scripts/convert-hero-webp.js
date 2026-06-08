const sharp = require("sharp");
const { readdir, readFile } = require("fs/promises");
const { join } = require("path");

const HERO_DIR = join(__dirname, "../public/hero");
const MAX_WIDTH = 900;
const QUALITY = 82;

function extractBase64Image(svgContent) {
  const match = svgContent.match(/xlink:href="data:image\/(png|jpeg|jpg|webp);base64,([^"]+)"/i);
  if (!match) throw new Error("Embedded image not found");
  return Buffer.from(match[2], "base64");
}

async function convert() {
  const files = (await readdir(HERO_DIR)).filter((f) => f.endsWith(".svg"));
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const input = join(HERO_DIR, file);
    const output = join(HERO_DIR, file.replace(".svg", ".webp"));
    const svgContent = await readFile(input, "utf8");
    const { size: beforeSize } = await import("fs").then((fs) => fs.promises.stat(input));
    totalBefore += beforeSize;

    const imageBuffer = extractBase64Image(svgContent);

    const info = await sharp(imageBuffer)
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(output);

    totalAfter += info.size;
    const kb = (info.size / 1024).toFixed(0);
    const mbBefore = (beforeSize / 1024 / 1024).toFixed(1);
    console.log(`${file}: ${mbBefore} MB → ${file.replace(".svg", ".webp")} ${info.width}x${info.height} ${kb} KB`);
  }

  console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(1)} MB → ${(totalAfter / 1024).toFixed(0)} KB (${Math.round((1 - totalAfter / totalBefore) * 100)}% menor)`);
}

convert().catch(console.error);
