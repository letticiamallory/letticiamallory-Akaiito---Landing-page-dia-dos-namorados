/**
 * Extrai imagens base64 embutidas em SVGs, comprime para WebP externo
 * e otimiza o markup — mantém todos os arquivos, só reduz tamanho.
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname, join, basename, relative } from "path";
import { glob } from "glob";
import sharp from "sharp";
import { optimize } from "svgo";

const MIN_BYTES = 1 * 1024 * 1024; // 1 MB
const PUBLIC_DIR = join(process.cwd(), "public");

const DATA_URI_RE =
  /xlink:href="data:image\/(png|jpeg|jpg|webp);base64,([^"]+)"/g;

async function optimizeSvg(filePath: string) {
  const original = await readFile(filePath, "utf8");
  let svg = original;
  let extracted = 0;
  const dir = dirname(filePath);
  const stem = basename(filePath, ".svg");
  const assetsDir = join(dir, `${stem}.assets`);

  const matches = [...original.matchAll(DATA_URI_RE)];
  if (matches.length > 0) {
    await mkdir(assetsDir, { recursive: true });
  }

  for (const match of matches) {
    const [, format, b64] = match;
    const buffer = Buffer.from(b64, "base64");
    const assetName = `${stem}-${extracted}.webp`;
    const assetPath = join(assetsDir, assetName);
    const publicPath =
      "/" + relative(PUBLIC_DIR, assetPath).replace(/\\/g, "/");

    await sharp(buffer)
      .webp({ quality: 82, effort: 4 })
      .toFile(assetPath);

    svg = svg.replace(match[0], `xlink:href="${publicPath}"`);
    extracted++;
  }

  let output = svg;
  try {
    output = optimize(svg, {
      multipass: true,
      plugins: [
        "preset-default",
        { name: "removeViewBox", active: false },
        { name: "cleanupIds", params: { remove: false, minify: true } },
      ],
    }).data;
  } catch {
    // SVGO pode estourar buffer em SVGs enormes; imagens já foram extraídas.
    output = svg;
  }

  await writeFile(filePath, output, "utf8");

  const before = Buffer.byteLength(original, "utf8");
  const after = Buffer.byteLength(output, "utf8");
  return { filePath, before, after, extracted };
}

async function main() {
  const files = await glob("**/*.svg", {
    cwd: PUBLIC_DIR,
    absolute: true,
    nodir: true,
  });

  const targets = [];
  for (const file of files) {
    const buf = await readFile(file);
    if (buf.byteLength >= MIN_BYTES) targets.push(file);
  }

  console.log(`Otimizando ${targets.length} SVGs (>1MB)...\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of targets) {
    const rel = relative(process.cwd(), file);
    try {
      const result = await optimizeSvg(file);
      totalBefore += result.before;
      totalAfter += result.after;
      const saved = ((1 - result.after / result.before) * 100).toFixed(1);
      console.log(
        `✓ ${rel}  ${(result.before / 1024 / 1024).toFixed(1)}MB → ${(result.after / 1024).toFixed(0)}KB (${saved}% SVG)  +${result.extracted} webp`
      );
    } catch (err) {
      console.error(`✗ ${rel}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(
    `\nSVG markup total: ${(totalBefore / 1024 / 1024).toFixed(1)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB`
  );
  console.log("(imagens extraídas ficam em pastas *.assets/ ao lado de cada SVG)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
