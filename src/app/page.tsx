import Image from "next/image";
import Link from "next/link";
import PuzzleCard from "@/components/PuzzleCard";
import EmailForm from "@/components/layout/EmailForm";
import { categories } from "@/data/categories";
import { puzzles, getDailyPuzzle } from "@/data/puzzles";

export default function Home() {
  const daily = getDailyPuzzle();
  const popular = puzzles.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="py-10 sm:py-16">
        <div className="grid md:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">

          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100 border border-amber-200/80 px-3 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Today&apos;s Daily Puzzle
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.0] tracking-tight mt-3">
              {daily.title}
            </h1>

            <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed max-w-md">
              {daily.description}
            </p>

            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                href="/daily"
                className="px-7 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all min-h-[48px] flex items-center text-base shadow-lg shadow-amber-200"
              >
                Play Today&apos;s Puzzle
              </Link>
              <Link
                href="/create"
                className="px-6 py-3.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-amber-50 hover:border-amber-300 transition-all min-h-[48px] flex items-center text-base"
              >
                Upload Your Photo
              </Link>
            </div>

            {/* Inline stats */}
            <div className="flex flex-wrap items-center gap-5 mt-8 text-sm text-slate-500">
              <span>
                <strong className="text-slate-800 font-black text-base">500+</strong>
                {" "}free puzzles
              </span>
              <span className="text-slate-300">|</span>
              <span>
                <strong className="text-slate-800 font-black text-base">24–150</strong>
                {" "}pieces
              </span>
              <span className="text-slate-300">|</span>
              <span>
                <strong className="text-slate-800 font-black text-base">Free</strong>
                {" "}forever
              </span>
            </div>
          </div>

          {/* Right: Image with offset shadow frame */}
          <Link href="/daily" className="relative group">
            {/* Decorative offset box */}
            <div className="absolute inset-0 bg-amber-300 rounded-3xl translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4" />
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/80">
              <Image
                src={daily.imageUrl}
                alt={daily.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-lg">
                  <div>
                    <div className="text-slate-800 font-bold text-sm leading-tight">Play Now</div>
                    <div className="text-slate-500 text-xs">48 pieces · Free</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────── */}
      <div className="-mx-4 sm:-mx-6 px-4 sm:px-6 py-4 bg-amber-50 border-y border-amber-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm font-semibold text-amber-800">
            <span>🧩 500+ free puzzles</span>
            <span>📅 New puzzle every day</span>
            <span>📱 Works on any device</span>
            <span>✨ No sign-up needed</span>
          </div>
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-12">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              What do you feel like solving?
            </h2>
            <p className="text-slate-500 mt-1 text-sm">8 categories, 500+ puzzles</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const thumb = puzzles.find((p) => p.category === cat.id)?.thumbnailUrl;
            return (
              <Link
                key={cat.id}
                href={`/puzzles/${cat.slug}`}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-sm hover:shadow-xl transition-all duration-300"
              >
                {thumb && (
                  <Image
                    src={thumb}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <div className="text-xl mb-0.5">{cat.icon}</div>
                  <div className="text-white font-black text-sm tracking-tight">{cat.name}</div>
                  <div className="text-white/60 text-xs mt-0.5">65+ puzzles</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── POPULAR PUZZLES ──────────────────────────────────── */}
      <section className="py-4 pb-12">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Start Solving
            </h2>
            <p className="text-slate-500 mt-1 text-sm">Handpicked favorites</p>
          </div>
          <Link
            href="/puzzles/animals"
            className="text-sm font-bold text-amber-600 hover:text-amber-700 border border-amber-200 hover:border-amber-300 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-lg transition-all"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((puzzle, i) => (
            <PuzzleCard key={puzzle.id} puzzle={puzzle} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* ── EDITORIAL STATS BANNER (replaces "Why Online Jigsaws") ── */}
      <section className="py-4 pb-12">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12">
          <div className="max-w-2xl">
            <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-3">Why we built this</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Great puzzles should be free.<br />
              <span className="text-amber-400">So we made them free.</span>
            </h2>
            <p className="text-slate-400 mt-4 text-base leading-relaxed max-w-lg">
              No subscriptions, no downloads, no accounts. Pick a puzzle, start solving. Works on your phone, tablet, or laptop — wherever you are.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-slate-800">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-amber-400">500+</div>
              <div className="text-sm text-slate-400 mt-1.5 leading-snug">Free puzzles across 8 categories</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">Daily</div>
              <div className="text-sm text-slate-400 mt-1.5 leading-snug">New challenge every morning</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-purple-400">24–150</div>
              <div className="text-sm text-slate-400 mt-1.5 leading-snug">Pieces — easy to expert</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EMAIL CTA ─────────────────────────────────────────── */}
      <section className="py-4 pb-16">
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
              A new puzzle, every morning.
            </h2>
            <p className="text-orange-100 max-w-md mx-auto mb-6 text-base">
              Join puzzle lovers who start their day with a fresh jigsaw challenge. No spam — ever.
            </p>
            <EmailForm className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" dark />
          </div>
        </div>
      </section>

    </div>
  );
}
