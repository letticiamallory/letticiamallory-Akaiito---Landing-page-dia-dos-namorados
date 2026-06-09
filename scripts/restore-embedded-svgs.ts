/**
 * Reverte optimize-svgs.ts: embute WebPs externos como data URIs no SVG.
 * Usado quando os originais base64 não existem no histórico git.
 */
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { glob } from "glob";

const PUBLIC_DIR = join(process.cwd(), "public");
const MUSEUM_DIR = join(PUBLIC_DIR, "museum");

const EXTERNAL_RE = /xlink:href="(\/museum\/[^"]+\.webp)"/g;

async function embedSvg(filePath: string) {
  const original = await readFile(filePath, "utf8");
  let svg = original;
  let embedded = 0;

  const matches = [...original.matchAll(EXTERNAL_RE)];
  for (const match of matches) {
    const publicPath = match[1];
    const assetPath = join(PUBLIC_DIR, publicPath.replace(/^\//, "").replace(/\//g, "\\"));
    const buffer = await readFile(assetPath);
    const b64 = buffer.toString("base64");
    const dataUri = `xlink:href="data:image/webp;base64,${b64}"`;
    svg = svg.replace(match[0], dataUri);
    embedded++;
  }

  if (embedded === 0) return null;

  await writeFile(filePath, svg, "utf8");
  const before = Buffer.byteLength(original, "utf8");
  const after = Buffer.byteLength(svg, "utf8");
  return { filePath, before, after, embedded };
}

async function main() {
  const files = await glob("*.svg", { cwd: MUSEUM_DIR, absolute: true });
  console.log(`Embutindo imagens em ${files.length} SVGs...\n`);

  for (const file of files) {
    const rel = file.replace(process.cwd() + "\\", "").replace(/\\/g, "/");
    try {
      const result = await embedSvg(file);
      if (!result) {
        console.log(`· ${rel} — sem refs externas`);
        continue;
      }
      console.log(
        `✓ ${rel}  ${(result.before / 1024).toFixed(0)}KB → ${(result.after / 1024 / 1024).toFixed(2)}MB  (+${result.embedded} embed)`
      );
    } catch (err) {
      console.error(`✗ ${rel}:`, err instanceof Error ? err.message : err);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
