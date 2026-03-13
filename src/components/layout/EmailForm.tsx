"use client";

export default function EmailForm({ className = "", dark }: { className?: string; dark?: boolean }) {
  return (
    <form
      className={className}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Your email"
        className={`px-4 py-2.5 text-sm rounded-xl min-h-[44px] w-full outline-none transition-all ${
          dark
            ? "bg-white/15 border border-white/20 text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40"
            : "bg-white border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        }`}
      />
      <button
        type="submit"
        className={`px-5 py-2.5 text-sm font-semibold rounded-xl min-h-[44px] w-full sm:w-auto transition-all ${
          dark
            ? "bg-white text-slate-900 hover:bg-slate-50 shadow-lg"
            : "bg-slate-900 text-white hover:bg-slate-800"
        }`}
      >
        Subscribe
      </button>
    </form>
  );
}
