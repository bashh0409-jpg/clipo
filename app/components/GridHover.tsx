"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { Playfair_Display } from "next/font/google";
import Link from "next/link";
import { StockPanel } from "./StockPanel";
import { playUiSound } from "@/lib/ui-sounds";
gsap.registerPlugin(SplitText);

const companyFont = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const WIPE_HIDDEN = "inset(100% 0% 0% 0%)";
const WIPE_VISIBLE = "inset(0% 0% 0% 0%)";

const subscribeToNothing = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// Single declaration: the file previously declared CellData twice, which TS silently merged.
interface CellData {
  id: string;
  imgSrc: string;
  company: string;
  title: string;
  url: string;
  xUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  reveal: string;
  detail: string;
  location: string; // HQ city, country
  availability: string;
  audience: string;
  founded: number; // number, not string, so you can sort or filter by it
  // Plain string so it covers private companies too, e.g. "Public · Nasdaq: WSE" or "Private"
  stage: string;
  ceo?: string; // optional so unverified entries can stay blank rather than wrong
  stockUrl?: string; // only set for publicly listed companies
}

interface CellProps {
  cell: CellData;
  onSeeMore: (cell: CellData) => void;
  isSidebarOpen: boolean;
}

interface SidebarProps {
  cell: CellData | null;
  isOpen: boolean;
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
    xUrl: "https://x.com/Wise",
    instagramUrl: "https://www.instagram.com/wise/",
    linkedinUrl: "https://www.linkedin.com/company/wiseaccount",
    reveal:
      "Wise makes sending, receiving, and holding money across currencies cheaper and more transparent, for both individuals and businesses.",
    detail: "Multi-currency accounts and money transfers",
    location: "London, United Kingdom",
    availability: "Multiple countries; services vary by market",
    audience: "Individuals and businesses",
    founded: 2011,
    stage: "Public · Nasdaq: WSE",
    ceo: "Kristo Käärmann",
    stockUrl: "https://www.google.com/finance/quote/WSE:NASDAQ",
  },
  {
    id: "taxfix",
    imgSrc: "/logos/taxfix.svg",
    company: "Taxfix",
    title: "Tax preparation software",
    url: "https://taxfix.de/en/",
    instagramUrl: "https://www.instagram.com/taxfix/",
    linkedinUrl: "https://www.linkedin.com/company/taxfix",
    reveal:
      "Taxfix lets users file tax returns from an app or the web by answering simple questions, the way a tax advisor would, while its tax engine works out the best refund.",
    detail: "Digital tax filing and tax guidance",
    location: "Berlin, Germany",
    availability: "Germany and selected European markets",
    audience: "Individuals filing tax returns",
    founded: 2016,
    stage: "Private",
    ceo: "Martin Ott",
  },
  {
    id: "syfe",
    imgSrc: "/logos/syfe.svg",
    company: "Syfe",
    title: "Investment management",
    url: "https://www.syfe.com/",
    instagramUrl: "https://www.instagram.com/syfe.sg/",
    linkedinUrl: "https://www.linkedin.com/company/syfe",
    reveal:
      "Syfe is a digital wealth management platform offering managed portfolios and self-directed investing, all handled online.",
    detail: "Investment and portfolio management",
    location: "Singapore",
    availability: "Singapore and selected Asian markets",
    audience: "Individual investors",
    xUrl: "https://x.com/SyfeSG",
    founded: 2017,
    stage: "Private",
    ceo: "Dhruv Arora",
  },
  {
    id: "neo-financial",
    imgSrc: "/logos/neo-financial.svg",
    company: "Neo Financial",
    title: "Digital banking and consumer finance",
    url: "https://neofinancial.com/",
    instagramUrl: "https://www.instagram.com/neofinancial/",
    linkedinUrl: "https://www.linkedin.com/company/neofinancial",
    reveal:
      "Neo Financial is a Canadian fintech that puts a cash back credit card, no-fee accounts, managed investments, and digital mortgages into a single app.",
    detail: "Digital banking and financial products",
    location: "Calgary, Canada",
    availability: "Canada",
    audience: "Canadian individuals",
    xUrl: "https://x.com/Neofinancial",
    founded: 2018,
    stage: "Private",
    ceo: "Andrew Chau",
  },
  {
    id: "revolut",
    imgSrc: "/logos/revolut.svg",
    company: "Revolut",
    title: "Digital banking",
    url: "https://www.revolut.com/",
    xUrl: "https://x.com/Revolut",
    instagramUrl: "https://www.instagram.com/revolut/",
    linkedinUrl: "https://www.linkedin.com/company/revolut",
    reveal:
      "Revolut is a global financial app combining everyday banking, currency exchange, trading, and business accounts under one roof.",
    detail: "Multi-currency banking and trading",
    location: "London, United Kingdom",
    availability: "Multiple countries; product eligibility varies",
    audience: "Individuals and businesses",
    founded: 2015,
    stage: "Private",
    ceo: "Nikolay (Nik) Storonsky",
  },
  {
    id: "mondu",
    imgSrc: "/logos/mondu.svg",
    company: "Mondu",
    title: "B2B payments",
    url: "https://www.mondu.ai/",
    instagramUrl: "https://www.instagram.com/mondu.ai/",
    linkedinUrl: "https://www.linkedin.com/company/mondu",
    reveal:
      "Mondu provides buy-now-pay-later and invoice payment options for business buyers, while sellers get paid upfront and the credit risk moves to Mondu.",
    detail: "Flexible payment options for businesses",
    location: "Berlin, Germany",
    ceo: "Malte Huffmann",
    availability: "Selected European markets",
    audience: "Business buyers, merchants, and marketplaces",
    founded: 2021,
    stage: "Private",
  },
  {
    id: "atlas",
    imgSrc: "/logos/atlas.svg",
    company: "Atlas",
    title: "Premium credit cards",
    url: "https://atlascard.com/",
    instagramUrl: "https://www.instagram.com/atlascard/",
    linkedinUrl: "https://www.linkedin.com/company/atlas-card",
    reveal:
      "Atlas is a members-only charge card built around last-minute access to sought-after dining, travel, and event experiences.",
    detail: "Members-only charge card and experience access",
    location: "New York, United States",
    availability: "United States",
    ceo: "Patrick Mrozowski",
    xUrl: "https://twitter.com/atlascard",
    audience: "Members seeking premium experiences",
    founded: 2021,
    stage: "Private",
  },
  {
    id: "majority",
    imgSrc: "/logos/majority.svg",
    company: "Majority",
    title: "Digital banking",
    url: "https://www.majority.com/",
    instagramUrl: "https://www.instagram.com/majority/",
    linkedinUrl: "https://www.linkedin.com/company/majority",
    reveal:
      "Majority is a mobile banking app aimed at immigrant communities, combining everyday banking with low-cost international money transfers.",
    detail: "Banking services and international money transfers",
    location: "Stockholm, Sweden",
    ceo: "Magnus Larsson",
    availability: "United States",
    audience: "Migrant communities and their families",
    founded: 2019,
    stage: "Private",
  },
  {
    id: "qonto",
    imgSrc: "/logos/qonto.svg",
    company: "Qonto",
    title: "Business banking",
    url: "https://qonto.com/",
    xUrl: "https://x.com/Qonto",
    instagramUrl: "https://www.instagram.com/qonto/",
    linkedinUrl: "https://www.linkedin.com/company/qonto",
    reveal:
      "Qonto is a European business finance platform for SMEs and freelancers, with business accounts, payment cards, expense management, invoicing, and accounting tools.",
    detail: "Business accounts, cards, and expense management",
    location: "Paris, France",
    availability: "France and selected European markets",
    audience: "SMEs and freelancers",
    founded: 2016,
    stage: "Private",
    ceo: "Alexandre Prot",
  },
  {
    id: "bitpanda",
    imgSrc: "/logos/bitpanda.svg",
    company: "Bitpanda",
    title: "Digital asset investment",
    url: "https://www.bitpanda.com/",
    xUrl: "https://x.com/bitpanda",
    instagramUrl: "https://www.instagram.com/bitpanda/",
    linkedinUrl: "https://www.linkedin.com/company/bitpanda",
    reveal:
      "Bitpanda is a European investment platform offering cryptocurrencies, stocks, ETFs, and precious metals, with availability varying by market.",
    detail: "Investments across multiple asset classes",
    location: "Vienna, Austria",
    availability: "Selected European markets",
    audience: "First-time and experienced investors",
    founded: 2014,
    stage: "Private",
    ceo: "Eric Demuth",
  },
  {
    id: "bukuwarung",
    imgSrc: "/logos/bukuwarung.svg",
    company: "BukuWarung",
    title: "Small-business fintech",
    url: "https://bukuwarung.com/",
    instagramUrl: "https://www.instagram.com/bukuwarung/",
    linkedinUrl: "https://www.linkedin.com/company/bukuwarung",
    reveal:
      "BukuWarung is an Indonesian platform that helps micro and small merchants handle bookkeeping, digital payments, and day-to-day business operations.",
    detail: "Bookkeeping and business management tools",
    location: "Jakarta, Indonesia",
    availability: "Indonesia",
    audience: "Micro and small merchants",
    founded: 2019,
    stage: "Private",
    ceo: "Abhinay Peddisetty",
  },
  {
    id: "velocity",
    imgSrc: "/logos/velocity.svg",
    company: "Velocity",
    title: "Revenue-based financing",
    url: "https://velocity.in",
    xUrl: "https://x.com/velocity_in",
    instagramUrl: "https://www.instagram.com/velocity.in/",
    linkedinUrl: "https://www.linkedin.com/company/velocity-in",
    reveal:
      "Velocity gives digital-first Indian businesses revenue-based financing and eCommerce analytics, alongside a corporate credit card and a payments management platform.",
    detail: "Growth financing for online businesses",
    location: "Bengaluru, India",
    availability: "India",
    audience: "Digital-first and ecommerce businesses",
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
    instagramUrl: "https://www.instagram.com/novo_hq/",
    linkedinUrl: "https://www.linkedin.com/company/novohq",
    reveal:
      "Novo is a business banking platform for small business owners, pairing simple online accounts with tools that save time and improve cash flow.",
    detail: "Digital banking for small businesses",
    location: "Miami, United States",
    availability: "United States",
    audience: "Small businesses and founders",
    founded: 2016,
    stage: "Private",
    ceo: "Michael Rangel",
  },
  {
    id: "regate",
    imgSrc: "/logos/regate.svg",
    company: "Regate",
    title: "Accounting software",
    url: "https://www.regate.io/",
    linkedinUrl: "https://www.linkedin.com/company/regate",
    reveal:
      "(Acquired by Qonto, March 2024). Regate builds software that automates accounting workflows, from invoice management to day-to-day financial administration.",
    detail: "Accounting and financial operations automation",
    location: "Paris, France",
    availability: "France; now part of Qonto",
    audience: "SMEs and accounting teams",
    founded: 2018,
    stage: "Private",
  },
  {
    id: "albo",
    imgSrc: "/logos/albo.svg",
    company: "Albo",
    title: "Digital banking",
    url: "https://www.albo.mx/",
    instagramUrl: "https://www.instagram.com/albo.mx/",
    linkedinUrl: "https://www.linkedin.com/company/albomx",
    reveal:
      "Albo is a Mexican digital bank that lets people manage everyday money entirely from an app.",
    detail: "Banking and financial services in Mexico",
    location: "Mexico City, Mexico",
    availability: "Mexico",
    xUrl: "https://x.com/albomx",
    ceo: "Angel Sahagún",
    audience: "Individuals and small businesses",
    founded: 2016,
    stage: "Private",
  },
  {
    id: "bestow",
    imgSrc: "/logos/bestow.svg",
    company: "Bestow",
    title: "Life insurance",
    url: "https://www.bestow.com/",
    instagramUrl: "https://www.instagram.com/bestow/",
    linkedinUrl: "https://www.linkedin.com/company/bestow",
    reveal:
      "Bestow is an insurtech that provides the technology behind digital life insurance, replacing lengthy paperwork with a fast online application.",
    detail: "Digital life insurance products",
    location: "Dallas, United States",
    availability: "United States",
    audience: "Insurance carriers and their customers",
    founded: 2016,
    stage: "Private",
    ceo: "Melbourne O'Banion",
  },
  {
    id: "capitec",
    imgSrc: "/logos/capitec.svg",
    company: "Capitec",
    title: "Retail banking and financial services",
    url: "https://www.capitecbank.co.za/",
    instagramUrl: "https://www.instagram.com/capitecbank/",
    linkedinUrl: "https://www.linkedin.com/company/capitec-bank",
    reveal:
      "Capitec is a South African bank offering digital banking, savings, credit, payments, and everyday financial services to individuals.",
    detail: "Personal banking, savings, credit, and payments",
    location: "Stellenbosch, South Africa",
    availability: "South Africa",
    audience: "Individuals",
    xUrl: "https://x.com/CapitecBankSA",
    founded: 2001,
    stage: "Public · JSE: CPI",
    ceo: "Graham Lee",
    stockUrl: "https://www.google.com/finance/quote/CPI:JSE",
  },
  {
    id: "yoco",
    imgSrc: "/logos/yoco.svg",
    company: "Yoco",
    title: "Payments and business tools",
    url: "https://www.yoco.com/",
    reveal:
      "Yoco provides card machines, online payments, and business tools that help small businesses accept payments and manage sales.",
    detail: "Card payments, online checkout, and tools for small businesses",
    location: "Cape Town, South Africa",
    availability: "South Africa",
    audience: "Small businesses and merchants",
    founded: 2015,
    ceo: "Carsten Höltkemeyer",
    stage: "Private",
    xUrl: "https://twitter.com/Yoco_ZA",
    instagramUrl: "https://www.instagram.com/yoco_za/ ",
    linkedinUrl: "https://www.linkedin.com/company/yoco/",
    youtubeUrl: "https://www.youtube.com/channel/UCjcas3l1Uh5NKavSIHunwwA",
  },
  {
    id: "chipper-cash",
    imgSrc: "/logos/chipper.svg",
    company: "Chipper Cash",
    title: "Mobile and cross-border payments",
    url: "https://www.chippercash.com/",
    reveal:
      "Chipper Cash is a financial technology company offering mobile payment and cross-border money transfer services across several African markets.",
    detail: "Mobile payments and cross-border transfers",
    location: "San Francisco, United States",
    availability: "Selected African markets",
    audience: "Consumers and businesses",
    founded: 2018,
    ceo: "Ham Serunjogi",
    stage: "Private",
    youtubeUrl: "https://www.youtube.com/channel/UCV8JsFe389TSrTuuXMZS6Ww",
    xUrl: "https://twitter.com/chippercashapp",
    instagramUrl: "https://www.instagram.com/chippercashapp",
  },
  {
    id: "standard-bank",
    imgSrc: "/logos/standardbank.svg",
    company: "Standard Bank",
    title: "Commercial and retail banking",
    url: "https://www.standardbank.co.za/",
    instagramUrl: "https://www.instagram.com/standardbanksa/",
    linkedinUrl: "https://www.linkedin.com/company/standard-bank",
    reveal:
      "Standard Bank is a major African financial services group providing personal and business banking, lending, investment, and wealth management services.",
    detail: "Personal banking, business banking, and wealth management",
    location: "Johannesburg, South Africa",
    availability: "South Africa and selected African markets",
    audience: "Individuals, businesses, and institutions",
    xUrl: "http://www.twitter.com/standardbankza",
    founded: 1862,
    stage: "Public · JSE: SBK",
    ceo: "Sim Tshabalala", // retiring end of 2027
    stockUrl: "https://www.google.com/finance/quote/SBK:JSE",
  },
  {
    id: "polar",
    imgSrc: "/logos/polar.svg",
    company: "Polar",
    title: "Developer billing and payment infrastructure",
    url: "https://polar.sh/",
    xUrl: "https://x.com/polar_sh",
    linkedinUrl: "https://www.linkedin.com/company/polar-sh",
    reveal:
      "Polar is an open-source billing platform that helps software developers and AI companies monetize their products through subscriptions, usage-based billing, one-time payments, and credits. It also acts as a Merchant of Record, handling global sales tax and billing operations.",
    detail:
      "Usage-based billing, subscriptions, checkout, payment processing, credits, and tax compliance",
    location: "Stockholm, Sweden · Remote team",
    availability:
      "Available internationally, subject to supported markets and payment requirements",
    audience: "Developers, indie hackers, SaaS businesses, etc.",
    founded: 2022,
    stage: "Private · Venture-backed",
    ceo: "Birk Jernström",
    stockUrl: undefined,
  },
  {
    id: "stripe",
    imgSrc: "/logos/stripe.svg",
    company: "Stripe",
    title: "Payments infrastructure",
    url: "https://stripe.com/",
    xUrl: "https://x.com/stripe",
    instagramUrl: "https://www.instagram.com/stripe/",
    linkedinUrl: "https://www.linkedin.com/company/stripe",
    reveal:
      "Stripe provides the payments infrastructure that online businesses use to accept payments, manage subscriptions, and move money globally.",
    detail: "Payment processing and billing APIs",
    location: "San Francisco, United States",
    availability: "Multiple countries; capabilities vary by market",
    audience: "Online businesses and developers",
    founded: 2010,
    stage: "Private",
    ceo: "Patrick Collison",
  },
  {
    id: "airwallex",
    imgSrc: "/logos/airwaxel.svg",
    company: "Airwallex",
    title: "Global business payments",
    url: "https://www.airwallex.com/",
    reveal:
      "Airwallex provides cross-border payments, business accounts, cards, and financial operations tools for businesses operating internationally.",
    detail: "Cross-border payments and global business accounts",
    location: "Melbourne, Australia",
    availability: "Multiple countries; products vary by market",
    audience: "Businesses operating internationally",
    founded: 2015,
    stage: "Private",
    ceo: "Jack Zhang",
    xUrl: "https://twitter.com/airwallex",
    linkedinUrl: "https://linkedin.com/company/airwallex",
  },
  {
    id: "monzo",
    imgSrc: "/logos/monzo.svg",
    company: "Monzo",
    title: "Digital banking",
    url: "https://monzo.com/",
    xUrl: "https://x.com/monzo",
    instagramUrl: "https://www.instagram.com/monzo/",
    linkedinUrl: "https://www.linkedin.com/company/monzo-bank",
    reveal:
      "Monzo is a UK digital bank built around its mobile app, offering current accounts, savings pots, and instant spending notifications.",
    detail: "App-first current accounts and savings",
    location: "London, United Kingdom",
    availability: "United Kingdom",
    audience: "Individuals and small businesses",
    founded: 2015,
    stage: "Private",
    ceo: "Diana Layfield", // succeeded TS Anil in 2026
  },
  {
    id: "nubank",
    imgSrc: "/logos/nubank.svg",
    company: "Nubank",
    title: "Digital banking and credit",
    url: "https://nubank.com.br/",
    xUrl: "https://x.com/nubank",
    instagramUrl: "https://www.instagram.com/nubank/",
    linkedinUrl: "https://www.linkedin.com/company/nubank",
    reveal:
      "Nubank is a Latin American digital bank serving millions of customers in Brazil, Mexico, and Colombia with credit cards, accounts, and loans.",
    detail: "Credit cards and accounts across Latin America",
    location: "São Paulo, Brazil",
    availability: "Brazil, Mexico, and Colombia",
    audience: "Individuals and small businesses",
    founded: 2013,
    stage: "Public · NYSE: NU",
    ceo: "David Vélez",
    stockUrl: "https://www.google.com/finance/quote/NU:NYSE",
  },
  {
    id: "klarna",
    imgSrc: "/logos/klarna.svg",
    company: "Klarna",
    title: "Buy now, pay later",
    url: "https://www.klarna.com/",
    xUrl: "https://x.com/klarna",
    instagramUrl: "https://www.instagram.com/klarna/",
    linkedinUrl: "https://www.linkedin.com/company/klarna",
    reveal:
      "Klarna is a Swedish payments company known for letting shoppers pay later or in instalments at online and in-store merchants.",
    detail: "Instalment payments and shopping tools",
    location: "Stockholm, Sweden",
    availability: "Multiple countries; products vary by market",
    audience: "Shoppers and merchants",
    founded: 2005,
    stage: "Public · NYSE: KLAR",
    ceo: "Sebastian Siemiatkowski",
    stockUrl: "https://www.google.com/finance/quote/KLAR:NYSE",
  },
  {
    id: "absa",
    imgSrc: "/logos/absa.svg",
    company: "Absa",
    title: "Banking and financial services",
    url: "https://www.absa.co.za/",
    instagramUrl: "https://www.instagram.com/absasouthafrica/",
    linkedinUrl: "https://www.linkedin.com/company/absa",
    reveal:
      "Absa is a major African financial services group offering personal and business banking, lending, insurance, and investment products.",
    detail: "Personal banking, business banking, lending, and investments",
    location: "Johannesburg, South Africa",
    availability: "South Africa and selected African markets",
    audience: "Individuals, businesses, and corporates",
    xUrl: "https://twitter.com/AbsaSouthAfrica",
    founded: 1991,
    stage: "Public · JSE: ABG",
    ceo: "Kenny Fihla",
    stockUrl: "https://www.google.com/finance/quote/ABG:JSE",
  },
  {
    id: "investec",
    imgSrc: "/logos/investec.svg",
    company: "Investec",
    title: "International banking and wealth management",
    url: "https://www.investec.com/",
    instagramUrl: "https://www.instagram.com/investec/",
    linkedinUrl: "https://www.linkedin.com/company/investec",
    reveal:
      "Investec is an international financial services group specialising in private banking, wealth management, and investment services.",
    detail: "Private banking, wealth management, and investments",
    location: "Sandton, South Africa",
    availability: "South Africa, the UK, and selected markets",
    audience: "Private clients, businesses, and institutions",
    xUrl: "https://x.com/Investec",
    founded: 1974,
    stage: "Public · JSE: INL",
    ceo: "Fani Titi",
    stockUrl: "https://www.google.com/finance/quote/INL:JSE",
  },
  {
    id: "discovery-bank",
    imgSrc: "/logos/discoverybank.svg",
    company: "Discovery Bank",
    title: "Digital banking and financial services",
    url: "https://www.discovery.co.za/",
    instagramUrl: "https://www.instagram.com/discovery_sa/",
    linkedinUrl: "https://www.linkedin.com/company/discovery-bank",
    reveal:
      "Discovery Bank is a digital bank that combines transactional accounts, savings, credit cards, and personalised financial rewards.",
    detail: "Digital banking, savings, credit, and rewards",
    location: "Sandton, South Africa",
    availability: "South Africa",
    audience: "Individuals",
    xUrl: "https://x.com/Discovery_SA",
    founded: 2019,
    stage: "Private · Discovery Limited group",
    ceo: "Hylton Kallner",
  },
  {
    id: "tymebank",
    imgSrc: "/logos/tymebank.svg",
    company: "Gotyme Bank",
    title: "Digital banking",
    url: "https://gotyme.co.za/",
    instagramUrl: "https://www.instagram.com/tymebank/",
    linkedinUrl: "https://www.linkedin.com/company/tymebank",
    reveal:
      "TymeBank is a digital banking provider offering accessible transactional accounts, savings products, and business banking services.",
    detail: "Digital personal banking, savings, and business accounts",
    location: "Johannesburg, South Africa",
    availability: "South Africa",
    audience: "Individuals and small businesses",
    xUrl: "https://x.com/gotymebankza",
    founded: 2019,
    stage: "Private",
    ceo: "Coen Jonker",
  },
  {
    id: "om-bank",
    imgSrc: "/logos/ombank.svg",
    company: "OM Bank",
    title: "Digital banking and financial services",
    url: "https://www.oldmutual.co.za/",
    instagramUrl: "https://www.instagram.com/oldmutualsa/",
    linkedinUrl: "https://www.linkedin.com/company/om-bank",
    reveal:
      "OM Bank is associated with Old Mutual's financial services ecosystem, focused on making everyday banking and financial products more accessible to customers.",
    detail: "Banking and integrated financial services",
    location: "Cape Town, South Africa",
    availability: "South Africa",
    audience: "Individuals and businesses",
    ceo: "Tsakani Clarence Nethengwe",
    xUrl: "https://x.com/OldMutualSA",
    founded: 2025,
    stage: "Private · Old Mutual subsidiary",
  },
  {
    id: "ramp",
    imgSrc: "/logos/ramp.svg",
    company: "Ramp",
    title: "Corporate cards and spend management",
    url: "https://ramp.com/",
    xUrl: "https://x.com/tryramp",
    instagramUrl: "https://www.instagram.com/tryramp/",
    linkedinUrl: "https://www.linkedin.com/company/ramp",
    reveal:
      "Ramp is a corporate card and spend management platform that automates expense tracking, approvals, and bill payments for finance teams.",
    detail: "Corporate cards and expense automation",
    location: "New York, United States",
    availability: "United States and selected markets",
    audience: "Businesses and finance teams",
    founded: 2019,
    stage: "Private",
    ceo: "Eric Glyman",
  },
  {
    id: "fnb",
    imgSrc: "/logos/fnb.svg",
    company: "FNB",
    title: "Retail and business banking",
    url: "https://www.fnb.co.za/",
    xUrl: "https://x.com/FNBSA",
    instagramUrl: "https://www.instagram.com/fnbsa/",
    linkedinUrl: "https://www.linkedin.com/company/fnb",
    reveal:
      "FNB is a South African bank offering digital banking, transactional accounts, lending, investments, insurance, and financial services for individuals and businesses.",
    detail: "Personal banking, business banking, lending, and investments",
    location: "Johannesburg, South Africa",
    availability: "South Africa",
    audience: "Individuals and businesses",
    founded: 1838,
    stage: "Public · JSE: FSR",
    ceo: "Harry Kellan", // Lytania Johnson takes over when he retires at end of 2026
    stockUrl: "https://www.google.com/finance/quote/FSR:JSE", // parent: FirstRand
  },
  {
    id: "nedbank",
    imgSrc: "/logos/nedbank.svg",
    company: "Nedbank",
    title: "Banking and financial services",
    url: "https://www.nedbank.co.za/",
    xUrl: "https://x.com/Nedbank",
    instagramUrl: "https://www.instagram.com/nedbank/",
    linkedinUrl: "https://www.linkedin.com/company/nedbank",
    reveal:
      "Nedbank is a South African financial services group providing personal and business banking, lending, investment, and wealth management solutions.",
    detail: "Personal banking, corporate banking, lending, and investments",
    location: "Sandton, South Africa",
    availability: "South Africa and selected African markets",
    audience: "Individuals, businesses, and corporates",
    founded: 1888,
    stage: "Public · JSE: NED",
    ceo: "Jason Quinn",
    stockUrl: "https://www.google.com/finance/quote/NED:JSE",
  },
  {
    id: "veyra",
    imgSrc: "/logos/veyra.svg",
    company: "Veyra group",
    title: "Company discovery website",
    url: "https://veyra.thewisestudio.xyz/",
    reveal:
      "Veyra Group is an independent company-discovery website helping people explore the companies and products shaping everyday life. Browse profiles to learn what each company does, who it serves, and where it operates. Good ideas deserve to be seen.",
    detail: "Company profiles and discovery",
    location: "Pietermaritzburg, South Africa",
    ceo: "Wandile M. Y. Langa",
    availability: "Explore individual portfolio company profiles",
    audience: "People exploring companies, products, and ideas",
    founded: 2026,
    stage: "Private · Holding company",
  },
];

