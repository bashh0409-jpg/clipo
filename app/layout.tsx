import type { Metadata } from "next";
import { Geist, Geist_Mono, BBH_Bartle } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import CookieConsent from "./components/CookieConsent";
import Logo from "./components/Logo";
import SmoothScroll from "./components/SmoothScroll";
import PageReveal from "./components/PageReveal";
import PageTransition from "./components/PageTransition";
import SequentialVideoBackground from "./components/SequentialVideoBackground";
import Sidebar from "./components/Sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bbhBartle = BBH_Bartle({
  weight: "400",
  variable: "--font-bartle",
  subsets: ["latin"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://veyra.thewisestudio.xyz"),
  title: "Veyra | Discover companies and products",
  description:
    "Discover companies and products shaping everyday life. Explore what they do, who they serve, and where they operate.",
  openGraph: {
    title: "Veyra | Discover companies and products",
    description:
      "Discover companies and products shaping everyday life. Explore what they do, who they serve, and where they operate.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veyra | Discover companies and products",
    description:
      "Discover companies and products shaping everyday life. Explore what they do, who they serve, and where they operate.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bbhBartle.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preconnect"
          href="https://stream.mux.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <SequentialVideoBackground />
        <SmoothScroll />
        <header>
          <Navbar />
          <Logo />
        </header>
        <PageReveal>{children}</PageReveal>
        <PageTransition />
        <Sidebar/>
        <footer className="sr-only">
          Veyra is an independent company-discovery website.
        </footer>
        <SpeedInsights />
<Analytics />        
      </body>
    </html>
  );
}
