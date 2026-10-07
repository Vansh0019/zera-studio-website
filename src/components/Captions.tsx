import { useEffect, useState } from "react";

/**
 * Auto captions, shown the way they look in an edit: word by word, the spoken word lit, on the beat. Hinglish comes
 * out in Roman letters — the speech model hears Devanagari and a second pass writes it the way people actually type
 * it (`functions/src/config/vertex-ai.ts`, `respellToRoman`).
 */

const LINES = [
  { roman: ["Bhai", "ye", "edit", "maine", "phone", "pe", "banaya", "hai"], deva: ["भाई", "ये", "एडिट", "मैंने", "फ़ोन", "पे", "बनाया", "है"] },
  { roman: ["Aur", "captions", "bhi", "khud", "aa", "gaye"], deva: ["और", "कैप्शन्स", "भी", "ख़ुद", "आ", "गए"] },
  { roman: ["Literally", "do", "minute", "lage"], deva: ["लिटरली", "दो", "मिनट", "लगे"] }
];

const LANGS = [
  { name: "Auto", note: "1 credit / min" },
  { name: "Hindi", note: "1 credit / min" },
  { name: "English", note: "1 credit / min" },
  { name: "Hinglish", note: "3 credits / min · Roman script" }
];

/** Beats each line is on screen: one per word, plus two to hold it. */
const SPANS = LINES.map((l) => l.roman.length + 2);
const ROUND = SPANS.reduce((a, b) => a + b, 0);

export default function Captions() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // No beats with reduced motion (the background draws one still frame): show the first line fully spoken.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTick(SPANS[0] - 2);
      return;
    }
    const onBeat = () => setTick((t) => t + 1);
    window.addEventListener("zera:beat", onBeat);
    return () => window.removeEventListener("zera:beat", onBeat);
  }, []);

  // Every other round shows what the speech model hears (Devanagari) before it is written in Roman.
  const roman = Math.floor(tick / ROUND) % 2 === 0;
  let at = tick % ROUND;
  let line = 0;
  while (at >= SPANS[line]) {
    at -= SPANS[line];
    line++;
  }
  const word = at;
  const words = roman ? LINES[line].roman : LINES[line].deva;

  return (
    <section id="captions" data-scene="captions" className="relative py-20 sm:py-28 lg:py-36">
      <div className="container-x">
        <div className="grid gap-6">
          <div>
            <h2 className="section-title reveal">
              HINGLISH
              <br />
              <span className="text-brand">THAT READS RIGHT.</span>
            </h2>
          </div>
          <p className="body-large reveal max-w-[620px] lg:justify-self-end">
            Captions land word by word, timed to your voice. Pick Hindi, English or Auto, or pick Hinglish, written in Roman
            letters the way people actually type it. Then style them with 200+ fonts and apply one look to every caption
            in a tap.
          </p>
        </div>

        <div data-gate className="reveal glass relative mt-12 overflow-hidden rounded-2xl px-5 py-14 sm:px-10 sm:py-20">
          <div className="relative mb-10 flex flex-wrap items-center justify-center gap-2">
            {LANGS.map((l) => {
              const on = roman ? l.name === "Hinglish" : l.name === "Hindi";
              return (
                <span
                  key={l.name}
                  className={`rounded-[4px] border px-3.5 py-2 text-xs font-semibold transition-colors duration-200 ${
                    on ? "border-white bg-white text-black" : "border-white/20 bg-white/5 text-white/70"
                  }`}
                >
                  {l.name}
                  <span className={`ml-2 font-normal ${on ? "text-black/55" : "text-white/40"}`}>{l.note}</span>
                </span>
              );
            })}
          </div>

          <p
            key={`${line}-${roman}`}
            className="relative mx-auto flex max-w-[1000px] flex-wrap justify-center gap-x-[0.28em] gap-y-2 text-center text-[clamp(2.2rem,7vw,6rem)] font-extrabold leading-[1.02] tracking-tight"
            aria-label={LINES[line].roman.join(" ")}
          >
            {words.map((w, i) => {
              const spoken = i < word;
              const now = i === word - 1;
              return (
                <span
                  key={i}
                  aria-hidden="true"
                  className={`say inline-block rounded-[0.18em] px-[0.12em] ${
                    now
                      ? "scale-110 bg-[#ffb547] text-black"
                      : spoken
                        ? "text-white"
                        : "text-white/15"
                  }`}
                >
                  {w}
                </span>
              );
            })}
          </p>

          <p className="tc relative mt-10 text-center text-xs text-white/45">
            {roman ? "Hinglish, Roman script" : "Hindi, Devanagari"}. Word-level timing from the audio.
          </p>
        </div>

        <dl className="spec spec-row reveal mt-8">
          {[
            ["Word by word", "Every caption timed to the word."],
            ["200+ fonts", "Including fonts that draw Devanagari."],
            ["Apply to all", "One style, every caption, one undo."],
            ["Yours to edit", "Fix a word, move it, restyle it."]
          ].map(([a, b]) => (
            <div key={a}>
              <dt className="spec-k">{a}</dt>
              <dd className="spec-v m-0">{b}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