function Cell({ cell, onSeeMore, isSidebarOpen }: CellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cursorHintRef = useRef<HTMLSpanElement>(null);
  const detailsLabelRef = useRef<HTMLSpanElement>(null);
  const pointerTypeRef = useRef<string>("mouse");
  const dismissingRef = useRef(false);
  const [cursorHint, setCursorHint] = useState("Info");
  const websiteHost = cell.company
    .replace(/(^\w+:|^)\/\//, "")
    .replace(/^www\./i, "")
    .split(/[/?#]/)[0];

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionPreferenceChange = () => {
      if (!reducedMotion.matches) return;
      const visible =
        rootRef.current?.matches(":hover") ||
        rootRef.current?.contains(document.activeElement) ||
        false;
      const wipe = rootRef.current?.querySelector<HTMLElement>("[data-wipe]");
      if (wipe) {
        gsap.killTweensOf(wipe);
        gsap.set(wipe, {
          clipPath: visible ? WIPE_VISIBLE : WIPE_HIDDEN,
        });
      }
    };

    reducedMotion.addEventListener("change", handleMotionPreferenceChange);
    return () =>
      reducedMotion.removeEventListener("change", handleMotionPreferenceChange);
  }, []);

  const setWipeVisible = (visible: boolean) => {
    const wipe = rootRef.current?.querySelector<HTMLElement>("[data-wipe]");
    if (!wipe) return;

    gsap.killTweensOf(wipe);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(wipe, {
        clipPath: visible ? WIPE_VISIBLE : WIPE_HIDDEN,
      });
      return;
    }

    gsap.to(wipe, {
      clipPath: visible ? WIPE_VISIBLE : WIPE_HIDDEN,
      duration: 0.7,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  };

  const open = () => setWipeVisible(true);
  const close = () => setWipeVisible(false);

  const animateDetailsLabel = (visible: boolean) => {
    const label = detailsLabelRef.current;
    if (!label) return;

    gsap.killTweensOf(label);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(label, { yPercent: 0 });
      return;
    }

    gsap.to(label, {
      yPercent: visible ? -50 : 0,
      duration: visible ? 0.38 : 0.24,
      ease: visible ? "power3.out" : "power2.inOut",
      overwrite: true,
    });
  };

  const changeCursorHint = (nextHint: string) => {
    if (cursorHint === nextHint) return;

    const hint = cursorHintRef.current;
    if (
      !hint ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setCursorHint(nextHint);
      return;
    }

    gsap.killTweensOf(hint);
    gsap.to(hint, {
      filter: "blur(5px)",
      duration: 0.12,
      onComplete: () => {
        setCursorHint(nextHint);
        requestAnimationFrame(() => {
          gsap.to(hint, {
            filter: "blur(0px)",
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => gsap.set(hint, { clearProps: "filter" }),
          });
        });
      },
    });
  };

  useEffect(() => {
    if (isSidebarOpen) return;

    const root = rootRef.current;
    if (!root) return;

    const wipe = root.querySelector<HTMLElement>("[data-wipe]");
    if (wipe) {
      gsap.killTweensOf(wipe);
      gsap.set(wipe, {
        clipPath: WIPE_HIDDEN,
      });
    }

    dismissingRef.current = false;
    const focusVisible =
      document.activeElement instanceof HTMLElement &&
      root.contains(document.activeElement) &&
      document.activeElement.matches(":focus-visible");
    if (!root.matches(":hover") && !focusVisible) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (wipe) gsap.set(wipe, { clipPath: WIPE_VISIBLE });
    } else if (wipe) {
      gsap.to(wipe, {
        clipPath: WIPE_VISIBLE,
        duration: 0.7,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }
  }, [isSidebarOpen]);

  const dismissUp = () => {
    dismissingRef.current = true;

    const wipe = rootRef.current?.querySelector<HTMLElement>("[data-wipe]");
    if (!wipe) return;

    const clipPath = "inset(0% 0% 100% 0%)";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(wipe, { clipPath });
      return;
    }

    gsap.to(wipe, {
      clipPath,
      duration: 1,
      ease: "power3.inOut",
      overwrite: "auto",
    });
  };

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
        if (e.pointerType === "mouse") {
          const hint = cursorHintRef.current;
          if (hint) {
            const x = Math.max(
              8,
              Math.min(
                e.clientX + 14,
                window.innerWidth - hint.offsetWidth - 8,
              ),
            );
            const y = Math.max(
              8,
              Math.min(
                e.clientY + 14,
                window.innerHeight - hint.offsetHeight - 8,
              ),
            );
            gsap.set(hint, {
              x,
              y,
            });
            gsap.to(hint, { autoAlpha: 1, duration: 0.18 });
          }
          if (dismissingRef.current) {
            const wipe =
              rootRef.current?.querySelector<HTMLElement>("[data-wipe]");
            if (wipe) gsap.killTweensOf(wipe);
            dismissingRef.current = false;
          }
          playUiSound("/tap_05.ogg");
          open();
        }
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") {
          gsap.to(cursorHintRef.current, {
            autoAlpha: 0,
            duration: 0.15,
            overwrite: "auto",
          });
          if (!dismissingRef.current) close();
        }
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !cursorHintRef.current) return;
        const hint = cursorHintRef.current;
        const x = Math.max(
          8,
          Math.min(e.clientX + 14, window.innerWidth - hint.offsetWidth - 8),
        );
        const y = Math.max(
          8,
          Math.min(e.clientY + 14, window.innerHeight - hint.offsetHeight - 8),
        );
        gsap.to(cursorHintRef.current, {
          x,
          y,
          duration: 0.12,
          ease: "power2.out",
          overwrite: "auto",
        });
      }}
      // Touch devices open the details directly instead of stepping through the hover reveal.
      onClick={() => {
        if (pointerTypeRef.current === "mouse") return;
        playUiSound("/tick.ogg");
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
        if (dismissingRef.current) return;
        close();
      }}
      className="relative aspect-square min-w-0 cursor-pointer overflow-hidden outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#F5D76A]"
    >
      <div
        data-base
        className="pointer-events-none absolute inset-0 z-0 flex items-center bg-[#050a4c]  justify-center p-4 text-center text-[clamp(1.4rem,3vw,3.25rem)] leading-none tracking-tight text-white"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cell.imgSrc || undefined}
          alt={cell.company}
          className=" max-w-[100%] object-contain"
        />
      </div>

      {/* Initial clip-path inline so the white layer is hidden before GSAP hydrates */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          playUiSound("/tick.ogg");
          dismissUp();
          onSeeMore(cell);
        }}
        data-wipe
        style={{ clipPath: WIPE_HIDDEN }}
        className="absolute inset-0 z-10 bg-white"
      >
        <div
          data-reveal
          className="flex h-full flex-col items-stretch justify-start gap-3 p-6 text-left text-[#050a4c]"
        >
          <p
            className={`${companyFont.className} italic text-4xl font-medium capitalize tracking-tighter`}
          >
            {cell.company}
          </p>
          {/* Clamped to 6 lines so the button always stays in view; the full text lives in the sidebar.
              Was "line-clamp-" (invalid class), so no clamp was actually applied. */}
          <p className="line-clamp-6  hidden md:block whitespace-pre-line text-justify text-sm font-medium leading-tight tracking-tight text-[#999]">
            {cell.reveal}
          </p>

          <p className="line-clamp-6 md:hidden whitespace-pre-line text-justify text-sm font-medium leading-tight tracking-tight text-[#999]">
            Click to see more details about{" "}
            <span className="capitalize">{cell.company}</span>
          </p>
          <div className="mt-auto flex w-full min-w-0 items-center justify-between gap-2">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label={`See more about ${cell.company}`}
              onClick={(e) => {
                // Prevent the card's touch handler from opening the sidebar again.
                e.stopPropagation();
                playUiSound("/tick.ogg");
                dismissUp();
                onSeeMore(cell);
              }}
              onPointerEnter={() => animateDetailsLabel(true)}
              onPointerLeave={(event) => {
                if (!event.currentTarget.matches(":focus-visible")) {
                  animateDetailsLabel(false);
                }
              }}
              onFocus={() => animateDetailsLabel(true)}
              onBlur={(event) => {
                if (!event.currentTarget.matches(":hover")) {
                  animateDetailsLabel(false);
                }
              }}
              className="group flex shrink-0 duration-300 transition-colors transition capitalize items-center whitespace-nowrap py-0.5 rounded text-[#999] hover:text-[#fff] text-sm font-medium bg-[#050a4c]/5 px-2 tracking-tighter  hover:bg-[#050a4c] cursor-pointer transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#050a4c]"
            >
              <span className="h-4 w-fit overflow-hidden">
                <span ref={detailsLabelRef} className="flex flex-col">
                  <span className="flex h-4 shrink-0 items-center justify-center">
                    See more
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex h-4 shrink-0 items-center justify-center"
                  >
                    See more
                  </span>
                </span>
              </span>
            </button>

            <a
              href={cell.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${cell.company} website`}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") {
                  changeCursorHint(`Visit ${websiteHost}`);
                }
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") {
                  changeCursorHint("Info");
                }
              }}
              className="flex min-w-0 items-center w-fit gap-1 text-sm font-medium tracking-tight text-[#999] hover:underline transition-colors duration-500 hover:text-[#050a4c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#050a4c]"
            >
              <span className="truncate text-right">
                {`www.${cell.url
                  .replace(/(^\w+:|^)\/\//, "")
                  .replace(/^www\./i, "")
                  .replace(/\/+$/, "")}`}
              </span>
            </a>
          </div>
        </div>
      </div>
      {typeof document !== "undefined" &&
        createPortal(
          <span
            ref={cursorHintRef}
            aria-hidden="true"
            style={{ zIndex: 2147483647 }}
            className="pointer-events-none fixed px-1  rounded-xs left-0 top-0 z-[99999] whitespace-nowrap bg-black p-0.5  font-mon font-semibold text-[10px] uppercase tracking-tight text-white opacity-0"
          >
            {cursorHint}
          </span>,
          document.body,
        )}
    </div>
  );
}

function DetailsSidebar({ cell, isOpen, onClose }: SidebarProps) {
  const portalReady = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!portalReady || !cell) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const splitText = reducedMotion
      ? null
      : SplitText.create(
          rootRef.current?.querySelectorAll<HTMLElement>(
            "[data-panel] h2:not(.hidden), [data-panel] p",
          ) ?? [],
          {
            type: "lines",
            mask: "lines",
          },
        );

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
          { clipPath: "inset(0% 100% 0% 0%)", autoAlpha: 0 },
          { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 },
          0,
        )
        .fromTo(
          "[data-item]",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.45 },
          0,
        )
        .fromTo(
          splitText?.lines ?? [],
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1,
          },
          0.2,
        );
    }, rootRef);

    return () => {
      ctx.revert();
      splitText?.revert();
    };
  }, [portalReady, cell]);

  useEffect(() => {
    if (!portalReady) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const reducedMotion = motionPreference.matches;
    const tl = tlRef.current;
    const handleMotionPreferenceChange = () => {
      if (!motionPreference.matches) return;
      tl?.pause().progress(isOpen ? 1 : 0);
      gsap.set("[data-overlay], [data-panel], [data-item]", {
        autoAlpha: isOpen ? 1 : 0,
        clearProps: "clipPath",
      });
    };
    motionPreference.addEventListener("change", handleMotionPreferenceChange);

    if (!isOpen) {
      if (reducedMotion) {
        gsap.set("[data-overlay], [data-panel]", {
          autoAlpha: 0,
          clearProps: "clipPath",
        });
      } else {
        tl?.timeScale(1.3).reverse();
      }
      return () =>
        motionPreference.removeEventListener(
          "change",
          handleMotionPreferenceChange,
        );
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

    const previousOverflow = document.body.style.overflow;

    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    let focusTimer: gsap.core.Tween | null = null;
    if (reducedMotion) {
      gsap.set("[data-overlay], [data-panel], [data-item]", {
        autoAlpha: 1,
        clearProps: "clipPath",
      });
      closeBtnRef.current?.focus({ preventScroll: true });
    } else {
      tl?.timeScale(1).play();
      focusTimer = gsap.delayedCall(0.1, () =>
        closeBtnRef.current?.focus({ preventScroll: true }),
      );
    }

    return () => {
      motionPreference.removeEventListener(
        "change",
        handleMotionPreferenceChange,
      );
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      focusTimer?.kill();
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose, portalReady, cell]);

  if (!portalReady) return null;

  return createPortal(
    <div ref={rootRef}>
      <div
        data-overlay
        aria-hidden="true"
        onClick={onClose}
        className="invisible fixed inset-0 z-[1000] bg-black/40"
      />

      <aside
        ref={dialogRef}
        data-panel
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        tabIndex={-1}
        data-lenis-prevent
        style={{ clipPath: "inset(0% 100% 0% 0%)" }}
        className="invisible fixed left-0 top-0 z-[1001] flex h-dvh w-full max-w-md flex-col gap-8 overflow-y-auto bg-white p-6 text-[#050a4c]"
      >
        {cell && (
          <>
            <Link
              href="/"
              aria-label="Veyra group home"
              className="inline-flex fixed z-100 items-center gap-1 text-xs font-bbh-bartle uppercase tracking-tighter text-[#999] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#050a4c]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z" />
              </svg>
              Veyra
            </Link>{" "}
            <div className="gap-2 mt-10 flex  flex-col">
              <h2
                id="details-title"
                data-item
                className={`${companyFont.className} text-4xl font-medium italic capitalize leading-[1.25] tracking-tighter py-1`}
              >
                {cell.company}
              </h2>
              <a
                href={cell.url}
                className="mb-1 hidden hover:text-black hover:underline cursor-pointer text-sm leading-tight font-medium tracking-tight text-[#999]"
              >
                {`https://${cell.url.replace(/(^\w+:|^)\/\//, "").replace(/^www\./i, "")}`}
              </a>
              <h2 className="mb-2 text-sm leading-tight font-medium tracking-tight text-[#999]">
                {cell.reveal} Availability and eligibility can vary by product.
                Check with the provider for current details.
              </h2>{" "}
            </div>
            <div className="my-auto ">
              <div className="grid gap-1 grid-cols-2">
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">
                    Industry
                  </h2>
                  <h2 className="mb-2 text-sm leading-tight font-medium tracking-tight text-[#999]">
                    {cell.title}
                  </h2>
                </div>
                <div>
                  <h2 className="text-sm font-medium tracking-tight ">
                    Services
                  </h2>
                  <h2 className="mb-2 text-sm leading-tight font-medium tracking-tight text-[#999]">
                    {cell.detail}
                  </h2>
                </div>
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">
                    Headquarters
                  </h2>
                  <h2 className="mb-2 text-sm leading-tight font-medium tracking-tight text-[#999]">
                    {cell.location}
                  </h2>
                </div>
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">
                    Founded
                  </h2>
                  <h2 className="mb-2 text-sm leading-tight font-medium tracking-tight text-[#999]">
                    {cell.founded}
                  </h2>
                </div>
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">CEO</h2>
                  <h2 className="mb-2 text-sm leading-tight font-medium tracking-tight text-[#999]">
                    {cell.ceo ?? "CEO not listed"}
                  </h2>
                </div>
                <div>
                  <h2 className="text-sm font-medium tracking-tight">
                    Availability
                  </h2>
                  <h2 className="mb-2 text-sm leading-tight font-medium tracking-tight text-[#999]">
                    {cell.availability}
                  </h2>
                </div>
                <div>
                  <h2 className="text-sm font-medium tracking-tight">
                    Who it&apos;s for
                  </h2>
                  <h2 className="mb-2 text-sm leading-tight font-medium tracking-tight text-[#999]">
                    {cell.audience}
                  </h2>
                </div>
                <div>
                  <h2 className=" text-sm font-medium tracking-tight ">
                    Stage
                  </h2>
                  <h2 className="mb-2 text-sm leading-tight font-medium tracking-tight text-[#999]">
                    {cell.stage}
                  </h2>
                </div>

                <StockPanel cellId={cell.id} stockUrl={cell.stockUrl} />
              </div>
            </div>
            <div>
              <h2 className="mb-2 text-sm leading-tight font-medium tracking-tight text-[#999]">
                Connect with {cell.company}
              </h2>
              <div className="flex w-full items-center justify-between">
                <div className=" flex gap-4">
                  <a
                    href={cell.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit ${cell.company} website`}
                    className="mb-2 text-sm font-medium tracking-tight text-[#999] hover:text-black duration-500 transition-color"
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

                  {cell.instagramUrl && (
                    <a
                      href={cell.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${cell.company} on Instagram`}
                      className="mb-2 text-sm font-medium tracking-tight text-[#999] hover:text-black duration-500 transition-color"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        />
                        <circle
                          cx="17.5"
                          cy="6.5"
                          r="1.1"
                          fill="currentColor"
                        />
                      </svg>
                    </a>
                  )}

                  {cell.xUrl && (
                    <a
                      href={cell.xUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${cell.company} on X`}
                      className="mb-2 text-sm font-medium tracking-tight text-[#999] hover:text-black duration-500 transition-color"
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
                  {cell.linkedinUrl && (
                    <a
                      href={cell.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${cell.company} on Linkedin`}
                      className="mb-2 text-sm font-medium tracking-tight text-[#999] hover:text-black duration-500 transition-color"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 448 512"
                        width="20"
                        height="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                      </svg>
                    </a>
                  )}
                  {cell.stockUrl && (
                    <a
                      href={cell.stockUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${cell.company} stocks`}
                      className="mb-2 text-sm gap-1 flex items-center font-medium tracking-tight text-[#999] hover:text-black duration-500 transition-color"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="20px"
                        viewBox="0 -960 960 960"
                        width="20px"
                        fill="currentColor"
                      >
                        <path d="M240-160q-66 0-113-47T80-320v-320q0-66 47-113t113-47h480q66 0 113 47t47 113v320q0 66-47 113t-113 47H240Zm0-480h480q22 0 42 5t38 16v-21q0-33-23.5-56.5T720-720H240q-33 0-56.5 23.5T160-640v21q18-11 38-16t42-5Zm-74 130 445 108q9 2 18 0t17-8l139-116q-11-15-28-24.5t-37-9.5H240q-26 0-45.5 13.5T166-510Z" />
                      </svg>
                      Stocks
                    </a>
                  )}
                  {cell.youtubeUrl && (
                    <a
                      href={cell.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${cell.company} on YouTube`}
                      className="mb-2 text-sm font-medium tracking-tight text-[#999] hover:text-black duration-500 transition-color"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          style={{ display: "none" }}
                          d="M15.797 4.40653C17.6793 7.17402 18.6089 10.2957 18.2614 13.8894C18.26 13.9046 18.252 13.9186 18.2395 13.9278C16.8141 14.9744 15.4331 15.6096 14.0714 16.0309C14.0608 16.0341 14.0495 16.0339 14.039 16.0304C14.0285 16.0268 14.0194 16.0201 14.0129 16.0111C13.6983 15.5734 13.4125 15.1119 13.162 14.6273C13.1477 14.5988 13.1608 14.5644 13.1904 14.5532C13.6443 14.3821 14.076 14.1771 14.4912 13.9344C14.5239 13.9153 14.526 13.8684 14.4958 13.8459C14.4077 13.7805 14.3204 13.7117 14.2368 13.643C14.2212 13.6303 14.2002 13.6278 14.1825 13.6363C11.4868 14.8811 8.53393 14.8811 5.80644 13.6363C5.78873 13.6284 5.76769 13.6311 5.75248 13.6436C5.66914 13.7123 5.58164 13.7805 5.49435 13.8459C5.46414 13.8684 5.46664 13.9153 5.49956 13.9344C5.91477 14.1726 6.34643 14.3821 6.79977 14.554C6.82914 14.5653 6.8431 14.5988 6.82852 14.6273C6.58352 15.1126 6.29768 15.574 5.97727 16.0117C5.96331 16.0294 5.94039 16.0376 5.91873 16.0309C4.56352 15.6096 3.18248 14.9744 1.75707 13.9278C1.74519 13.9186 1.73665 13.904 1.7354 13.8888C1.44498 10.7803 2.03686 7.63277 4.19748 4.4059C4.20269 4.39736 4.2106 4.39069 4.21977 4.38674C5.28289 3.89882 6.42185 3.53986 7.61227 3.33486C7.63393 3.33153 7.6556 3.34153 7.66685 3.3607C7.81393 3.62111 7.98206 3.95507 8.09581 4.22799C9.3506 4.03632 10.625 4.03632 11.906 4.22799C12.0198 3.9609 12.1821 3.62111 12.3285 3.3607C12.3337 3.35119 12.3418 3.34357 12.3516 3.33893C12.3614 3.33429 12.3724 3.33287 12.3831 3.33486C13.5741 3.54049 14.7131 3.89945 15.7754 4.38674C15.7848 4.39069 15.7925 4.39736 15.797 4.40653ZM8.73372 10.3169C8.74685 9.39798 8.07685 8.63756 7.23581 8.63756C6.40164 8.63756 5.7381 9.39131 5.7381 10.3169C5.7381 11.2424 6.41477 11.9961 7.23581 11.9961C8.07018 11.9961 8.73372 11.2424 8.73372 10.3169ZM14.2716 10.3169C14.2848 9.39798 13.6148 8.63756 12.7739 8.63756C11.9395 8.63756 11.276 9.39131 11.276 10.3169C11.276 11.2424 11.9527 11.9961 12.7739 11.9961C13.6148 11.9961 14.2716 11.2424 14.2716 10.3169Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8Z"
                          fill="currentColor"
                        />
                        <path d="m9.6 15.6 6.2-3.6-6.2-3.6v7.2Z" fill="white" />
                      </svg>
                    </a>
                  )}
                </div>{" "}
                <div>
                  <button
                    ref={closeBtnRef}
                    type="button"
                    onClick={onClose}
                    aria-label="Close details"
                    className="bg-[#050a4c] rounded cursor-pointer px-1 py-1 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#050a4c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#050a4c]"
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
              </div>
            </div>
          </>
        )}
      </aside>
    </div>,
    document.body,
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
        inert={selected !== null}
        className="grid w-full grid-cols-2 gap-[2px] bg-white p-[2px] md:grid-cols-3 lg:grid-cols-4 "
      >
        <h1 className="sr-only">Discover companies and products with Veyra</h1>
        {CELLS.map((cell) => (
          <Cell
            key={cell.id}
            cell={cell}
            onSeeMore={openSidebar}
            isSidebarOpen={selected !== null}
          />
        ))}
      </main>

      <DetailsSidebar
        key={sidebarContent?.id ?? "closed"}
        cell={sidebarContent}
        isOpen={selected !== null}
        onClose={closeSidebar}
      />
    </>
  );
}
