import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AudioLines, Clapperboard, Shapes, Type, Video } from "lucide-react";

/**
 * # The B-roll section: scroll and watch the AI build the edit
 *
 * Pinned while you scroll; the scroll *is* the playhead. Each stage lands on the timeline in the order the real
 * director works (`functions/src/brollDirector.ts`): it listens first, then places stock B-roll, designs motion
 * graphics, sets zooms and beat effects, and writes word-by-word captions. The edit then opens in the editor.
 */

const STAGES = [
  "Listening to your words",
  "Finding moments for B-roll",
  "Designing motion graphics",
  "Placing zooms on the beat",
  "Writing word-by-word captions",
  "Edit ready. Opening the editor"
];

const WORDS = ["Bhai", "ye", "app", "sach", "me", "2", "minute", "me", "edit", "kar", "deta", "hai"];

const BROLL = [
  { left: 8, width: 17, label: "city night" },
  { left: 39, width: 14, label: "laptop typing" },
  { left: 70, width: 19, label: "phone scroll" }
];
const GFX = [
  { left: 2, width: 15, label: "Title" },
  { left: 27, width: 11, label: "Checklist" },
  { left: 55, width: 13, label: "Growth chart" },
  { left: 84, width: 13, label: "Call-out" }
];
const ZOOMS = [12, 33, 51, 77, 92];

