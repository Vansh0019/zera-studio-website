const sharp = require("sharp");

const W = 1200;
const H = 630;
// Regenerates public/og-image.jpg (the social preview card).
// Run from the project root:  node scripts/generate-og-image.cjs
// Change SUBTITLE below if the product positioning changes.

const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/og-image.jpg");
const LOGO = path.join(ROOT, "public/zera_studio_logo.png");

const TITLE = "Zera Studio";
const SUBTITLE = "AI Video Editing for Android";

const logoH = 400;
const logoW = Math.round((logoH * 1024) / 1536);
const logoX = 120;
const logoY = Math.round((H - logoH) / 2);

const textX = 560;

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="${textX}" y="300"
        font-family="Inter, sans-serif" font-size="96" font-weight="400"
        fill="#ffffff" letter-spacing="-1.5">${TITLE}</text>
  <text x="${textX + 4}" y="385"
        font-family="Inter, sans-serif" font-size="38" font-weight="400"
        fill="#9c9c9c">${SUBTITLE}</text>
</svg>`;

(async () => {
  const logo = await sharp(LOGO)
    .resize(logoW, logoH, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  await sharp({
    create: { width: W, height: H, channels: 3, background: { r: 0, g: 0, b: 0 } }
  })
    .composite([
      { input: logo, left: logoX, top: logoY },
      { input: Buffer.from(svg), left: 0, top: 0 }
    ])
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .toFile(OUT);

  const meta = await sharp(OUT).metadata();
  console.log(`og-image.jpg regenerated: ${meta.width}x${meta.height}, ${meta.size} bytes`);
})().catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
