"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function MouseFollowerImage() {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    gsap.set(image, {
      transformPerspective: 800,
      transformOrigin: "center center",
    });

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;

      gsap.to(image, {
        x: x * 55,
        y: y * 40,
        rotationY: x * 20,
        rotationX: -y * 16,
        rotation: x * 6,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleLeave = () => {
      gsap.to(image, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        rotation: 0,
        duration: 1.2,
        ease: "elastic.out(1, 0.5)",
        overwrite: "auto",
      });
    };

    const updateMotion = () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      gsap.killTweensOf(image);

      if (reduceMotion.matches) {
        gsap.set(image, { clearProps: "transform" });
        return;
      }

      window.addEventListener("pointermove", handleMove);
      document.documentElement.addEventListener("pointerleave", handleLeave);
    };

    updateMotion();
    reduceMotion.addEventListener("change", updateMotion);
    return () => {
      reduceMotion.removeEventListener("change", updateMotion);
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      gsap.killTweensOf(image);
    };
  }, []);

  return (
    <div
      ref={imageRef}
      aria-hidden="true"
      className="pointer-events-none absolute right-12 top-44 z-0 hidden h-48 w-48 sm:block md:h-64 md:w-64"
    >
      <img
        src="https://clipo.one/uploads/loading/see.svg?v=20260901-3"
        alt=""
        className="h-full w-full scale-x-[-1] object-contain"
      />
    </div>
  );
}
