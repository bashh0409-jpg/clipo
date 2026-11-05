"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default function SponsorSplitText({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (
      !root ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const splits = Array.from(
      root.querySelectorAll<HTMLElement>("[data-split-text]"),
      (element) =>
        SplitText.create(element, {
          type: "words",
          mask: "words",
        }),
    );
    const words = splits.flatMap((split) => split.words);
    const animation = gsap.fromTo(
      words,
      {
        yPercent: 75,
        autoAlpha: 0,
        filter: "blur(6px)",
      },
      {
        yPercent: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 0.55,
        stagger: 0.035,
        ease: "power3.out",
        delay: 0.1,
        onComplete: () =>
          gsap.set(words, {
            clearProps: "filter,transform,opacity,visibility",
          }),
      },
    );

    return () => {
      animation.kill();
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}
