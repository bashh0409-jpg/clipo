"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { Fraunces } from "next/font/google";

const companyFont = Fraunces({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

interface CellData {
  id: string;
  imgSrc: string;
  company: string;
  url: string;
  title: string;
  reveal: string;
  detail: string;
}

interface CellProps {
  cell: CellData;
  onSeeMore: (cell: CellData) => void;
}

interface SidebarProps {
  cell: CellData | null;
  isOpen: boolean;
  backgroundRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

const CELLS: CellData[] = [
  {
    id: "brand",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/77d1b2941af91ab9c043df78dda9affcb57785a4-188x188.svg",
    company: "Wise",
    title: "Money transfer and financial services",
    url: "https://wise.com/",
    reveal:
      "Wise is an international financial technology company that makes sending, receiving, and holding money across currencies easier. It focuses on transparent fees and international money transfers for individuals and businesses.",
    detail: "Multi-currency accounts and money transfers",
  },
  {
    id: "design",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/0788bdd6f42d21e06d185b0d909be6f4250a2e0c-188x188.svg",
    company: "taxflix",
    title: "Tax preparation software",
    url: "https://taxfix.de/en/",
    reveal:
      "Making complex tax systems accessible to everyone, Taxfix allows users to submit tax returns quickly and easily via app or web. Tax filing with forms takes hours and requires expert knowledge. Taxfix disrupts the industry by offering an easy solution that guides users through the process of filing their taxes by asking them simple questions – as a tax advisor would. With its underlying tax engine, Taxfix's systems can generate the smartest questions and achieve the best refund for its customers.",
    detail: "Digital tax filing and tax guidance",
  },
  {
    id: "frontend",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/7155a96d8ec88d2d8844fc5313077b21e977914f-188x188.svg",
    company: "syfe",
    title: "Investment management",
    url: "https://www.syfe.com/",
    reveal:
      "Syfe is a digital wealth management platform offering investment and portfolio management products. Its technology-led approach helps users access and manage their investments online.",
    detail: "Investment and portfolio management",
  },
  {
    id: "backend",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/da3083fc0bb8809cf8ebc8c7380c80e506e3880c-188x188.svg",
    company: "neo",
    title: "Digital banking and consumer finance",
    url: "https://neofinancial.com/",
    reveal: "Visit Neo to learn more about the company and its work.",
    detail: "Digital banking and financial products",
  },
  {
    id: "motion",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/ea6884f7b62069c9ff6e8321d9b4fb2eaa6863b8-188x188.svg",
    company: "mondu",
    title: "B2B payments",
    url: "https://www.mondu.ai/",
    reveal:
      "Mondu is a B2B payments company focused on business-to-business payment solutions, including flexible payment options for business buyers and sellers.",
    detail: "Flexible payment options for businesses",
  },
  {
    id: "webgl",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/21f07b81514b6b62c60c9159be8851bfca467be4-188x188.svg",
    company: "Atlas",
    title: "Premium credit cards",
    url: "https://atlascard.com/",
    reveal:
      "Atlas is building a members-only charge card for last minute access to coveted experiences.",
    detail: "Members-only charge card and experience access",
  },
  {
    id: "type",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/3585c93de1859eeb0d31633e8cc476223083194b-188x188.svg",
    company: "majority",
    title: "Digital banking",
    url: "https://www.majority.com/",
    reveal:
      "MAJORITY is a financial technology company focused on serving international communities with financial services, including money transfers and mobile banking features.",
    detail: "Banking services and international money transfers",
  },
  {
    id: "brand-id",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/34b63f57f26da561919df07dec379ff19a392a02-188x188.svg",
    company: "qonto",
    title: "Business banking",
    url: "https://qonto.com/",
    reveal:
      "Qonto is a European business finance platform for small and medium-sized businesses and freelancers. Its services include business accounts, payment cards, expense management, invoicing, and accounting tools.",
    detail: "Business accounts, cards, and expense management",
  },
  {
    id: "illustration",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/0bff149ef816ead4922be1d798680664069ab9de-188x188.svg",
    company: "bitpanda",
    title: "Digital asset investment",
    url: "https://www.bitpanda.com/",
    reveal:
      "Bitpanda is a European digital investment platform that provides access to financial assets, including cryptocurrencies, stocks, ETFs, and precious metals, depending on the market and product.",
    detail: "Investments across multiple asset classes",
  },
  {
    id: "mobile",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/5d8b2589cb90dfa1713a525a98d58f642bcf75aa-188x188.svg",
    company: "BukuWarung",
    title: "Small-business fintech",
    url: "https://bukuwarung.com/",
    reveal:
      "BukuWarung is an Indonesian business technology platform associated with tools that help micro and small businesses manage bookkeeping, transactions, and business operations.",
    detail: "Bookkeeping and business management tools",
  },
  {
    id: "ai",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/73a31af4a47f8f386ef0108ed6cd19f77393bb25-188x188.svg",
    company: "velocity",
    title: "Revenue-based financing",
    url: "https://velocity.in",
    reveal: "Visit Velocity to learn more about the company and its work.",
    detail: "Growth financing for online businesses",
  },
  {
    id: "audio",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/096fa4f0626ddf50fbb017b3252491c2e7857f35-188x188.svg",
    company: "novo",
    title: "Small-business banking",
    url: "https://novo.co/",
    reveal: "Visit Novo to learn more about the company and its work.",
    detail: "Digital banking for small businesses",
  },
  {
    id: "film",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/7c70c42d655e6f01ea45f82a5fe52056b74a1211-188x188.svg",
    company: "regate",
    title: "Accounting software",
    url: "https://en.regate.io/",
    reveal:
      "Regate is a financial technology company known for software that helps businesses automate accounting processes, manage invoices, and streamline financial administration.",
    detail: "Accounting and financial operations automation",
  },
  {
    id: "tools",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/26c2e449ba76972e53236f66310d240a57cca5de-188x188.svg",
    company: "albo",
    title: "Digital banking",
    url: "https://www.albo.mx/",
    reveal:
      "Albo is a Mexican digital financial services company offering digital banking and related financial products. Its services are designed to help people manage money through digital tools.",
    detail: "Banking and financial services in Mexico",
  },
  {
    id: "join",
    imgSrc:
      "https://cdn.sanity.io/images/9y5rc2e3/production/3a6c464e5fd4ce913663cab9767c1bdfbe5a3655-188x189.svg",
    company: "bestow",
    title: "Life insurance",
    url: "https://www.bestow.com/",
    reveal:
      "Bestow is an insurance technology company known for digital life insurance products and technology that simplifies the life insurance application process.",
    detail: "Digital life insurance products",
  },
];

function Cell({ cell, onSeeMore }: CellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const pointerTypeRef = useRef<string>("mouse");

  useEffect(() => {
    // Scoped context so revert() kills every tween and clears inline styles on unmount
    const ctx = gsap.context(() => {
      tlRef.current = gsap
        .timeline({
          paused: true,
          defaults: { duration: 0.5, ease: "power3.out" },
        })
        .fromTo(
          "[data-wipe]",
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)" },
          0,
        )
        .to("[data-base]", { yPercent: -25, opacity: 0, duration: 0.35 }, 0)
        .fromTo(
          "[data-reveal]",
          { yPercent: 25, opacity: 0 },
          { yPercent: 0, opacity: 1 },
          0.12,
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const open = () => tlRef.current?.play();
  const close = () => tlRef.current?.reverse();

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      // "group", not "link": the cell now contains a real button, and a link can't nest one
      role="group"
      aria-label={cell.company}
      onPointerDown={(e) => {
        pointerTypeRef.current = e.pointerType;
      }}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") open();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") close();
      }}
      // Touch has no hover, so a tap toggles the reveal instead
      onClick={() => {
        if (pointerTypeRef.current === "mouse") return;
        if ((tlRef.current?.progress() ?? 0) > 0.5) close();
        else open();
      }}
      onFocus={open}
      onBlur={(e) => {
        // Focus moving from the cell to its own button is not "leaving", so don't collapse the reveal
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        close();
      }}
      className="relative aspect-square cursor-pointer overflow-hidden bg-[#2535E8] outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#F5D76A] md:aspect-auto"
    >
      <div
        data-base
        className="absolute inset-0 flex items-center justify-center p-4 text-center text-[clamp(1.4rem,3vw,3.25rem)] leading-none tracking-tight text-white"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cell.imgSrc || undefined} alt={cell.company} />
      </div>

      {/* Initial clip-path inline so the white layer is hidden before GSAP hydrates */}
      <div
        onClick={(e) => {
          // Stop the cell's touch-toggle handler from also firing
          e.stopPropagation();
          onSeeMore(cell);
        }}
        data-wipe
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        className="absolute inset-0 bg-white"
      >
        <div
          data-reveal
          className="flex h-full flex-col items-stretch justify-start gap-3 p-6 text-left text-[#2535E8]"
        >
          <p
            className={`${companyFont.className} text-[1.05rem] font-medium capitalize tracking-tight`}
          >
            {cell.company}
          </p>
          {/* Clamped to 6 lines so the button always stays in view; the full text lives in the sidebar */}
          <p className="line-clamp-6 whitespace-pre-line text-justify text-xs font-medium leading-tight tracking-tight text-[#999]">
            {cell.reveal}
          </p>

          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`See more about ${cell.company}`}
            onClick={(e) => {
              // Stop the cell's touch-toggle handler from also firing
              e.stopPropagation();
              onSeeMore(cell);
            }}
            className="mt-auto tracking-tighter self-start text-[#999] rounded-full  py-1.5 text-xs font-medium underline cursor-pointer transition-colors duration-300 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2535E8]"
          >
            See more
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailsSidebar({
  cell,
  isOpen,
  backgroundRef,
  onClose,
}: SidebarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      tlRef.current = gsap
        .timeline({
          paused: true,
          defaults: { duration: 0.6, ease: "power3.inOut" },
        })
        .fromTo(
          "[data-overlay]",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4 },
          0,
        )
        .fromTo(
          "[data-panel]",
          { xPercent: -100, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1 },
          0,
        )
        .fromTo(
          "[data-item]",
          { y: 16, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.06,
          },
          0.3,
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;

    if (!isOpen) {
      tl.timeScale(1.3).reverse();
      return;
    }

    // Only restore focus for keyboard users. Restoring it after a mouse click would
    // re-open the cell's hover reveal, because the cell opens on focus.
    const active = document.activeElement;
    const trigger =
      active instanceof HTMLElement && active.matches(":focus-visible")
        ? active
        : null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) {
        e.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;
      const focusOutsideDialog = !dialogRef.current?.contains(activeElement);
      if (e.shiftKey && (activeElement === first || focusOutsideDialog)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (activeElement === last || focusOutsideDialog)) {
        e.preventDefault();
        first.focus();
      }
    };

    const background = backgroundRef.current;
    const wasInert = background?.inert ?? false;
    const previousOverflow = document.body.style.overflow;
    if (background) background.inert = true;

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    tl.timeScale(1).play();
    // The panel is still visibility:hidden on this tick, so wait a beat before moving focus
    const focusTimer = gsap.delayedCall(0.1, () =>
      closeBtnRef.current?.focus({ preventScroll: true }),
    );

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (background) background.inert = wasInert;
      focusTimer.kill();
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen, backgroundRef, onClose]);

  return (
    <div ref={rootRef}>
      <div
        data-overlay
        aria-hidden="true"
        onClick={onClose}
        className="invisible fixed inset-0 z-[60] bg-black/40"
      />

      <aside
        ref={dialogRef}
        data-panel
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        tabIndex={-1}
        className="invisible fixed left-0 top-0 z-[70] flex h-dvh w-full max-w-md flex-col gap-8 overflow-y-auto bg-white p-6 text-[#2535E8]"
      >
        <div className="flex justify-end">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="bg-[#2535E8] cursor-pointer px-1 py-1 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#1A27B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2535E8]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#fff"
            >
              <path d="M160-360v-80h640v80H160Zm0-160v-80h640v80H160Z" />
            </svg>
          </button>
        </div>

        {cell && (
          <>
            <div className="gap-2 flex flex-col">
              <h2
                id="details-title"
                data-item
                className={`${companyFont.className} text-5xl font-medium capitalize leading-none tracking-tighter`}
              >
                {cell.company}
              </h2>
              <h2 className="text-sm font-medium mt-2 tracking-tight text-[#999]">
                About{" "}
                <a
                  href={cell.url}
                  target="_blank"
                  className="underline cursor-pointer capitalize uppercase"
                >
                  {" "}
                  {cell.company}
                </a>
              </h2>
              <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                {cell.reveal}
              </h2>{" "}
            </div>

            <div className="my-auto">
              <div>
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">
                    Industry
                  </h2>
                  <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                    {cell.title}
                  </h2>
                </div>
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">
                    Services
                  </h2>
                  <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                    {cell.detail}
                  </h2>
                </div>
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                Connect with{" "}
                <span className="uppercase"> {cell.company}</span>
              </h2>
              <div className=" flex gap-4">
                <a
                  href={cell.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 text-sm font-medium tracking-tight text-[#999]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M3 10H17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      stroke-linejoin="round"
                    ></path>
                    <path
                      d="M10 3C11.7509 4.91685 12.7459 7.40442 12.8 10C12.7459 12.5956 11.7509 15.0832 10 17C8.24912 15.0832 7.25409 12.5956 7.20001 10C7.25409 7.40442 8.24912 4.91685 10 3V3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </a>

                <a
                  href={cell.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 text-sm font-medium tracking-tight text-[#999]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.8885 2.5H17.4953L11.8002 8.85385L18.5 17.5H13.2541L9.14539 12.2562L4.44405 17.5H1.8357L7.92711 10.7038L1.5 2.5H6.87904L10.593 7.29308L14.8885 2.5ZM13.9736 15.9769H15.418L6.09417 3.94308H4.54413L13.9736 15.9769Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
                <a
                  href={cell.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 text-sm font-medium tracking-tight text-[#999]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.797 4.40653C17.6793 7.17402 18.6089 10.2957 18.2614 13.8894C18.26 13.9046 18.252 13.9186 18.2395 13.9278C16.8141 14.9744 15.4331 15.6096 14.0714 16.0309C14.0608 16.0341 14.0495 16.0339 14.039 16.0304C14.0285 16.0268 14.0194 16.0201 14.0129 16.0111C13.6983 15.5734 13.4125 15.1119 13.162 14.6273C13.1477 14.5988 13.1608 14.5644 13.1904 14.5532C13.6443 14.3821 14.076 14.1771 14.4912 13.9344C14.5239 13.9153 14.526 13.8684 14.4958 13.8459C14.4077 13.7805 14.3204 13.7117 14.2368 13.643C14.2212 13.6303 14.2002 13.6278 14.1825 13.6363C11.4868 14.8811 8.53393 14.8811 5.80644 13.6363C5.78873 13.6284 5.76769 13.6311 5.75248 13.6436C5.66914 13.7123 5.58164 13.7805 5.49435 13.8459C5.46414 13.8684 5.46664 13.9153 5.49956 13.9344C5.91477 14.1726 6.34643 14.3821 6.79977 14.554C6.82914 14.5653 6.8431 14.5988 6.82852 14.6273C6.58352 15.1126 6.29768 15.574 5.97727 16.0117C5.96331 16.0294 5.94039 16.0376 5.91873 16.0309C4.56352 15.6096 3.18248 14.9744 1.75707 13.9278C1.74519 13.9186 1.73665 13.904 1.7354 13.8888C1.44498 10.7803 2.03686 7.63277 4.19748 4.4059C4.20269 4.39736 4.2106 4.39069 4.21977 4.38674C5.28289 3.89882 6.42185 3.53986 7.61227 3.33486C7.63393 3.33153 7.6556 3.34153 7.66685 3.3607C7.81393 3.62111 7.98206 3.95507 8.09581 4.22799C9.3506 4.03632 10.625 4.03632 11.906 4.22799C12.0198 3.9609 12.1821 3.62111 12.3285 3.3607C12.3337 3.35119 12.3418 3.34357 12.3516 3.33893C12.3614 3.33429 12.3724 3.33287 12.3831 3.33486C13.5741 3.54049 14.7131 3.89945 15.7754 4.38674C15.7848 4.39069 15.7925 4.39736 15.797 4.40653ZM8.73372 10.3169C8.74685 9.39798 8.07685 8.63756 7.23581 8.63756C6.40164 8.63756 5.7381 9.39131 5.7381 10.3169C5.7381 11.2424 6.41477 11.9961 7.23581 11.9961C8.07018 11.9961 8.73372 11.2424 8.73372 10.3169ZM14.2716 10.3169C14.2848 9.39798 13.6148 8.63756 12.7739 8.63756C11.9395 8.63756 11.276 9.39131 11.276 10.3169C11.276 11.2424 11.9527 11.9961 12.7739 11.9961C13.6148 11.9961 14.2716 11.2424 14.2716 10.3169Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

export default function GridHover() {
  const backgroundRef = useRef<HTMLElement>(null);
  const [selected, setSelected] = useState<CellData | null>(null);
  const [sidebarContent, setSidebarContent] = useState<CellData | null>(null);
  // Stable reference so the sidebar's keydown effect doesn't re-subscribe on every render
  const closeSidebar = useCallback(() => setSelected(null), []);
  const openSidebar = useCallback((cell: CellData) => {
    setSidebarContent(cell);
    setSelected(cell);
  }, []);

  return (
    <>
      {/* gap + white background paints the 2px white lines between cells without per-cell borders */}
      <main
        ref={backgroundRef}
        className="grid min-h-screen grid-cols-2 gap-[2px] bg-white p-[2px] md:h-screen md:grid-cols-5 md:grid-rows-3"
      >
        {CELLS.map((cell) => (
          <Cell key={cell.id} cell={cell} onSeeMore={openSidebar} />
        ))}
      </main>

      <DetailsSidebar
        cell={sidebarContent}
        isOpen={selected !== null}
        backgroundRef={backgroundRef}
        onClose={closeSidebar}
      />
    </>
  );
}

/*
 * Design note
 * - Selected cell lives in GridHover, not in each Cell, so only one sidebar exists and opening a
 *   second cell can never stack panels.
 * - GridHover retains the last sidebar content while it slides out, so the details remain visible
 *   until the close animation completes.
 * - The background is inert while the dialog is open, and Tab navigation stays within the dialog.
 * - The cell is role="group" and the reveal clamps text to 6 lines. The button is pinned to the
 *   bottom with mt-auto, so it stays visible however long the description is.
 */
