"use client";

import Image from "next/image";
import MuxPlayer, {
  type MuxPlayerRefAttributes,
} from "@mux/mux-player-react";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";

const MUX_PLAYBACK_ID = "s00AcBh8SwqiRssd7F017X7i01jYBOe5scgDrUyZYybOMg";
const MUX_INTRO_VIDEO = "mux-intro-video";
const VIDEO_READY_TIMEOUT_MS = 10_000;

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

  MUX_INTRO_VIDEO,
] as const;

const PAGE_HIDDEN = "inset(100% 0% 0% 0%)";
const PAGE_VISIBLE = "inset(0% 0% 0% 0%)";

export default function PageReveal({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const introVideoRef = useRef<MuxPlayerRefAttributes | null>(null);
  const [videoNeedsTap, setVideoNeedsTap] = useState(false);
  const pathname = usePathname();
  const initialPathnameRef = useRef(pathname);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const page = root.querySelector<HTMLElement>("[data-page-content]");
    const curtain = root.querySelector<HTMLElement>("[data-page-curtain]");
    const progress = root.querySelector<HTMLElement>("[data-intro-progress]");
    if (!page || !curtain || !progress) return;

    const stopIntroVideo = () => {
      const player = introVideoRef.current;
      if (!player) return;
      player.pause();
      player.preload = "none";
    };

    if (initialPathnameRef.current !== "/") {
      stopIntroVideo();
      gsap.set(page, { clearProps: "clipPath,zIndex" });
      gsap.set(curtain, { autoAlpha: 0 });
      root.removeAttribute("aria-busy");
      return;
    }

    // Reduced motion: skip the intro entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stopIntroVideo();
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
    let cancelVideoWait = () => {};
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
    const videoReady = new Promise<void>((resolve) => {
      const player = introVideoRef.current;
      if (!player) {
        resolve();
        return;
      }

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        player.removeEventListener("canplay", handleVideoReady);
        player.removeEventListener("playing", handleVideoReady);
        player.removeEventListener("error", handleVideoError);
        resolve();
      };
      const handleVideoReady = () => finish();
      const handleVideoTimeout = () => {
        setVideoNeedsTap(true);
        console.warn(
          "The Mux intro video did not become playable before the reveal timeout.",
        );
        finish();
      };
      const handleVideoError = () => {
        console.error("The Mux intro video failed to load.");
        finish();
      };
      const timeoutId = setTimeout(handleVideoTimeout, VIDEO_READY_TIMEOUT_MS);

      cancelVideoWait = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        player.removeEventListener("canplay", handleVideoReady);
        player.removeEventListener("playing", handleVideoReady);
        player.removeEventListener("error", handleVideoError);
        resolve();
      };
      player.addEventListener("canplay", handleVideoReady);
      player.addEventListener("playing", handleVideoReady);
      player.addEventListener("error", handleVideoError);
      if (player.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        finish();
      }
    });
    let activeTimeline: gsap.core.Timeline | null = null;
    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray<HTMLElement>("[data-intro-image]");

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
          .to({}, { duration: 0.15 })
          .set(page, { zIndex: 201 })
          .to(progress, { autoAlpha: 0, duration: 0.3 }, "<")
          .fromTo(
            page,
            { clipPath: PAGE_HIDDEN },
            {
              clipPath: PAGE_VISIBLE,
              duration: 1.5,
              ease: "power2.inOut",
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

      void Promise.all([
        windowLoaded,
        document.fonts.ready,
        pageImagesLoaded,
        videoReady,
      ]).then(() => {
        if (!cancelled) playImageSequence();
      });

      return () => activeTimeline?.kill();
    }, root);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreferenceChange = () => {
      if (!reducedMotion.matches) return;
      cancelled = true;
      activeTimeline?.kill();
      cancelVideoWait();
      stopIntroVideo();
      if (handleWindowLoad) {
        window.removeEventListener("load", handleWindowLoad);
      }
      gsap.set(page, { clearProps: "clipPath,zIndex,transform,filter" });
      gsap.set(curtain, { autoAlpha: 0 });
      html.style.overflow = previousOverflow;
      root.removeAttribute("aria-busy");
    };
    reducedMotion.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      cancelled = true;
      ctx.revert();
      cancelVideoWait();
      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);
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
        className="pointer-events-none invisible fixed inset-0 z-[200] overflow-hidden bg-[#fff]"
      >
        {INTRO_IMAGES.map((image) => (
          <div
            key={image}
            data-intro-image
            className="invisible absolute left-1/2 top-1/2 aspect-[4/5] w-[min(65vw,60vh)] -translate-x-1/2 -translate-y-1/2 overflow-hidden will-change-[clip-path] sm:w-[min(35vw,35vh)]"
            style={{ clipPath: "inset(50%)" }}
          >
            {image === MUX_INTRO_VIDEO ? (
              <>
                <MuxPlayer
                  ref={introVideoRef}
                  playbackId={MUX_PLAYBACK_ID}
                  streamType="on-demand"
                  autoPlay="muted"
                  muted
                  loop
                  playsInline
                  preload="auto"
                  poster=""
                  placeholder=""
                  aria-label="Veyra introduction video"
                  data-intro-video
                  onCanPlay={() => {
                    const player = introVideoRef.current;
                    if (!player) return;
                    player.muted = true;
                    void player.play().catch((error: unknown) => {
                      setVideoNeedsTap(true);
                      console.error(
                        "The Mux intro video could not start playback.",
                        error,
                      );
                    });
                  }}
                  onPlaying={() => setVideoNeedsTap(false)}
                  style={{
                    width: "100%",
                    height: "100%",
                    "--media-object-fit": "cover",
                    "--media-object-position": "center",
                    "--media-control-bar-display": "none",
                  }}
                  className="absolute inset-0 h-full w-full"
                />
                {videoNeedsTap && (
                  <span className="sr-only">
                    Video playback needs a tap to start.
                  </span>
                )}
              </>
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

        {videoNeedsTap && (
          <button
            type="button"
            className="pointer-events-auto absolute bottom-8 left-1/2 z-30 -translate-x-1/2 rounded-full bg-black/75 px-5 py-3 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
            onClick={() => {
              const player = introVideoRef.current;
              if (!player) return;
              player.muted = true;
              void player.play().catch((error: unknown) => {
                console.error(
                  "The Mux intro video could not start after tapping play.",
                  error,
                );
              });
            }}
          >
            Tap to load intro
          </button>
        )}

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 aspect-[4/1] w-[min(35vw,420px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
          <Image
            src="/logos/veyra.svg"
            alt=""
            fill
            sizes="30vw"
            aria-hidden="true"
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
