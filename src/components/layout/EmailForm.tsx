"use client";

import { useState, useRef } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function EmailForm({ className = "", dark }: { className?: string; dark?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = inputRef.current?.value.trim() ?? "";
    if (!email) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
          dark
            ? "bg-white/15 border border-white/20 text-white"
            : "bg-emerald-50 border border-emerald-200 text-emerald-700"
        } ${className}`}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        You&apos;re in! Check your inbox.
      </div>
    );
  }

  return (
    <form className={className} onSubmit={handleSubmit} noValidate>
      <input
        ref={inputRef}
        type="email"
        placeholder="Your email"
        required
        disabled={status === "loading"}
        className={`px-4 py-2.5 text-sm rounded-xl min-h-[44px] w-full outline-none transition-all disabled:opacity-60 ${
          dark
            ? "bg-white/15 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40"
            : "bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        }`}
      />
      {status === "error" && errorMsg && (
        <p className={`text-xs mt-1.5 ${dark ? "text-red-300" : "text-red-500"}`}>{errorMsg}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className={`px-5 py-2.5 text-sm font-semibold rounded-xl min-h-[44px] w-full sm:w-auto transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
          dark
            ? "bg-white text-slate-900 hover:bg-slate-50 shadow-lg"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        {status === "loading" ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Subscribing…
          </>
        ) : (
          "Subscribe"
        )}
      </button>
    </form>
  );
}
