import type { Metadata } from "next";
import ContactForm from "./ContactForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | Clipo",
  description: "Get in touch with the Clipo team.",
};

export default function ContactPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#010c84] px-6 pb-10 pt-32 text-white md:px-12 md:pt-40">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full border border-white/15 md:right-[-8rem] md:top-16 md:h-[38rem] md:w-[38rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-44 h-48 w-48 rounded-full border border-white/15 md:right-[-3rem] md:top-32 md:h-[26rem] md:w-[26rem]"
      />
      <section className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 content-center gap-12 md:grid-cols-2 md:gap-20">
        <div>
          <p className="mb-5 text-sm font-bold uppercase tracking-wide text-white/75">
            Contact
          </p>
          <h1 className="max-w-2xl text-5xl font-medium leading-[0.98] tracking-[-0.06em] sm:text-6xl md:text-8xl">
            Let&apos;s make something happen.
          </h1>
          <p className=" text-lg leading-relaxed text-white/75"></p>
          <p className="mt-8 max-w-md leading-tight text-sm font-bold uppercase tracking-tight text-white/90 md:text-lg">
            Have a question, an idea, or just want to say hello? Send us a
            message and we&apos;ll get back to you.
          </p>
        </div>
         <Link
          href="/"
          aria-label="Clipo home"
          className="block left-4 top-4 fixed z-1000 absolute shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://clipo.one/uploads/loading/see.svg?v=20260901-3"
            alt="Clipo"
            className="h-[56px] rotate-[15deg] w-auto"
          />
        </Link>
        <div className="pt-7 md:mt-14">
          <ContactForm />
        </div>
      </section>
      <footer className="relative z-10 mx-auto mt-16 flex w-full max-w-7xl justify-between gap-4 border-t border-white/25 pt-4 text-xs text-white/60">
        <p className="text-sm font-bold uppercase tracking-tight text-white/90 md:text-lg">
          Companies, products, and ideas.
        </p>
        <p className="text-right text-sm font-bold uppercase tracking-tight text-white/90 md:text-lg">
          2026 Clipo All rights reserved.
        </p>
      </footer>
    </main>
  );
}
