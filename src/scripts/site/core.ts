/**
 * The site's motion runtime. Sections add their own scenes in their own scripts; this file owns what is shared:
 * smooth scroll, the loader (it waits for the real assets), the nav, the menu, the cursor, magnetic buttons, text and
 * media reveals, hand-drawn strokes, the blue "flip" sections and video playback.
 *
 * Everything degrades: with reduced motion there is no loader and no smoothing, and text, strokes and media sit in
 * their final state.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

export const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
export const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector(s) as T | null;
export const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll(s)) as T[];

// A reload lands at the top, like a first visit: the pinned scenes are built to be scrolled into. ScrollTrigger owns
// history.scrollRestoration (it saves and restores it around each refresh), so it is set through it.
ScrollTrigger.clearScrollMemory("manual");
if (!location.hash) window.scrollTo(0, 0);

// ── smooth scroll (wheel only; touch keeps the phone's own scrolling) ─────────
export const lenis: Lenis | null = reduce ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.95 });
if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
export function scrollTo(target: string | number | HTMLElement) {
  if (lenis) return lenis.scrollTo(target as string, { offset: 0, duration: 1.4, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
  const el = typeof target === "string" ? $(target) : typeof target === "number" ? null : target;
  if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: reduce ? "auto" : "smooth" });
}
document.addEventListener("click", (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute("href")!;
  if (id.length > 1 && $(id)) { e.preventDefault(); closeMenu(); scrollTo(id); }
});

// ── ready: sections queue their entrances here; they run as the loader leaves ─
const readyQueue: (() => void)[] = [];
let isReady = false;
export function onReady(fn: () => void) { isReady ? fn() : readyQueue.push(fn); }
function ready() {
  isReady = true;
  readyQueue.splice(0).forEach((fn) => fn());
  ScrollTrigger.refresh();
}

// ── loader: counts to the real progress of the fonts and the hero's media ─────
function waitFor(el: HTMLVideoElement | HTMLImageElement) {
  return new Promise<void>((res) => {
    const done = () => res();
    if (el instanceof HTMLVideoElement) {
      if (el.readyState >= 3) return res();
      el.addEventListener("canplaythrough", done, { once: true });
      el.addEventListener("loadeddata", () => setTimeout(done, 400), { once: true });
      el.addEventListener("error", done, { once: true });
    } else {
      if (el.complete) return res();
      el.addEventListener("load", done, { once: true });
      el.addEventListener("error", done, { once: true });
    }
  });
}
function runLoader() {
  const loader = $("#loader");
  if (!loader || document.documentElement.classList.contains("no-loader")) { loader?.remove(); return ready(); }
  try { sessionStorage.setItem("zera-loaded", "1"); } catch {}
  lenis?.stop();
  const num = $("#ldNum")!, bar = $("#ldBar")!, sweep = $("#ldSweep")!;
  const jobs: Promise<unknown>[] = [document.fonts.ready, ...$$<HTMLVideoElement | HTMLImageElement>("[data-preload]").map(waitFor)];
  let target = 0, settled = 0;
  jobs.forEach((j) => j.then(() => { settled++; target = settled / jobs.length; }));
  setTimeout(() => (target = 1), 6000); // a slow network never holds the page hostage
  const t0 = performance.now();
  const s = { p: 0 };
  const tick = () => {
    // Ease toward the real progress, but never faster than a second for the whole count, and never stall at 99.
    const minT = Math.min(1, (performance.now() - t0) / 1100);
    s.p += (Math.min(target, minT) - s.p) * 0.14;
    if (Math.min(target, minT) >= 1 && s.p > 0.995) s.p = 1;
    num.textContent = String(Math.round(s.p * 100));
    bar.style.transform = `scaleX(${s.p})`;
    if (s.p >= 1) { gsap.ticker.remove(tick); leave(); }
  };
  gsap.ticker.add(tick);
  function leave() {
    gsap.timeline({ defaults: { ease: "expo.inOut" } })
      .to(num, { yPercent: -105, duration: 0.7, ease: "expo.in" }, 0.05)
      .to(sweep, { yPercent: -100, duration: 0.9 }, 0.35)
      .add(() => { loader!.style.background = "transparent"; $$(".ld-row, .ld-num, .ld-bar", loader!).forEach((e) => e.remove()); ready(); }, 1.2)
      .to(sweep, { yPercent: -200, duration: 0.95 }, 1.2)
      .add(() => { loader!.remove(); lenis?.start(); });
  }
}

// ── nav: a glass bar once the page moves, out of the way while reading down ───
const nav = $("#nav");
if (nav) {
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle("solid", y > 40);
      if (!menuOpen) nav.classList.toggle("tuck", self.direction === 1 && y > 320);
    },
  });
}

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
  lenis?.stop();
}
export function closeMenu() {
  if (!menu || !menuOpen) return;
  menuOpen = false;
  menu.classList.remove("open");
  burger?.setAttribute("aria-expanded", "false");
  burger?.setAttribute("aria-label", "Open menu");
  setTimeout(() => { if (!menuOpen) menu.hidden = true; }, 800);
  lenis?.start();
}
burger?.addEventListener("click", () => (menuOpen ? closeMenu() : openMenu()));
addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

// ── cursor and magnetic buttons (mouse and trackpad only) ─────────────────────
const cursor = $("#cursor"), cLabel = $("#cursorLabel");
if (cursor && fine && !reduce) {
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.5, ease: "power3" }), yTo = gsap.quickTo(cursor, "y", { duration: 0.5, ease: "power3" });
  addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
  document.addEventListener("pointerover", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
    cursor.classList.toggle("big", !!t);
    if (t && cLabel) cLabel.textContent = t.dataset.cursor ?? "";
  });
  addEventListener("pointerdown", () => cursor.classList.add("down"));
  addEventListener("pointerup", () => cursor.classList.remove("down"));
  document.addEventListener("mouseleave", () => gsap.to(cursor, { opacity: 0, duration: 0.2 }));
  document.addEventListener("mouseenter", () => gsap.to(cursor, { opacity: 1, duration: 0.2 }));

  $$("[data-magnetic]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" }), y = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" });
    el.addEventListener("pointermove", (e) => {
      const b = el.getBoundingClientRect();
      x((e.clientX - b.left - b.width / 2) * 0.3);
      y((e.clientY - b.top - b.height / 2) * 0.35);
    });
    el.addEventListener("pointerleave", () => { x(0); y(0); });
  });
}

// ── reveals ───────────────────────────────────────────────────────────────────
function reveals() {
  if (reduce) return;
  $$("[data-split]").forEach((el) => {
    const chars = el.dataset.split === "chars";
    // autoSplit: lines are measured again when the width changes (a phone turned sideways); the animation keeps
    // its place.
    SplitText.create(el, {
      type: chars ? "lines,chars" : "lines", mask: "lines", linesClass: "ln", autoSplit: true,
      onSplit: (self) => gsap.from(chars ? self.chars : self.lines, {
        yPercent: chars ? 112 : 120, rotate: chars ? 0 : 3, transformOrigin: "0% 100%",
        duration: chars ? 1.15 : 1.25, ease: "expo.out", stagger: chars ? 0.022 : 0.09,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }),
    });
  });
  $$("[data-reveal]").forEach((el) => {
    const kind = el.dataset.reveal;
    const st = { trigger: el, start: "top 90%", once: true };
    if (kind === "clip") gsap.fromTo(el, { clipPath: "inset(18% 12% 18% 12% round 28px)", scale: 1.06 }, { clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1, duration: 1.5, ease: "expo.out", scrollTrigger: st, clearProps: "clipPath" });
    else gsap.from(el, { y: 60, opacity: 0, duration: 1.3, ease: "expo.out", delay: Number(el.dataset.delay ?? 0), scrollTrigger: st });
  });
  $$<SVGSVGElement>(".doodle").forEach((svg) => {
    const paths = $$<SVGPathElement>("path", svg);
    gsap.set(paths, { drawSVG: "0%" });
    gsap.to(paths, { drawSVG: "100%", duration: 1, ease: "power2.inOut", stagger: 0.2, scrollTrigger: { trigger: svg.closest("[data-doodle-trigger]") ?? svg, start: "top 78%", once: true } });
  });
  $$("[data-parallax]").forEach((el) => {
    gsap.fromTo(el, { yPercent: Number(el.dataset.parallax) * 20 }, { yPercent: Number(el.dataset.parallax) * -20, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });
}

// ── flip: chapters that turn the page Zera blue while they hold the screen ─────
$$("[data-flip]").forEach((el) => {
  // refreshPriority -1: measured after every pinned scene above it has added its scroll length.
  ScrollTrigger.create({ trigger: el, start: "top 40%", end: "bottom 50%", refreshPriority: -1, onToggle: (self) => document.documentElement.classList.toggle("flip", self.isActive) });
});

// ── videos: load near the screen, play only on it ─────────────────────────────
// `data-lazy` videos load when near; others load with the page. Both play only while visible. Browsers also pause
// muted autoplay on their own (a background tab, power saving), so on-screen videos resume when the tab comes back,
// on the first touch, and every few seconds.
const onScreen = new Set<HTMLVideoElement>();
const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
  const v = e.target as HTMLVideoElement;
  if (e.isIntersecting) {
    if (v.dataset.src && !v.getAttribute("src")) { v.src = v.dataset.src; v.load(); }
    onScreen.add(v);
    v.play().catch(() => {});
  } else { onScreen.delete(v); v.pause(); }
}), { rootMargin: "300px 0px" });
$$<HTMLVideoElement>("video[data-lazy], video[data-auto]").forEach((v) => vio.observe(v));
const resume = () => onScreen.forEach((v) => v.paused && !v.dataset.hold && v.play().catch(() => {}));
document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && resume());
["pointerdown", "keydown", "wheel", "touchstart"].forEach((t) => addEventListener(t, resume, { once: true, passive: true }));
setInterval(() => document.visibilityState === "visible" && resume(), 2500);

// ── start ─────────────────────────────────────────────────────────────────────
document.fonts.ready.then(() => { reveals(); runLoader(); });

export { gsap, ScrollTrigger, SplitText };
