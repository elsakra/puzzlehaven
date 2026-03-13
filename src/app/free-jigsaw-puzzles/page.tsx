import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/layout/AdSlot";
import PuzzleCard from "@/components/PuzzleCard";
import { categories } from "@/data/categories";
import { puzzles } from "@/data/puzzles";

export const metadata: Metadata = {
  title: "Free Jigsaw Puzzles Online — Play Instantly, No Download",
  description:
    "Play hundreds of free jigsaw puzzles online. No download, no sign-up required. Choose from animals, nature, landscapes, art, travel and more. Play your daily puzzle now!",
  keywords: [
    "free jigsaw puzzles",
    "free online jigsaw puzzles",
    "jigsaw puzzles online free",
    "free puzzle games",
    "play jigsaw puzzles online",
    "free jigsaw",
  ],
  openGraph: {
    title: "Free Jigsaw Puzzles Online — Play Instantly",
    description:
      "Hundreds of free jigsaw puzzles online. No download or sign-up. Animals, nature, landscapes, art and more.",
    type: "website",
  },
  alternates: {
    canonical: "https://online-jigsaws.com/free-jigsaw-puzzles",
  },
};

const faqItems = [
  {
    question: "Are these jigsaw puzzles really free?",
    answer:
      "Yes — every puzzle on Online Jigsaws is completely free to play, forever. No subscription, no credits, no hidden fees. Just pick a puzzle and start playing.",
  },
  {
    question: "Do I need to download anything to play?",
    answer:
      "No download or installation is required. Our puzzles run entirely in your web browser using modern browser technology. They work on any device — desktop, tablet, or smartphone.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is needed. You can start playing any puzzle immediately. Your progress is automatically saved in your browser so you can pause and come back anytime.",
  },
  {
    question: "How many puzzles are available?",
    answer:
      "We offer over 500 hand-curated jigsaw puzzles across 8 categories: animals, nature, landscapes, art, food, travel, holidays, and abstract. New puzzles are added regularly.",
  },
  {
    question: "What difficulty levels are available?",
    answer:
      "Each puzzle is available in four piece counts: 24 pieces (easy), 48 pieces (medium), 96 pieces (hard), and 150 pieces (expert). You can switch difficulty at any time.",
  },
  {
    question: "Is there a new puzzle every day?",
    answer:
      "Yes! Visit our Daily Puzzle page for a fresh new jigsaw puzzle every single day. Complete it to build your streak and see how many days in a row you can solve.",
  },
  {
    question: "Can I play on my phone or tablet?",
    answer:
      "Absolutely. Our puzzles are fully mobile-friendly and work great on phones and tablets. Use your finger to drag and place pieces just like you would on a table.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

// Pick 12 featured puzzles — one or two from each category (easy/medium difficulty)
const featuredPuzzles = categories
  .flatMap((cat) =>
    puzzles
      .filter((p) => p.category === cat.slug && p.difficulty <= 2)
      .slice(0, 2)
  )
  .slice(0, 12);

export default function FreeJigsawPuzzlesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-6">
          <Link href="/" className="hover:text-indigo-500 transition-colors">
            Home
          </Link>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-600 font-medium">Free Jigsaw Puzzles</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
            Free Jigsaw Puzzles Online
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Hundreds of beautiful jigsaw puzzles — completely free, no download, no
            sign-up. Pick a puzzle, choose your piece count, and start playing right
            now.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              href="/daily"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              🧩 Play Today&apos;s Puzzle
            </Link>
            <Link
              href="/puzzles/animals"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              Browse All Puzzles
            </Link>
          </div>
        </div>

        {/* Ad */}
        <div className="flex justify-center mb-8">
          <AdSlot format="leaderboard" className="hidden md:flex" />
          <AdSlot format="mobile-banner" className="md:hidden" />
        </div>

        {/* Featured puzzles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Popular Free Puzzles
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredPuzzles.map((puzzle, i) => (
              <PuzzleCard key={puzzle.id} puzzle={puzzle} priority={i < 4} />
            ))}
          </div>
        </section>

        {/* Browse by category */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/puzzles/${cat.slug}`}
                className="group flex items-center gap-3 p-4 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-xl transition-all duration-200"
              >
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-slate-400">Free puzzles</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO content */}
        <section className="mb-12 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            The Best Free Online Jigsaw Puzzles
          </h2>
          <div className="prose prose-slate prose-sm max-w-none space-y-4 text-slate-600 leading-relaxed">
            <p>
              Online Jigsaws is home to hundreds of free jigsaw puzzles you can play
              directly in your browser — no app to download, no account to create, and
              absolutely nothing to pay. Whether you have five minutes or an entire
              afternoon, there is a puzzle here for you.
            </p>
            <p>
              Our library spans eight hand-curated categories. <strong>Animal lovers</strong>{" "}
              will find puzzles featuring everything from cute kittens and golden
              retriever puppies to majestic elephants and colorful tropical birds. Our{" "}
              <strong>nature collection</strong> captures sweeping wildflower meadows,
              misty forest mornings, and golden-hour sunsets. The{" "}
              <strong>landscapes category</strong> takes you around the globe: soaring
              mountain peaks, turquoise Caribbean beaches, rolling Tuscan hills, and
              dramatic fjords.
            </p>
            <p>
              Art enthusiasts can lose themselves in our <strong>art puzzles</strong>,
              which include classic paintings rendered in stunning detail alongside
              contemporary illustrations and abstract designs. Foodies will love the{" "}
              <strong>food and drink puzzles</strong> — imagine piecing together an
              overhead shot of a perfectly arranged charcuterie board or a colourful
              bowl of ramen. Wanderlusters can work through our{" "}
              <strong>travel puzzles</strong>, featuring famous skylines, ancient temples,
              and hidden village lanes from every continent.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-6">
              Four Difficulty Levels for Every Skill
            </h3>
            <p>
              Every puzzle on Online Jigsaws can be played at four piece counts:{" "}
              <strong>24 pieces</strong> for a quick, relaxing solve;{" "}
              <strong>48 pieces</strong> for a satisfying 15-minute session;{" "}
              <strong>96 pieces</strong> for a proper challenge; or{" "}
              <strong>150 pieces</strong> for those who want a real brain workout. You
              can change the piece count at any time mid-game, so you can start easy
              and work your way up as your confidence grows.
            </p>
            <p>
              The puzzle engine renders every piece with hand-crafted Bezier curve edges,
              giving each piece a realistic interlocking shape — not the boring rectangular
              grid cuts you find on cheaper sites. A satisfying snap confirms when a piece
              is correctly placed, and nearby pieces automatically group together just as
              they would in a real physical puzzle.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-6">
              Your Progress Is Always Saved
            </h3>
            <p>
              Life is busy — sometimes you need to close the browser tab mid-puzzle. That
              is why Online Jigsaws automatically saves your progress to your browser.
              Every piece position, every group you have assembled — it all persists until
              you finish. Just come back to the same puzzle page and your work will be
              right where you left it.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-6">
              A New Free Puzzle Every Single Day
            </h3>
            <p>
              Our <Link href="/daily" className="text-indigo-600 hover:underline">Daily Jigsaw Puzzle</Link> gives
              you a brand-new puzzle every morning. Complete it to start — or extend — your
              daily streak. The daily puzzle is the same for everyone, so you can compare
              times and challenge friends or family to beat your score. It is free, of
              course, and resets at midnight every night.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-6">
              Create Your Own Free Jigsaw Puzzle
            </h3>
            <p>
              Want to turn your favourite photo into a jigsaw puzzle? Our{" "}
              <Link href="/create" className="text-indigo-600 hover:underline">
                custom puzzle creator
              </Link>{" "}
              lets you upload any image and play it as a jigsaw immediately — for free. It
              is a wonderful way to enjoy family photos, holiday snapshots, or pictures of
              beloved pets in a whole new way.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-6">
              Why Free Online Jigsaw Puzzles Are So Popular
            </h3>
            <p>
              Jigsaw puzzles have been a beloved pastime for centuries, and the digital
              version brings all the same satisfaction without the need for table space or
              worrying about lost pieces. Research shows that regularly solving puzzles
              can improve short-term memory, strengthen concentration, and even help reduce
              the risk of cognitive decline. They are an ideal screen-time activity because
              they engage the brain constructively — exercising both logical thinking and
              spatial reasoning.
            </p>
            <p>
              Free online jigsaw puzzles are also wonderfully accessible. There is no cost
              barrier, no download queue, no account to remember, and they work on any
              device with a web browser. That means you can solve a puzzle on your laptop
              during a lunch break, on your tablet on the couch, or on your phone while
              waiting in a queue.
            </p>
            <p>
              Online Jigsaws is designed specifically for puzzle lovers who want the{" "}
              <em>best</em> free experience: beautiful images, realistic piece shapes,
              smooth gameplay, and a new reason to come back every day.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="border border-slate-200 rounded-xl p-5"
              >
                <h3 className="font-semibold text-slate-800 mb-2">{item.question}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom ad */}
        <div className="flex justify-center">
          <AdSlot format="leaderboard" className="hidden md:flex" />
          <AdSlot format="mobile-banner" className="md:hidden" />
        </div>
      </div>
    </>
  );
}
