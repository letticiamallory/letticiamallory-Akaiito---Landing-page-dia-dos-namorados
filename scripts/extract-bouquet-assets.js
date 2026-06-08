const sharp = require("sharp");
const { mkdir } = require("fs/promises");
const { join } = require("path");

const BOUQUET_DIR = join(__dirname, "../public/bouquet");
const OUT = join(__dirname, "../public/bouquet/assets");

async function extract(input, out, crop, sheetW, sheetH) {
  const meta = await sharp(input, { density: 144 }).metadata();
  const scale = meta.width / sheetW;
  let left = Math.round(crop.x * scale);
  let top = Math.round(crop.y * scale);
  let width = Math.round(crop.w * scale);
  let height = Math.round(crop.h * scale);

  if (left + width > meta.width) width = meta.width - left - 1;
  if (top + height > meta.height) height = meta.height - top - 1;
  if (width < 1 || height < 1) throw new Error(`Invalid crop for ${out}`);

  const info = await sharp(input, { density: 144 })
    .extract({ left, top, width, height })
    .resize(320, 320, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .ensureAlpha()
    .trim({ threshold: 12 })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(out);

  console.log(`${out.replace(/.*[\\/]/, "")} → ${info.width}x${info.height}`);
}

async function main() {
  await mkdir(join(OUT, "flowers"), { recursive: true });
  await mkdir(join(OUT, "wrappers"), { recursive: true });
  await mkdir(join(OUT, "ties"), { recursive: true });

  const flowers = [
    ["lily", 0, 0, 38, 69],
    ["sunflower", 44, 0, 42, 69],
    ["forget-me-not", 86, 0, 38, 69],
    ["poppy", 118, 0, 38, 48],
    ["clover", 148, 0, 25, 69],
  ];
  for (const [id, x, y, w, h] of flowers) {
    await extract(
      join(BOUQUET_DIR, "individual-flowers.svg"),
      join(OUT, "flowers", `${id}.webp`),
      { x, y, w, h },
      173,
      69
    );
  }

  const wrappers = [
    ["cream", 0, 61, 280, 212],
    ["pink", 0, 310, 210, 228],
    ["purple", 220, 61, 280, 212],
    ["kraft", 430, 61, 280, 212],
  ];
  for (const [id, x, y, w, h] of wrappers) {
    await extract(join(BOUQUET_DIR, "wrappers.svg"), join(OUT, "wrappers", `${id}.webp`), { x, y, w, h }, 831, 539);
  }

  const ties = [
    ["ribbon-pink", 0, 61, 150, 115],
    ["ribbon-purple", 190, 61, 150, 115],
    ["twine", 340, 61, 180, 115],
  ];
  for (const [id, x, y, w, h] of ties) {
    await extract(join(BOUQUET_DIR, "ties.svg"), join(OUT, "ties", `${id}.webp`), { x, y, w, h }, 559, 177);
  }
}

main().catch(console.error);
