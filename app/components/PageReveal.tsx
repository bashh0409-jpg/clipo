"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const INTRO_IMAGES = [
  "/start/cosmos_1271383869.webp",
  "/start/cosmos_1312131681.webp",

  "/start/cosmos_1566198137.webp",
  "/start/cosmos_1871981957.webp",
  "/start/cosmos_499248863.webp",
  "/start/cosmos_1321191480.webp",

  "/start/cosmos_189048023.webp",
  "/start/cosmos_2024599819.webp",
  "/start/cosmos_1980853716.webp",

  "/start/cosmos_512150715-mobile.mp4",
] as const;

const PAGE_HIDDEN = "inset(100% 0% 0% 0%)";
const PAGE_VISIBLE = "inset(0% 0% 0% 0%)";

export default function PageReveal({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const initialPathnameRef = useRef(pathname);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const page = root.querySelector<HTMLElement>("[data-page-content]");
    const curtain = root.querySelector<HTMLElement>("[data-page-curtain]");
    const progress = root.querySelector<HTMLElement>("[data-intro-progress]");
    if (!page || !curtain || !progress) return;

    if (initialPathnameRef.current !== "/") {
      gsap.set(page, { clearProps: "clipPath,zIndex" });
      gsap.set(curtain, { autoAlpha: 0 });
      root.removeAttribute("aria-busy");
      return;
    }

    // Reduced motion: skip the intro entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(page, { clipPath: "none" });
      gsap.set(curtain, { autoAlpha: 0 });
      root.removeAttribute("aria-busy");
      return;
    }

    // Prevent scrolling while the intro plays.
    const html = document.documentElement;
    const previousOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    let cancelled = false;
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
    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray<HTMLElement>("[data-intro-image]");
      let activeTimeline: gsap.core.Timeline | null = null;

      gsap.set(page, { clipPath: PAGE_HIDDEN });
      gsap.set(curtain, { autoAlpha: 1 });
      gsap.set(images, {
        autoAlpha: 0,
        clipPath: "inset(50%)",
      });
      gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

      const completeReveal = () => {
        const lastImage = images.at(-1);
        if (!lastImage) return;

        activeTimeline = gsap.timeline({
          onComplete: () => {
            gsap.set(page, { clearProps: "clipPath,zIndex" });
            gsap.set(curtain, { autoAlpha: 0 });
            html.style.overflow = previousOverflow;
            root.removeAttribute("aria-busy");
          },
        });

        activeTimeline
          .to({}, { duration: 3 })
          .to(lastImage, {
            width: window.innerWidth,
            height: window.innerHeight,
            duration: 1.25,
            ease: "expo.inOut",
          })
          .to({}, { duration: 2 })
          .set(page, { zIndex: 201 })
          .to(progress, { autoAlpha: 0, duration: 0.3 }, "<")
          .to(
            page,
            {
              clipPath: PAGE_VISIBLE,
              duration: 2,
              ease: "expo.inOut",
            },
            "<",
          );
      };

      const playImageSequence = () => {
        activeTimeline = gsap.timeline({
          defaults: { ease: "power2.inOut" },
          onComplete: completeReveal,
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

      void Promise.all([windowLoaded, document.fonts.ready, pageImagesLoaded]).then(
        () => {
          if (!cancelled) playImageSequence();
        },
      );

      return () => activeTimeline?.kill();
    }, root);

    return () => {
      cancelled = true;
      ctx.revert();
      html.style.overflow = previousOverflow;
      if (handleWindowLoad) {
        window.removeEventListener("load", handleWindowLoad);
      }
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-busy="true"
      className="relative min-h-screen w-full overflow-x-clip bg-[#010c84]"
    >
      <div
        data-page-content
        className="relative z-10 min-h-screen w-full"
      >
        {children}
      </div>

      <div
        data-page-curtain
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[200] overflow-hidden bg-[#fff]"
      >
        {INTRO_IMAGES.map((image) => (
          <div
            key={image}
            data-intro-image
            className="invisible absolute left-1/2 top-1/2 aspect-[4/5] w-[min(35vw,35vh)] -translate-x-1/2 -translate-y-1/2 overflow-hidden will-change-[clip-path]"
            style={{ clipPath: "inset(50%)" }}
          >
            {image.endsWith(".mp4") ? (
              <video
                src={image}
                poster="/start/cosmos_1980853716.webp"
                autoPlay={true}
                muted={true}
                loop={true}
                playsInline={true}
                preload="auto"
                aria-hidden="true"
                data-intro-video
                onCanPlay={(event) => {
                  event.currentTarget.defaultMuted = true;
                  event.currentTarget.muted = true;
                  void event.currentTarget.play().catch((error: unknown) => {
                    console.error("The intro video could not start playback.", error);
                  });
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <Image
                src={image}
                alt=""
                fill
                priority
                sizes="62vmin"
                className="object-cover"
              />
            )}
          </div>
        ))}

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 aspect-[4/1] w-[min(35vw,420px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          <Image
            src="/logos/veyra.svg"
            alt=""
            fill
            sizes="30vw"
            className="object-cover"
          />
        </div>

        <div className="absolute inset-x-0 hidde bottom-0 h-[3px] bg-black/10">
          <div
            data-intro-progress
            className="h-full w-full origin-left bg-black/60"
          />
        </div>
      </div>

    </div>
  );
}
