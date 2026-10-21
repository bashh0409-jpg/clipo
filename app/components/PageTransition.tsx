"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";

const PAGE_ORDER: Record<string, number> = {
  "/": 1,
  "/sponsor": 2,
  "/about": 3,
  "/contact": 4,
};

function getDirection(from: string, to: string) {
  const fromOrder = PAGE_ORDER[from];
  const toOrder = PAGE_ORDER[to];
  if (fromOrder === undefined || toOrder === undefined || fromOrder === toOrder) {
    return null;
  }
  return toOrder > fromOrder ? -1 : 1;
}

export default function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const outgoingPageRef = useRef<HTMLElement | null>(null);
  const directionRef = useRef<number | null>(null);
  const lastPathnameRef = useRef(pathname);
  const pathnameRef = useRef(pathname);
  const routerRef = useRef(router);
  const transitionRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    pathnameRef.current = pathname;
    routerRef.current = router;
  }, [pathname, router]);

  useEffect(() => {
    const captureOutgoingPage = (direction: number) => {
      const page = document.querySelector<HTMLElement>("[data-page-content]");
      const stage = stageRef.current;
      if (!page || !stage || page.closest("[aria-busy='true']")) return;

      const snapshot = page.cloneNode(true) as HTMLElement;
      snapshot.removeAttribute("data-page-content");
      snapshot.removeAttribute("aria-busy");
      Object.assign(snapshot.style, {
        position: "absolute",
        top: `${-window.scrollY}px`,
        left: "0",
        width: "100vw",
        minHeight: "100vh",
        margin: "0",
        transform: "none",
        zIndex: "0",
        pointerEvents: "none",
      });

      stage.replaceChildren(snapshot);
      gsap.set(stage, { autoAlpha: 1 });
      outgoingPageRef.current = snapshot;
      directionRef.current = direction;
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.hasAttribute("download") ||
        (anchor.target && anchor.target !== "_self")
      ) {
        return;
      }

      const destination = new URL(anchor.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname === window.location.pathname
      ) {
        return;
      }

      const direction = getDirection(
        pathnameRef.current,
        destination.pathname,
      );
      if (direction === null) return;

      const page = document.querySelector<HTMLElement>("[data-page-content]");
      if (!page || page.closest("[aria-busy='true']")) return;

      event.preventDefault();
      captureOutgoingPage(direction);
      routerRef.current.push(
        `${destination.pathname}${destination.search}${destination.hash}`,
      );
    };

    const handlePopState = () => {
      const direction = getDirection(pathnameRef.current, window.location.pathname);
      if (direction !== null) captureOutgoingPage(direction);
    };

    document.addEventListener("click", handleDocumentClick, true);
    window.addEventListener("popstate", handlePopState);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      window.removeEventListener("popstate", handlePopState);
      transitionRef.current?.kill();
    };
  }, []);

  useLayoutEffect(() => {
    if (lastPathnameRef.current === pathname) return;
    const previousPathname = lastPathnameRef.current;
    lastPathnameRef.current = pathname;

    const page = document.querySelector<HTMLElement>("[data-page-content]");
    const snapshot = outgoingPageRef.current;
    const stage = stageRef.current;
    if (!page || !stage) return;

    transitionRef.current?.kill();
    const direction =
      directionRef.current ?? getDirection(previousPathname, pathname);
    directionRef.current = null;

    if (
      direction === null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      snapshot?.remove();
      outgoingPageRef.current = null;
      gsap.set(stage, { autoAlpha: 0 });
      gsap.set(page, { clearProps: "transform" });
      return;
    }

    gsap.set(page, {
      x: -direction * window.innerWidth,
      filter: "blur(30px)",
    });
    transitionRef.current = gsap.timeline({
      onComplete: () => {
        snapshot?.remove();
        outgoingPageRef.current = null;
        gsap.set(stage, { autoAlpha: 0 });
        gsap.set(page, { clearProps: "transform,filter" });
        transitionRef.current = null;
      },
    });

    transitionRef.current.to(
      page,
      {
        x: 0,
        filter: "blur(0px)",
        duration: 0.55,
        ease: "power2.inOut",
      },
      0,
    );

    if (snapshot) {
      transitionRef.current.to(
        snapshot,
        {
          x: direction * window.innerWidth,
          filter: "blur(2px)",
          duration: 0.55,
          ease: "power2.inOut",
        },
        0,
      );
    } else {
      gsap.set(stage, { autoAlpha: 0 });
    }
  }, [pathname]);

  return (
    <div
      ref={stageRef}
      aria-hidden="true"
      className="pointer-events-none invisible fixed inset-0 z-[20] overflow-hidden"
    />
  );
}
