// Per-page social cards (Open Graph / Twitter): writes public/og/<page>.png, 1200×630, one per main page.
//
//   node scripts/generate-og-images.mjs            (all cards)
//   node scripts/generate-og-images.mjs terms      (one card)
//
// The cards are static files in the repo, so `npm run build` never needs this script or a browser; run it again when a
// page's headline changes or a page is added (then add the page's `image` prop, see SiteLayout.astro).
//
// Rendered with headless Chromium (Playwright) rather than sharp's SVG text, because librsvg can't use Mona Sans's
// width axis: the headlines here are the site's own `.d` style (Mona Sans 820, 75% width, uppercase) and only a browser
// draws that. Playwright isn't a dependency of the site; use a global install (`npm i -g playwright` +
// `npx playwright install chromium`) or `npx -p playwright node scripts/generate-og-images.mjs`.
// Colours and fonts are site.css's: canvas #0E0E11, surface #17171C, paper #F4F4F6, muted #A0A0AC, Zera blue
// #1D74D9 / #4C9AFF.
import { readFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/og");

// headline: the card's big line; `|` breaks it and the part after the last `|` is drawn in Zera blue.
// label: the small line above it. phone: a still from public/media/site shown in the app's phone frame (optional).
const PAGES = [
  { id: "home", path: "/", label: "AI video editor · Android", headline: "Just talk.|Zera does|the edit.", phone: "hero_edit.webp" },
  { id: "auto-b-roll", path: "/auto-b-roll/", label: "AI B-roll", headline: "Add B-roll to|talking videos,|automatically", phone: "broll_edit.webp" },
  { id: "auto-captions", path: "/auto-captions/", label: "Auto captions", headline: "Auto captions,|word by word,|in 28 animations", phone: "broll_raw.webp", caption: "this changed everything" },
  { id: "hinglish-captions", path: "/hinglish-captions/", label: "Hinglish captions", headline: "Hinglish captions|for Reels,|word by word", phone: "hero_raw.webp", caption: "ye trick try karo" },
  { id: "copy-reel-editing-style", path: "/copy-reel-editing-style/", label: "Reference edit", headline: "Copy any reel's|edit onto|your own clips", phone: "ref_edit.webp" },
  { id: "video-editor", path: "/video-editor/", label: "Video editor", headline: "A free|multi-track editor|for Android", phone: "app_home.webp", app: true },
  { id: "capcut-alternative-india", path: "/capcut-alternative-india/", label: "An honest comparison · 2026", headline: "CapCut|alternatives|in India" },
  { id: "privacy-policy", path: "/privacy-policy/", label: "Legal & Privacy", headline: "Privacy|Policy" },
  { id: "terms", path: "/terms/", label: "Legal", headline: "Terms of|Service" },
  { id: "account-deletion", path: "/account-deletion/", label: "User rights & data controls", headline: "Delete your|account" },
];

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch {
    const globalRoot = execSync("npm root -g").toString().trim();
    return createRequire(path.join(globalRoot, "noop.js"))("playwright");
  }
}

