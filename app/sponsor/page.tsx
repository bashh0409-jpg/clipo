import type { Metadata } from "next";
import { CONTACT_HREF } from "@/lib/contact";
import SponsorSplitText from "../components/SponsorSplitText";

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
        <SponsorSplitText>
        <div className="relative z-10 flex w-full flex-col items-center text-center">
          <h1 className="bbh flex w-full flex-col items-center justify-center font-black uppercase leading-[0.85] tracking-tighter text-white md:flex-row md:gap-[0.15em]">
            <span className="text-[24vw] md:text-[8vw]">Veyra</span>
            <span className="text-[24vw] md:text-[8vw]">Group</span>
          </h1>

          <div className="relative z-10 mx-auto mt-8 w-full max-w-3xl">
            <p className="bbh mb-5 text-xs font-semibold uppercase tracking-tight text-white/70">
              Partner with Veyra
            </p>

            <h2 data-split-text className="bbh text-xl font-bold uppercase leading-[0.98] tracking-tight sm:text-4xl md:text-5xl">
              Put your brand in the discovery.
            </h2>

            <p data-split-text className="mx-auto mt-7 mb-8 max-w-md text-sm font-semibold leading-tight tracking-tight text-white">
              Veyra introduces people to companies, products, and ideas. We’re
              open to relevant sponsorship partnerships. Sponsored placements
              will be clearly identified and are not independent endorsements.
              Get in touch to discuss options and availability.
            </p>

            <a
              href={CONTACT_HREF}
              className="pointer-events-auto uppercase font-mono mt-8 z-30  rounded bg-white px-2 tracking-tight  py-1 text-xs font-medium text-black shadow-lg backdrop-blur-sm"
            >
              Contact us
            </a>
          </div>

          <div className="mx-auto mt-14 w-full max-w-xl border-t border-white/20 pt-10">
            <p className="bbh mb-4 text-xs font-semibold uppercase tracking-tight text-white/70">
              Support the project
            </p>
            <h2 data-split-text className="bbh text-xl font-bold uppercase leading-[0.98] tracking-tight sm:text-3xl">
              Help Veyra grow.
            </h2>
            <p data-split-text className="mx-auto mt-7 mb-8 max-w-md text-sm font-semibold leading-tight tracking-tight text-white">
              If you find this independent company-discovery project useful, you
              can support its development and running costs through our
              BackaBuddy campaign. Contributions are handled by BackaBuddy.
            </p>
            <a
              href="https://www.backabuddy.co.za/campaign/support-veyra-group-grow"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto uppercase font-mono mt-8 z-30  rounded bg-white px-2 tracking-tight  py-1 text-xs font-medium text-black shadow-lg backdrop-blur-sm"
            >
              Support Veyra on BackaBuddy
            </a>
          </div>
        </div>
        </SponsorSplitText>
      </section>
    </main>
  );
}
