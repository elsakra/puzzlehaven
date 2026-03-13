import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PuzzleCard from "@/components/PuzzleCard";
import AdSlot from "@/components/layout/AdSlot";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getPuzzlesByCategory } from "@/data/puzzles";
import Link from "next/link";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) return {};

  return {
    title: cat.seoTitle,
    description: cat.seoDescription,
    openGraph: {
      title: cat.seoTitle,
      description: cat.seoDescription,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);
  if (!cat) notFound();

  const categoryPuzzles = getPuzzlesByCategory(category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-5">
        <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-600 font-medium">{cat.name}</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{cat.icon}</span>
          <h1 className="text-3xl font-bold text-slate-800">{cat.name} Jigsaw Puzzles</h1>
        </div>
        <p className="text-slate-500 leading-relaxed max-w-3xl">
          {cat.description}
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <AdSlot format="leaderboard" className="hidden md:flex" />
        <AdSlot format="mobile-banner" className="md:hidden" />
      </div>

      {categoryPuzzles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg">
            More puzzles coming soon! Check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryPuzzles.map((puzzle, i) => (
            <PuzzleCard key={puzzle.id} puzzle={puzzle} priority={i < 4} />
          ))}
        </div>
      )}

      {/* SEO Content */}
      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold text-slate-800 mb-3">
          Free {cat.name} Jigsaw Puzzles Online
        </h2>
        <div className="text-slate-500 leading-relaxed space-y-3 text-sm">
          <p>
            Enjoy our collection of free {cat.name.toLowerCase()} jigsaw puzzles
            that you can play online right in your browser. No downloads or
            sign-ups required — just pick a puzzle and start playing.
          </p>
          <p>
            Each puzzle offers multiple difficulty levels from 24 to 150 pieces,
            making them perfect for both beginners and experienced puzzlers. Your
            progress is automatically saved, so you can take a break and come
            back to finish anytime.
          </p>
          <p>
            Jigsaw puzzles are a wonderful way to relax, reduce stress, and keep
            your mind sharp. Studies show that regularly solving puzzles can help
            improve memory, concentration, and problem-solving skills.
          </p>
        </div>
      </section>
    </div>
  );
}
