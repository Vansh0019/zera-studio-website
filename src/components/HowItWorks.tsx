import { Download, FileUp, ScanSearch, Wand2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Upload",
    copy: "Add your video clips.",
    icon: FileUp
  },
  {
    number: "02",
    title: "Analyze",
    copy: "Zera analyzes your footage and audio.",
    icon: ScanSearch
  },
  {
    number: "03",
    title: "Generate",
    copy: "AI creates the edit.",
    icon: Wand2
  },
  {
    number: "04",
    title: "Export",
    copy: "Get the generated video.",
    icon: Download
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="overflow-hidden py-20 sm:py-28 lg:py-36">
      <div className="container-x">
        <div className="grid gap-8 border-b border-black/10 pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="reveal">
            <p className="eyebrow mb-4">How it works</p>
            <h2 className="section-title">FROM CLIPS TO CUT.</h2>
          </div>
          <p className="body-large reveal max-w-[610px] lg:justify-self-end">
            A simple beta workflow built around the actual product: upload,
            analyze, generate, export.
          </p>
        </div>

        <div className="grid gap-px bg-black/10 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.number} className="reveal min-h-[260px] bg-paper p-5 sm:p-7">
                <div className="mb-14 flex items-center justify-between">
                  <span className="text-sm font-black text-black/[0.35]">{step.number}</span>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-black/[0.15]">
                    <Icon size={20} strokeWidth={1.8} />
                  </span>
                </div>
                <h3 className="text-2xl font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-black/60">{step.copy}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
