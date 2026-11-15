/**
 * The site's motion runtime, light enough for a budget phone (2026-11-15). Most visitors come from phones, and the
 * pinned scroll scenes made the page feel stuck there, so scrolling is now the browser's own everywhere: no
 * smooth-scroll library, nothing pinned, nothing scrubbed by scroll. One kind of entrance is left, a short fade-up
 * that plays once, done in CSS (`site.css`) and started here by an IntersectionObserver.
 *
 * This file owns what is shared: the nav, the menu, the reveals, hand-drawn strokes and video playback. With
 * reduced motion, or before this script runs, everything sits in its final state.
 */
export const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector(s) as T | null;
export const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll(s)) as T[];

const root = document.documentElement;

// ── in-page links: close the menu, then the browser's own smooth scroll ───────
export function scrollTo(target: string | HTMLElement) {
  const el = typeof target === "string" ? $(target) : target;
  el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}
document.addEventListener("click", (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href")!;
  if (id.length > 1 && $(id)) { e.preventDefault(); closeMenu(); scrollTo(id); }
});

// ── nav: a solid bar once the page moves, out of the way while reading down ───
const nav = $("#nav");
let lastY = scrollY, queued = false;
const onScroll = () => {
  if (queued || !nav) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    const y = scrollY;
    nav.classList.toggle("solid", y > 40);
    if (y <= 320) { nav.classList.remove("tuck"); lastY = y; return; }
    // a few pixels of jitter (a finger resting, the URL bar) never flips it
    if (Math.abs(y - lastY) < 12) return;
    if (!menuOpen) nav.classList.toggle("tuck", y > lastY);
    lastY = y;
  });
};
addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ── menu ──────────────────────────────────────────────────────────────────────
const menu = $("#menu"), burger = $<HTMLButtonElement>("#burger");
let menuOpen = false;
function openMenu() {
  if (!menu || menuOpen) return;
  menuOpen = true;
  menu.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add("open")));
  burger?.setAttribute("aria-expanded", "true");
  burger?.setAttribute("aria-label", "Close menu");
  nav?.classList.remove("tuck");
  root.classList.add("locked");
}
export function closeMenu() {
  if (!menu || !menuOpen) return;
  menuOpen = false;
  menu.classList.remove("open");
  burger?.setAttribute("aria-expanded", "false");
  burger?.setAttribute("aria-label", "Open menu");
  setTimeout(() => { if (!menuOpen) menu.hidden = true; }, 800);
  root.classList.remove("locked");
}
burger?.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

// ── reveals: headings, text and strokes fade up (or draw) once, as they arrive ─
// Only what is still below the screen when this runs is hidden (`rv`) and revealed on arrival (`in`): what a visitor
// sees first never waits for this script, or fades in late. `data-reveal` and `data-split` are the same short fade;
// `data-delay` (seconds) staggers a row.
const reveal = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  reveal.unobserve(e.target);
}), { rootMargin: "0px 0px -8% 0px" });
if (!reduce) {
  const fold = innerHeight * 0.92;
  $$("[data-reveal], [data-split], .doodle, [data-rise]").forEach((el) => {
    if (el.getBoundingClientRect().top < fold) return;
    if (el.dataset.delay) el.style.setProperty("--d", `${el.dataset.delay}s`);
    el.classList.add("rv");
    reveal.observe(el);
  });
}

// ── videos: load near the screen, play only on it ─────────────────────────────
// `data-lazy` videos load when near; others load with the page. Both play only while visible, unless a section
// holds one (`data-hold`). Browsers also pause muted autoplay on their own (a background tab, power saving), so
// on-screen videos resume when the tab comes back, on the first touch, and every few seconds.
const onScreen = new Set<HTMLVideoElement>();
const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
  const v = e.target as HTMLVideoElement;
  if (e.isIntersecting) {
    if (v.dataset.src && !v.getAttribute("src")) { v.src = v.dataset.src; v.load(); }
    onScreen.add(v);
    if (!v.dataset.hold) v.play().catch(() => {});
  } else { onScreen.delete(v); v.pause(); }
}), { rootMargin: "300px 0px" });
$$<HTMLVideoElement>("video[data-lazy], video[data-auto]").forEach((v) => vio.observe(v));
const resume = () => onScreen.forEach((v) => v.paused && !v.dataset.hold && v.play().catch(() => {}));
document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && resume());
["pointerdown", "keydown", "touchstart"].forEach((t) => addEventListener(t, resume, { once: true, passive: true }));
setInterval(() => document.visibilityState === "visible" && resume(), 2500);

/** Runs [fn] every frame while [el] is on screen, and not at all otherwise. */
export function whileVisible(el: Element, fn: (now: number) => void, margin = "0px") {
  let raf = 0;
  const loop = (now: number) => { fn(now); raf = requestAnimationFrame(loop); };
  new IntersectionObserver(([e]) => {
    cancelAnimationFrame(raf);
    if (e.isIntersecting) raf = requestAnimationFrame(loop);
  }, { rootMargin: margin }).observe(el);
}
