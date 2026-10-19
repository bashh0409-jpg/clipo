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
    "w-full border-b border-white bg-transparent px-0 py-3 text-base ttext-sm font-bold  tracking-tight text-white/90 md:text-lg outline-none transition-colors placeholder:text-white/45 focus:border-[#F5D76A]";

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="contact-name"
          className="mb-2 block text-xs font-bold uppercase tracking-wide text-white/75"
        >
          <p className=" text-sm font-bold uppercase tracking-tight text-white/90 md:text-lg">
            your name
          </p>
        </label>
        <input
          autoComplete="name"
          className={fieldClassName}
          id="contact-name"
          maxLength={100}
          name="name"
          placeholder="Jane Smith"
          required
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-2 block text-xs font-bold uppercase tracking-wide text-white/75"
        >
          <p className=" text-sm font-bold uppercase tracking-tight text-white/90 md:text-lg">
            your email
          </p>
        </label>
        <input
          autoComplete="email"
          className={fieldClassName}
          id="contact-email"
          maxLength={254}
          name="email"
          placeholder="jane@example.com"
          required
          type="email"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-xs font-bold uppercase tracking-wide text-white/75"
        >
          <p className=" text-sm font-bold uppercase tracking-tight text-white/90 md:text-lg">
            How can we help you?
          </p>
        </label>
        <textarea
          className={`${fieldClassName} min-h-32 resize-y`}
          id="contact-message"
          maxLength={5000}
          name="message"
          placeholder="Tell us a little about what you have in mind..."
          required
          rows={4}
        />
      </div>

      <button
        className="inline-flex items-center gap-3 bg-[#F5D76A] px-4 cursor-pointer py-2 text-sm font-bold uppercase tracking-wide text-[#171717] transition-transform focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait disabled:opacity-60"
        disabled={submissionState === "submitting"}
        type="submit"
      >
        <p className=" text-sm font-bold uppercase tracking-tight md:text-lg">
          {submissionState === "submitting" ? "Sending..." : "Send message"}
        </p>
      </button>

      <p className=" text-sm font-bold uppercase tracking-tight text-white/90 md:text-sm">
        {submissionState === "sent" &&
          "Thanks for reaching out. Your message is on its way."}
        {submissionState === "error" && errorMessage}
      </p>
     
    </form>
  );
}
