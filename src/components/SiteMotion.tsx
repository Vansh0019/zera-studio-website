import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export default function SiteMotion() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.remove("reveal");
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.85
    });

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);

    /*
     * Motion follows what the thing is, not one fade for everything (uniform fade-ups are a template tell):
     * - titles rise out of a mask, like a title card;
     * - pictures and panels marked `data-gate` open from a horizontal sliver, like a projector gate;
     * - meters marked `data-grow` fill from the left once;
     * - everything else simply comes up, with no slide.
     */
    const revealItems = gsap.utils.toArray<HTMLElement>(".reveal");
    revealItems.forEach((item) => {
      const st = { trigger: item, start: "top 85%", once: true };
      const isTitle = item.matches(".section-title, .display");
      if (isTitle) {
        gsap.set(item, { opacity: 1 });
        gsap.fromTo(
          item,
          { clipPath: "inset(0 0 100% 0)", yPercent: 22 },
          { clipPath: "inset(0 0 0% 0)", yPercent: 0, duration: 1.2, ease: "expo.out", clearProps: "clipPath", scrollTrigger: st }
        );
      } else if (item.hasAttribute("data-gate")) {
        gsap.set(item, { opacity: 1 });
        gsap.fromTo(
          item,
          { clipPath: "inset(49% 0% 49% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: st }
        );
      } else {
        gsap.to(item, { opacity: 1, duration: 0.8, ease: "power2.out", scrollTrigger: st });
      }
    });
    gsap.utils.toArray<HTMLElement>("[data-grow]").forEach((bar, i) => {
      gsap.from(bar, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        delay: (i % 4) * 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: bar, start: "top 90%", once: true }
      });
    });

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
