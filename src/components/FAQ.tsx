import { pricing, siteConfig } from "@/config/site";

export const faqs = [
  {
    question: "What is Zera Studio?",
    answer:
      "Zera Studio is an AI video editor for Android, made for creators who talk to the camera. Pick a video of you talking and the AI adds B-roll, motion graphics, zooms and word-by-word captions, timed to your words. Every AI edit opens in a full multi-track editor where you can change anything."
  },
  {
    question: "Is it free?",
    answer: `Downloading the app, the editor, effects and export are free. AI features use credits, and you get ${pricing.welcomeCredits} free credits when you sign up on a phone. For more, the Basic plan is ${pricing.basic.price} a month for ${pricing.basic.credits} credits, and Pro is ${pricing.pro[0].price} for ${pricing.pro[0].credits.toLocaleString("en-IN")} or ${pricing.pro[1].price} for ${pricing.pro[1].credits.toLocaleString("en-IN")} credits a month. Plans are ad-free.`
  },
  {
    question: "How many credits does each AI feature use?",
    answer:
      "AI B-roll uses 30 credits per minute of video and auto captions use 1 credit per minute for Auto, Hindi or English and 3 credits per minute for Hinglish. The price is shown before you start, and a run that fails gives its credits back."
  },
  {
    question: "Do Hinglish captions come out in Hindi script?",
    answer:
      "No. Choose Hinglish and the captions are written in Roman letters, the way people type Hinglish. Choose Hindi for Devanagari."
  },
  {
    question: "How long can my video be?",
    answer:
      "AI B-roll works on talking videos from 4 seconds up to 3 minutes. For a longer recording, cut the part you want in the editor first, then run AI B-roll on it."
  },
  {
    question: "Can I edit videos on this website?",
    answer: "No. Editing happens in the Zera Studio Android app. This website is the product and company site for Zera AI."
  },
  {
    question: "Which phones are supported?",
    answer: "Android phones, through Google Play. An iPhone version is not available yet."
  },
  {
    question: "Who builds Zera Studio?",
    answer: `Zera AI, founded by ${siteConfig.founder.name} (${siteConfig.founder.title}).`
  },
  {
    question: "How do I get support, or delete my account?",
    answer: `Email ${siteConfig.supportEmail} for support. You can delete your account inside the app, or follow the steps on the Account Deletion page; how data is handled is in the Privacy Policy.`
  }
];

export default function FAQ() {
  return (
    <section id="faq" data-scene="calm" className="relative py-20 sm:py-28 lg:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 className="section-title reveal lg:sticky lg:top-28">
            Questions,
            <br />
            <span className="text-brand">answered.</span>
          </h2>
        </div>

        <div className="reveal border-t border-white/15">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-white/15">
              <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.05rem] font-semibold sm:text-lg [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span aria-hidden="true" className="relative h-3 w-3 shrink-0">
                  <span className="absolute inset-x-0 top-1/2 h-px bg-white/70" />
                  <span className="absolute inset-y-0 left-1/2 w-px bg-white/70 transition-transform duration-300 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="max-w-[680px] pb-6 text-base leading-7 text-white/65">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
