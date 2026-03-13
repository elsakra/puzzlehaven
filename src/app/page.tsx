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
      {/* Hero — Daily Puzzle */}
      <section className="py-10 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-sm font-medium text-amber-600 uppercase tracking-wide">
              Today&apos;s Daily Puzzle
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mt-2 leading-tight">
              {daily.title}
            </h1>
            <p className="text-stone-500 mt-4 text-lg leading-relaxed max-w-lg">
              {daily.description}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/daily"
                className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors min-h-[48px] flex items-center text-base"
              >
                Play Daily Puzzle
              </Link>
              <Link
                href="/create"
                className="px-6 py-3 border border-stone-200 text-stone-700 font-medium rounded-xl hover:bg-stone-50 transition-colors min-h-[48px] flex items-center text-base"
              >
                Create Your Own
              </Link>
            </div>
          </div>
          <Link href="/daily" className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 group shadow-lg">
            <Image
              src={daily.imageUrl}
              alt={daily.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-white/90 text-sm font-medium bg-amber-500/90 px-3 py-1.5 rounded-full">
                Play Now
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10">
        <h2 className="text-2xl font-bold text-stone-800 mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/puzzles/${cat.slug}`}
              className="flex items-center gap-3 p-4 rounded-xl border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all min-h-[64px] bg-white"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-medium text-stone-700 text-sm sm:text-base">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Puzzles */}
      <section className="py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-stone-800">
            Popular Puzzles
          </h2>
          <Link
            href="/puzzles/animals"
            className="text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors"
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

      {/* Value Proposition */}
      <section className="py-10">
        <div className="bg-stone-50 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-4">
            Why PuzzleHaven?
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto mb-8 text-lg">
            Jigsaw puzzles are one of the best ways to relax, reduce stress, and
            keep your mind sharp. Play for free, anytime, on any device.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl mb-2">🧠</div>
              <h3 className="font-semibold text-stone-800 mb-1">Brain Health</h3>
              <p className="text-sm text-stone-500">
                Puzzles improve memory, problem-solving, and spatial reasoning.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-stone-800 mb-1">Daily Challenge</h3>
              <p className="text-sm text-stone-500">
                A new puzzle every day. Build your streak and share your times.
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📱</div>
              <h3 className="font-semibold text-stone-800 mb-1">Play Anywhere</h3>
              <p className="text-sm text-stone-500">
                Works perfectly on phone, tablet, and desktop. No downloads needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="py-10 pb-16">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-stone-800 mb-3">
            Get a Daily Puzzle in Your Inbox
          </h2>
          <p className="text-stone-600 max-w-md mx-auto mb-6">
            Join thousands of puzzle lovers who start their morning with a fresh
            jigsaw puzzle.
          </p>
          <EmailForm className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" />
        </div>
      </section>
    </div>
  );
}
