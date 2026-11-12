"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const backgroundPoster = "/start/cosmos_2024599819.webp";

const videos = [
  "/start/cosmos_889225998.mp4",
  "/start/cosmos_1077638721.mp4",
  "/start/cosmos_1580766245.mp4",
  "/start/cosmos_328349619.mp4",
  "/start/cosmos_1848116587.mp4",
];

const backgroundPaths = new Set(["/about", "/contact", "/sponsor"]);

export default function SequentialVideoBackground() {
  const pathname = usePathname();
  const [videoIndices, setVideoIndices] = useState<[number, number]>([0, 1]);
  const [activeSlot, setActiveSlot] = useState(0);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [isRendered, setIsRendered] = useState(() =>
    backgroundPaths.has(pathname),
  );
  const [previousPathname, setPreviousPathname] = useState(pathname);
  const videoRefs = useRef<[HTMLVideoElement | null, HTMLVideoElement | null]>([
    null,
    null,
  ]);
  const readySlotsRef = useRef<[boolean, boolean]>([false, false]);
  const pendingSlotRef = useRef<number | null>(null);
  const switchingRef = useRef(false);
  const pathnameRef = useRef(pathname);

  if (pathname !== previousPathname) {
    setPreviousPathname(pathname);
    if (backgroundPaths.has(pathname)) setIsRendered(true);
  }

  useLayoutEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    const handlePageTransitionComplete = () => {
      if (!backgroundPaths.has(pathnameRef.current)) setIsRendered(false);
    };

    window.addEventListener(
      "page-transition-complete",
      handlePageTransitionComplete,
    );
    return () => {
      window.removeEventListener(
        "page-transition-complete",
        handlePageTransitionComplete,
      );
    };
  }, []);

  if (!isRendered) return null;

  return (
    <div
      data-sequential-background
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <Image
        src={backgroundPoster}
        alt=""
        fill
        priority
        sizes="100vw"
        className={`z-10 object-cover transition-opacity duration-700 ${
          hasVideoStarted ? "opacity-0" : "opacity-100"
        }`}
      />
      {videoIndices.map((videoIndex, slot) => (
        <video
          key={slot}
          ref={(video) => {
            videoRefs.current[slot] = video;
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
            activeSlot === slot ? "opacity-100" : "opacity-0"
          } motion-reduce:hidden`}
          src={videos[videoIndex]}
          autoPlay={activeSlot === slot}
          muted
          playsInline
          preload={activeSlot === slot ? "auto" : "metadata"}
          onPlaying={() => setHasVideoStarted(true)}
          onCanPlay={() => {
            readySlotsRef.current[slot] = true;
            if (pendingSlotRef.current === slot) {
              pendingSlotRef.current = null;
              advanceToSlot(slot);
            }
          }}
          onEnded={() => {
            if (activeSlot !== slot || switchingRef.current) return;
            const nextSlot = (slot + 1) % 2;
            if (readySlotsRef.current[nextSlot]) {
              advanceToSlot(nextSlot);
            } else {
              pendingSlotRef.current = nextSlot;
              const nextVideo = videoRefs.current[nextSlot];
              if (nextVideo) {
                nextVideo.preload = "auto";
                nextVideo.load();
              }
            }
          }}
        />
      ))}
    </div>
  );

  function advanceToSlot(nextSlot: number) {
    if (switchingRef.current) return;
    const nextVideo = videoRefs.current[nextSlot];
    if (!nextVideo) return;

    switchingRef.current = true;
    void nextVideo.play().then(
      () => {
        const previousSlot = (nextSlot + 1) % 2;
        setActiveSlot(nextSlot);
        window.setTimeout(() => {
          readySlotsRef.current[previousSlot] = false;
          setVideoIndices((indices) => {
            const nextIndices: [number, number] = [...indices];
            nextIndices[previousSlot] = (indices[nextSlot] + 1) % videos.length;
            return nextIndices;
          });
          switchingRef.current = false;
        }, 700);
      },
      (error: unknown) => {
        switchingRef.current = false;
        console.error("The next background video could not start.", error);
      },
    );
  }
}
