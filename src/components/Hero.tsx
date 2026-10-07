import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { pricing, siteConfig } from "@/config/site";

/** What the AI does, cut in on the beat like a jump cut. Short, so "AI <verb>" always fits one line. */
const VERBS = ["EDITS.", "CUTS.", "CAPTIONS.", "ZOOMS.", "SYNCS."];

/**
 * Notes on the edit, the way an editor marks up a cut: what the AI put where, with its timecode. One lights up on
 * the beat. Not floating gradient badges.
 */
const NOTES = [
  { label: "B-roll", tc: "00:02", cls: "left-[-30%] top-[16%]" },
  { label: "Zoom 1.2×", tc: "00:05", cls: "right-[-26%] top-[30%]" },
  { label: "Flash on the beat", tc: "00:07", cls: "left-[-38%] top-[50%]" },
  { label: "Motion graphic", tc: "00:11", cls: "right-[-30%] top-[62%]" },
  { label: "Captions, Hinglish", tc: "00:00", cls: "left-[-34%] top-[78%]" }
];

function useTimecode() {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 40) {
        last = now;
        const f = Math.floor(((now - start) / 1000) * 25);
        const ff = f % 25;
        const s = Math.floor(f / 25);
        const p = (n: number) => String(n).padStart(2, "0");
        setTc(`${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(ff)}`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return tc;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const [verb, setVerb] = useState(0);
  const [pop, setPop] = useState(-1);
  const tc = useTimecode();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root.current) return;
    let beats = 0;
    const onBeat = () => {
      beats++;
      if (beats % 4 === 0) setVerb((v) => (v + 1) % VERBS.length);
      if (beats % 2 === 0) setPop((p) => (p + 1) % NOTES.length);
    };
    window.addEventListener("zera:beat", onBeat);
    if (reduced) return () => window.removeEventListener("zera:beat", onBeat);

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // The title comes in like a title card: each line rises out of a mask.
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .from(".hero-line", { yPercent: 105, duration: 1.25, stagger: 0.1 })
        .from(".hero-copy", { opacity: 0, duration: 0.9 }, "-=0.8")
        .from(".hero-actions > *", { opacity: 0, y: 10, duration: 0.7, stagger: 0.06 }, "-=0.7")
        // The phone opens like a projector gate: a sliver of light widening to the full frame.
        .fromTo(
          ".hero-phone",
          { clipPath: "inset(48% 0% 48% 0% round 44px)" },
          { clipPath: "inset(0% 0% 0% 0% round 44px)", duration: 1.2, ease: "expo.inOut", clearProps: "clipPath" },
          "-=1.1"
        )
        .from(".hero-note", { opacity: 0, x: (i) => (i % 2 ? 12 : -12), duration: 0.6, stagger: 0.06 }, "-=0.4");
      // Scrolling away dollies the phone back.
      gsap.to(".hero-phone-wrap", {
        rotateX: 14,
        rotateY: -10,
        y: -30,
        scale: 0.94,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true }
      });
      gsap.to(".hero-type", {
        yPercent: -14,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true }
      });
    }, root);
    return () => {
      window.removeEventListener("zera:beat", onBeat);
      ctx.revert();
    };
  }, []);

  return (
    <section id="top" ref={root} data-scene="hero" className="relative overflow-hidden pb-16 pt-[120px] sm:pt-[140px] lg:min-h-[100svh] lg:pb-10">
      <div className="container-x grid items-center gap-16 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="hero-type min-w-0">
          <h1 className="font-display whitespace-nowrap text-[clamp(4.1rem,10.4vw,10.6rem)] font-[800] uppercase leading-[0.84] tracking-[-0.01em]">
            <span className="block overflow-hidden">
              <span className="hero-line block">You talk.</span>
            </span>
            <span className="block overflow-hidden pb-[0.04em]">
              <span className="hero-line block">
                <span className="text-white/40">AI </span>
                <span key={verb} className="cut-word text-lamp">
                  {VERBS[verb]}
                </span>
              </span>
            </span>
          </h1>
          <p className="hero-copy mt-9 max-w-[540px] text-[1.08rem] leading-[1.6] text-white/70 sm:text-[1.2rem]">
            Drop in a talking video. Zera Studio listens to every word and hands back an edit with B-roll, motion
            graphics, zooms and Hinglish captions on real tracks, so you can change any of it.
          </p>
          <div className="hero-actions mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={siteConfig.playStoreUrl} target="_blank" rel="noreferrer" className="cta-primary focus-ring">
              Get it on Google Play
              <ArrowUpRight size={17} strokeWidth={2} />
            </a>
            <a href="/#broll" className="cta-secondary focus-ring">
              See how it edits
              <ArrowDown size={17} strokeWidth={2} />
            </a>
          </div>
          <p className="hero-copy mt-5 text-sm text-white/55">
            {pricing.welcomeCredits} credits free when you sign up. The editor and export are free.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[300px] [perspective:1200px] sm:max-w-[340px] lg:max-w-[360px]">
          <div className="hero-phone-wrap relative [transform-style:preserve-3d]">
            <figure className="hero-phone relative m-0 overflow-hidden rounded-[44px] border border-white/15 bg-black p-[9px] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)]">
              <div className="relative aspect-[9/19.2] overflow-hidden rounded-[35px] bg-[#0b0b0d]">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/media/home.mp4"
                  poster="/media/home.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Zera Studio adding B-roll and graphics to a creator's talking video"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-end px-5 pt-4">
                  <span className="tc rounded-[3px] bg-black/55 px-1.5 py-0.5 text-[0.62rem] text-white/85">{tc}</span>
                </div>
                {/* A timeline strip along the bottom, with its playhead. */}
                <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-[6px] border border-white/10 bg-black/70 p-1.5">
                  <div className="relative h-8 overflow-hidden">
                    <div className="timeline-strip absolute inset-y-0 left-0 flex w-[200%] gap-[3px]">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <span
                          key={i}
                          className="h-full flex-1 rounded-[2px]"
                          style={{ background: ["#4a78c9", "rgba(243,237,227,0.14)", "#3f8f9a", "#b8643f"][i % 4] }}
                        />
                      ))}
                    </div>
                    <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-[#ffb547]" />
                  </div>
                </div>
              </div>
            </figure>
            {NOTES.map((c, i) => (
              <span key={c.label} aria-hidden="true" className={`hero-note absolute ${c.cls} z-10 hidden sm:block`}>
                <span
                  className={`flex items-center gap-2.5 whitespace-nowrap border-l-2 bg-[#0e0c0b]/90 py-1.5 pl-2.5 pr-3 text-[0.72rem] transition-colors duration-200 ${
                    pop === i ? "border-[#ffb547] text-white" : "border-white/25 text-white/60"
                  }`}
                >
                  <span className="tc text-white/40">{c.tc}</span>
                  {c.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
