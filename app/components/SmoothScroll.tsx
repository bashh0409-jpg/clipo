"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pageReveal = document.querySelector("[data-page-reveal]");
    let lenis: Lenis | null = null;
    const syncPageRevealScroll = () => {
      if (pageReveal?.getAttribute("aria-busy") === "true") {
        lenis?.stop();
      } else {
        lenis?.start();
      }
    };
    const syncScrollMode = () => {
      lenis?.destroy();
      lenis = reducedMotion.matches
        ? null
        : new Lenis({ autoRaf: true, smoothWheel: true });
      syncPageRevealScroll();
    };

    const revealObserver = new MutationObserver(syncPageRevealScroll);
    if (pageReveal) {
      revealObserver.observe(pageReveal, {
        attributeFilter: ["aria-busy"],
      });
    }

    syncScrollMode();
    reducedMotion.addEventListener("change", syncScrollMode);

    return () => {
      revealObserver.disconnect();
      reducedMotion.removeEventListener("change", syncScrollMode);
      lenis?.destroy();
    };
  }, []);

  return null;
}
