import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | Clipo",
  description: "Get in touch with the Clipo team.",
};

export default function ContactPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#010c84] px-6 pb-10 pt-32 text-white md:px-12 md:pt-40">
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
    </main>
  );
}
