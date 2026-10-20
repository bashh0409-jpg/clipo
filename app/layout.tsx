import type { Metadata } from "next";
import { Geist, Geist_Mono, BBH_Bartle } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Logo from "./components/Logo";
import SmoothScroll from "./components/SmoothScroll";

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
});

export const metadata: Metadata = {
  title: "Veyra group | Selected work",
  description:
    "Explore companies, products, and ideas featured in the Veyra group portfolio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bbhBartle.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll />
        {children}

        <Navbar />
        <Logo />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