export default function BrollStage() {
  const root = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!root.current) return;
    if (reduced) {
      setStage(STAGES.length - 1);
      setPct(100);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: ".broll-pin",
          start: "top top+=80",
          end: "+=1700",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            const p = self.progress;
            setPct(Math.round(p * 100));
            setStage(Math.min(STAGES.length - 1, Math.floor(p * STAGES.length)));
          }
        }
      });
      tl.from(".bw-wave span", { scaleY: 0.1, duration: 1, stagger: 0.01 }, 0)
        .from(".bw-broll", { xPercent: 140, opacity: 0, duration: 1, stagger: 0.35 }, 0.9)
        .from(".bw-gfx", { scale: 0.2, opacity: 0, duration: 0.8, stagger: 0.25, ease: "back.out(2.2)" }, 2.1)
        .from(".bw-zoom", { scale: 0, rotate: 45, opacity: 0, duration: 0.5, stagger: 0.12, ease: "back.out(3)" }, 3.2)
        .from(".bw-word", { y: 14, opacity: 0, duration: 0.35, stagger: 0.08 }, 4.0)
        .fromTo(".bw-playhead", { left: "0%" }, { left: "100%", duration: 5.6, ease: "none" }, 0)
        .from(".bw-ready", { y: 20, opacity: 0, scale: 0.9, duration: 0.6, ease: "back.out(2)" }, 5.1)
        .to(".bw-monitor", { scale: 1.06, duration: 0.6 }, 3.2)
        .to(".bw-monitor", { scale: 1, duration: 0.6 }, 3.9);
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="broll" ref={root} data-scene="broll" className="relative py-20 sm:py-28">
      <div className="container-x">
        <div className="grid gap-6">
          <div>
            <h2 className="section-title reveal">
              TALK ONCE.
              <br />
              <span className="text-brand">GET THE WHOLE EDIT.</span>
            </h2>
          </div>
          <p className="body-large reveal max-w-[620px] lg:justify-self-end">
            Upload a talking video up to 3 minutes long. The AI listens to every word, then adds stock B-roll, designs
            motion graphics for your video, zooms in on the moments that matter, flashes on the beat and writes your
            captions. Scroll down to watch it work, in the order it really does.
          </p>
        </div>

        <div className="broll-pin mt-12">
          <div className="glass overflow-hidden rounded-2xl p-3 sm:p-5">
            {/* Top bar of the editor */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2 text-[0.78rem] font-medium text-white/75">
                <span className="h-2 w-2 bg-[#ffb547]" aria-hidden="true" />
                <span aria-live="polite">{STAGES[stage]}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10 sm:w-44">
                  <span className="block h-full rounded-full bg-[#ffb547]" style={{ width: `${pct}%` }} />
                </div>
                <span className="tc w-10 text-right text-xs font-bold text-white/60">{pct}%</span>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
              {/* Monitor */}
              {/* Hidden on phones: pinned, the monitor plus the timeline would not fit one screen, and the timeline is the point. */}
              <div className="bw-monitor relative mx-auto hidden aspect-[9/16] w-[230px] overflow-hidden rounded-2xl border border-white/15 bg-black sm:block lg:w-full">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/media/signin.mp4"
                  poster="/media/signin.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-label="A finished Zera Studio B-roll edit"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
                  <p className="text-center text-[0.95rem] font-black leading-tight">
                    {WORDS.slice(0, 6).map((w, i) => (
                      <span key={i} className={`bw-word mr-1 inline-block ${i === 2 ? "text-[#ffb547]" : ""}`}>
                        {w}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative flex flex-col rounded-xl border border-white/10 bg-black/40 p-3 sm:p-4">
                <div className="tc mb-3 flex justify-between text-[0.62rem] text-white/35">
                  {["00:00", "00:05", "00:10", "00:15", "00:20"].map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>

                <div className="relative space-y-2.5 sm:space-y-3.5 lg:my-auto">
                  <Track icon={<Type size={13} />} name="Captions">
                    <div className="absolute inset-0 flex items-center gap-1 overflow-hidden px-1">
                      {WORDS.map((w, i) => (
                        <span key={i} className="bw-word shrink-0 rounded-[2px] bg-white/90 px-1.5 py-0.5 text-[0.6rem] font-bold text-black">
                          {w}
                        </span>
                      ))}
                    </div>
                  </Track>
                  <Track icon={<Shapes size={13} />} name="Graphics">
                    {GFX.map((g) => (
                      <Block key={g.label} cls="bw-gfx bg-tgfx" left={g.left} width={g.width} label={g.label} />
                    ))}
                  </Track>
                  <Track icon={<Clapperboard size={13} />} name="B-roll">
                    {BROLL.map((b) => (
                      <Block key={b.label} cls="bw-broll bg-tbroll" left={b.left} width={b.width} label={b.label} />
                    ))}
                  </Track>
                  <Track icon={<Video size={13} />} name="Video">
                    <div className="absolute inset-y-1 left-0 right-0 rounded-[3px] bg-[repeating-linear-gradient(90deg,rgba(74,120,201,0.75)_0_38px,rgba(74,120,201,0.45)_38px_40px)]" />
                    {ZOOMS.map((z) => (
                      <span
                        key={z}
                        className="bw-zoom absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-45 rounded-[2px] border-2 border-[#0b0908] bg-[#ffb547]"
                        style={{ left: `${z}%` }}
                      />
                    ))}
                  </Track>
                  <Track icon={<AudioLines size={13} />} name="Audio">
                    <div className="bw-wave absolute inset-0 flex items-center gap-[3px] px-1">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <span
                          key={i}
                          className="w-full origin-center rounded-full bg-taudio"
                          style={{ height: `${18 + ((i * 37) % 70)}%` }}
                        />
                      ))}
                    </div>
                  </Track>

                  {/* The playhead runs over the lanes only, not the track names. */}
                  <div className="pointer-events-none absolute -bottom-2 -top-2 left-[72px] right-0 z-10 sm:left-[92px]">
                    <span className="bw-playhead absolute inset-y-0 w-[2px] bg-[#ffb547]">
                      <span className="absolute -left-[5px] -top-1 h-3 w-3 rotate-45 bg-[#ffb547]" />
                    </span>
                  </div>
                </div>

                <div className="bw-ready mt-5 flex items-center justify-between gap-4 border-t border-white/15 px-1 pt-4">
                  <span className="text-sm font-bold text-[#ffb547]">Edit ready</span>
                  <span className="text-right text-xs text-white/60">Opens in the editor. Move, trim or delete anything.</span>
                </div>
              </div>
            </div>
          </div>

          <dl className="spec spec-row reveal mt-8">
            {[
              ["30 credits a minute", "Given back if a run fails."],
              ["Up to 3 minutes", "Of talking video per edit."],
              ["Every piece editable", "Graphics, clips and captions land on real tracks."]
            ].map(([a, b]) => (
              <div key={a}>
                <dt className="spec-k">{a}</dt>
                <dd className="spec-v m-0">{b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function Track({ icon, name, children }: { icon: React.ReactNode; name: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <span className="flex w-[64px] shrink-0 items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-wide text-white/50 sm:w-[80px]">
        <span className="shrink-0">{icon}</span>
        {name}
      </span>
      <div className="relative h-8 flex-1 overflow-hidden rounded-[4px] bg-white/[0.04] sm:h-11">{children}</div>
    </div>
  );
}

function Block({ cls, left, width, label }: { cls: string; left: number; width: number; label: string }) {
  return (
    <span
      className={`${cls} absolute inset-y-1 flex items-center overflow-hidden rounded-[3px] border-t border-white/25 px-2 text-[0.6rem] font-semibold text-white`}
      style={{ left: `${left}%`, width: `${width}%` }}
    >
      <span className="truncate">{label}</span>
    </span>
  );
}
