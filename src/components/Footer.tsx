import type { SVGProps } from "react";
import { Mail } from "lucide-react";
import { siteConfig } from "@/config/site";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="zera-ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="100%" stopColor="#285AEB" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#zera-ig-gradient)" fill="none" />
      <circle cx="12" cy="12" r="4" stroke="url(#zera-ig-gradient)" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="url(#zera-ig-gradient)" stroke="none" />
    </svg>
  );
}

const iconMap = {
  Instagram: InstagramIcon,
  X: (_props: SVGProps<SVGSVGElement>) => <span className="text-[0.72rem] font-black">X</span>
};

export default function Footer() {
  return (
    <footer className="dark-section border-t border-white/10 py-10">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <a href="/#top" className="focus-ring inline-flex items-center gap-3">
              <img src={siteConfig.logo} alt="Zera Studio logo" className="h-12 w-12 object-contain" width={48} height={48} />
              <span className="text-sm font-black">ZERA STUDIO</span>
            </a>
            <p className="mt-4 max-w-[360px] text-sm leading-6 text-white/60">
              AI video editing, built for creators.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-[auto_auto_auto] items-start lg:gap-10">
            <div>
              <div className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-wider text-white/40">Navigation</div>
              <nav className="flex flex-col gap-2.5" aria-label="Footer navigation">
                {siteConfig.nav.map((item) => (
                  <a
                    key={item.href}
                    href={item.href.startsWith("#") ? `/${item.href}` : item.href}
                    className="focus-ring text-xs font-bold text-white/60 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <div className="mb-3 text-[0.72rem] font-extrabold uppercase tracking-wider text-white/40">Legal</div>
              <nav className="flex flex-col gap-2.5" aria-label="Legal navigation">
                <a
                  href="/privacy-policy"
                  className="focus-ring text-xs font-bold text-white/60 transition-colors hover:text-white"
                >
                  Privacy Policy
                </a>
                <a
                  href="/account-deletion"
                  className="focus-ring text-xs font-bold text-white/60 transition-colors hover:text-white"
                >
                  Account Deletion
                </a>
              </nav>
            </div>

            <div className="flex gap-2 pt-1 sm:pt-0">
              {siteConfig.socials.map((social) => {
                const Icon = iconMap[social.label as keyof typeof iconMap];
                return social.href ? (
                  <a
                    key={social.label}
                    href={social.href}
                    className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-white/[0.15] text-white/70 transition-colors hover:text-white"
                    aria-label={social.label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon size={16} />
                  </a>
                ) : (
                  <span
                    key={social.label}
                    className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/30"
                    aria-label={`${social.label} link unavailable`}
                    aria-disabled="true"
                    title={`${social.label} link unavailable`}
                  >
                    <Icon size={16} />
                  </span>
                );
              })}
              <a
                href={`mailto:${siteConfig.generalEmail}`}
                className="focus-ring grid h-9 w-9 place-items-center rounded-full border border-white/[0.15] text-white/70 transition-colors hover:text-white"
                aria-label="Email Zera Studio"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs font-bold text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Zera Studio.</span>
          <a href={`mailto:${siteConfig.generalEmail}`} className="focus-ring w-fit">
            {siteConfig.generalEmail}
          </a>
        </div>
      </div>
    </footer>
  );
}
