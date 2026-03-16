"use client";

import { useEffect, useState } from "react";

type ConsentChoice = {
  analytics: boolean;
  advertising: boolean;
  ts: number;
};

const STORAGE_KEY = "oj_consent";

function readConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentChoice;
  } catch {
    return null;
  }
}

function applyConsent(choice: ConsentChoice) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const granted = choice.analytics && choice.advertising;
  window.gtag("consent", "update", {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: choice.advertising ? "granted" : "denied",
    ad_personalization: granted ? "granted" : "denied",
    ad_user_data: granted ? "granted" : "denied",
  });
}

function saveConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(choice));
  } catch {
    // ignore storage errors
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      applyConsent(stored);
    } else {
      setVisible(true);
    }
  }, []);

  function handleAcceptAll() {
    const choice: ConsentChoice = { analytics: true, advertising: true, ts: Date.now() };
    saveConsent(choice);
    applyConsent(choice);
    setVisible(false);
  }

  function handleEssentialOnly() {
    const choice: ConsentChoice = { analytics: false, advertising: false, ts: Date.now() };
    saveConsent(choice);
    applyConsent(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-white border-t border-slate-200 shadow-2xl"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
        <div className="flex-1">
          <p className="text-sm sm:text-base font-semibold text-slate-900 mb-1">
            We use cookies
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            We use cookies to keep your puzzle progress, remember your settings, show relevant ads,
            and understand how people use our site. You can accept all cookies or use only the
            essential ones that keep the puzzles working.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            onClick={handleEssentialOnly}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors min-h-[44px]"
          >
            Essential only
          </button>
          <button
            onClick={handleAcceptAll}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors min-h-[44px] shadow-sm"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
