"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Navbar() {
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const rect = logo.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (event.clientX - centerX) / (window.innerWidth / 2);
      const y = (event.clientY - centerY) / (window.innerHeight / 2);

      gsap.to(logo, {
        x: x * 12,
        y: y * 8,
        rotationY: x * 18,
        rotationX: -y * 14,
        rotation: x * 5,
        transformPerspective: 500,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleLeave = () => {
      gsap.to(logo, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        rotation: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("pointermove", handleMove);
    document.documentElement.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      gsap.killTweensOf(logo);
    };
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className="absolute fixed inset-x-0 top-0 z-[100] flex items-center justify-between p-5 text-white md:p-7"
    >
      <Link href="/" aria-label="Clipo home" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={logoRef}
          src="https://clipo.one/uploads/loading/see.svg?v=20260901-3"
          alt="Clipo"
          className="h-[30px] w-auto"
        />
      </Link>

      <div className="flex items-center  gap-6 text-xs font-bold uppercase tracking-wide md:gap-8">
        <Link
          href="/"
          className="text-lg font-bold uppercase tracking-tight text-white/90 transition-opacity hover:opacity-60 md:text-lg"
        >
          Work
        </Link>

        <Link
          href="/about"
          className="text-lg font-bold uppercase tracking-tight text-white/90 transition-opacity hover:opacity-60 md:text-lg"
        >
          About
        </Link>
      </div>
    </nav>
  );
}
