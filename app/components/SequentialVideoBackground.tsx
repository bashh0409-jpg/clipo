"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

const videos = [
  "/start/cosmos_1355130040.mp4",
  "/start/cosmos_1009642190.mp4",
  "/start/cosmos_512150715.mp4",
];

const backgroundPaths = new Set(["/about", "/contact", "/sponsor"]);

export default function SequentialVideoBackground() {
  const pathname = usePathname();
  const [videoIndex, setVideoIndex] = useState(0);
  const src = videos[videoIndex];
  const isActive = backgroundPaths.has(pathname);

  if (!isActive) return null;

  return (
    <video
      key={src}
      className="fixed inset-0 z-0 h-full w-full object-cover motion-reduce:hidden"
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      onEnded={() => setVideoIndex((index) => (index + 1) % videos.length)}
      aria-hidden="true"
    />
  );
}
