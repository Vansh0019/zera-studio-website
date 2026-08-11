import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

const clipRows = [
  ["00:04", "Street", "Motion"],
  ["00:09", "Product", "Close"],
  ["00:13", "Audio", "Beat"]
];

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const visual = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-logo", { opacity: 0, scale: 0.86, duration: 0.7 })
        .from(".hero-word", { y: 70, opacity: 0, duration: 1.05, stagger: 0.08 }, "-=0.35")
        .from(".hero-copy", { y: 26, opacity: 0, duration: 0.8 }, "-=0.55")
        .from(".hero-actions", { y: 18, opacity: 0, duration: 0.7 }, "-=0.45")
        .from(".hero-visual", { y: 42, opacity: 0, duration: 0.95 }, "-=0.75");

      const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.8, defaults: { ease: "power2.inOut" } });
      loop
        .fromTo(".clip-card", { x: -26, opacity: 0.5 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.1 })
        .fromTo(".scan-line", { xPercent: -115 }, { xPercent: 125, duration: 1.4 }, "-=0.25")
        .fromTo(".beat", { scaleY: 0.3, opacity: 0.35 }, { scaleY: 1, opacity: 1, duration: 0.5, stagger: 0.055 }, "-=1.0")
        .fromTo(".cut-marker", { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.35, stagger: 0.11 }, "-=0.75")
        .to(".clip-card", { x: (i) => [74, 18, 46][i] ?? 28, duration: 0.75, stagger: 0.05 }, "-=0.15")
        .to(".result-frame", { clipPath: "inset(0% 0% 0% 0%)", duration: 0.8 }, "-=0.55")
        .to(".ready-pill", { opacity: 1, y: 0, duration: 0.45 }, "-=0.35")
        .to(".ready-pill", { opacity: 0, y: -8, duration: 0.35 }, "+=1.2")
        .to(".result-frame", { clipPath: "inset(0% 100% 0% 0%)", duration: 0.5 }, "-=0.2");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="relative overflow-hidden pb-14 pt-[92px] sm:pb-20 lg:min-h-screen lg:pt-[104px]">
      <div className="container-x grid items-end gap-10 lg:grid-cols-[0.98fr_1.02fr]">
        <div className="max-w-[760px]">
          <img src={siteConfig.logo} alt="" className="hero-logo mb-8 h-20 w-20 object-contain sm:h-24 sm:w-24" />
          <p className="hero-copy eyebrow mb-5">AI Video Editor · Currently in Beta</p>
          <h1 className="display overflow-hidden">
            <span className="hero-word block">EDIT</span>
            <span className="hero-word block">VIDEOS</span>
            <span className="hero-word block text-black/[0.35]">LIKE A</span>
            <span className="hero-word block">VISION.</span>
          </h1>
          <p className="hero-copy mt-7 max-w-[600px] text-[1.13rem] leading-[1.55] text-black/[0.65] sm:text-[1.28rem]">
            Not frame by frame. Zera Studio uses AI to understand your footage
            and turn your clips into an edited video.
          </p>
          <div className="hero-actions mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={siteConfig.playStoreUrl} target="_blank" rel="noreferrer" className="cta-primary focus-ring">
              Try Zera Studio
              <ArrowUpRight size={15} strokeWidth={2.4} />
            </a>
            <a href="#how-it-works" className="cta-secondary focus-ring">
              How It Works
              <ArrowRight size={15} strokeWidth={2.4} />
            </a>
          </div>
        </div>

        <div ref={visual} className="hero-visual relative min-h-[520px] overflow-hidden border border-black/10 bg-white p-3 shadow-soft sm:min-h-[620px] sm:p-4 lg:min-h-[690px]">
          <div className="grid h-full min-h-[496px] grid-rows-[1fr_auto_1fr] gap-3 sm:min-h-[588px]">
            <div className="relative overflow-hidden bg-[#111] p-4 text-white">
              <div className="mb-5 flex items-center justify-between">
                <span className="eyebrow text-white/60">Raw clips</span>
                <span className="text-[0.7rem] font-bold text-white/[0.45]">3 ITEMS</span>
              </div>
              <div className="space-y-3">
                {clipRows.map((clip) => (
                  <div key={clip[1]} className="clip-card grid grid-cols-[58px_1fr_auto] items-center gap-3 border border-white/10 bg-white/[0.055] p-3">
                    <span className="text-[0.72rem] font-black text-rose">{clip[0]}</span>
                    <span className="text-sm font-bold">{clip[1]}</span>
                    <span className="text-[0.68rem] font-bold text-white/50">{clip[2]}</span>
                  </div>
                ))}
              </div>
              <div className="scan-line pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            <div className="border-y border-black/10 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">AI analysis</span>
                <span className="text-[0.7rem] font-black text-plum">TIMELINE BUILD</span>
              </div>
              <div className="grid h-20 items-end gap-1 overflow-hidden bg-bone p-3" style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}>
                {Array.from({ length: 24 }).map((_, index) => (
                  <span
                    key={index}
                    className="beat origin-bottom bg-black"
                    style={{ height: `${18 + ((index * 19) % 48)}px` }}
                  />
                ))}
              </div>
              <div className="relative mt-3 h-12 bg-black">
                {[11, 31, 54, 72, 88].map((left) => (
                  <span key={left} className="cut-marker absolute top-0 h-full w-px origin-bottom bg-rose" style={{ left: `${left}%` }} />
                ))}
                <div className="absolute inset-y-2 left-[8%] w-[23%] bg-white/20" />
                <div className="absolute inset-y-2 left-[36%] w-[16%] bg-white/[0.35]" />
                <div className="absolute inset-y-2 left-[58%] w-[26%] bg-white/20" />
              </div>
            </div>

            <div className="relative overflow-hidden bg-[#0b0b0b] p-4 text-white">
              <div className="mb-4 flex items-center justify-between">
                <span className="eyebrow text-white/60">Result</span>
                <span className="ready-pill translate-y-2 text-[0.7rem] font-black text-cyan opacity-0">EDIT READY</span>
              </div>
              <div className="relative h-[calc(100%-2.1rem)] overflow-hidden border border-white/10 bg-white/[0.04]">
                <div className="absolute inset-4 bg-gradient-to-br from-white/20 via-white/5 to-rose/20" />
                <div className="absolute bottom-5 left-5 right-5 h-2 bg-white/[0.15]">
                  <span className="block h-full w-[64%] bg-white" />
                </div>
                <div className="result-frame absolute inset-0 bg-[linear-gradient(135deg,rgba(124,62,242,.78),rgba(241,92,175,.46)_48%,rgba(103,216,210,.42))]" style={{ clipPath: "inset(0% 100% 0% 0%)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
