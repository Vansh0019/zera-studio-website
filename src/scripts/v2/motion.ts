/**
 * The motion runtime for the v2 site. Sections add their own scenes in their own scripts; this file owns what is
 * shared: smooth scroll (desktop only — phones keep native scrolling), the loader, the menu, the cursor, line
 * reveals for `[data-split]`, hand-drawn strokes for `.doodle`, and lazy videos for `video[data-src]`.
 *
 * Everything degrades: with reduced motion, no loader, no smoothing, and text and strokes appear in their final state.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = <T extends Element>(s: string, root: ParentNode = document) => root.querySelector(s) as T | null;
const $$ = <T extends Element>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll(s)) as T[];

// A reload lands at the top, like a first visit: the pinned scenes are built for scrolling into, not landing mid-way.
// ScrollTrigger owns history.scrollRestoration (it saves and puts it back around each refresh), so it is set through it.
ScrollTrigger.clearScrollMemory("manual");
if (!location.hash) window.scrollTo(0, 0);

// ── smooth scroll ─────────────────────────────────────────────────────────────
let lenis: Lenis | null = null;
if (fine && !reduce) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
export const scrollTo = (target: string | HTMLElement) => (lenis ? lenis.scrollTo(target as string, { offset: -10 }) : (typeof target === "string" ? $(target) : target)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }));
$$<HTMLAnchorElement>('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => { const id = a.getAttribute("href")!; if (id.length > 1 && $(id)) { e.preventDefault(); closeMenu(); scrollTo(id); } }));

// ── loader: a timecode that renders to one second, then a cut ─────────────────
const loader = $<HTMLElement>("#loader");
const intro = gsap.timeline({ paused: true });
function runLoader(onDone: () => void) {
  if (!loader || document.documentElement.classList.contains("no-loader")) return onDone();
  try { sessionStorage.setItem("zera-loaded", "1"); } catch {}
  lenis?.stop();
  const tc = $<HTMLElement>("#ldTc")!, pct = $<HTMLElement>("#ldPct")!, bar = $<HTMLElement>("#ldBar")!, head = $<HTMLElement>("#ldHead")!;
  const track = head.parentElement!;
  const o = { f: 0 };
  gsap.timeline({ onComplete: () => { loader.remove(); lenis?.start(); onDone(); } })
    .to(o, { f: 30, duration: 1.05, ease: "power2.inOut", onUpdate: () => {
      const f = Math.round(o.f);
      tc.textContent = `00:00:${String(f).padStart(2, "0")}`;
      pct.textContent = `${Math.round((f / 30) * 100)}%`;
      bar.style.transform = `scaleX(${f / 30})`;
      head.style.transform = `translateX(${(f / 30) * track.clientWidth}px)`;
    } })
    .to([tc, pct, track, $(".ld-top")], { opacity: 0, duration: 0.2 }, "+=0.08")
    .set(loader, { background: "transparent" })
    .to(".ld-a", { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, "<")
    .to(".ld-b", { yPercent: 100, duration: 0.7, ease: "expo.inOut" }, "<");
}

// ── nav: out of the way while reading down, back on the way up ───────────────
const nav = $<HTMLElement>("#nav");
if (nav) ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => nav.classList.toggle("tuck", self.direction === 1 && self.scroll() > 240) });

// ── menu ──────────────────────────────────────────────────────────────────────
const menu = $<HTMLElement>("#menu"), burger = $<HTMLButtonElement>("#burger");
function closeMenu() {
  if (!menu || menu.hidden) return;
  menu.classList.remove("open");
  burger?.setAttribute("aria-expanded", "false");
  setTimeout(() => (menu.hidden = true), 600);
  lenis?.start();
}
burger?.addEventListener("click", () => {
  if (!menu) return;
  if (menu.hidden) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("open"));
    burger.setAttribute("aria-expanded", "true");
    lenis?.stop();
  } else closeMenu();
});
addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

// ── cursor ────────────────────────────────────────────────────────────────────
const cursor = $<HTMLElement>("#cursor"), cLabel = $<HTMLElement>("#cursorLabel");
if (cursor && fine) {
  const xTo = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" }), yTo = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
  addEventListener("pointermove", (e) => { xTo(e.clientX); yTo(e.clientY); });
  document.addEventListener("pointerover", (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
    cursor.classList.toggle("big", !!t);
    if (cLabel) cLabel.textContent = t?.dataset.cursor ?? "";
  });
}

// ── line reveals ──────────────────────────────────────────────────────────────
function reveals() {
  $$<HTMLElement>("[data-split]").forEach((el) => {
    if (reduce) return;
    // autoSplit: lines are re-measured when the width changes (a phone turned sideways), keeping the animation's place.
    SplitText.create(el, {
      type: "lines", mask: "lines", linesClass: "ln", autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 125, duration: 1.05, ease: "expo.out", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      }),
    });
  });
  $$<HTMLElement>("[data-rise]").forEach((el) => {
    if (reduce) return;
    gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
  });
  $$<SVGSVGElement>(".doodle").forEach((svg) => {
    const paths = $$<SVGPathElement>("path", svg);
    if (reduce) return;
    gsap.set(paths, { drawSVG: "0%" });
    gsap.to(paths, {
      drawSVG: "100%", duration: 0.9, ease: "power2.inOut", stagger: 0.18,
      scrollTrigger: { trigger: svg.closest("[data-doodle-trigger]") ?? svg, start: "top 75%", once: true },
    });
  });
  $$<HTMLElement>("[data-speed]").forEach((el) => {
    if (reduce) return;
    gsap.to(el, { yPercent: Number(el.dataset.speed) * -20, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
  });
}

// ── videos: load near the viewport, play only while visible ───────────────────
// `data-lazy` videos load when near; `data-auto` ones load with the page. Both play only on screen. Browsers pause
// muted autoplay on their own (a background tab, power saving), so on-screen videos are resumed when the tab comes
// back and on the first touch, click or key.
const onScreen = new Set<HTMLVideoElement>();
const vio = new IntersectionObserver((entries) => entries.forEach((e) => {
  const v = e.target as HTMLVideoElement;
  if (e.isIntersecting) {
    if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); }
    onScreen.add(v);
    v.play().catch(() => {});
  } else { onScreen.delete(v); v.pause(); }
}), { rootMargin: "200px 0px" });
$$<HTMLVideoElement>("video[data-lazy], video[data-auto]").forEach((v) => vio.observe(v));
const resume = () => onScreen.forEach((v) => v.paused && v.play().catch(() => {}));
document.addEventListener("visibilitychange", () => document.visibilityState === "visible" && resume());
["pointerdown", "keydown", "wheel", "touchstart"].forEach((t) => addEventListener(t, resume, { once: true, passive: true }));
setInterval(() => document.visibilityState === "visible" && resume(), 3000);

// ── start ─────────────────────────────────────────────────────────────────────
document.fonts.ready.then(() => {
  reveals();
  runLoader(() => { intro.play(); ScrollTrigger.refresh(); document.dispatchEvent(new CustomEvent("zera:ready")); });
});

export { gsap, ScrollTrigger, intro, reduce, fine };
