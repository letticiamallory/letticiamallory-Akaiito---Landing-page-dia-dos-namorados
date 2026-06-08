/**
 * Converte os SVGs do Figma (Downloads) para WebP em public/letter/envelopes/
 */
const sharp = require("sharp");
const { mkdir } = require("fs/promises");
const { join } = require("path");

const DOWNLOADS =
  "C:/Users/lett/Downloads/Template for a envelope and a golden ticket (Community) (3)";
const OUT = join(__dirname, "../public/letter/envelopes");

const MAP = [
  { id: "classic-cream", closed: "close_letter.svg", open: "open_letter.svg" },
  { id: "blush", closed: "close_letter-1.svg", open: "open_letter-1.svg" },
  { id: "sage", closed: "close_letter-2.svg", open: "open_letter-2.svg" },
  { id: "midnight", closed: "close_letter-3.svg", open: "open_letter-3.svg" },
];

async function convertPair(style) {
  const closedIn = join(DOWNLOADS, style.closed);
  const openIn = join(DOWNLOADS, style.open);
  const closedOut = join(OUT, `${style.id}.webp`);
  const openOut = join(OUT, `${style.id}-open.webp`);

  const closedMeta = await sharp(closedIn)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(closedOut);

  const openMeta = await sharp(openIn)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 88 })
    .toFile(openOut);

  const aspect = +(closedMeta.width / closedMeta.height).toFixed(4);
  console.log(
    `${style.id}: closed ${closedMeta.width}x${closedMeta.height}, open ${openMeta.width}x${openMeta.height}, aspect=${aspect}`,
  );
  return aspect;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const aspects = {};
  for (const style of MAP) {
    aspects[style.id] = await convertPair(style);
  }
  console.log("\nAspects:", JSON.stringify(aspects, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
