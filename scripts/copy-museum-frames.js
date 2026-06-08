const fs = require("fs");
const path = require("path");

const srcDir = path.join(
  process.env.USERPROFILE,
  "Downloads",
  "Museum of Us – Interactive Valentine’s Day Card (Community) (1)"
);
const destDir = path.join(__dirname, "../public/museum");

for (let i = 1; i <= 9; i++) {
  const src = path.join(srcDir, `Frame ${i} Overlay + Label.svg`);
  const dest = path.join(destDir, `frame-${i}.svg`);
  fs.copyFileSync(src, dest);
  const mb = (fs.statSync(dest).size / (1024 * 1024)).toFixed(2);
  console.log(`frame-${i}.svg (${mb} MB)`);
}

console.log("Done.");
