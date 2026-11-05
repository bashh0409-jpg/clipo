"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { playUiSound } from "@/lib/ui-sounds";

const Logo = () => {
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(
    () => () => {
      if (labelRef.current) gsap.killTweensOf(labelRef.current);
    },
    [],
  );

  const animateLabel = (visible: boolean) => {
    const label = labelRef.current;
    if (!label) return;

    gsap.killTweensOf(label);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(label, { yPercent: 0 });
      return;
    }

    gsap.to(label, {
      yPercent: visible ? -50 : 0,
      duration: visible ? 0.38 : 0.24,
      ease: visible ? "power3.out" : "power2.inOut",
      overwrite: true,
    });
  };

  return (
    <Link
      href="/"
      aria-label="Veyra group home"
      onClick={() => playUiSound("/homelink.ogg")}
      onPointerEnter={() => animateLabel(true)}
      onPointerLeave={(event) => {
        if (!event.currentTarget.matches(":focus-visible")) {
          animateLabel(false);
        }
      }}
      onFocus={() => animateLabel(true)}
      onBlur={(event) => {
        if (!event.currentTarget.matches(":hover")) animateLabel(false);
      }}
      className="fixed left-4 top-4 z-[150] flex shrink-0 items-center text-xs font-semibold uppercase tracking-tighter text-[#fff] bbh"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="currentColor"
      >
        <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z" />
      </svg>
      <span className="h-[1em] overflow-hidden leading-none">
        <span ref={labelRef} className="flex flex-col">
          <span className="h-[1em] shrink-0">Veyra</span>
          <span aria-hidden="true" className="h-[1em] shrink-0">
            Veyra
          </span>
        </span>
      </span>
    </Link>
  );
};

export default Logo;
