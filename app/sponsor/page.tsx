import type { Metadata } from "next";
import { CONTACT_HREF } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Sponsor | Veyra group",
  description:
    "Explore sponsorship opportunities with Veyra group and reach people discovering companies, products, and ideas.",
};

export default function SponsorPage() {
  return (
    <main className="relative min-h-screen w-full text-white">
      <div aria-hidden="true" className="fixed inset-0 z-0" />
      <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-20">
        <div className="relative z-10 flex w-full flex-col items-center text-center">
          <h1 className="bbh flex w-full flex-col items-center justify-center font-black uppercase leading-[0.85] tracking-tighter text-white md:flex-row md:gap-[0.15em]">
            <span className="text-[24vw] md:text-[8vw]">Veyra</span>
            <span className="text-[24vw] md:text-[8vw]">Group</span>
          </h1>

          <div className="relative z-10 mx-auto mt-8 w-full max-w-3xl">
            <p className="bbh mb-5 text-xs font-semibold uppercase tracking-tight text-white/70">
              Partner with Veyra
            </p>

            <h2 className="bbh text-xl font-bold uppercase leading-[0.98] tracking-tight sm:text-4xl md:text-5xl">
              Put your brand in the discovery.
            </h2>

            <p className="mx-auto mt-7 mb-8 max-w-sm text-sm font-medium leading-5 tracking-tight text-white">
              Veyra introduces people to companies, products, and ideas. We’re
              open to relevant sponsorship partnerships. Sponsored placements
              will be clearly identified and are not independent endorsements.
              Get in touch to discuss options and availability.
            </p>

            <a
              href={CONTACT_HREF}
              className="pointer-events-auto uppercase font-mono mt-8 z-30  rounded bg-black px-2 tracking-tight  py-1 text-xs font-medium text-white shadow-lg backdrop-blur-sm"
            >
              Contact us
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
