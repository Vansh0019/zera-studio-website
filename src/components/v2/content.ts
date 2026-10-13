import { pricing, siteConfig } from "@/config/site";

/**
 * Words on the v2 site, in one place. Facts here must match the app and the server
 * (`functions/src/config/credits/config.ts`, `src/config/site.ts`). Since 2026-10-13 there are no ad credits: the welcome
 * credits are the only free credits, the editor and export stay free with ads, and every plan is ad-free.
 */

export const faqs = [
  {
    question: "What is Zera Studio?",
    answer:
      "An AI video editor for Android. Upload a talking video and the AI adds B-roll, motion graphics, zooms and word-by-word captions, or show it a reel you like and it edits your clips in that style. Every AI edit opens in a full multi-track editor where you can change anything.",
  },
  {
    question: "Is it free?",
    answer: `Yes. The editor and export are free forever, with ads. Every new phone gets ${pricing.welcomeCredits} credits once to try the AI features. For more credits and no ads, there are monthly plans from ${pricing.basic.price}.`,
  },
  {
    question: "How many credits does each AI feature use?",
    answer:
      "AI B-roll uses 30 credits per minute of video, reference to edit uses 5 credits per edit, and auto captions use 1 credit per minute (3 for Hinglish). The price is shown before you start, and a run that fails gives its credits back.",
  },
  {
    question: "Do Hinglish captions come out in Hindi script?",
    answer: "No. Choose Hinglish and the captions are written in Roman letters, the way people type Hinglish. Choose Hindi for Devanagari.",
  },
  {
    question: "How long can my video be?",
    answer: "AI B-roll works on talking videos up to 3 minutes. For reference to edit, the reference can be up to 6 minutes and your clips up to 30 minutes together.",
  },
  {
    question: "Which phones are supported?",
    answer: "Android phones, through Google Play. An iPhone version is not available yet.",
  },
  {
    question: "How do I get support, or delete my account?",
    answer: `Write to ${siteConfig.supportEmail}. You can delete your account inside the app (Settings) or by following the account deletion page.`,
  },
];

/** The ten caption styles shown live on the site, named as in the app's Animate tab. The app has 28. */
export const captionStyles = [
  { id: "pop", name: "Pop" },
  { id: "wave", name: "Wave" },
  { id: "type", name: "Type" },
  { id: "reveal", name: "Reveal" },
  { id: "drop", name: "Letter Drop" },
  { id: "glow", name: "Glow" },
  { id: "slide", name: "Slide L" },
  { id: "scramble", name: "Scramble" },
  { id: "bounce", name: "Bounce" },
  { id: "jitter", name: "Jitter" },
];

export const plans = [
  { name: "Free", price: "₹0", per: "", lines: [`${pricing.welcomeCredits} credits once, per phone`, "Full editor and export, forever", "With ads"], cta: "Download" },
  { name: pricing.basic.name, price: pricing.basic.price, per: "/ month", lines: [`${pricing.basic.credits} credits every month`, "Every AI feature", "No ads"], cta: "Get Basic" },
  { name: "Pro", price: pricing.pro[0].price, per: "/ month", lines: [`${pricing.pro[0].credits} credits every month`, `or ${pricing.pro[1].credits} for ${pricing.pro[1].price}`, "No ads"], cta: "Get Pro", hot: true },
];
