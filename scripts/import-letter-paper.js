/**
 * Extrai o papel de carta do PPTX "Letticia & João" → public/letter/paper/
 */
const sharp = require("sharp");
const { mkdir, copyFile, rm } = require("fs/promises");
const { join } = require("path");
const { execSync } = require("child_process");

const PPTX =
  process.argv[2] ||
  "C:/Users/lett/Downloads/Letticia & João (2).pptx";
const OUT = join(__dirname, "../public/letter/paper");
const TMP = join(__dirname, "../.tmp-letter-pptx");

async function extract() {
  await rm(TMP, { recursive: true, force: true });
  await mkdir(TMP, { recursive: true });
  await copyFile(PPTX, join(TMP, "deck.zip"));
  execSync(
    `powershell -NoProfile -Command "Expand-Archive -Path '${join(TMP, "deck.zip").replace(/'/g, "''")}' -DestinationPath '${TMP.replace(/'/g, "''")}' -Force"`,
    { stdio: "inherit" }
  );
}

async function convert() {
  await mkdir(OUT, { recursive: true });
  const media = join(TMP, "ppt/media");

  await sharp(join(media, "image3.png"))
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(join(OUT, "texture.webp"));

  await sharp(join(media, "image4.png"))
    .resize({ width: 400, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(join(OUT, "deco-botanical.webp"));

  await sharp(join(media, "image6.png"))
    .resize({ width: 280, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(join(OUT, "deco-flower.webp"));

  const tex = await sharp(join(OUT, "texture.webp")).metadata();
  const aspect = +((tex.height / tex.width).toFixed(4));
  console.log(`texture: ${tex.width}x${tex.height}, aspect=${aspect}`);
  console.log(`→ ${OUT}`);
}

async function main() {
  console.log("PPTX:", PPTX);
  await extract();
  await convert();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
