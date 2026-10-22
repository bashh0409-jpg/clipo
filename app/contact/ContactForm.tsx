"use client";

import { useState, type FormEvent } from "react";

type SubmissionState = "idle" | "submitting" | "sent" | "error";

export default function ContactForm() {
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionState("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });
      const result: { error?: string } = await response.json();

      if (!response.ok) {
        setErrorMessage(result.error ?? "Your message could not be sent.");
        setSubmissionState("error");
        return;
      }

      form.reset();
      setSubmissionState("sent");
    } catch {
      setErrorMessage(
        "We couldn't reach the server. Please try again in a moment.",
      );
      setSubmissionState("error");
    }
  }
  

  const fieldClassName =
    "w-full rounded border border-white/[0.08] bg-[#fcfcfc] px-3 py-2 text-sm font-medium tracking-tight text-black outline-none transition-colors placeholder:text-black/55 focus:border-white/30 ";

  return (
    <form
      className="mt-10 w-full max-w-[400px] space-y-2"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="contact-name" className="sr-only">
          Full name
        </label>
        <input
          autoComplete="name"
          className={fieldClassName}
          id="contact-name"
          maxLength={100}
          name="name"
          disabled={submissionState === "submitting"}
          placeholder="Full name"
          required
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="sr-only">
          Email address
        </label>
        <input
          autoComplete="email"
          className={fieldClassName}
          id="contact-email"
          maxLength={254}
          name="email"
          disabled={submissionState === "submitting"}
          placeholder="Email address"
          required
          type="email"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">
          How can we help?
        </label>
        <textarea
          className={`${fieldClassName} min-h-32 max-h-60 resize-y`}
          id="contact-message"
          maxLength={5000}
          name="message"
          disabled={submissionState === "submitting"}
          placeholder="How can we help?"
          required
          rows={4}
        />
      </div>

      <button
        className="inline-flex w-full items-center bbh tracking-tight justify-center rounded-md bg-[#ded8cb] px-4 py-2 text-xs font-semibold text-[#191817] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait disabled:opacity-60"
        disabled={submissionState === "submitting"}
        type="submit"
      >
        {submissionState === "submitting" ? "Sending..." : "Send message"}
      </button>

      <p
        aria-live="polite"
        className={`min-h-5 pt-1 text-sm leading-tight tracking-tight font-medium ${
          submissionState === "error"
            ? "text-red-200"
            : submissionState === "sent"
              ? "text-[#ded8cb]"
              : "text-white/70"
        }`}
        role={submissionState === "error" ? "alert" : "status"}
      >
        {submissionState === "sent" &&
          "Thanks for reaching out. Your message is on its way."}
        {submissionState === "error" && errorMessage}
      </p>
    </form>
  );
}
