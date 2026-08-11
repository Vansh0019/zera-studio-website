export const siteConfig = {
  name: "ZERA STUDIO",
  shortName: "Zera Studio",
  domain: "zera-ai.com",
  url: "https://zera-ai.com",
  description:
    "Zera Studio is an AI video editing app that turns your raw footage into edited videos. Currently in beta and free to try on Android.",
  logo: "/zera_studio_logo.png",
  ogImage: "/og-image.jpg",
  playStoreUrl:
    "https://play.google.com/store/apps/details?id=com.zerastudio.app",
  generalEmail: "hello@zera-ai.com",
  feedbackEmail: "feedback@zera-ai.com",
  nav: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Examples", href: "#examples" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" }
  ],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/zerastudio.ai" },
    { label: "X", href: "" }
  ]
} as const;
