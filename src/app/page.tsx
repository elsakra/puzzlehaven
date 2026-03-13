import Link from "next/link";
import PuzzleCard from "@/components/PuzzleCard";
import HeroImage from "@/components/HeroImage";
import EmailForm from "@/components/layout/EmailForm";
import AdSlot from "@/components/layout/AdSlot";
import { categories } from "@/data/categories";
import { puzzles, getDailyPuzzle } from "@/data/puzzles";

export default function Home() {
  const daily = getDailyPuzzle();
  const popular = puzzles.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="py-12 sm:py-20">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-center">

          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Daily puzzle — {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" })}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
              {daily.title}
            </h1>

            <p className="text-slate-500 mt-5 text-base sm:text-lg leading-relaxed max-w-md">
              {daily.description}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/daily"
                className="px-7 py-3.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors min-h-[48px] flex items-center text-base"
              >
                Play today&apos;s puzzle
              </Link>
              <Link
                href="/create"
                className="px-6 py-3.5 border border-slate-200 text-slate-600 font-medium rounded-xl hover:border-slate-300 hover:bg-white transition-all min-h-[48px] flex items-center text-base bg-transparent"
              >
                Upload your photo
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-8 text-sm text-slate-400">
              <span>257 puzzles</span>
              <span>·</span>
              <span>24–150 pieces</span>
              <span>·</span>
              <span>Free, always</span>
            </div>
          </div>

          {/* Right: Hero image */}
          <Link href="/daily" className="relative group block">
            <HeroImage src={daily.imageUrl} alt={daily.title} />
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm border border-slate-100">
              <div>
                <div className="text-slate-800 font-semibold text-sm leading-tight">Play now</div>
                <div className="text-slate-400 text-xs">48 pieces · Free</div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────── */}
      <div className="border-t border-slate-100" />

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section className="py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Browse by category
            </h2>
            <p className="text-slate-400 mt-1 text-sm">8 collections, new puzzles weekly</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const thumb = puzzles.find((p) => p.category === cat.id)?.thumbnailUrl;
            return (
              <CategoryCard key={cat.id} cat={cat} thumb={thumb} />
            );
          })}
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────── */}
      <div className="border-t border-slate-100" />

      {/* ── AD: leaderboard between categories and popular puzzles ── */}
      <div className="py-5 flex justify-center">
        <AdSlot format="leaderboard" />
      </div>

      <div className="border-t border-slate-100" />

      {/* ── POPULAR PUZZLES ──────────────────────────────────── */}
      <section className="py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Popular puzzles
            </h2>
            <p className="text-slate-400 mt-1 text-sm">Handpicked favorites</p>
          </div>
          <Link
            href="/puzzles/animals"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((puzzle, i) => (
            <PuzzleCard key={puzzle.id} puzzle={puzzle} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────── */}
      <div className="border-t border-slate-100" />

      {/* ── WHY SECTION ──────────────────────────────────────── */}
      <section className="py-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">About</p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Good puzzles.<br />No paywall.
            </h2>
            <p className="text-slate-500 mt-4 text-base leading-relaxed">
              No accounts, no downloads, no subscriptions. Pick a puzzle and start solving — on your phone, tablet, or laptop.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">257</div>
              <div className="text-sm text-slate-400 mt-1">Free puzzles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">Daily</div>
              <div className="text-sm text-slate-400 mt-1">New challenge</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-slate-900">8</div>
              <div className="text-sm text-slate-400 mt-1">Categories</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ──────────────────────────────────────────── */}
      <div className="border-t border-slate-100" />

      {/* ── EMAIL CTA ─────────────────────────────────────────── */}
      <section className="py-14 pb-20">
        <div className="max-w-lg">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            A new puzzle, every morning.
          </h2>
          <p className="text-slate-500 mb-6 text-base">
            Get the daily puzzle in your inbox. No spam, unsubscribe anytime.
          </p>
          <EmailForm className="flex flex-col sm:flex-row gap-3" />
        </div>
      </section>

    </div>
  );
}

// Category card as a server component — image error handling via bg fallback
function CategoryCard({
  cat,
  thumb,
}: {
  cat: { id: string; slug: string; name: string; icon: string };
  thumb?: string;
}) {
  return (
    <Link
      href={`/puzzles/${cat.slug}`}
      className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 block"
    >
      {thumb && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb}
          alt={cat.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="text-white font-bold text-sm">{cat.name}</div>
      </div>
    </Link>
  );
}
