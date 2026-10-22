import type { Metadata } from "next";
import MouseFollowerImage from "../components/MouseFollowerImage";
import PinnedAboutSections from "../components/PinnedAboutSections";
import { CONTACT_HREF } from "@/lib/contact";

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

const sections = [
  {
    id: "who",
    title: "Who we are",
    body: "Veyra Group is a collection of companies and products that make everyday experiences simpler, smarter, and more connected.",
    note: 1,
  },
  {
    id: "solve",
    title: "What we solve",
    body: "From moving money across borders to running a business, filing taxes, or investing for the future, each company here tackles a different real-world problem.",
    note: 2,
  },
  {
    id: "explore",
    title: "How to explore",
    body: "Browse the grid to meet the people building these products, the industries they work in, and the ideas behind them.",
    note: 3,
  },
];

export default function AboutPage() {
  return (
    <main className="relative flex min-h-screen flex-col text-white">
      {/* Dark scrim keeps body text readable over the video */}
      <div aria-hidden="true" className="fixed inset-0 z-0 " />
      <MouseFollowerImage />

      {/* ───────── HERO ───────── */}
      <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="bbh flex w-full flex-col items-center justify-center font-black uppercase leading-[0.85] tracking-tighter md:flex-row md:gap-[0.15em]">
          <span className="text-[24vw] md:text-[8vw]">Veyra</span>
          <span className="text-[24vw] md:text-[8vw]">Group</span>
        </h1>

        <div className="mx-auto mt-8 w-full max-w-3xl">
          <p className="bbh mb-5 text-xs font-semibold uppercase tracking-tight text-white/70">
            About us
          </p>
          <h2 className="bbh text-xl font-bold uppercase leading-[0.98] tracking-tight sm:text-4xl md:text-5xl">
            Companies, products, and ideas.
          </h2>
          <p className="mx-auto mt-7 max-w-sm text-sm font-medium leading-5 tracking-tight text-white/90">
            Good ideas deserve to be seen. Veyra helps you discover the
            companies and products behind them.
          </p>
          <a
            href="#about"
            className="mt-6 inline-flex items-center bg-[#F5D76A] px-4 py-2 text-xs font-semibold uppercase text-[#171717] transition-all duration-300 hover:rounded-full hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Read more
          </a>
        </div>
      </section>

      {/* ───────── ABOUT CONTENT ───────── */}
      <PinnedAboutSections sections={sections} />

      <section className="relative z-10 flex w-full flex-col items-center px-6 pb-24 text-center">
        {/* Notes */}
        <aside
          aria-labelledby="notes-heading"
          className="mx-auto mt-24 w-full max-w-2xl pt-10"
        >
          <h2
            id="notes-heading"
            className="bbh mb-6 text-xs font-semibold uppercase tracking-tight text-white/70"
          >
            Important information
          </h2>
          <ol className="space-y-5">
            {notes.map((note) => (
              <li
                key={note.n}
                id={`note-${note.n}`}
                className="scroll-mt-28 text-xs leading-relaxed text-white/70 target:text-white"
              >
                <span className="mr-2 font-bold text-[#F5D76A]">{note.n}</span>
                {note.text}
              </li>
            ))}
          </ol>
          <a
            href={CONTACT_HREF}
            className="mt-8 inline-block bbh text-xs font-bold text-white/90 underline decoration-[#F5D76A] decoration-2 underline-offset-4 transition-colors hover:text-[#F5D76A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Contact us
          </a>
        </aside>
      </section>

      {/* ───────── CENTERED STATEMENT ───────── */}
      <section className="relative z-10 flex flex-col items-center  px-6 py-24 text-center md:px-12 md:py-32">
        <p className="bbh max-w-3xl text-3xl font-bold leading-[1.05] tracking-tight md:text-6xl">
          Companies, products, and ideas.
        </p>

        <p className="bbh mb-5 text-xs mt-10 font-semibold uppercase tracking-tight text-white/70">
          Simpler. Smarter. More connected.
        </p>
      </section>

    </main>
  );
}
