/**
 * Importa "Frame N Overlay + Label.svg" do pacote Figma,
 * remove a camada de label/foto embutida e gera frame-N.svg (só moldura).
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

function stripLabelLayer(svg: string): string {
  const labelGroup = svg.match(/<g filter="url\(#filter0[^"]*\)">[\s\S]*?<\/g>/);
  if (!labelGroup) return svg;

  const labelPatternId = labelGroup[0].match(/fill="url\(#([^)]+)\)"/)?.[1];
  let out = svg.replace(labelGroup[0], "");
  out = out.replace(/<filter id="filter0[\s\S]*?<\/filter>/, "");

  if (labelPatternId) {
    const patternBlock = out.match(
      new RegExp(`<pattern id="${labelPatternId}"[\\s\\S]*?</pattern>`)
    )?.[0];
    if (patternBlock) {
      const imageId = patternBlock.match(/xlink:href="#([^"]+)"/)?.[1];
      out = out.replace(patternBlock, "");
      if (imageId) {
        out = out.replace(
          new RegExp(`<image id="${imageId}"[\\s\\S]*?/>`),
          ""
        );
      }
    }
  }

  return out;
}

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
  const matches = await glob("**/Frame 1 Overlay + Label.svg", {
    cwd: "C:/Users/lett/Downloads",
    absolute: true,
    nodir: true,
  });
  const preferred =
    matches.find((p) => p.includes("(1)")) ?? matches[matches.length - 1];
  if (!preferred) {
    throw new Error(
      "Não encontrei 'Frame 1 Overlay + Label.svg' em Downloads."
    );
  }
  return join(preferred, "..");
}

async function main() {
  const sourceDir = await findSourceDir();
  console.log(`Fonte: ${sourceDir}\n`);

  for (let n = 1; n <= 9; n++) {
    const srcName = `Frame ${n} Overlay + Label.svg`;
    const srcPath = join(sourceDir, srcName);
    const destPath = join(MUSEUM_DIR, `frame-${n}.svg`);

    try {
      const raw = await readFile(srcPath, "utf8");
      const stripped = stripLabelLayer(raw);
      if (!stripped.includes("<image")) {
        throw new Error("SVG sem camada de moldura após remover label");
      }
      const optimized = await extractWebpsAndEmbed(stripped, `frame-${n}`);
      await writeFile(destPath, optimized, "utf8");

      const before = Buffer.byteLength(raw, "utf8");
      const after = Buffer.byteLength(optimized, "utf8");
      console.log(
        `✓ frame-${n}.svg  ${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024).toFixed(0)}KB (sem label)`
      );
    } catch (err) {
      console.error(`✗ frame-${n}:`, err instanceof Error ? err.message : err);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
