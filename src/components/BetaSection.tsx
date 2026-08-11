import FeedbackForm from "@/components/FeedbackForm";

export default function BetaSection() {
  return (
    <section id="feedback" className="overflow-hidden bg-bone py-20 sm:py-28 lg:py-36">
      <div className="container-x">
        <div className="reveal grid gap-10 border border-black/10 bg-paper p-5 sm:p-8 lg:grid-cols-[0.92fr_1.08fr] lg:p-12">
          <div>
            <p className="eyebrow mb-4">Beta</p>
            <h2 className="section-title max-w-[760px]">HELP SHAPE ZERA STUDIO.</h2>
            <p className="body-large mt-7 max-w-[580px]">
              Zera Studio is currently in beta. Tell us what worked, what did
              not, or what you would change.
            </p>
          </div>
          <div className="lg:self-end">
            <FeedbackForm />
          </div>
        </div>
      </div>
    </section>
  );
}
