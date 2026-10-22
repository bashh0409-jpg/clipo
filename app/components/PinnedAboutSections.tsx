"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type AboutSection = {
  id: string;
  title: string;
  body: string;
  note: number;
};

export default function PinnedAboutSections({
  sections,
}: {
  sections: AboutSection[];
}) {
  const trackRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const activeSection = sections[activeIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);

    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const nextIndex = Math.min(
          sections.length - 1,
          Math.floor(self.progress * sections.length),
        );
        setActiveIndex((index) => (index === nextIndex ? index : nextIndex));
      },
    });

    return () => trigger.kill();
  }, [reducedMotion, sections.length]);

  useEffect(() => {
    if (reducedMotion || !contentRef.current) return;

    const tween = gsap.fromTo(
      contentRef.current,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
    );
    return () => {
      tween.kill();
    };
  }, [activeIndex, reducedMotion]);

  return (
    <>
      <section
        id="about"
        ref={trackRef}
        className="relative z-10 w-full"
        style={{
          height: reducedMotion ? "auto" : `${sections.length * 100}svh`,
        }}
        aria-label="About Veyra"
      >
        <div className="sticky top-0 flex h-screen min-h-[100svh] w-full items-center justify-center px-6 py-16 text-center">
          <div className="w-full max-w-3xl">
            {reducedMotion ? (
              sections.map((section, index) => (
                <article
                  key={section.id}
                  aria-labelledby={`h-${section.id}`}
                  className={`py-10 md:py-12 ${index > 0 ? "border-t border-white/25" : ""}`}
                >
                  <h2
                    id={`h-${section.id}`}
                    className="bbh text-xl font-bold uppercase leading-[0.98] tracking-tight sm:text-4xl md:text-5xl"
                  >
                    {section.title}
                  </h2>
                  <p className="mx-auto mt-6 max-w-md text-base font-medium leading-6 tracking-tight text-white/90">
                    {section.body}
                    <Mark n={section.note} />
                  </p>
                </article>
              ))
            ) : (
              <div ref={contentRef}>
                <p className="bbh mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                  About Veyra
                </p>
                <p className="bbh mb-5 text-sm font-semibold text-[#F5D76A]">
                  0{activeIndex + 1} <span className="text-white/40">/</span>{" "}
                  0{sections.length}
                </p>
                <h2
                  id={`h-${activeSection.id}`}
                  className="bbh text-3xl font-bold uppercase leading-[0.98] tracking-tight sm:text-5xl md:text-7xl"
                >
                  {activeSection.title}
                </h2>
                <p className="mx-auto mt-7 max-w-md text-base font-medium leading-6 tracking-tight text-white/90 md:text-lg">
                  {activeSection.body}
                  <Mark n={activeSection.note} />
                </p>
                <div
                  className="mx-auto mt-10 flex w-32 gap-2"
                  aria-hidden="true"
                >
                  {sections.map((section, index) => (
                    <span
                      key={section.id}
                      className={`h-0.5 flex-1 transition-colors duration-300 ${
                        index <= activeIndex
                          ? "bg-[#F5D76A]"
                          : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>
                <p className="sr-only" aria-live="polite" aria-atomic="true">
                  {activeSection.title}. {activeSection.body}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="relative z-10 flex justify-center px-6 pb-20 text-center">
        <Link
          href="/"
          className="inline-flex items-center bg-[#F5D76A] px-4 py-2 text-xs font-semibold uppercase text-[#171717] transition-all duration-300 hover:rounded-full hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Explore the grid
        </Link>
      </div>
    </>
  );
}

function Mark({ n }: { n: number }) {
  return (
    <sup className="ml-0.5 text-[0.55em] font-bold">
      <a
        href={`#note-${n}`}
        className="rounded-sm px-0.5 text-[#F5D76A] transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        aria-label={`See note ${n}`}
      >
        {n}
      </a>
    </sup>
  );
}
