/**
 * Assets da seção de música — PPTX "Letticia & João (3)"
 */
const sharp = require("sharp");
const { mkdir, copyFile, rm } = require("fs/promises");
const { join } = require("path");
const { execSync } = require("child_process");

const PPTX =
  process.argv[2] ||
  "C:/Users/lett/Downloads/Letticia & João (3).pptx";
const OUT = join(__dirname, "../public/music-section");
const TMP = join(__dirname, "../.tmp-music-pptx");

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

  await sharp(join(media, "image1.png"))
    .resize({ width: 534, withoutEnlargement: true })
    .webp({ quality: 92, alphaQuality: 100 })
    .toFile(join(OUT, "polaroid-frame.webp"));

  await sharp(join(media, "image2.png"))
    .resize({ width: 701, withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(join(OUT, "clothesline.webp"));

  await sharp(join(media, "image3.png"))
    .resize({ width: 280, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(join(OUT, "hearts.webp"));

  await sharp(join(media, "image4.png"))
    .resize({ width: 120, withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(join(OUT, "heart-red.webp"));

  const frame = await sharp(join(OUT, "polaroid-frame.webp")).metadata();
  console.log(`polaroid frame: ${frame.width}x${frame.height}`);
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
