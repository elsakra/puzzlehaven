import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PuzzleCard from "@/components/PuzzleCard";
import AdSlot from "@/components/layout/AdSlot";
import { categories, getCategoryBySlug } from "@/data/categories";
import { getPuzzlesByCategory } from "@/data/puzzles";
import Link from "next/link";

function buildFaqSchema(catName: string) {
  const name = catName.toLowerCase();
  const items = [
    {
      question: `Are these ${name} jigsaw puzzles free?`,
      answer: `Yes — every ${name} puzzle on Online Jigsaws is completely free to play. No subscription, no account, and no download required. Just open the page and start solving.`,
    },
    {
      question: `How do I play ${name} jigsaw puzzles online?`,
      answer: `Click on any puzzle thumbnail to open the puzzle page. Choose your preferred piece count (24, 48, 96, or 150 pieces), then drag and drop pieces onto the board to assemble the image. Pieces snap into place automatically when correctly positioned.`,
    },
    {
      question: `What difficulty levels are available for ${name} puzzles?`,
      answer: `Every puzzle offers four difficulty levels based on piece count: 24 pieces (easy, around 5–10 minutes), 48 pieces (medium, 10–20 minutes), 96 pieces (hard, 20–40 minutes), and 150 pieces (expert, 40+ minutes). You can switch difficulty at any time.`,
    },
    {
      question: `Can I play ${name} jigsaw puzzles on my phone or tablet?`,
      answer: `Yes. All puzzles work on smartphones and tablets. Use your finger to drag and place pieces just as you would on a desktop computer. The layout adapts automatically to your screen size.`,
    },
    {
      question: `Will my progress be saved if I leave the page?`,
      answer: `Yes. Your puzzle progress is automatically saved to your browser. If you close the tab or navigate away, your piece positions will be restored when you return to the same puzzle page.`,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

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
  const faqSchema = buildFaqSchema(cat.name);

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
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

      {/* FAQ section */}
      <section className="mt-10 mb-4 max-w-3xl">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqSchema.mainEntity.map((item) => (
            <div key={item.name} className="border border-slate-200 rounded-xl p-4">
              <h3 className="font-semibold text-slate-700 text-sm mb-1">{item.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {item.acceptedAnswer.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
    </>
  );
}
