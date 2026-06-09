/**
 * Importa Museum Spectators 1/2 e Museum Spectator 3 do pacote Figma
 * para public/museum/spectator-N.svg (embed WebP para <img>).
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { glob } from "glob";
import sharp from "sharp";
import { optimize } from "svgo";

const PUBLIC_DIR = join(process.cwd(), "public");
const MUSEUM_DIR = join(PUBLIC_DIR, "museum");

const DATA_URI_RE =
  /xlink:href="data:image\/(png|jpeg|jpg|webp);base64,([^"]+)"/g;

const SOURCES: { src: string; dest: string }[] = [
  { src: "Museum Spectators 1.svg", dest: "spectator-1.svg" },
  { src: "Museum Spectators 2.svg", dest: "spectator-2.svg" },
  { src: "Museum Spectator 3.svg", dest: "spectator-3.svg" },
];

async function extractWebpsAndEmbed(svg: string, stem: string): Promise<string> {
  const assetsDir = join(MUSEUM_DIR, `${stem}.assets`);
  await mkdir(assetsDir, { recursive: true });

  let result = svg;
  let index = 0;
  const matches = [...svg.matchAll(DATA_URI_RE)];

  for (const match of matches) {
    const buffer = Buffer.from(match[2], "base64");
    const assetName = `${stem}-${index}.webp`;
    const assetPath = join(assetsDir, assetName);
    await sharp(buffer).webp({ quality: 88, effort: 4 }).toFile(assetPath);

    const embedded = await readFile(assetPath);
    const b64 = embedded.toString("base64");
    result = result.replace(match[0], `xlink:href="data:image/webp;base64,${b64}"`);
    index++;
  }

  try {
    result = optimize(result, {
      multipass: true,
      plugins: [
        "preset-default",
        { name: "removeViewBox", active: false },
        { name: "cleanupIds", params: { remove: false, minify: true } },
      ],
    }).data;
  } catch {
    // SVGO pode falhar em SVGs enormes.
  }

  return result;
}

async function findSourceDir(): Promise<string> {
  const matches = await glob("**/Museum Spectators 1.svg", {
    cwd: "C:/Users/lett/Downloads",
    absolute: true,
    nodir: true,
  });
  const preferred = matches.find((p) => !p.includes("(1)")) ?? matches[0];
  if (!preferred) {
    throw new Error("Não encontrei 'Museum Spectators 1.svg' em Downloads.");
  }
  return join(preferred, "..");
}

async function main() {
  const sourceDir = await findSourceDir();
  console.log(`Fonte: ${sourceDir}\n`);

  for (const { src, dest } of SOURCES) {
    const srcPath = join(sourceDir, src);
    const destPath = join(MUSEUM_DIR, dest);
    const stem = dest.replace(/\.svg$/, "");

    try {
      const raw = await readFile(srcPath, "utf8");
      if (!raw.includes("<image")) {
        throw new Error("SVG sem imagem embutida");
      }
      const optimized = await extractWebpsAndEmbed(raw, stem);
      await writeFile(destPath, optimized, "utf8");

      const before = Buffer.byteLength(raw, "utf8");
      const after = Buffer.byteLength(optimized, "utf8");
      console.log(
        `✓ ${dest}  ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024).toFixed(0)}KB`
      );
    } catch (err) {
      console.error(`✗ ${dest}:`, err instanceof Error ? err.message : err);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
