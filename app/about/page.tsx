import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import MouseFollowerImage from "../components/MouseFollowerImage";

export const metadata: Metadata = {
  title: "About | Veyra group",
  description:
    "A closer look at Veyra group and the companies, products, and ideas featured in its portfolio.",
};

const notes = [
  {
    n: 1,
    text: "Veyra Group is an independent company-discovery website. Company names and logos belong to their respective owners; their inclusion does not imply affiliation, sponsorship, or endorsement.",
  },
  {
    n: 2,
    text: "Site content and market information are for general informational purposes only. They are not financial, investment, legal, or tax advice, and are not a recommendation to buy or sell any asset.",
  },
  {
    n: 3,
    text: "Market data and company information may be delayed, incomplete, or inaccurate. Verify information independently and consult a qualified professional before relying on it or making decisions.",
  },
];

function Mark({ n }: { n: number }) {
  return (
    <sup className="ml-1 align-super text-[0.5em] font-bold">
      <a
        href={`#note-${n}`}
        className="text-[#F5D76A] transition-colors hover:text-white"
        aria-label={`See note ${n}`}
      >
        {n}
      </a>
    </sup>
  );
}

export default function AboutPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#010c84] text-white">
      <MouseFollowerImage />
     
      {/* ───────── HERO ───────── */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cover bg-center px-2 md:px-6"
        style={{ backgroundImage: "url('/images/about-bg.jpg')" }}
      >
        {/* Background video (hidden for reduced motion, so the still image shows) */}
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          src="/start/cosmos_512150715.mp4"
          poster="/images/about-bg.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />

        {/* Dark tint so the white wordmark always reads */}
        <div
          aria-hidden="true"
          className="absolute inset-0 to-[#010c84]"
        />

        <div className="relative z-10 flex w-full flex-col items-center text-center">
          {/* Wordmark */}
          <h1 className="flex w-full flex-col items-center justify-center font-black uppercase bbh leading-[0.85] tracking-tighter text-white md:flex-row md:gap-[0.15em]">
            <span className="text-[24vw] md:text-[8vw]">Veyra</span>
            <span className="text-[24vw] md:text-[8vw]">Group</span>
          </h1>

          {/* Mono tagline */}
          <div className="mt-6 flex flex-col hidden items-center font-mono text-xs uppercase leading-snug tracking-wide text-white md:mt-8 md:text-lg">
            <span>About us</span>
            <span>Companies, products, and ideas.</span>
            <span className="text-[#F5D76A]">
              Good ideas deserve to be seen.
            </span>
          </div>

         
        </div>
      </section>
      ;{/* ───────── A / B / C + NOTES ───────── */}
      <section className="relative z-10 border-t border-white/25 px-6 py-20 md:px-12 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 md:grid-cols-12 md:gap-10">
          {/* Footnotes (left) */}
          <aside className="md:col-span-4">
            <p className="mb-6 text-xs font-semibold uppercase tracking-widest bbh text-white/70">
              Important information
            </p>
            <ol className="space-y-8">
              {notes.map((note) => (
                <li
                  key={note.n}
                  id={`note-${note.n}`}
                  className="grid scroll-mt-32 grid-cols-[1.5rem_1fr] gap-3 text-xs font-medium leading-snug text-white/70 target:text-white"
                >
                  <span className="font-bold text-[#F5D76A]">{note.n}</span>
                  <p className="max-w-xs">{note.text}</p>
                </li>
              ))}
            </ol>

            <Link
              href="/contact"
              className="mt-10 inline-block text-sm font-bold uppercase tracking-tight text-white/90 underline decoration-[#F5D76A] decoration-2 underline-offset-4 transition-colors hover:text-[#F5D76A]"
            >
              Contact us about this information
            </Link>
          </aside>

          {/* A / B / C (right) */}
          <div className="md:col-span-7 md:col-start-6">
            <div className="space-y-14">
              <div className="grid grid-cols-[2.5rem_1fr] gap-4 md:grid-cols-[5rem_1fr]">
                <span className="text-2xl font-bold bbh text-[#F5D76A] md:text-3xl">
                  A:
                </span>
                <div>
                  <h2 className="text-2xl font-bold uppercase bbh leading-none tracking-tight md:text-4xl">
                    Who we are
                  </h2>
                  <p className="mt-5 text-lg font-medium leading-tight tracking-tight text-white/90 md:text-2xl">
                    Veyra group is a collection of companies and products
                    <Mark n={1} /> making everyday experiences simpler, smarter,
                    and more connected.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[2.5rem_1fr] gap-4 md:grid-cols-[5rem_1fr]">
                <span className="text-2xl font-bold bbh text-[#F5D76A] md:text-3xl">
                  B:
                </span>
                <div>
                  <h2 className="text-2xl font-bold uppercase bbh leading-none tracking-tight md:text-4xl">
                    What we solve
                  </h2>
                  <p className="mt-5 text-lg font-medium leading-tight tracking-tight text-white/90 md:text-2xl">
                    From moving money across borders to managing a business,
                    filing taxes, or investing for the future
                    <Mark n={2} />, each company here solves a different kind of
                    real-world challenge.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[2.5rem_1fr] gap-4 md:grid-cols-[5rem_1fr]">
                <span className="text-2xl font-bold bbh text-[#F5D76A] md:text-3xl">
                  C:
                </span>
                <div>
                  <h2 className="text-2xl font-bold uppercase bbh leading-none tracking-tight md:text-4xl">
                    How to explore
                  </h2>
                  <p className="mt-5 text-lg font-medium leading-tight tracking-tight text-white/90 md:text-2xl">
                    Explore the grid to discover the people building these
                    products, the industries they work in, and the ideas behind
                    them.
                    <Mark n={3} />
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="group mt-16 flex items-center justify-between border-t border-white/25 pt-5 text-lg font-bold uppercase tracking-tight transition-colors hover:text-[#F5D76A] md:ml-[5rem] md:text-2xl"
            >
              Explore the grid
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-2"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
      {/* ───────── CENTERED STATEMENT ───────── */}
      <section className="relative z-10 flex flex-col items-center border-t border-white/25 px-6 py-24 text-center md:px-12 md:py-32">
        <p className="max-w-3xl text-2xl font-bold uppercase leading-[1.02] tracking-tight md:text-5xl">
          Companies, products, and ideas.
        </p>

        <div className="mt-14 flex flex-col items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/80 md:items-end md:text-sm">
          <span className="md:mr-24">Simpler. Smarter.</span>
          <span>More connected.</span>
        </div>
      </section>
      {/* ───────── CTA ARCH ───────── */}
      <section className="relative z-10 flex flex-col items-center px-6 pt-8 md:px-12">
        <p className="mb-8 text-3xl font-medium tracking-tight md:text-6xl">
          Got a question?
        </p>

        <Link
          href="/contact"
          className="group flex w-full max-w-6xl items-end justify-center rounded-t-full border-x border-t border-white/60 px-6 pb-4 pt-16 transition-colors duration-300 hover:bg-[#F5D76A] hover:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:pt-28"
        >
          <span className="text-center text-6xl font-bold uppercase leading-[0.85] tracking-tighter sm:text-8xl md:text-[10rem] lg:text-[13rem]">
            Let&rsquo;s talk
          </span>
        </Link>
      </section>
      {/* ───────── FOOTER ───────── */}
      <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 border-t border-white/25 px-6 py-6 text-center sm:flex-row md:px-12">
        <Link
          href="/"
          className="text-sm font-bold uppercase tracking-tight text-white/90 transition-colors hover:text-[#F5D76A]"
        >
          ← Home
        </Link>
        <p className="text-sm font-bold uppercase tracking-tight text-white/60">
          © 2026 Veyra group
        </p>
      </footer>
    </main>
  );
}
