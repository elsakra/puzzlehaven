"use client";

export default function EmailForm({ className = "" }: { className?: string }) {
  return (
    <form
      className={className}
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Your email"
        className="px-3 py-2.5 text-sm border border-stone-200 rounded-lg bg-white text-stone-700 placeholder-stone-400 min-h-[44px] w-full"
      />
      <button
        type="submit"
        className="px-4 py-2.5 text-sm font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors min-h-[44px] w-full"
      >
        Subscribe
      </button>
    </form>
  );
}
