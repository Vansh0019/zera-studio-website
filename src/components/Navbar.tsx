import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // On the paper pages (legal) a transparent bar would put white text on white: always the dark bar there.
    const paper = document.body.classList.contains("page-light");
    const onScroll = () => setScrolled(paper || window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled ? "border-b border-white/10 bg-[#0b0908]/90" : "border-b border-transparent"}`}>
      <nav
        className="container-x flex h-[64px] items-center justify-between gap-5 text-white"
      >
        <a href="/#top" className="focus-ring flex items-center gap-2.5" onClick={close}>
          <img src={siteConfig.logoSmall} alt="Zera Studio logo" className="h-8 w-auto object-contain" width={32} height={32} />
          <span className="font-display text-[1.05rem] font-[750] uppercase tracking-[0.02em] [font-stretch:80%]">
            ZERA<span className="hidden sm:inline"> STUDIO</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={`/${item.href}`}
              className="focus-ring text-[0.88rem] text-white/65 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={siteConfig.playStoreUrl} className="cta-primary focus-ring !min-h-[40px] !px-4 !text-[0.85rem]" target="_blank" rel="noreferrer">
            Get the app
            <ArrowUpRight size={15} strokeWidth={2} />
          </a>
        </div>

        <button
          type="button"
          className="focus-ring grid h-10 w-10 place-items-center rounded-[4px] border border-white/20 lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>

      <div
        className={`fixed inset-x-0 top-[64px] z-40 transition-all duration-300 lg:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <div className="border-b border-white/10 bg-[#0b0908] px-4 pb-4 text-white">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={`/${item.href}`}
              onClick={close}
              className="focus-ring flex min-h-12 items-center border-b border-white/10 px-1 text-base"
            >
              {item.label}
            </a>
          ))}
          <a href={siteConfig.playStoreUrl} onClick={close} target="_blank" rel="noreferrer" className="cta-primary focus-ring mt-3 w-full">
            Get it on Google Play
            <ArrowUpRight size={15} strokeWidth={2} />
          </a>
        </div>
      </div>
    </header>
  );
}
