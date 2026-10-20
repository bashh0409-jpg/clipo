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
        <p className="max-w-xl text-md leading-tight tracking-tight font-bold uppercase text-white/90 md:text-md ">
          About us
        </p>
        <h1 className="max-w-5xl text-5xl font-medium leading-[0.98] tracking-[-0.06em] sm:text-6xl md:text-8xl">
          Good ideas deserve to be seen.
        </h1>

        <div className="mt-12 grid gap-10 border-t border-white/25 pt-7 md:mt-16 md:grid-cols-2 md:gap-16">
          <p className="max-w-xl text-xl leading-tight tracking-tight font-bold uppercase text-white/90 md:text-2xl">
            Veyra group is a collection of companies and products making
            everyday experiences simpler, smarter, and more connected.
          </p>
          <div className="max-w-xl space-y-5 text-sm leading-relaxed text-white/75 md:text-base">
            <p className="max-w-xl text-xl leading-tight tracking-tight font-bold uppercase text-white/90 md:text-2xl">
              From moving money across borders to managing a business, filing
              taxes, or investing for the future, each company here solves a
              different kind of real-world challenge.
            </p>
            <p className="max-w-xl text-xl leading-tight tracking-tight font-bold uppercase text-white/90 md:text-2xl">
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
      </section>

      <footer className="relative z-10 flex-co mx-auto mt-16 flex w-full max-w-7xl justify-between border-t border-white/25 pt-4 text-xs text-white/60">
        <p className="max-w-xl text-lg leading-tight tracking-tight font-bold uppercase text-white/90 md:text-lg">
          Companies, products, and ideas.
        </p>
        <p className="max-w-xl text-lg leading-tight tracking-tight font-bold uppercase text-white/90 md:text-lg">
          2026 Veyra group All rights reserved.
        </p>
      </footer>
    </main>
  );
}
