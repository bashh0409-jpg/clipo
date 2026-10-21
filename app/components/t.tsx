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
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#010c84] px-6 pb-10 pt-32 text-center text-white md:px-12 md:pt-40">
      <MouseFollowerImage />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full border border-white/15 md:right-[-8rem] md:top-16 md:h-[38rem] md:w-[38rem]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 top-44 h-48 w-48 rounded-full border border-white/15 md:right-[-3rem] md:top-32 md:h-[26rem] md:w-[26rem]"
      />

      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center text-cente">
        <p className="mb-5 text-xs item-left font-semibold uppercase tracking-tight bbh text-white/70">
          About us
        </p>

        <h1 className="mx-auto max-w-xl text-left text-xl font-bold uppercase bbh leading-[0.98] tracking-tight sm:text-6xl md:text-4xl">
          Good ideas deserve to be seen.
        </h1>

        <section className="mx-auto mt-12 flex w-full max-w-4xl flex-col items-center border-t border-white/25 pt-7 text-center md:mt-16">
          <div className="flex flex-col items-center space-y-4 text-center text-sm leading-relaxed text-white/75 md:text-base">
            <p className="mx-auto max-w-xl text-center text-sm font-bold uppercase leading-tight tracking-tight text-white/90 md:text-xs">
              Veyra group is a collection of companies and products making
              everyday experiences simpler, smarter, and more connected.
            </p>
            <p className="mx-auto max-w-xl text-center text-sm font-bold uppercase leading-tight tracking-tight text-white/90 md:text-xs">
              From moving money across borders to managing a business, filing
              taxes, or investing for the future, each company here solves a
              different kind of real-world challenge.
            </p>
            <p className="mx-auto mb-10 max-w-xl text-center text-sm font-bold uppercase leading-tight tracking-tight text-white/90 md:text-xs">
              Explore the grid to discover the people building these products,
              the industries they work in, and the ideas behind them.
            </p>
          </div>

          <Link
            href="/"
            className="mx-auto max-w-xl bg-[#F5D76A] px-2 py-1 text-center text-xs font-semibold uppercase leading-tight tracking-tight text-[#171717]"
          >
            home
          </Link>
        </section>

        <section className="mx-auto mt-16 flex w-full max-w-4xl flex-col items-center border-t border-white/25 pt-7 text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-wide bbh text-white/70">
            Important information
          </p>

          <h1 className="mx-auto max-w-xl text-center text-xl font-bold uppercase bbh leading-[0.98] tracking-tight sm:text-6xl md:text-4xl">
            About the information on this site
          </h1>
          <div className="mt-6 flex flex-col items-center space-y-4 text-center text-sm leading-relaxed text-white/75 md:text-base">
            <p className="mx-auto max-w-xl text-center text-sm font-bold uppercase leading-tight tracking-tight text-white/90 md:text-xs">
              Veyra Group is an independent company-discovery website. Company
              names and logos belong to their respective owners; their inclusion
              does not imply affiliation, sponsorship, or endorsement.
            </p>
            <p className="mx-auto max-w-xl text-center text-sm font-bold uppercase leading-tight tracking-tight text-white/90 md:text-xs">
              Site content and market information are for general informational
              purposes only. They are not financial, investment, legal, or tax
              advice, and are not a recommendation to buy or sell any asset.
            </p>
            <p className="mx-auto mb-10 max-w-xl text-center text-sm font-bold uppercase leading-tight tracking-tight text-white/90 md:text-xs">
              Market data and company information may be delayed, incomplete, or
              inaccurate. Verify information independently and consult a
              qualified professional before relying on it or making decisions.
            </p>
          </div>
          <Link
            href="/contact"
            className="mx-auto max-w-xl text-center text-sm font-bold uppercase leading-tight tracking-tight text-white/90 underline md:text-sm"
          >
            Contact us about this information
          </Link>
        </section>
      </section>

      <footer className="relative z-10 mx-auto mt-16 flex w-full max-w-7xl flex-col items-center justify-center gap-4 border-t border-white/25 pt-4 text-center text-xs text-white/60 sm:flex-row sm:gap-10">
        <p className="text-center text-sm font-bold uppercase leading-tight tracking-tight text-white/90">
          Companies, products, and ideas.
        </p>
        <p className="text-center text-sm font-bold uppercase leading-tight tracking-tight text-white/90">
          © 2026 Veyra group
        </p>
      </footer>
    </main>
  );
}
