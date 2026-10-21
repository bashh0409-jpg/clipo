import type { Metadata } from "next";
import Link from "next/link";
import MouseFollowerImage from "../components/MouseFollowerImage";

export const metadata: Metadata = {
  title: "Sponsor | Veyra group",
  description:
    "Explore sponsorship opportunities with Veyra group and reach people discovering companies, products, and ideas.",
};

export default function SponsorPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#010c84] px-6 py-32 text-center text-white">
      <MouseFollowerImage />

      <section className="relative z-10 mx-auto max-w-3xl">
        <p className="mb-5 text-xs font-semibold uppercase tracking-tigh bbh text-white/70">
          Partner with Veyra
        </p>
       
        <h1 className="text-xl font-bold uppercase  bbh leading-[0.98] tracking-tight sm:text-6xl md:text-4xl">
          Put your brand in the discovery.
        </h1>

        <p className="mx-auto mt-7 max-w-sm text-sm tracking-tight leading-4 text-white font-medium">
          Veyra introduces people to companies, products, and ideas. We’re open
          to relevant sponsorship partnerships. Sponsored placements will be
          clearly identified and are not independent endorsements. Get in touch
          to discuss options and availability.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex uppercase items-center bg-[#F5D76A] px-2 py-1 text-xs font-semibold text-[#171717] "
        >
          Contact us
        </Link>
      </section>
    </main>
  );
}
