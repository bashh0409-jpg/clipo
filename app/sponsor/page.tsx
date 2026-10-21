import type { Metadata } from "next";
import MouseFollowerImage from "../components/MouseFollowerImage";

export const metadata: Metadata = {
  title: "Sponsor | Veyra group",
  description: "More information about sponsoring Veyra is coming soon.",
};

export default function SponsorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#010c84] px-6 text-center text-white">
      
      <p className="text-sm font-bold uppercase tracking-tight text-white/90 md:text-lg">
        More information is coming soon. please wait for the official announcement on our social media platforms.
      </p>
      <MouseFollowerImage />
    </main>
  );
}
