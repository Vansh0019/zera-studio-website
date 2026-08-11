import { useId, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

const FORM_NAME = "zera-feedback";

type SubmitState = "idle" | "submitting" | "success" | "error";

function toEncodedBody(formData: FormData) {
  const body = new URLSearchParams();

  formData.forEach((value, key) => {
    if (typeof value === "string") {
      body.append(key, value);
    }
  });

  return body.toString();
}

export default function FeedbackForm() {
  const formId = useId();
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const spamField = formData.get("bot-field");
    const message = formData.get("message");

    if (typeof spamField === "string" && spamField.trim().length > 0) {
      return;
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      setSubmitState("error");
      return;
    }

    formData.set("form-name", FORM_NAME);
    setSubmitState("submitting");

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: toEncodedBody(formData)
      });

      if (!response.ok) {
        throw new Error("Feedback submission failed");
      }

      form.reset();
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  return (
    <form
      name={FORM_NAME}
      method="POST"
      action="/#feedback"
      className="grid gap-4"
      onSubmit={handleSubmit}
      {...{
        "data-netlify": "true",
        "netlify-honeypot": "bot-field"
      }}
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden">
        <label htmlFor={`${formId}-bot-field`}>
          Do not fill this out if you are human.
        </label>
        <input id={`${formId}-bot-field`} name="bot-field" tabIndex={-1} autoComplete="off" />
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${formId}-name`} className="mb-2 block text-xs font-black uppercase text-black/[0.55]">
            Name <span className="font-bold text-black/[0.35]">(optional)</span>
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className="focus-ring min-h-12 w-full border border-black/10 bg-white px-4 text-base font-bold text-black outline-none transition-colors focus:border-black"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-email`} className="mb-2 block text-xs font-black uppercase text-black/[0.55]">
            Email <span className="font-bold text-black/[0.35]">(optional, recommended)</span>
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Recommended"
            className="focus-ring min-h-12 w-full border border-black/10 bg-white px-4 text-base font-bold text-black outline-none transition-colors placeholder:text-black/30 focus:border-black"
          />
        </div>
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="mb-2 block text-xs font-black uppercase text-black/[0.55]">
          Feedback <span className="text-rose">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={6}
          placeholder="Tell us what worked, what did not, or what you would change."
          className="focus-ring min-h-36 w-full resize-y border border-black/10 bg-white px-4 py-3 text-base font-bold leading-7 text-black outline-none transition-colors placeholder:text-black/30 focus:border-black"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="cta-primary focus-ring disabled:cursor-not-allowed disabled:opacity-[0.55]"
          disabled={submitState === "submitting"}
        >
          {submitState === "submitting" ? "Sending..." : "Send feedback"}
          <ArrowUpRight size={15} strokeWidth={2.4} />
        </button>

        <p className="min-h-6 text-sm font-bold text-black/60" aria-live="polite">
          {submitState === "success" && (
            <span className="inline-flex items-center gap-2 text-black">
              <Check size={15} strokeWidth={2.4} />
              Thanks - your feedback has been received.
            </span>
          )}
          {submitState === "error" && (
            <span className="text-rose">
              Please add feedback and try again.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
