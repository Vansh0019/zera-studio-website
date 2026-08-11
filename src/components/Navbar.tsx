import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-black/10 bg-paper/[0.86] backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="container-x flex h-[68px] items-center justify-between gap-5">
        <a href="/#top" className="focus-ring flex items-center gap-2.5" onClick={close}>
          <img
            src={siteConfig.logo}
            alt="Zera Studio logo"
            className="h-9 sm:h-10 w-auto object-contain"
            width={40}
            height={40}
          />
          <span className="text-[0.78rem] font-black leading-none">
            ZERA
            <span className="hidden sm:inline"> STUDIO</span>
          </span>
        </a>

        <div className="hidden items-center gap-7 lg:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href.startsWith("#") ? `/${item.href}` : item.href}
              className="focus-ring text-[0.76rem] font-bold text-black/70 transition-colors hover:text-black"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={siteConfig.playStoreUrl} className="cta-primary focus-ring" target="_blank" rel="noreferrer">
            Try Zera Studio
            <ArrowUpRight size={15} strokeWidth={2.4} />
          </a>
        </div>

        <button
          type="button"
          className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-black/[0.15] lg:hidden"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </nav>

      <div
        className={`fixed inset-x-0 top-[68px] z-40 bg-paper px-4 pb-5 shadow-soft transition-all duration-300 lg:hidden ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-3 opacity-0"
        }`}
      >
        <div className="rounded-b-[6px] border-x border-b border-black/10 bg-paper p-3">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href.startsWith("#") ? `/${item.href}` : item.href}
              onClick={close}
              className="focus-ring flex min-h-12 items-center border-b border-black/10 text-sm font-bold last:border-0"
            >
              {item.label}
            </a>
          ))}
          <a
            href={siteConfig.playStoreUrl}
            onClick={close}
            target="_blank"
            rel="noreferrer"
            className="cta-primary focus-ring mt-3 w-full"
          >
            Try Zera Studio
            <ArrowUpRight size={15} strokeWidth={2.4} />
          </a>
        </div>
      </div>
    </header>
  );
}
