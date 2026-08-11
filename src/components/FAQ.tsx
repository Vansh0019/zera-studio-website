export const faqs = [
  {
    question: "What is Zera Studio?",
    answer:
      "Zera Studio is an AI video editing app that helps turn your footage into edited videos."
  },
  {
    question: "Is Zera Studio free?",
    answer: "Zera Studio is currently free to try during beta."
  },
  {
    question: "What can Zera Studio do right now?",
    answer:
      "The current product focuses on AI video editing: you provide footage and Zera helps generate an edited video."
  },
  {
    question: "Is Zera Studio finished?",
    answer:
      "Zera Studio is launched and usable, but it is still in beta and actively being improved."
  },
  {
    question: "How can I give feedback?",
    answer:
      "Use the feedback form on this page. Your feedback helps shape the beta product."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="overflow-hidden bg-paper pb-20 sm:pb-28 lg:pb-36">
      <div className="container-x">
        <div className="grid gap-8 border-t border-black/10 pt-16 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="reveal">
            <p className="eyebrow mb-4">FAQ</p>
            <h2 className="section-title">CLEAR ANSWERS.</h2>
          </div>

          <div className="space-y-px bg-black/10">
            {faqs.map((faq) => (
              <article key={faq.question} className="reveal bg-paper py-6 sm:grid sm:grid-cols-[0.55fr_1fr] sm:gap-8 sm:px-0">
                <h3 className="text-lg font-black">{faq.question}</h3>
                <p className="mt-3 text-base leading-7 text-black/60 sm:mt-0">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
