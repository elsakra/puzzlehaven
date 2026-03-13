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
      <section className="py-10 sm:py-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Today&apos;s Daily Puzzle
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mt-2 leading-tight">
              {daily.title}
            </h1>
            <p className="text-slate-500 mt-4 text-lg leading-relaxed max-w-lg">
              {daily.description}
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link
                href="/daily"
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all min-h-[48px] flex items-center text-base shadow-lg shadow-indigo-200"
              >
                Play Daily Puzzle
              </Link>
              <Link
                href="/create"
                className="px-6 py-3 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all min-h-[48px] flex items-center text-base"
              >
                Create Your Own
              </Link>
            </div>
          </div>
          <Link href="/daily" className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 group shadow-2xl shadow-slate-200 ring-1 ring-black/5">
            <Image
              src={daily.imageUrl}
              alt={daily.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <span className="text-white font-semibold text-sm bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                Play Now
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="py-10">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/puzzles/${cat.slug}`}
              className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-50 transition-all min-h-[64px] bg-white group"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-medium text-slate-700 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Popular Puzzles
          </h2>
          <Link
            href="/puzzles/animals"
            className="text-indigo-600 text-sm font-semibold hover:text-indigo-700 transition-colors"
          >
            View All &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((puzzle, i) => (
            <PuzzleCard key={puzzle.id} puzzle={puzzle} priority={i < 4} />
          ))}
        </div>
      </section>

      <section className="py-10">
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-3xl p-8 sm:p-12 text-center border border-slate-200/60">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4">
            Why Online Jigsaws?
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto mb-10 text-lg">
            Jigsaw puzzles are one of the best ways to relax, reduce stress, and
            keep your mind sharp. Play for free, anytime, on any device.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Brain Health</h3>
              <p className="text-sm text-slate-500">
                Puzzles improve memory, problem-solving, and spatial reasoning.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Daily Challenge</h3>
              <p className="text-sm text-slate-500">
                A new puzzle every day. Build your streak and share your times.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-200">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
              </div>
              <h3 className="font-semibold text-slate-800 mb-1">Play Anywhere</h3>
              <p className="text-sm text-slate-500">
                Works perfectly on phone, tablet, and desktop. No downloads needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 pb-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Get a Daily Puzzle in Your Inbox
          </h2>
          <p className="text-indigo-200 max-w-md mx-auto mb-6">
            Join thousands of puzzle lovers who start their morning with a fresh
            jigsaw puzzle.
          </p>
          <EmailForm className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" dark />
        </div>
      </section>
    </div>
  );
}
