import { useId, useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { siteConfig } from "@/config/site";

type SubmitState = "idle" | "submitting" | "success" | "error";

const ENDPOINT = siteConfig.feedbackFormEndpoint;

export default function FeedbackForm() {
  const formId = useId();
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!message) {
      setState("error");
      return;
    }

    // Preferred path: post to a configured form-to-email endpoint.
    if (ENDPOINT) {
      setState("submitting");
      try {
        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            message,
            subject: `Zera Studio feedback${name ? ` from ${name}` : ""}`
          })
        });

        if (!response.ok) throw new Error("Feedback submission failed");

        form.reset();
        setState("success");
      } catch {
        setState("error");
      }
      return;
    }

    // Fallback on a static host with no backend: hand the message to the
    // visitor's email client, addressed straight to the feedback inbox.
    const body = [
      name ? `Name: ${name}` : null,
      email ? `Email: ${email}` : null,
      "",
      message
    ]
      .filter((line) => line !== null)
      .join("\n");

    const href =
      `mailto:${siteConfig.feedbackEmail}` +
      `?subject=${encodeURIComponent("Zera Studio feedback")}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setState("success");
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor={`${formId}-name`}
            className="mb-2 block text-sm font-medium text-white/70"
          >
            Name <span className="font-normal text-white/40">(optional)</span>
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className="focus-ring min-h-12 w-full rounded-[4px] border border-white/15 bg-black/40 px-4 text-base text-white outline-none transition-colors focus:border-[#ffb547]"
          />
        </div>

        <div>
          <label
            htmlFor={`${formId}-email`}
            className="mb-2 block text-sm font-medium text-white/70"
          >
            Email{" "}
            <span className="font-normal text-white/40">
              (optional, recommended)
            </span>
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="So we can reply"
            className="focus-ring min-h-12 w-full rounded-[4px] border border-white/15 bg-black/40 px-4 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#ffb547]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor={`${formId}-message`}
          className="mb-2 block text-sm font-medium text-white/70"
        >
          Feedback <span className="text-[#ffb547]">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          required
          rows={6}
          placeholder="Tell us what worked, what did not, or what you would change."
          className="focus-ring min-h-36 w-full resize-y rounded-[4px] border border-white/15 bg-black/40 px-4 py-3 text-base leading-7 text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#ffb547]"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="cta-primary focus-ring disabled:cursor-not-allowed disabled:opacity-[0.55]"
          disabled={state === "submitting"}
        >
          {state === "submitting" ? "Sending..." : "Send feedback"}
          <ArrowUpRight size={15} strokeWidth={2.4} />
        </button>

        <p
          className="min-h-6 max-w-[340px] text-sm text-white/60"
          aria-live="polite"
        >
          {state === "success" &&
            (ENDPOINT ? (
              <span className="inline-flex items-center gap-2 text-white">
                <Check size={15} strokeWidth={2.4} />
                Thanks, your feedback has been sent.
              </span>
            ) : (
              <span className="inline-flex items-start gap-2 text-white">
                <Check size={15} strokeWidth={2.4} className="mt-0.5 shrink-0" />
                Your email app should have opened with the message ready to
                send.
              </span>
            ))}
          {state === "error" && (
            <span className="text-[#ffb547]">
              Please add your feedback, or email {siteConfig.feedbackEmail}{" "}
              directly.
            </span>
          )}
        </p>
      </div>

      <p className="text-xs leading-5 text-white/40">
        Feedback goes to{" "}
        <a
          href={`mailto:${siteConfig.feedbackEmail}`}
          className="focus-ring text-white/60 underline underline-offset-2"
        >
          {siteConfig.feedbackEmail}
        </a>
        .
      </p>
    </form>
  );
}