const dataUri = (file, type) => `data:${type};base64,${readFileSync(file).toString("base64")}`;
const font = (pkg, file) => dataUri(path.join(ROOT, "node_modules/@fontsource-variable", pkg, "files", file), "font/woff2");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const css = `
@font-face { font-family: "Mona Sans Variable"; src: url(${font("mona-sans", "mona-sans-latin-wdth-normal.woff2")}) format("woff2"); font-weight: 200 900; font-stretch: 75% 125%; }
@font-face { font-family: "Inter Variable"; src: url(${font("inter", "inter-latin-wght-normal.woff2")}) format("woff2"); font-weight: 100 900; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 1200px; height: 630px; background: #0e0e11; color: #f4f4f6; -webkit-font-smoothing: antialiased; }
.card { position: relative; width: 1200px; height: 630px; overflow: hidden; padding: 64px 72px; display: grid; grid-template-rows: auto 1fr auto; }
.glow { position: absolute; right: -220px; bottom: -320px; width: 820px; height: 820px; border-radius: 50%; background: radial-gradient(closest-side, rgba(29,116,217,0.38), rgba(29,116,217,0) 70%); }
.top { position: relative; display: flex; align-items: center; gap: 14px; font: 600 19px/1 "Inter Variable"; letter-spacing: 0.08em; text-transform: uppercase; color: #a0a0ac; }
.top b { color: #4c9aff; font-weight: 650; }
.top i { width: 48px; height: 2px; background: rgba(244,244,246,0.16); }
h1 { position: relative; align-self: center; font-family: "Mona Sans Variable"; font-weight: 820; font-stretch: 75%; text-transform: uppercase; line-height: 0.86; letter-spacing: -0.012em; font-size: var(--fs); max-width: var(--mw); }
h1 span { display: block; }
h1 .b { color: #4c9aff; }
.foot { position: relative; display: flex; align-items: center; gap: 16px; font: 650 26px/1 "Mona Sans Variable"; font-stretch: 125%; letter-spacing: -0.02em; }
.foot img { width: 30px; height: 45px; border-radius: 9px; }
.foot small { margin-left: 10px; font: 500 20px/1 "Inter Variable"; letter-spacing: 0; color: #a0a0ac; }
.phone { position: absolute; top: 58px; right: 92px; width: 268px; aspect-ratio: 1 / 1.728; border-radius: 12.5% / 7.2%; padding: 8px; transform: rotate(4deg); background: linear-gradient(145deg, #2a2a31, #0b0b0d 40%, #1d1d22); box-shadow: 0 0 0 1px rgba(255,255,255,0.08) inset, 0 50px 100px -30px rgba(0,0,0,0.85), 0 30px 70px -30px rgba(29,116,217,0.55); }
.phone.app { aspect-ratio: 9 / 19.5; border-radius: 14% / 6.5%; }
.scr { position: relative; width: 100%; height: 100%; border-radius: 10% / 5.6%; overflow: hidden; background: #000; }
.phone.app .scr { border-radius: 11.5% / 5.3%; background: #0e0e11; }
.scr img { width: 100%; height: 100%; object-fit: cover; }
.phone.app .scr img { object-position: center bottom; }
.scr::after { content: ""; position: absolute; top: 1.6%; left: 50%; width: 28%; height: 3.4%; transform: translateX(-50%); border-radius: 999px; background: #000; }
.cap { position: absolute; left: 8%; right: 8%; bottom: 22%; text-align: center; font: 850 26px/1.1 "Inter Variable"; text-transform: uppercase; letter-spacing: -0.02em; color: #fff; text-wrap: balance; text-shadow: 0 2px 12px rgba(0,0,0,0.5); }
.cap b { padding: 0.04em 0.16em; border-radius: 0.2em; background: #1d74d9; font-weight: inherit; }
`;

function html(p) {
  const lines = p.headline.split("|");
  const last = lines.length - 1;
  const withPhone = Boolean(p.phone);
  // biggest size that keeps the longest line inside the text column (condensed caps run ≈0.43em per character)
  const longest = Math.max(...lines.map((l) => l.length));
  const column = withPhone ? 690 : 1050;
  const fs = Math.min(withPhone ? 112 : 168, Math.floor(column / (longest * 0.43)), lines.length > 2 ? 132 : 168);
  const phone = withPhone
    ? `<div class="phone${p.app ? " app" : ""}"><div class="scr"><img src="${dataUri(path.join(ROOT, "public/media/site", p.phone), "image/webp")}" />${
        p.caption ? `<span class="cap">${p.caption.split(" ").map((w, i) => (i === 1 ? `<b>${esc(w)}</b>` : esc(w))).join(" ")}</span>` : ""
      }</div></div>`
    : "";
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="card" style="--fs:${fs}px;--mw:${column}px">
  <div class="glow"></div>
  <div class="top"><b>Zera Studio</b><i></i><span>${esc(p.label)}</span></div>
  <h1>${lines.map((l, i) => `<span${i === last && lines.length > 1 ? ' class="b"' : ""}>${esc(l)}</span>`).join("")}</h1>
  <div class="foot"><img src="${dataUri(path.join(ROOT, "public/media/logo-96.png"), "image/png")}" />zera-ai.com${esc(p.path === "/" ? "" : p.path.replace(/\/$/, ""))}<small>Free to start · Android</small></div>
  ${phone}
</div></body></html>`;
}

const only = process.argv[2];
const pages = only ? PAGES.filter((p) => p.id === only) : PAGES;
if (!pages.length) throw new Error(`no page "${only}"; ids: ${PAGES.map((p) => p.id).join(", ")}`);
mkdirSync(OUT, { recursive: true });

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
for (const p of pages) {
  await page.setContent(html(p), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  const file = path.join(OUT, `${p.id}.png`);
  await page.screenshot({ path: file, type: "png" });
  console.log(`og/${p.id}.png`);
}
await browser.close();
