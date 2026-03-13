import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PuzzleCanvas from "@/components/puzzle/PuzzleCanvas";
import PuzzleCard from "@/components/PuzzleCard";
import AdSlot from "@/components/layout/AdSlot";
import { puzzles, getPuzzleBySlug, getPuzzlesByCategory } from "@/data/puzzles";
import { getCategoryBySlug } from "@/data/categories";
import Link from "next/link";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return puzzles.map((p) => ({
    category: p.category,
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const puzzle = getPuzzleBySlug(category, slug);
  if (!puzzle) return {};

  return {
    title: `${puzzle.title} — Free Online Jigsaw Puzzle`,
    description: `Play "${puzzle.title}" jigsaw puzzle for free online. ${puzzle.description} Choose from 24 to 150 pieces. No download required.`,
    openGraph: {
      title: `${puzzle.title} — Free Jigsaw Puzzle`,
      description: puzzle.description,
      images: [{ url: puzzle.imageUrl, width: 1200, height: 900 }],
      type: "website",
    },
  };
}

export default async function PuzzlePage({ params }: Props) {
  const { category, slug } = await params;
  const puzzle = getPuzzleBySlug(category, slug);
  if (!puzzle) notFound();

  const cat = getCategoryBySlug(category);
  const related = getPuzzlesByCategory(category)
    .filter((p) => p.id !== puzzle.id)
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: puzzle.title,
    description: puzzle.description,
    applicationCategory: "GameApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    image: puzzle.imageUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-5">
          <Link href="/" className="hover:text-indigo-500 transition-colors">Home</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/puzzles/${category}`} className="hover:text-indigo-500 transition-colors">
            {cat?.name ?? category}
          </Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-600 font-medium">{puzzle.title}</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr,280px] gap-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
              {puzzle.title}
            </h1>
            <p className="text-slate-400 text-sm mb-5">Free online jigsaw puzzle &middot; 24-150 pieces</p>

            <PuzzleCanvas
              imageUrl={puzzle.imageUrl}
              puzzleId={puzzle.id}
              puzzleTitle={puzzle.title}
              initialPieceCount={48}
              seed={puzzle.id.charCodeAt(0) * 1000 + puzzle.id.charCodeAt(1)}
            />

            <div className="mt-8 bg-white rounded-2xl border border-slate-200/80 p-6">
              <h2 className="text-lg font-semibold text-slate-800 mb-2">
                About This Puzzle
              </h2>
              <p className="text-slate-500 leading-relaxed text-sm">
                {puzzle.description} Choose from 24 to 150 puzzle pieces and
                challenge yourself at the difficulty level that suits you. Your
                progress is automatically saved so you can pick up right where
                you left off.
              </p>
            </div>
          </div>

          <aside className="hidden lg:flex flex-col gap-5">
            <AdSlot format="sidebar" />
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
              <h3 className="font-semibold text-slate-800 mb-4 text-sm">
                More {cat?.name} Puzzles
              </h3>
              <div className="space-y-3">
                {related.map((p) => (
                  <PuzzleCard key={p.id} puzzle={p} />
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="lg:hidden mt-10">
          <h3 className="font-semibold text-slate-800 mb-4 text-lg">
            More {cat?.name} Puzzles
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {related.map((p) => (
              <PuzzleCard key={p.id} puzzle={p} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
