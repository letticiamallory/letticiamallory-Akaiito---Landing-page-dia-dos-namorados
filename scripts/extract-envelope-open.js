const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SVG_PATH = path.join(__dirname, "../public/letter/envelopes.svg");
const OUT_DIR = path.join(__dirname, "../public/letter/envelopes");

/** colX from letter-catalog + crops for open body (full envelope open) */
const STYLES = [
  { id: "classic-cream", colX: 310 },
  { id: "blush", colX: 1799 },
  { id: "sage", colX: 3288 },
  { id: "midnight", colX: 4777 },
];

const BODY_OPEN = { x: 8, y: 1981, w: 1152, h: 687 };

async function main() {
  const svg = fs.readFileSync(SVG_PATH, "utf8");
  const re = /xlink:href="data:image\/png;base64,([^"]+)"/g;
  const images = [];
  let m;
  while ((m = re.exec(svg)) !== null) {
    images.push(Buffer.from(m[1], "base64"));
  }

  console.log(`Found ${images.length} embedded PNGs`);
  const sheet = images.find((buf) => {
    try {
      const meta = sharp(buf).metadata();
      return meta;
    } catch {
      return false;
    }
  });

  // Use largest embedded image as sprite sheet (4096x2828)
  let sheetBuf = null;
  let maxPixels = 0;
  for (const buf of images) {
    try {
      const meta = await sharp(buf).metadata();
      const px = (meta.width || 0) * (meta.height || 0);
      if (px > maxPixels) {
        maxPixels = px;
        sheetBuf = buf;
      }
    } catch {
      /* skip */
    }
  }

  if (!sheetBuf) {
    console.error("No sheet buffer found");
    process.exit(1);
  }

  const sheetMeta = await sharp(sheetBuf).metadata();
  console.log(`Sheet: ${sheetMeta.width}x${sheetMeta.height}`);

  const scale = sheetMeta.width / 6245;

  for (const style of STYLES) {
    const left = Math.round((style.colX + BODY_OPEN.x) * scale);
    const top = Math.round(BODY_OPEN.y * scale);
    const width = Math.round(BODY_OPEN.w * scale);
    const height = Math.round(BODY_OPEN.h * scale);

    const out = path.join(OUT_DIR, `${style.id}-open.webp`);
    await sharp(sheetBuf)
      .extract({ left, top, width, height })
      .webp({ quality: 90 })
      .toFile(out);

    console.log(`Wrote ${style.id}-open.webp (${width}x${height})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
