"use client";

import { useState, useSyncExternalStore } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

type ConsentChoice = "accepted" | "rejected" | null;

const CONSENT_STORAGE_KEY = "veyra-cookie-consent-v1";
const CONSENT_CHANGE_EVENT = "veyra-cookie-consent-change";
let hasReadStoredChoice = false;
let storedChoice: ConsentChoice = null;

function getStoredChoice(): ConsentChoice {
  if (typeof window === "undefined") return null;
  if (hasReadStoredChoice) return storedChoice;

  hasReadStoredChoice = true;
  try {
    const savedChoice = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (savedChoice === "accepted" || savedChoice === "rejected") {
      storedChoice = savedChoice;
    }
  } catch (error) {
    console.warn("Unable to read the cookie consent preference.", error);
  }
  return storedChoice;
}

function subscribeToChoice(callback: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return;
    storedChoice =
      event.newValue === "accepted" || event.newValue === "rejected"
        ? event.newValue
        : null;
    hasReadStoredChoice = true;
    callback();
  };

  window.addEventListener(CONSENT_CHANGE_EVENT, callback);
  window.addEventListener("storage", handleStorage);
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback);
    window.removeEventListener("storage", handleStorage);
  };
}

export default function CookieConsent() {
  const choice = useSyncExternalStore(
    subscribeToChoice,
    getStoredChoice,
    () => null,
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const saveChoice = (nextChoice: Exclude<ConsentChoice, null>) => {
    storedChoice = nextChoice;
    hasReadStoredChoice = true;
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, nextChoice);
    } catch (error) {
      console.warn("Unable to save the cookie consent preference.", error);
    }
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    setIsSettingsOpen(false);
  };

  return (
    <>
      {choice === "accepted" && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}

      {choice === null || isSettingsOpen ? (
        <section
          aria-label="Cookie preferences"
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-3 z-[200] flex items-center gap-1 rounded-full bg-white px-1 pl-2 py-1 text-black shadow-xl"
        >
          <span className="text-xs tracking-tight mr-1 font-medium">Allow analytics?</span>
          <button
            type="button"
            onClick={() => saveChoice("accepted")}
            className="rounded-full bg-black px-3 cursor-pointer py-1 text-xs font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => saveChoice("rejected")}
            className="rounded-full border border-black/20 px-3 cursor-pointer py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            No
          </button>
        </section>
      ) : null}
    </>
  );
}
