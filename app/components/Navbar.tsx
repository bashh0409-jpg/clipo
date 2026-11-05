"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import {
  getUiSoundEnabled,
  playUiSound,
  subscribeToUiSoundPreference,
  setUiSoundEnabled,
} from "@/lib/ui-sounds";
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
  
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const soundEnabled = useSyncExternalStore(
    subscribeToUiSoundPreference,
    getUiSoundEnabled,
    () => true,
  );
  const logoRef = useRef<HTMLImageElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const soundIconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

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

    const updateMotion = () => {
      window.removeEventListener("pointermove", handleMove);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      gsap.killTweensOf(logo);

      if (reduceMotion.matches) {
        gsap.set(logo, { clearProps: "transform" });
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

   const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
   const movePill = () => {
   const immediate = reducedMotion.matches;
   if (!activeItem) {
     if (immediate) gsap.set(pill, { opacity: 0 });
     else gsap.to(pill, { opacity: 0, duration: 0.2, overwrite: "auto" });
     return;
   }

   const navRect = nav.getBoundingClientRect();
   const itemRect = activeItem.getBoundingClientRect();

   const position = {
     x: itemRect.left - navRect.left,
     y: itemRect.top - navRect.top,
     width: itemRect.width,
     height: itemRect.height,
     opacity: 1,
   };
   if (immediate) {
     gsap.set(pill, position);
     return;
   }

   gsap.to(pill, {
     ...position,
     duration: immediate ? 0 : 0.45,
     ease: "power3.inOut",
     overwrite: "auto",
   });
   };

   const handleResize = () => movePill();
   const handleMotionPreferenceChange = () => movePill();

   // Animate the pill to the active route.
   movePill();

   window.addEventListener("resize", handleResize);
   reducedMotion.addEventListener("change", handleMotionPreferenceChange);

   return () => {
     window.removeEventListener("resize", handleResize);
     reducedMotion.removeEventListener("change", handleMotionPreferenceChange);
     gsap.killTweensOf(pill);
   };
 }, [pathname]);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[150] px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:px-7 md:pb-7"
      >
        <div
          ref={navRef}
          className="pointer-events-auto relative mx-auto flex w-fit max-w-[360px] items-center justify-between gap-1 rounded-full bg-white px-1 py-1 text-black shadow-2xl backdrop-blur-xl md:w-fit md:max-w-xs md:gap-2"
        >
          

          <span
            ref={pillRef}
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 z-0 rounded-full bg-black/10 opacity-0"
          />

          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive =
              href === pathname ||
              (!href.startsWith("mailto:") &&
                href !== "/" &&
                pathname.startsWith(`${href}/`));
            const className = `group relative z-10 flex h-8 w-10 min-w-0 flex-1 flex-col items-center justify-center gap- rounded-full transition-colors duration-300 hover:text-black focus-visible:text-black focus-visible:outline-none md:h-8 md:w-10 md:flex-none md:flex-row md:gap-1 ${
              isActive ? "text-black" : "text-[#999]"
            }`;

            const content = (
              <>
                <Icon
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                  className="transition-transform duration-300"
                />
                <span className="text-[10px] hidden font-medium leading-none md:hidden">
                  {label}
                </span>
              </>
            );

            return href.startsWith("mailto:") ? (
              <a
                key={label}
                href={href}
                aria-label={label}
                data-nav-item
                data-active={isActive}
                className={className}
                onClick={() => playUiSound("/tick.ogg")}
              >
                {content}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                aria-label={label}
                data-nav-item
                data-active={isActive}
                aria-current={isActive ? "page" : undefined}
                className={className}
                onClick={() => playUiSound("/tick.ogg")}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>
      <button
        type="button"
        aria-label={soundEnabled ? "Turn sound off" : "Turn sound on"}
        aria-pressed={soundEnabled}
        title={soundEnabled ? "Sound on" : "Sound off"}
        onClick={() => {
          const nextEnabled = !soundEnabled;
          setUiSoundEnabled(nextEnabled);
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const icon = soundIconRef.current;
            if (icon) {
              gsap.fromTo(
                icon,
                { filter: "blur(4px)", scale: 0.8 },
                {
                  filter: "blur(0px)",
                  scale: 1,
                  duration: 0.35,
                  ease: "power2.out",
                  overwrite: true,
                  onComplete: () => gsap.set(icon, { clearProps: "filter,transform" }),
                },
              );
            }
          }
          if (nextEnabled) playUiSound("/tick.ogg");
        }}
        className="group pointer-events-auto fixed right-0 top-4 z-[160] flex h-7 w-2 cursor-pointer items-center justify-center overflow-hidden rounded-l hover:rounded-l bg-white text-[#999] transition-[width,color] duration-300 hover:w-7 hover:h-7 hover:text-black focus-visible:w-10 focus-visible:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none"
      >
        <span
          aria-hidden="true"
          className="absolute left-0.5 h-6 w-[3px] rounded-full bg-black/40 transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0"
        />
        <span className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <SoundIcon ref={soundIconRef} enabled={soundEnabled} />
        </span>
      </button>
    </>
  );
}

function SoundIcon({
  enabled,
  ref,
}: {
  enabled: boolean;
  ref: React.Ref<SVGSVGElement>;
}) {
  return (
    <svg
      ref={ref}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        d={
          enabled
            ? "M14,20.73V18.68q2.25-0.65 3.63-2.5T19,11.98t-1.38-4.2Q16.25,5.93 14,5.27V3.22q3.1,0.7 5.05,3.14T21,11.98t-1.95,5.61T14,20.73ZM3,15V9H7l5-5V20L7,15H3Zm11,1V7.95Q15.18,8.5 15.84,9.6T16.5,12q0,1.27-0.66,2.36T14,16ZM10,8.85L7.85,11H5v2H7.85L10,15.15V8.85ZM7.5,12Z"
            : "M19.8,22.6l-3.02-3.03q-0.63,0.4-1.33,0.69T14,20.73V18.68q0.35-0.13 0.69-0.25q0.34-0.13 0.64-0.3L12,14.8V20L7,15H3V9H6.2L1.4,4.2L2.8,2.8L21.2,21.2l-1.4,1.4Zm-0.2-5.8l-1.45-1.45q0.42-0.78 0.64-1.63T19,11.98q0-2.35-1.38-4.2Q16.25,5.93 14,5.27V3.22q3.1,0.7 5.05,3.14T21,11.98q0,1.32-0.36,2.55T19.6,16.8Zm-3.35-3.35L14,11.2V7.95Q15.18,8.5 15.84,9.6T16.5,12q0,0.38-0.06 0.74t-0.19 0.71ZM12,9.2L9.4,6.6L12,4V9.2Zm-2,5.95V12.8L8.2,11H5v2H7.85L10,15.15ZM9.1,11.9Z"
        }
      />
    </svg>
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
