import { ArrowUpRight } from "lucide-react";
import { playUrl, siteConfig } from "@/config/site";

function InstagramIcon({ size = 15 }: { size?: number }) {
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

const productLinks = [
  { label: "AI B-roll", href: "/#broll" },
  { label: "Auto captions", href: "/#captions" },
  { label: "The editor", href: "/#editor" },
  { label: "Pricing", href: "/#pricing" }
];

const companyLinks = [
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" }
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Account Deletion", href: "/account-deletion" }
];

export default function Footer() {
  const verifyLinks = [
    { label: "Google Play", href: playUrl("page-footer") },
    { label: "Company LinkedIn", href: siteConfig.companyLinkedin },
    { label: "Founder LinkedIn", href: siteConfig.founder.linkedin }
  ];

  return (
    <footer className="dark-section border-t border-white/10 py-14">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1.85fr]">
          {/* Brand */}
          <div>
            <a href="/#top" className="focus-ring inline-flex items-center gap-3">
              <img
                src={siteConfig.logoSmall}
                alt="Zera Studio logo"
                className="h-12 w-auto object-contain"
                width={48}
                height={48}
              />
              <span className="font-display text-lg font-[750] uppercase [font-stretch:80%]">Zera Studio</span>
            </a>
            <p className="mt-4 max-w-[330px] text-sm leading-6 text-white/60">
              The AI video editor for creators, by {siteConfig.company}. AI
              B-roll, Hinglish captions and a full editor, on Android.
            </p>
          </div>

          {/* Link columns */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:justify-items-end">
            <div>
              <div className="mb-3.5 text-[0.72rem] font-extrabold uppercase tracking-wider text-white/40">
                Product
              </div>
              <nav className="flex flex-col gap-2.5" aria-label="Product">
                {productLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="focus-ring text-xs font-bold text-white/60 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <div className="mb-3.5 text-[0.72rem] font-extrabold uppercase tracking-wider text-white/40">
                Company
              </div>
              <nav className="flex flex-col gap-2.5" aria-label="Company">
                {companyLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="focus-ring text-xs font-bold text-white/60 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="focus-ring text-xs font-bold text-white/60 transition-colors hover:text-white"
                >
                  {siteConfig.supportEmail}
                </a>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="focus-ring text-xs font-bold text-white/60 transition-colors hover:text-white"
                >
                  {siteConfig.contactEmail}
                </a>
              </nav>
            </div>

            <div>
              <div className="mb-3.5 text-[0.72rem] font-extrabold uppercase tracking-wider text-white/40">
                Legal
              </div>
              <nav className="flex flex-col gap-2.5" aria-label="Legal">
                {legalLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="focus-ring text-xs font-bold text-white/60 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <div>
              <div className="mb-3.5 text-[0.72rem] font-extrabold uppercase tracking-wider text-white/40">
                Verify
              </div>
              <nav className="flex flex-col gap-2.5" aria-label="Verification links">
                {verifyLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring inline-flex items-center gap-1.5 text-xs font-bold text-white/60 transition-colors hover:text-white"
                  >
                    {item.label}
                    <ArrowUpRight size={12} strokeWidth={2.6} />
                  </a>
                ))}
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex items-center gap-2 text-xs font-bold text-white/60 transition-colors hover:text-white"
                >
                  <InstagramIcon size={14} />
                  Instagram
                </a>
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs font-bold text-white/40">
          <span>
            © {new Date().getFullYear()} {siteConfig.companyLegalName}. All rights
            reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
