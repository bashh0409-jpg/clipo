"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Work", href: "/work" },
  { label: "Contact", href: "/contact" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={isOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="fixe hidden right-4 top-4 z-[160] flex h-6 w-7 shrink-0 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xs bg-[#F5D76A] text-xs font-semibold uppercase tracking-tighter text-white"
      >
        <span
          className={`h-[2px] w-5 bg-black transition-transform duration-300 ${
            isOpen ? "translate-y-[3.5px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-[2px] w-5 bg-black transition-transform duration-300 ${
            isOpen ? "-translate-y-[3.5px] -rotate-45" : ""
          }`}
        />
      </button>

      {/* Backdrop closes the menu without requiring another navigation click. */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[140] bg-black/40 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      <aside
        id="site-sidebar"
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-[150] flex  justify-center h-dvh w-full max-w-sm flex-col bg-white p-8 pt-24 text-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 sm:pt-28 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        

        <nav className="flex flex-col " aria-label="Main menu">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsOpen(false)}
              className="group flex items-center justify-between  transition-opacity hover:opacity-60"
            >
              <span className="text-2xl font-bol bbh tracking-tighter uppercase sm:text-3xl">
                {item.label}
              </span>
              
            </Link>
          ))}
        </nav>

       
      </aside>
    </>
  );
}
