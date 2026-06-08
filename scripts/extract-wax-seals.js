const sharp = require("sharp");
const { mkdir, readFile } = require("fs/promises");
const { join } = require("path");

const WAX_SVG = join(__dirname, "../public/letter/wax.svg");
const OUT_DIR = join(__dirname, "../public/letter/seals");

const SEALS = [
  { id: "gold-classic", x: 921, y: 176, w: 535, h: 535 },
  { id: "rose-heart", x: 1556, y: 178, w: 535, h: 535 },
  { id: "burgundy", x: 284, y: 811, w: 535, h: 535 },
  { id: "emerald", x: 919, y: 841, w: 535, h: 476 },
  { id: "silver", x: 1554, y: 813, w: 535, h: 507 },
  { id: "blush", x: 284, y: 1446, w: 535, h: 493 },
  { id: "sapphire", x: 919, y: 1417, w: 535, h: 527 },
  { id: "lilac", x: 1554, y: 1420, w: 537, h: 522 },
  { id: "bronze", x: 944, y: 2044, w: 449, h: 503 },
  { id: "copper", x: 284, y: 2039, w: 510, h: 503 },
  { id: "ruby", x: 1556, y: 2042, w: 535, h: 499 },
  { id: "forest", x: 284, y: 2642, w: 485, h: 481 },
  { id: "amber", x: 944, y: 2656, w: 485, h: 467 },
  { id: "pearl", x: 1552, y: 2642, w: 539, h: 481 },
  // crimson: usar scripts/extract-crimson-seal.js (imagem embutida, rotacionada no sprite)
];

function stripDarkPixels(buffer, width, height, threshold = 45) {
  for (let i = 0; i < buffer.length; i += 4) {
    const r = buffer[i];
    const g = buffer[i + 1];
    const b = buffer[i + 2];
    if (r <= threshold && g <= threshold && b <= threshold) {
      buffer[i + 3] = 0;
    }
  }
  return buffer;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const only = process.argv[2];
  const list = only ? SEALS.filter((s) => s.id === only) : SEALS;
  if (only && !list.length) {
    console.error(`Selo desconhecido: ${only}`);
    process.exit(1);
  }

  let svg = await readFile(WAX_SVG, "utf8");
  svg = svg.replace(/<rect width="2375" height="3298"[^>]*fill="#222222"[^>]*\/>/g, "");
  const svgBuffer = Buffer.from(svg);

  const meta = await sharp(svgBuffer, { density: 144 }).metadata();
  const scale = (meta.width ?? 2375) / 2375;

  for (const seal of list) {
    const out = join(OUT_DIR, `${seal.id}.webp`);
    const { data, info } = await sharp(svgBuffer, { density: 144 })
      .extract({
        left: Math.round(seal.x * scale),
        top: Math.round(seal.y * scale),
        width: Math.round(seal.w * scale),
        height: Math.round(seal.h * scale),
      })
      .resize(256, 256, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    stripDarkPixels(data, info.width, info.height);

    let pipeline = sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    });

    if (!seal.noTrim) {
      pipeline = pipeline.trim({ threshold: 10 });
    }

    const fileInfo = await pipeline
      .webp({ quality: 90, alphaQuality: 100, effort: 4 })
      .toFile(out);

    const check = await sharp(out).metadata();
    console.log(
      `${seal.id}.webp → ${fileInfo.width}x${fileInfo.height} alpha=${check.hasAlpha} (${Math.round(fileInfo.size / 1024)} KB)`
    );
  }
}

main().catch(console.error);
