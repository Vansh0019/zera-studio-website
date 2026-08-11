import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Pricing() {
  return (
    <section id="pricing" className="overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="reveal">
            <p className="eyebrow mb-4">Pricing</p>
            <h2 className="section-title">BETA ACCESS.</h2>
          </div>

          <div className="reveal border border-black/10 bg-white p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-3xl font-black sm:text-5xl">Currently free during beta</h3>
                <p className="mt-4 max-w-[640px] text-base leading-7 text-black/60">
                  Try Zera Studio while the product is still evolving. Pricing
                  may change later as the beta develops.
                </p>
              </div>
              <span className="inline-flex w-fit border border-black px-3 py-2 text-[0.7rem] font-black uppercase">
                Beta
              </span>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-black/50">No subscription tiers are listed during beta.</p>
              <a href={siteConfig.playStoreUrl} target="_blank" rel="noreferrer" className="cta-primary focus-ring">
                Try Zera Studio
                <ArrowUpRight size={15} strokeWidth={2.4} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
