const sharp = require("sharp");
const { mkdir, copyFile } = require("fs/promises");
const { join } = require("path");

const ASSETS =
  process.env.CURSOR_ASSETS ||
  "C:/Users/lett/.cursor/projects/c-Users-lett-Desktop-valentinesday/assets";
const OUT = join(__dirname, "../public/letter/envelopes");

const MAP = [
  {
    id: "classic-cream",
    src: "c__Users_lett_AppData_Roaming_Cursor_User_workspaceStorage_c3c2f55c0e543d9f4881de874cd81964_images_close_letter-02cbb2f6-baf8-45f2-8bfa-06b3db7daae3.png",
  },
  {
    id: "blush",
    src: "c__Users_lett_AppData_Roaming_Cursor_User_workspaceStorage_c3c2f55c0e543d9f4881de874cd81964_images_close_letter-1-0fa6cda9-5cdc-4361-99d2-b79d24829983.png",
  },
  {
    id: "sage",
    src: "c__Users_lett_AppData_Roaming_Cursor_User_workspaceStorage_c3c2f55c0e543d9f4881de874cd81964_images_close_letter-2-0c6725df-e3fd-441c-a665-90c10d405489.png",
  },
  {
    id: "midnight",
    src: "c__Users_lett_AppData_Roaming_Cursor_User_workspaceStorage_c3c2f55c0e543d9f4881de874cd81964_images_close_letter-3-0fcea237-e10a-4afa-a122-52e9e261ae43.png",
  },
];

async function main() {
  await mkdir(OUT, { recursive: true });
  const aspects = {};

  for (const item of MAP) {
    const input = join(ASSETS, item.src);
    const out = join(OUT, `${item.id}.webp`);
    const info = await sharp(input)
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toFile(out);
    aspects[item.id] = +(info.width / info.height).toFixed(4);
    console.log(`${item.id}: ${info.width}x${info.height} aspect=${aspects[item.id]}`);
  }

  console.log("\nAspect ratios:", JSON.stringify(aspects, null, 2));
}

main().catch(console.error);
