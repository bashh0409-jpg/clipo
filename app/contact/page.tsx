import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import SequentialVideoBackground from "../components/SequentialVideoBackground";

export const metadata: Metadata = {
  title: "Contact | Veyra group",
  description: "Get in touch with the Veyra group team.",
};

export default function ContactPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center bg-[#191817] px-5 pb-10 pt-10 text-white sm:px-6 sm:pt-12">
      <SequentialVideoBackground />
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 bg-black/55"
      />

      <section className="relative z-10 my-auto flex w-full flex-col items-center py-16">
        <p className="bbh text-xl font-bold tracking-tight text-[#d7d2c8] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          Get in touch
        </p>
        <ContactForm />
      </section>

      <footer className="relative z-10 w-full text-center text-xs text-white/60">
        © 2026 Veyra group
      </footer>
    </main>
  );
}
