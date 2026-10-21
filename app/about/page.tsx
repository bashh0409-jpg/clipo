import type { Metadata } from "next";
import Link from "next/link";
import MouseFollowerImage from "../components/MouseFollowerImage";

export const metadata: Metadata = {
  title: "About | Veyra group",
  description:
    "A closer look at Veyra group and the companies, products, and ideas featured in its portfolio.",
};

export default function AboutPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#010c84] px-6 pb-10 pt-32 text-white md:px-12 md:pt-40">
      <MouseFollowerImage />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full border border-white/15 md:right-[-8rem] md:top-16 md:h-[38rem] md:w-[38rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-44 h-48 w-48 rounded-full border border-white/15 md:right-[-3rem] md:top-32 md:h-[26rem] md:w-[26rem]"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center">
        <p className="mb-5 text-xs font-semibold uppercase tracking-tigh bbh text-white/70">
          About us
        </p>

        <h1 className="text-xl max-w-xl font-bold uppercase  bbh leading-[0.98] tracking-tight sm:text-6xl md:text-4xl">
          Good ideas deserve to be seen.
        </h1>

        <div className="mt-12 grid gap-10 border-t border-white/25 pt-7 md:mt-16 md:grid-cols-2 md:gap-16">
          <p className="max-w-xl text-lg leading-tight tracking-tighter font-bold uppercase text-white/90 md:text-2xl">
            Veyra group is a collection of companies and products making
            everyday experiences simpler, smarter, and more connected.
          </p>
          

          <div className="max-w-xl space-y-5 text-sm leading-relaxed text-white/75 md:text-base">
            <p className="max-w-xl text-lg leading-tight tracking-tighter font-bold uppercase text-white/90 md:text-2xl">
              From moving money across borders to managing a business, filing
              taxes, or investing for the future, each company here solves a
              different kind of real-world challenge.
            </p>
            <p className="max-w-xl text-lg leading-tight tracking-tighter font-bold uppercase text-white/90 md:text-2xl">
              Explore the grid to discover the people building these products,
              the industries they work in, and the ideas behind them.
            </p>

            <Link
              href="/"
              className="mt-3 inline-flex items-center gap-3 bg-[#F5D76A] px-5 py-3 text-sm font-semibold text-[#171717] transition-transform hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <p className="max-w-xl text-xl leading-tight tracking-tight font-bold uppercase md:text-2xl">
                home
              </p>
            </Link>
          </div>
        </div>

        <section className="mt-16 max-w-4xl border-t border-white/25 pt-7">
         

          <p className="mb-5 text-xs font-semibold uppercase tracking-wide bbh text-white/70">
            Important information
          </p>

          <h1 className="text-xl max-w-xl font-bold uppercase  bbh leading-[0.98] tracking-tight sm:text-6xl md:text-4xl">
            About the information on this site
          </h1>
          <div className="mt-6 space-y-4 text-sm leading-relaxe text-white/75 md:text-base">
            <p className="max-w-xl text-justify text-sm leading-tight tracking-tight font-bold uppercase text-white/90 md:text-xs">
              Veyra Group is an independent company-discovery website. Company
              names and logos belong to their respective owners; their inclusion
              does not imply affiliation, sponsorship, or endorsement.
            </p>
            <p className="max-w-xl text-justify text-sm leading-tight tracking-tight font-bold uppercase text-white/90 md:text-xs">
              Site content and market information are for general informational
              purposes only. They are not financial, investment, legal, or tax
              advice, and are not a recommendation to buy or sell any asset.
            </p>
            <p className="max-w-xl mb-10 text-justify text-sm leading-tight tracking-tight font-bold uppercase text-white/90 md:text-xs">
              Market data and company information may be delayed, incomplete, or
              inaccurate. Verify information independently and consult a
              qualified professional before relying on it or making decisions.
            </p>
          </div>
          <Link
            href="/contact"
            className="max-w-xl  text-justify underline text-sm leading-tight tracking-tight font-bold uppercase text-white/90 md:text-sm"
          >
            Contact us about this information
          </Link>
        </section>
      </section>

      <footer className="relative z-10 mx-auto mt-16 flex w-full max-w-7xl flex-wrap justify-between gap-4 border-t border-white/25 pt-4 text-xs text-white/60">
        <p className="max-w-xl text-justify text-sm leading-tight tracking-tight font-bold uppercase text-white/90 md:text-sm">
          Companies, products, and ideas.
        </p>
        <p className="max-w-xl text-justify text-sm leading-tight tracking-tight font-bold uppercase text-white/90 md:text-sm">
          © 2026 Veyra group
        </p>
      </footer>
    </main>
  );
}
