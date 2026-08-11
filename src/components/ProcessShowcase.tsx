import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Activity, Check, CircleDashed } from "lucide-react";

const stages = [
  "Analyzing footage",
  "Finding cuts",
  "Analyzing audio",
  "Detecting rhythm",
  "Building edit",
  "Applying style",
  "Edit ready"
];

export default function ProcessShowcase() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root.current || reduced) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          repeat: -1,
          defaults: { ease: "power2.inOut" }
        })
        .to(".process-scan", { xPercent: 115, duration: 1.1 })
        .to(".process-cut", { scaleY: 1, opacity: 1, stagger: 0.08, duration: 0.32 }, "-=0.72")
        .to(".process-strip", { x: -52, duration: 0.9 }, "-=0.2")
        .to(".process-progress", { scaleX: 1, duration: 1.25 }, "-=0.9")
        .to(".process-frame", { backgroundPosition: "100% 50%", duration: 1.2 }, "-=0.7")
        .to(".process-progress", { scaleX: 0, duration: 0.25 }, "+=0.9")
        .to(".process-cut", { scaleY: 0, opacity: 0, duration: 0.2 }, "-=0.2")
        .set(".process-strip", { x: 0 })
        .set(".process-scan", { xPercent: -115 });
    }, root);

    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % stages.length);
    }, 1250);

    return () => {
      window.clearInterval(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} className="dark-section overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <div className="reveal">
            <p className="eyebrow mb-4">Editing process</p>
            <h2 className="section-title">WATCH THE EDIT TAKE SHAPE.</h2>
          </div>
          <p className="body-large reveal max-w-[670px] lg:justify-self-end">
            A visual representation of the beta editing flow: footage is
            reviewed, decisions appear on the timeline, and the generated result
            becomes ready to export.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="reveal overflow-hidden border border-white/[0.15] bg-white/[0.045] p-3 sm:p-4">
            <div
              className="process-frame relative min-h-[420px] overflow-hidden bg-[linear-gradient(130deg,#191919_0%,#2b2233_35%,#111_58%,#203231_100%)] bg-[length:180%_180%]"
            >
              <div className="absolute inset-5 border border-white/10" />
              <div className="process-scan absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="absolute left-5 right-5 top-5 flex items-center justify-between">
                <span className="eyebrow text-white/60">Preview</span>
                <span className="inline-flex items-center gap-2 text-[0.72rem] font-black text-cyan">
                  <Activity size={14} />
                  LIVE BUILD
                </span>
              </div>
              <div className="absolute inset-x-5 bottom-5">
                <div className="mb-4 h-24 overflow-hidden border border-white/10 bg-black/[0.35] p-2">
                  <div className="process-strip flex h-full w-[128%] gap-2">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div
                        key={index}
                        className="min-w-[90px] flex-1 bg-white/10"
                        style={{
                          background:
                            index % 3 === 0
                              ? "linear-gradient(135deg, rgba(124,62,242,.42), rgba(255,255,255,.16))"
                              : index % 3 === 1
                                ? "linear-gradient(135deg, rgba(241,92,175,.35), rgba(255,255,255,.08))"
                                : "linear-gradient(135deg, rgba(103,216,210,.28), rgba(255,255,255,.1))"
                        }}
                      />
                    ))}
                  </div>
                  {[17, 33, 49, 68, 82].map((left) => (
                    <span
                      key={left}
                      className="process-cut absolute bottom-7 h-20 w-px origin-bottom scale-y-0 bg-rose opacity-0"
                      style={{ left: `${left}%` }}
                    />
                  ))}
                </div>
                <div className="h-1.5 bg-white/10">
                  <span className="process-progress block h-full origin-left scale-x-0 bg-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="reveal border border-white/[0.15] bg-white p-4 text-black sm:p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="eyebrow">Current stage</span>
              <span className="text-[0.72rem] font-black text-plum">{String(active + 1).padStart(2, "0")}/07</span>
            </div>
            <div className="space-y-2">
              {stages.map((stage, index) => {
                const done = index < active || active === stages.length - 1;
                const current = index === active;
                return (
                  <div
                    key={stage}
                    className={`flex min-h-12 items-center gap-3 border px-3 text-sm font-bold transition-colors ${
                      current
                        ? "border-black bg-black text-white"
                        : done
                          ? "border-black/10 bg-bone text-black"
                          : "border-black/10 bg-white text-black/[0.45]"
                    }`}
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full border border-current">
                      {done && !current ? <Check size={13} /> : <CircleDashed size={13} />}
                    </span>
                    {stage}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
