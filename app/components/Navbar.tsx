"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface NavIconProps {
  size: number;
  strokeWidth: number;
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

const NAV_ITEMS = [
  { label: "Work", href: "/", icon: WorkIcon },
  { label: "Sponsor", href: "/sponsor", icon: SponsorIcon },
  { label: "About", href: "/about", icon: InfoIcon },
  { label: "Contact", href: "/contact", icon: ContactIcon },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const logoRef = useRef<HTMLImageElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) return;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const rect = logo.getBoundingClientRect();
      const x =
        (event.clientX - (rect.left + rect.width / 2)) /
        (window.innerWidth / 2);
      const y =
        (event.clientY - (rect.top + rect.height / 2)) /
        (window.innerHeight / 2);

      gsap.to(logo, {
        x: x * 12,
        y: y * 8,
        rotationY: x * 18,
        rotationX: -y * 14,
        rotation: x * 5,
        transformPerspective: 500,
        duration: 0.6,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    const handleLeave = () => {
      gsap.to(logo, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        rotation: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("pointermove", handleMove);
    document.documentElement.addEventListener("pointerleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      gsap.killTweensOf(logo);
    };
  }, []);

  // Keep the pill on the active route.
  // It does not respond to hover or focus.
 useEffect(() => {
   const nav = navRef.current;
   const pill = pillRef.current;

   if (!nav || !pill) return;

   const items = Array.from(
     nav.querySelectorAll<HTMLAnchorElement>("[data-nav-item]"),
   );

   const activeItem =
     items.find((item) => item.dataset.active === "true") ?? null;

   const movePill = (immediate = false) => {
     if (!activeItem) {
       gsap.to(pill, {
         opacity: 0,
         duration: 0.2,
         overwrite: "auto",
       });
       return;
     }

     const navRect = nav.getBoundingClientRect();
     const itemRect = activeItem.getBoundingClientRect();

     gsap.to(pill, {
       x: itemRect.left - navRect.left,
       y: itemRect.top - navRect.top,
       width: itemRect.width,
       height: itemRect.height,
       opacity: 1,
       duration: immediate ? 0 : 0.45,
       ease: "power3.inOut",
       overwrite: "auto",
     });
   };

   const handleResize = () => movePill();

   // Animate the pill to the active route.
   movePill();

   window.addEventListener("resize", handleResize);

   return () => {
     window.removeEventListener("resize", handleResize);
     gsap.killTweensOf(pill);
   };
 }, [pathname]);

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-[150] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:px-7 md:pb-7"
    >
      <div
        ref={navRef}
        className="relative mx-auto flex w-fit max-w-[360px] items-center justify-between gap-1 rounded-full bg-white px-1 py-1 text-black shadow-2xl backdrop-blur-xl md:w-fit md:max-w-xs md:gap-2"
      >
        

        <span
          ref={pillRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-0 rounded-full bg-black/10 opacity-0"
        />

        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === pathname ||
            (href !== "/" && pathname.startsWith(`${href}/`));

          return (
            <Link
              key={label}
              href={href}
              aria-label={label}
              data-nav-item
              data-active={isActive}
              aria-current={isActive ? "page" : undefined}
              className={`group relative z-10 flex h-8 w-10 min-w-0 flex-1 flex-col items-center justify-center gap- rounded-full transition-colors duration-300 hover:text-black focus-visible:text-black focus-visible:outline-none md:h-8 md:w-10 md:flex-none md:flex-row md:gap-1 ${
                isActive ? "text-black" : "text-[#999]"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={2}
                aria-hidden="true"
                className="transition-transform duration-300"
              />
              <span className="text-[10px] hidden font-medium leading-none md:hidden">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function SponsorIcon({ size, className, ...props }: NavIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      fill="currentColor"
      className={className}
    >
      <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z" />
    </svg>
  );
}

function WorkIcon({ size, className, ...props }: NavIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill="currentColor"
      className={className}
    >
      <path d="M280-80q-33 0-56.5-23.5T200-160v-320q0-85 44.5-152T360-732v-28q0-50 35-85t85-35q50 0 85 35t35 85v28q71 33 115.5 100T760-480v320q0 33-23.5 56.5T680-80H280Zm348.5-251.5Q640-343 640-360v-120H320v80h240v40q0 17 11.5 28.5T600-320q17 0 28.5-11.5ZM440-756q11-2 20-3t20-1q11 0 20 1t20 3v-4q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v4Z" />
    </svg>
  );
}

function InfoIcon({ size, className, ...props }: NavIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill="currentColor"
      className={className}
    >
      <path d="M440-280h80v-240h-80v240Zm68.5-331.5Q520-623 520-640t-11.5-28.5Q497-680 480-680t-28.5 11.5Q440-657 440-640t11.5 28.5Q463-600 480-600t28.5-11.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
    </svg>
  );
}

function ContactIcon({ size, className, ...props }: NavIconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill="currentColor"
      className={className}
    >
      <path d="M440-120v-80h320v-284q0-117-81.5-198.5T480-764q-117 0-198.5 81.5T200-484v244h-40q-33 0-56.5-23.5T80-320v-80q0-21 10.5-39.5T120-469l3-53q8-68 39.5-126t79-101q47.5-43 109-67T480-840q68 0 129 24t109 66.5Q766-707 797-649t40 126l3 52q19 9 29.5 27t10.5 38v92q0 20-10.5 38T840-249v49q0 33-23.5 56.5T760-120H440ZM331.5-411.5Q320-423 320-440t11.5-28.5Q343-480 360-480t28.5 11.5Q400-457 400-440t-11.5 28.5Q377-400 360-400t-28.5-11.5Zm240 0Q560-423 560-440t11.5-28.5Q583-480 600-480t28.5 11.5Q640-457 640-440t-11.5 28.5Q617-400 600-400t-28.5-11.5ZM241-462q-7-106 64-182t177-76q89 0 156.5 56.5T720-519q-91-1-167.5-49T435-698q-16 80-67.5 142.5T241-462Z" />
    </svg>
  );
}
