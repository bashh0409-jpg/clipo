"use client";

import { useState } from "react";

const videos = [
  "/start/cosmos_1355130040.mp4",
  "/start/cosmos_1009642190.mp4",
  "/start/cosmos_512150715.mp4",
];

export default function SequentialVideoBackground() {
  const [videoIndex, setVideoIndex] = useState(0);
  const src = videos[videoIndex];

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
