"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { Fraunces } from "next/font/google";
import Link from "next/link";
const companyFont = Fraunces({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

// Single declaration: the file previously declared CellData twice, which TS silently merged.
interface CellData {
  id: string;
  imgSrc: string;
  company: string;
  title: string;
  url: string;
  xUrl?: string;
  discordUrl?: string;
  reveal: string;
  detail: string;
  location: string; // HQ city, country
  founded: number; // number, not string, so you can sort or filter by it
  // Plain string so it covers private companies too, e.g. "Public · Nasdaq: WSE" or "Private"
  stage: string;
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

// ids are company slugs, so they stay stable if you key animations or routes off them.
const CELLS: CellData[] = [
  {
    id: "wise",
    imgSrc: "/logos/wise.svg",
    company: "Wise",
    title: "Money transfer and financial services",
    url: "https://wise.com/",
    reveal:
      "Wise makes sending, receiving, and holding money across currencies cheaper and more transparent, for both individuals and businesses.",
    detail: "Multi-currency accounts and money transfers",
    location: "London, United Kingdom",
    founded: 2011,
    stage: "Public · Nasdaq: WSE",
  },
  {
    id: "taxfix",
    imgSrc: "/logos/taxfix.svg",
    company: "Taxfix",
    title: "Tax preparation software",
    url: "https://taxfix.de/en/",
    reveal:
      "Taxfix lets users file tax returns from an app or the web by answering simple questions, the way a tax advisor would, while its tax engine works out the best refund.",
    detail: "Digital tax filing and tax guidance",
    location: "Berlin, Germany",
    founded: 2016,
    stage: "Private",
  },
  {
    id: "syfe",
    imgSrc: "/logos/syfe.svg",
    company: "Syfe",
    title: "Investment management",
    url: "https://www.syfe.com/",
    reveal:
      "Syfe is a digital wealth management platform offering managed portfolios and self-directed investing, all handled online.",
    detail: "Investment and portfolio management",
    location: "Singapore",
    founded: 2017,
    stage: "Private",
  },
  {
    id: "neo-financial",
    imgSrc: "/logos/neo-financial.svg",
    company: "Neo Financial",
    title: "Digital banking and consumer finance",
    url: "https://neofinancial.com/",
    reveal:
      "Neo Financial is a Canadian fintech that puts a cash back credit card, no-fee accounts, managed investments, and digital mortgages into a single app.",
    detail: "Digital banking and financial products",
    location: "Calgary, Canada",
    founded: 2018,
    stage: "Private",
  },
  {
    id: "revolut",
    imgSrc: "/logos/revolut.svg",
    company: "Revolut",
    title: "Digital banking",
    url: "https://www.revolut.com/",
    xUrl: "https://x.com/RevolutApp",
    reveal:
      "Revolut is a global financial app combining everyday banking, currency exchange, trading, and business accounts under one roof.",
    detail: "Multi-currency banking and trading",
    location: "London, United Kingdom",
    founded: 2015,
    stage: "Private",
  },
  {
    id: "mondu",
    imgSrc: "/logos/mondu.svg",
    company: "Mondu",
    title: "B2B payments",
    url: "https://www.mondu.ai/",
    reveal:
      "Mondu provides buy-now-pay-later and invoice payment options for business buyers, while sellers get paid upfront and the credit risk moves to Mondu.",
    detail: "Flexible payment options for businesses",
    location: "Berlin, Germany",
    founded: 2021,
    stage: "Private",
  },
  {
    id: "atlas",
    imgSrc: "/logos/atlas.svg",
    company: "Atlas",
    title: "Premium credit cards",
    url: "https://atlascard.com/",
    reveal:
      "Atlas is a members-only charge card built around last-minute access to sought-after dining, travel, and event experiences.",
    detail: "Members-only charge card and experience access",
    location: "New York, United States",
    founded: 2021,
    stage: "Private",
  },
  {
    id: "majority",
    imgSrc: "/logos/majority.svg",
    company: "Majority",
    title: "Digital banking",
    url: "https://www.majority.com/",
    reveal:
      "Majority is a mobile banking app aimed at immigrant communities, combining everyday banking with low-cost international money transfers.",
    detail: "Banking services and international money transfers",
    location: "Stockholm, Sweden",
    founded: 2019,
    stage: "Private",
  },
  {
    id: "qonto",
    imgSrc: "/logos/qonto.svg",
    company: "Qonto",
    title: "Business banking",
    url: "https://qonto.com/",
    reveal:
      "Qonto is a European business finance platform for SMEs and freelancers, with business accounts, payment cards, expense management, invoicing, and accounting tools.",
    detail: "Business accounts, cards, and expense management",
    location: "Paris, France",
    founded: 2016,
    stage: "Private",
  },
  {
    id: "bitpanda",
    imgSrc: "/logos/bitpanda.svg",
    company: "Bitpanda",
    title: "Digital asset investment",
    url: "https://www.bitpanda.com/",
    xUrl: "https://x.com/bitpanda",
    reveal:
      "Bitpanda is a European investment platform offering cryptocurrencies, stocks, ETFs, and precious metals, with availability varying by market.",
    detail: "Investments across multiple asset classes",
    location: "Vienna, Austria",
    founded: 2014,
    stage: "Private",
  },
  {
    id: "bukuwarung",
    imgSrc: "/logos/bukuwarung.svg",
    company: "BukuWarung",
    title: "Small-business fintech",
    url: "https://bukuwarung.com/",
    reveal:
      "BukuWarung is an Indonesian platform that helps micro and small merchants handle bookkeeping, digital payments, and day-to-day business operations.",
    detail: "Bookkeeping and business management tools",
    location: "Jakarta, Indonesia",
    founded: 2019,
    stage: "Private",
  },
  {
    id: "velocity",
    imgSrc: "/logos/velocity.svg",
    company: "Velocity",
    title: "Revenue-based financing",
    url: "https://velocity.in",
    xUrl: "https://x.com/velocity_in",
    reveal:
      "Velocity gives digital-first Indian businesses revenue-based financing and eCommerce analytics, alongside a corporate credit card and a payments management platform.",
    detail: "Growth financing for online businesses",
    location: "Bengaluru, India",
    founded: 2019,
    stage: "Private",
  },
  {
    id: "novo",
    imgSrc: "/logos/novo.svg",
    company: "Novo",
    title: "Small-business banking",
    url: "https://novo.co/",
    xUrl: "https://x.com/Novo_HQ",
    reveal:
      "Novo is a business banking platform for small business owners, pairing simple online accounts with tools that save time and improve cash flow.",
    detail: "Digital banking for small businesses",
    location: "Miami, United States",
    founded: 2016,
    stage: "Private",
  },
  {
    id: "regate",
    imgSrc: "/logos/regate.svg",
    company: "Regate",
    title: "Accounting software",
    url: "https://en.regate.io/",
    reveal:
      "Regate builds software that automates accounting workflows, from invoice management to day-to-day financial administration.",
    detail: "Accounting and financial operations automation",
    location: "Paris, France",
    founded: 2018,
    stage: "Private",
  },
  {
    id: "albo",
    imgSrc: "/logos/albo.svg",
    company: "Albo",
    title: "Digital banking",
    url: "https://www.albo.mx/",
    reveal:
      "Albo is a Mexican digital bank that lets people manage everyday money entirely from an app.",
    detail: "Banking and financial services in Mexico",
    location: "Mexico City, Mexico",
    founded: 2016,
    stage: "Private",
  },
  {
    id: "bestow",
    imgSrc: "/logos/bestow.svg",
    company: "Bestow",
    title: "Life insurance",
    url: "https://www.bestow.com/",
    reveal:
      "Bestow is an insurtech that provides the technology behind digital life insurance, replacing lengthy paperwork with a fast online application.",
    detail: "Digital life insurance products",
    location: "Dallas, United States",
    founded: 2016,
    stage: "Private",
  },
  {
    id: "capitec",
    imgSrc: "/logos/capitec.svg",
    company: "Capitec",
    title: "Retail banking and financial services",
    url: "https://www.capitecbank.co.za/",
    reveal:
      "Capitec is a South African bank offering digital banking, savings, credit, payments, and everyday financial services to individuals.",
    detail: "Personal banking, savings, credit, and payments",
    location: "Stellenbosch, South Africa",
    founded: 2001,
    stage: "Public · JSE: CPI",
  },
  {
    id: "standard-bank",
    imgSrc: "/logos/standardbank.svg",
    company: "Standard Bank",
    title: "Commercial and retail banking",
    url: "https://www.standardbank.co.za/",
    reveal:
      "Standard Bank is a major African financial services group providing personal and business banking, lending, investment, and wealth management services.",
    detail: "Personal banking, business banking, and wealth management",
    location: "Johannesburg, South Africa",
    founded: 1862,
    stage: "Public · JSE: SBK",
  },
  {
    id: "stripe",
    imgSrc: "/logos/stripe.svg",
    company: "Stripe",
    title: "Payments infrastructure",
    url: "https://stripe.com/",
    xUrl: "https://x.com/stripe",
    reveal:
      "Stripe provides the payments infrastructure that online businesses use to accept payments, manage subscriptions, and move money globally.",
    detail: "Payment processing and billing APIs",
    location: "San Francisco, United States",
    founded: 2010,
    stage: "Private",
  },

  {
    id: "monzo",
    imgSrc: "/logos/monzo.svg",
    company: "Monzo",
    title: "Digital banking",
    url: "https://monzo.com/",
    xUrl: "https://x.com/monzo",
    reveal:
      "Monzo is a UK digital bank built around its mobile app, offering current accounts, savings pots, and instant spending notifications.",
    detail: "App-first current accounts and savings",
    location: "London, United Kingdom",
    founded: 2015,
    stage: "Private",
  },
  {
    id: "nubank",
    imgSrc: "/logos/nubank.svg",
    company: "Nubank",
    title: "Digital banking and credit",
    url: "https://nubank.com.br/",
    reveal:
      "Nubank is a Latin American digital bank serving millions of customers in Brazil, Mexico, and Colombia with credit cards, accounts, and loans.",
    detail: "Credit cards and accounts across Latin America",
    location: "São Paulo, Brazil",
    founded: 2013,
    stage: "Public · NYSE: NU",
  },
  {
    id: "klarna",
    imgSrc: "/logos/klarna.svg",
    company: "Klarna",
    title: "Buy now, pay later",
    url: "https://www.klarna.com/",
    xUrl: "https://x.com/klarna",
    reveal:
      "Klarna is a Swedish payments company known for letting shoppers pay later or in instalments at online and in-store merchants.",
    detail: "Instalment payments and shopping tools",
    location: "Stockholm, Sweden",
    founded: 2005,
    stage: "Public · NYSE: KLAR",
  },
  {
    id: "absa",
    imgSrc: "/logos/absa.svg",
    company: "Absa",
    title: "Banking and financial services",
    url: "https://www.absa.co.za/",
    reveal:
      "Absa is a major African financial services group offering personal and business banking, lending, insurance, and investment products.",
    detail: "Personal banking, business banking, lending, and investments",
    location: "Johannesburg, South Africa",
    founded: 1991,
    stage: "Public · JSE: ABG",
  },
  {
    id: "investec",
    imgSrc: "/logos/investec.svg",
    company: "Investec",
    title: "International banking and wealth management",
    url: "https://www.investec.com/",
    reveal:
      "Investec is an international financial services group specialising in private banking, wealth management, and investment services.",
    detail: "Private banking, wealth management, and investments",
    location: "Sandton, South Africa",
    founded: 1974,
    stage: "Public · JSE: INL",
  },
  {
    id: "discovery-bank",
    imgSrc: "/logos/discoverybank.svg",
    company: "Discovery Bank",
    title: "Digital banking and financial services",
    url: "https://www.discovery.co.za/bank",
    reveal:
      "Discovery Bank is a digital bank that combines transactional accounts, savings, credit cards, and personalised financial rewards.",
    detail: "Digital banking, savings, credit, and rewards",
    location: "Sandton, South Africa",
    founded: 2019,
    stage: "Private · Discovery Limited group",
  },
  {
    id: "tymebank",
    imgSrc: "/logos/tymebank.svg",
    company: "TymeBank",
    title: "Digital banking",
    url: "https://www.tymebank.co.za/",
    reveal:
      "TymeBank is a digital banking provider offering accessible transactional accounts, savings products, and business banking services.",
    detail: "Digital personal banking, savings, and business accounts",
    location: "Johannesburg, South Africa",
    founded: 2019,
    stage: "Private",
  },
  {
    id: "om-bank",
    imgSrc: "/logos/ombank.svg",
    company: "OM Bank",
    title: "Digital banking and financial services",
    url: "https://www.oldmutual.co.za/",
    reveal:
      "OM Bank is associated with Old Mutual's financial services ecosystem, focused on making everyday banking and financial products more accessible to customers.",
    detail: "Banking and integrated financial services",
    location: "Cape Town, South Africa",
    founded: 2025,
    stage: "Private · Old Mutual subsidiary",
  },
  {
    id: "ramp",
    imgSrc: "/logos/ramp.svg",
    company: "Ramp",
    title: "Corporate cards and spend management",
    url: "https://ramp.com/",
    reveal:
      "Ramp is a corporate card and spend management platform that automates expense tracking, approvals, and bill payments for finance teams.",
    detail: "Corporate cards and expense automation",
    location: "New York, United States",
    founded: 2019,
    stage: "Private",
  },
  {
    id: "fnb",
    imgSrc: "/logos/fnb.svg",
    company: "FNB",
    title: "Retail and business banking",
    url: "https://www.fnb.co.za/",
    reveal:
      "FNB is a South African bank offering digital banking, transactional accounts, lending, investments, insurance, and financial services for individuals and businesses.",
    detail: "Personal banking, business banking, lending, and investments",
    location: "Johannesburg, South Africa",
    founded: 1838,
    stage: "Public · JSE: FSR",
  },
  {
    id: "nedbank",
    imgSrc: "/logos/nedbank.svg",
    company: "Nedbank",
    title: "Banking and financial services",
    url: "https://www.nedbank.co.za/",
    reveal:
      "Nedbank is a South African financial services group providing personal and business banking, lending, investment, and wealth management solutions.",
    detail: "Personal banking, corporate banking, lending, and investments",
    location: "Sandton, South Africa",
    founded: 1888,
    stage: "Public · JSE: NED",
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
      // Touch devices open the details directly instead of stepping through the hover reveal.
      onClick={() => {
        if (pointerTypeRef.current === "mouse") return;
        onSeeMore(cell);
      }}
      onFocus={(e) => {
        if (
          e.target instanceof HTMLElement &&
          e.target.matches(":focus-visible")
        ) {
          open();
        }
      }}
      onBlur={(e) => {
        // Focus moving from the cell to its own button is not "leaving", so don't collapse the reveal
        if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
        close();
      }}
      className="relative aspect-square min-w-0 cursor-pointer overflow-hidden bg-[#010c84] outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#F5D76A]"
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
          e.stopPropagation();
          onSeeMore(cell);
        }}
        data-wipe
        style={{ clipPath: "inset(100% 0% 0% 0%)" }}
        className="absolute inset-0 bg-white"
      >
        <div
          data-reveal
          className="flex h-full flex-col items-stretch justify-start gap-3 p-6 text-left text-[#010c84]"
        >
          <p
            className={`${companyFont.className} text-[1.05rem] font-medium capitalize tracking-tight`}
          >
            {cell.company}
          </p>
          {/* Clamped to 6 lines so the button always stays in view; the full text lives in the sidebar.
              Was "line-clamp-" (invalid class), so no clamp was actually applied. */}
          <p className="line-clamp-6 hidden md:block whitespace-pre-line text-justify text-xs font-medium leading-tight tracking-tight text-[#999]">
            {cell.reveal}
          </p>

          <p className="line-clamp-6 md:hidden whitespace-pre-line text-justify text-xs font-medium leading-tight tracking-tight text-[#999]">
            Click to see more details about{" "}
            <span className="capitalize">{cell.company}</span>
          </p>

          <button
            type="button"
            aria-haspopup="dialog"
            aria-label={`See more about ${cell.company}`}
            onClick={(e) => {
              // Prevent the card's touch handler from opening the sidebar again.
              e.stopPropagation();
              onSeeMore(cell);
            }}
            className="mt-auto hidden tracking-tighter self-start text-[#999] rounded-full  py-1.5 text-xs font-medium underline cursor-pointer transition-colors duration-300 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#010c84]"
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
      } else if (
        !e.shiftKey &&
        (activeElement === last || focusOutsideDialog)
      ) {
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
        className="invisible fixed left-0 top-0 z-[70] flex h-dvh w-full max-w-md flex-col z-[102] gap-8 overflow-y-auto bg-white p-6 text-[#010c84]"
      >
        <div className="absolute bottom-6 right-6">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="bg-[#010c84] cursor-pointer px-1 py-1 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#1A27B8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#010c84]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>
          </button>
        </div>

        {cell && (
          <>
            <div className="gap-2 flex mt-15 flex-col">
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
                  rel="noopener noreferrer"
                  className="underline cursor-pointer capitalize"
                >
                  {" "}
                  {cell.company}
                </a>
              </h2>
              <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                {cell.reveal}
              </h2>{" "}
            </div>

            <div className="my-auto ">
              <div className="grid grid-cols-2">
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">
                    Industry
                  </h2>
                  <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                    {cell.title}
                  </h2>
                </div>
                <div>
                  <h2 className="text-sm font-medium tracking-tight ">
                    Services
                  </h2>
                  <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                    {cell.detail}
                  </h2>
                </div>
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">
                    Location
                  </h2>
                  <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                    {cell.location}
                  </h2>
                </div>
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">
                    Founded
                  </h2>
                  <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                    {cell.founded}
                  </h2>
                </div>
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">
                    Stage
                  </h2>
                  <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                    {cell.stage}
                  </h2>
                </div>
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-sm font-medium tracking-tight text-[#999]">
                Connect with <span className="capitalize"> {cell.company}</span>
              </h2>
              <div className=" flex gap-4">
                <a
                  href={cell.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${cell.company} website`}
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
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M3 10H17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M10 3C11.7509 4.91685 12.7459 7.40442 12.8 10C12.7459 12.5956 11.7509 15.0832 10 17C8.24912 15.0832 7.25409 12.5956 7.20001 10C7.25409 7.40442 8.24912 4.91685 10 3V3Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </a>

                {cell.xUrl && (
                  <a
                    href={cell.xUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${cell.company} on X`}
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
                )}
                {cell.discordUrl && (
                  <a
                    href={cell.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${cell.company} on Discord`}
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
                )}
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
        className="grid w-full grid-cols-2 gap-[2px] bg-white p-[2px] md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      >
        <Link
          href="/"
          aria-label="Clipo home"
          className="block left-4 top-4 fixed z-1000 absolute shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://clipo.one/uploads/loading/see.svg?v=20260901-3"
            alt="Clipo"
            className="h-[56px] rotate-[15deg] w-auto"
          />
        </Link>
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
 * - `stage` is a display string rather than a structured listing: the sidebar only renders it,
 *   and one string covers public and private companies alike.
 */
