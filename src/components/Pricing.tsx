import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { pricing, siteConfig } from "@/config/site";

/** What a number of credits buys, in the units people think in. */
function buys(credits: number) {
  const n = (v: number) => v.toLocaleString("en-IN");
  return [`${n(Math.floor(credits / 30))} min of AI B-roll`, `or ${n(Math.floor(credits / 5))} reference edits`, `or ${n(credits)} min of captions`];
}

/**
 * One price sheet with three columns divided by hairlines, not three floating cards. There is no "Most popular"
 * badge: nothing here measures that, and an invented badge is a template tell (`.ai/DECISIONS.md`).
 */
export default function Pricing() {
  const [pro, setPro] = useState(0);
  const p = pricing.pro[pro];

  return (
    <section id="pricing" data-scene="pricing" className="relative py-20 sm:py-28 lg:py-36">
      <div className="container-x">
        <div className="grid gap-6">
          <h2 className="section-title reveal">
            Pay for AI.
            <br />
            <span className="text-brand">Edit for free.</span>
          </h2>
          <p className="body-large reveal max-w-[600px] lg:justify-self-end">
            AI features run on credits, and you start with {pricing.welcomeCredits} free. The editor, effects and export
            are free and stay free. Plans add credits every month and turn ads off.
          </p>
        </div>

        <div className="reveal glass mt-12 grid rounded-2xl lg:grid-cols-3">
          <Plan
            name="Free"
            price="₹0"
            per=""
            credits={`${pricing.welcomeCredits} credits when you sign up`}
            items={["Welcome credits, once per phone", "Full editor and export, free forever", "AI B-roll, captions, reference to edit", "With ads"]}
            cta="Get the app"
          />
          <Plan
            name={pricing.basic.name}
            price={pricing.basic.price}
            per="/ month"
            credits={`${pricing.basic.credits} credits every month`}
            items={[...buys(pricing.basic.credits), "No ads"]}
            cta="Subscribe in the app"
            divided
          />
          <Plan
            name={p.name}
            price={p.price}
            per="/ month"
            credits={`${p.credits.toLocaleString("en-IN")} credits every month`}
            items={[...buys(p.credits), "No ads"]}
            cta="Subscribe in the app"
            divided
            primary
          >
            <div className="mt-6">
              <label htmlFor="pro-credits" className="mb-2 flex justify-between text-xs text-white/60">
                <span>Credits a month</span>
                <span className="tc text-white">{p.credits.toLocaleString("en-IN")}</span>
              </label>
              <input
                id="pro-credits"
                type="range"
                min={0}
                max={pricing.pro.length - 1}
                step={1}
                value={pro}
                onChange={(e) => setPro(Number(e.target.value))}
                className="w-full accent-[#ffb547]"
                aria-valuetext={`${p.credits} credits for ${p.price} a month`}
              />
              <div className="tc mt-1 flex justify-between text-[0.7rem] text-white/45">
                {pricing.pro.map((o) => (
                  <span key={o.credits}>{o.credits.toLocaleString("en-IN")}</span>
                ))}
              </div>
            </div>
          </Plan>
        </div>

        {/* What things cost */}
        <div className="reveal mt-12">
          <h3 className="eyebrow mb-4">What each feature costs</h3>
          <dl className="m-0 border-t border-white/15">
            {pricing.costs.map((c) => (
              <div key={c.feature} className="flex items-baseline justify-between gap-4 border-b border-white/15 py-4">
                <dt>{c.feature}</dt>
                <dd className="m-0 shrink-0 text-right">
                  <span className="tc text-lg text-white">{c.amount}</span>
                  <span className="ml-2 text-sm text-white/55">{c.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="reveal mt-6 max-w-[760px] text-sm leading-6 text-white/50">
          Plans are monthly subscriptions through Google Play, and you can cancel anytime there. Plan credits refresh at
          each renewal. Prices shown are for India; Google Play shows the price for your country. A run that fails gives its
          credits back.
        </p>
      </div>
    </section>
  );
}

function Plan({
  name,
  price,
  per,
  credits,
  items,
  cta,
  divided = false,
  primary = false,
  children
}: {
  name: string;
  price: string;
  per: string;
  credits: string;
  items: string[];
  cta: string;
  divided?: boolean;
  primary?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <article
      className={`relative flex flex-col p-6 sm:p-8 ${divided ? "border-t border-white/15 lg:border-l lg:border-t-0" : ""} ${
        primary ? "before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-[#ffb547]" : ""
      }`}
    >
      <p className="eyebrow">{name}</p>
      <p className="font-display mt-5 text-[3.6rem] font-[750] leading-none [font-stretch:80%]">
        {price}
        {per && <span className="ml-2 font-sans text-base font-normal text-white/50">{per}</span>}
      </p>
      <p className="mt-3 text-sm text-white/65">{credits}</p>
      {children}
      <ul className="mt-6 space-y-2.5 text-sm">
        {items.map((f) => (
          <li key={f} className="flex gap-3 text-white/80">
            <span className="mt-[0.55em] h-px w-3 shrink-0 bg-white/40" aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <a href={siteConfig.playStoreUrl} target="_blank" rel="noreferrer" className={`${primary ? "cta-primary" : "cta-secondary"} focus-ring w-full`}>
          {cta}
          <ArrowUpRight size={16} strokeWidth={2} />
        </a>
      </div>
    </article>
  );
}
