import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Veyra group",
  description: "Get in touch with the Veyra group team.",
};

export default function ContactPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#010c84] px-6 pb-10 pt-32 text-white md:px-12 md:pt-40"></main>
  );
}
