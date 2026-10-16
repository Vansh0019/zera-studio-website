export const siteConfig = {
  /** Product */
  name: "ZERA STUDIO",
  shortName: "Zera Studio",

  /** Company */
  company: "ZERA AI",
  companyLegalName: "ZERA AI",
  companyDescription: "Zera AI builds AI-powered software for creators.",

  /** Canonical production domain (non-www, matches deployed configuration) */
  domain: "zera-ai.com",
  url: "https://zera-ai.com",

  description:
    "Zera Studio is the AI video editor for creators on Android. Drop in a talking video and get B-roll, motion graphics, zooms and word-by-word captions, then fine-tune everything in a full editor.",

  logo: "/media/logo-256.png",
  logoSmall: "/media/logo-96.png",
  ogImage: "/og-image.jpg",

  /** Product availability */
  platform: "Android",
  status: "Available on Android",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.zerastudio.app",

  /** Founder — verified, single founder */
  founder: {
    name: "Yuvansh Batra",
    title: "Founder & CEO",
    email: "vansh@zera-ai.com",
    linkedin: "https://www.linkedin.com/in/yuvansh-batra-991202302/"
  },

  /** Public contact routes */
  supportEmail: "support@zera-ai.com",
  contactEmail: "contact@zera-ai.com",
  feedbackEmail: "feedback@zera-ai.com",

  /**
   * Optional HTTP endpoint for background feedback submissions.
   * Leave empty to send feedback through the visitor's own email client
   * (guarantees nothing is silently dropped on a static host).
   */
  feedbackFormEndpoint: "",

  /** Verifiable third-party profiles */
  companyLinkedin: "https://www.linkedin.com/company/zera-ai",
  instagram: "https://www.instagram.com/zerastudio.ai",

  nav: [
    { label: "AI B-roll", href: "#broll" },
    { label: "Captions", href: "#captions" },
    { label: "Editor", href: "#editor" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" }
  ]
} as const;

/**
 * Credits and plans — the server's numbers (`functions/src/config/credits/config.ts`, his decisions in
 * `.ai/PRICING.md` §0). Prices are what he set on Google Play for India; Play shows local prices elsewhere.
 * When a number changes there, change it here.
 */
export const pricing = {
  welcomeCredits: 50,
  costs: [
    { feature: "AI B-roll", amount: "30", unit: "credits / min of video" },
    { feature: "Reference to edit", amount: "15", unit: "credits / edit (20 over 9 min of clips, 25 over 15 min)" },
    { feature: "Auto captions (Auto, Hindi, English)", amount: "1", unit: "credit / min" },
    { feature: "Hinglish captions (Roman script)", amount: "3", unit: "credits / min" },
    { feature: "Manual editor, effects, export", amount: "0", unit: "free, forever" }
  ],
  basic: { name: "Basic", price: "₹349", credits: 300 },
  pro: [
    { name: "Pro", price: "₹1,249", credits: 1000 },
    { name: "Pro", price: "₹2,499", credits: 2000 }
  ]
} as const;

/**
 * The Play Store link for one button on the site, tagged so Play Console's acquisition report can say which button
 * brought an install: `utm_source=zera-ai.com`, `utm_medium=website`, `utm_campaign=<placement>`. Play reads these
 * from the `referrer` parameter. Structured data keeps the plain `siteConfig.playStoreUrl`.
 */
export const playUrl = (placement: string) =>
  `${siteConfig.playStoreUrl}&referrer=${encodeURIComponent(`utm_source=zera-ai.com&utm_medium=website&utm_campaign=${placement}`)}`;
