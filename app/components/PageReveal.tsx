"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const INTRO_IMAGES = [
  "/start/cosmos_1271383869.webp",
  "/start/cosmos_1312131681.webp",
  "/start/cosmos_2028908772.webp",
  "/start/cosmos_1566198137.webp",
  "/start/cosmos_1871981957.webp",
  "/start/cosmos_499248863.webp",
  "/start/cosmos_1321191480.webp",

  "/start/cosmos_189048023.webp",
  "/start/cosmos_2024599819.webp",
  "/start/cosmos_1980853716.webp",
] as const;

// inset(top right bottom left): shrinking the top inset reveals upward from the bottom.
const PAGE_HIDDEN = "inset(100% 0% 0% 0%)";
const PAGE_VISIBLE = "inset(0% 0% 0% 0%)";

export default function PageReveal({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const page = root.querySelector<HTMLElement>("[data-page-content]");
    const curtain = root.querySelector<HTMLElement>("[data-page-curtain]");
    const progress = root.querySelector<HTMLElement>("[data-intro-progress]");
    const edge = root.querySelector<HTMLElement>("[data-reveal-edge]");
    if (!page || !curtain || !progress || !edge) return;

    // Reduced motion: skip the intro entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(page, { clipPath: "none" });
      gsap.set([curtain, edge], { autoAlpha: 0 });
      root.removeAttribute("aria-busy");
      return;
    }

    // Prevent scrolling while the intro plays.
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    let resourcesReady = false;
    let handleWindowLoad: (() => void) | undefined;
    const windowLoaded =
      document.readyState === "complete"
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            handleWindowLoad = () => resolve();
            window.addEventListener("load", handleWindowLoad, { once: true });
          });
    const pageImagesLoaded = Promise.all(
      Array.from(document.images, (image) =>
        image.decode().catch(() => undefined),
      ),
    );
    void Promise.all([windowLoaded, document.fonts.ready, pageImagesLoaded]).then(
      () => {
        resourcesReady = true;
      },
    );

    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray<HTMLElement>("[data-intro-image]");
      let activeTimeline: gsap.core.Timeline | null = null;

      gsap.set(page, { clipPath: PAGE_HIDDEN });
      gsap.set(images, {
        autoAlpha: 0,
        clipPath: "inset(50%)",
      });
      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(edge, { autoAlpha: 0, y: 0 });

      const completeReveal = () => {
        activeTimeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            gsap.set(page, { clearProps: "clipPath,zIndex,position" });
            gsap.set([curtain, edge], { autoAlpha: 0 });
            html.style.overflow = previousOverflow;
            root.removeAttribute("aria-busy");
          },
        });

        activeTimeline
          .set(page, { zIndex: 201 }, 0)
          .set(edge, { autoAlpha: 1, y: 0 }, 0)
          .to(progress, { autoAlpha: 0, duration: 0.3 }, 0)
          .to(
            page,
            { clipPath: PAGE_VISIBLE, duration: 1.5, ease: "expo.inOut" },
            0,
          )
          .to(edge, { y: "-100vh", duration: 1.1, ease: "expo.inOut" }, 0)
          .to(edge, { autoAlpha: 0, duration: 0.8 }, "-=0.1");
      };

      const playImageSequence = () => {
        activeTimeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: () => {
            if (resourcesReady) {
              completeReveal();
              return;
            }

            gsap.set(images, {
              autoAlpha: 0,
              clipPath: "inset(50%)",
            });
            playImageSequence();
          },
        });

        // Each new square opens over the previous image, which remains underneath.
        images.forEach((image, i) => {
          activeTimeline?.to(
            image,
            {
              autoAlpha: 1,
              clipPath: "inset(0%)",
              duration: 0.55,
              ease: "power2.out",
            },
            i === 0 ? 0.1 : ">-0.12",
          );
        });

        activeTimeline.play();
      };

      playImageSequence();

      return () => activeTimeline?.kill();
    }, root);

    return () => {
      ctx.revert();
      html.style.overflow = previousOverflow;
      if (handleWindowLoad) {
        window.removeEventListener("load", handleWindowLoad);
      }
    };
  }, []);

  return (
    <div ref={rootRef} aria-busy="true">
      <div
        data-page-content
        className="relative z-[100]"
        style={{ clipPath: PAGE_HIDDEN }}
      >
        {children}
      </div>

      {/* Leading edge of the reveal (starts at the bottom, rises to the top) */}
      <div
        data-reveal-edge
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-x-0 bottom-0 z-[202] h-px  will-change-transform"
      />

      <div
        data-page-curtain
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200] overflow-hidden bg-white"
      >
        {INTRO_IMAGES.map((image, index) => (
          <div
            key={image}
            data-intro-image
            className="invisible absolute left-1/2 top-1/2 aspect-[4/5] w-[min(35vw,35vh)] -translate-x-1/2 -translate-y-1/2 overflow-hidden will-change-[clip-path]"
            style={{ clipPath: "inset(50%)" }}
          >
            <Image
              src={image}
              alt=""
              fill
              priority
              sizes="62vmin"
              className="object-cover"
            />
            {index === INTRO_IMAGES.length - 1 && (
              <div className="absolute left-1/2 top-1/2 z-10 aspect-[4/1] w-[82%] max-w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                <Image
                  src="/logos/veyra.svg"
                  alt="Veyra"
                  fill
                  sizes="82vw"
                  className="object-cover"
                />
              </div>
            )}
          </div>
        ))}

        <div className="absolute inset-x-0 hidden bottom-0 h-[3px] bg-black/10">
          <div
            data-intro-progress
            className="h-full w-full origin-left bg-black/60"
          />
        </div>
      </div>
    </div>
  );
}
