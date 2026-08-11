import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clapperboard, FileVideo, Sparkles } from "lucide-react";

const analysisItems = ["visual content", "audio", "pacing", "context"];

export default function AIEditingDemo() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root.current || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          transformOrigin: "left center",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: ".feature-stage", start: "top 70%" }
        }
      );

      gsap.from(".feature-node", {
        opacity: 0,
        y: 26,
        duration: 0.65,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: { trigger: ".feature-stage", start: "top 70%" }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={root} className="dark-section overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="reveal">
            <p className="eyebrow mb-4">Core feature</p>
            <h2 className="section-title">AI VIDEO EDITING</h2>
          </div>
          <p className="body-large reveal max-w-[680px] lg:justify-self-end">
            Zera has one job right now: take your footage, analyze it, and
            generate an edited video. The product is early, focused, and still
            improving with feedback.
          </p>
        </div>

        <div className="feature-stage relative mt-16 grid gap-4 lg:grid-cols-3 lg:items-stretch">
          <div className="feature-line absolute left-0 top-1/2 hidden h-px w-full bg-white/20 lg:block" />
          <div className="feature-node relative border border-white/[0.15] bg-white/[0.055] p-5 sm:p-7">
            <FileVideo className="mb-10 text-white/80" size={25} strokeWidth={1.8} />
            <p className="eyebrow mb-3">Your footage</p>
            <h3 className="text-2xl font-black">Clips enter the workspace.</h3>
          </div>

          <div className="feature-node relative border border-white/[0.15] bg-white/[0.075] p-5 sm:p-7">
            <Sparkles className="mb-10 text-rose" size={25} strokeWidth={1.8} />
            <p className="eyebrow mb-3">Zera analyzes</p>
            <div className="grid grid-cols-2 gap-2">
              {analysisItems.map((item) => (
                <span key={item} className="border border-white/10 bg-black/20 px-3 py-3 text-sm font-bold text-white/75">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="feature-node relative border border-white/[0.15] bg-white p-5 text-black sm:p-7">
            <Clapperboard className="mb-10 text-plum" size={25} strokeWidth={1.8} />
            <p className="eyebrow mb-3">Final video</p>
            <h3 className="text-2xl font-black">A generated edit is ready to review.</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
