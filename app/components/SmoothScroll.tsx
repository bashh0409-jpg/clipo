"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    const syncScrollMode = () => {
      lenis?.destroy();
      lenis = reducedMotion.matches
        ? null
        : new Lenis({ autoRaf: true, smoothWheel: true });
    };

    syncScrollMode();
    reducedMotion.addEventListener("change", syncScrollMode);

    return () => {
      reducedMotion.removeEventListener("change", syncScrollMode);
      lenis?.destroy();
    };
  }, []);

  return null;
}
