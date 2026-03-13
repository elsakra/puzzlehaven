import type { Metadata } from "next";
import Link from "next/link";
import AdSlot from "@/components/layout/AdSlot";
import PuzzleCard from "@/components/PuzzleCard";
import { categories } from "@/data/categories";
import { puzzles } from "@/data/puzzles";

export const metadata: Metadata = {
  title: "Jigsaw Puzzles for Adults — Free Online Brain Games",
  description:
    "Free online jigsaw puzzles for adults. Relaxing and challenging puzzles from 24 to 150 pieces — great for stress relief, brain health, and daily mental exercise. No download needed.",
  keywords: [
    "jigsaw puzzles for adults",
    "online jigsaw puzzles for adults",
    "adult jigsaw puzzles",
    "jigsaw puzzles for seniors",
    "brain games for adults",
    "relaxing puzzle games",
    "free puzzles for adults",
  ],
  openGraph: {
    title: "Jigsaw Puzzles for Adults — Free Online",
    description:
      "Hundreds of free online jigsaw puzzles for adults. Great for stress relief and keeping your mind sharp. No download or sign-up required.",
    type: "website",
  },
  alternates: {
    canonical: "https://online-jigsaws.com/jigsaw-puzzles-for-adults",
  },
};

const faqItems = [
  {
    question: "Are these jigsaw puzzles suitable for seniors and older adults?",
    answer:
      "Absolutely. Our puzzles are designed with accessibility in mind — large touch targets, clear high-contrast images, and adjustable piece counts starting from just 24 pieces. Many of our users are in their 60s, 70s, and 80s and find the puzzles both enjoyable and easy to use.",
  },
  {
    question: "What are the cognitive benefits of doing jigsaw puzzles?",
    answer:
      "Research suggests that jigsaw puzzles engage both the left and right hemispheres of the brain simultaneously. They can improve short-term memory, enhance problem-solving skills, increase mental speed, and help reduce the risk of cognitive decline in older adults. They also promote the production of dopamine, a neurotransmitter associated with learning and memory.",
  },
  {
    question: "How challenging are the hardest puzzles?",
    answer:
      "Our 150-piece puzzles offer a genuine challenge for experienced adult puzzlers, with detailed imagery and realistic interlocking Bezier curve piece shapes — no boring rectangular cuts. If you want an even greater challenge, try the abstract or art categories which feature complex colour patterns that make sorting harder.",
  },
  {
    question: "Can jigsaw puzzles help with stress and anxiety?",
    answer:
      "Yes. The focused, repetitive nature of puzzle-solving is often described as meditative. Concentrating on fitting pieces together gives the mind a break from worries and has been linked to lowered heart rate and reduced cortisol levels. Many adults report that doing a puzzle is one of their favourite ways to unwind.",
  },
  {
    question: "Do I need good eyesight to play?",
    answer:
      "Our puzzles feature high-resolution photography rendered sharply on screen. You can zoom in on any puzzle page using your browser or device zoom controls. On desktop, the puzzle canvas can be expanded to full-screen for maximum visibility.",
  },
  {
    question: "Can I play with a friend or family member?",
    answer:
      "You can both sit down at the same device and take turns placing pieces — many of our users enjoy puzzles as a shared family activity. A multiplayer mode with side-by-side completion times is on our roadmap.",
  },
  {
    question: "Is there a daily puzzle I can do every morning?",
    answer:
      "Yes — the Daily Jigsaw Puzzle resets every day at midnight with a brand-new image. It is a wonderful way to build a healthy mental-exercise habit. Complete the daily puzzle each day to grow your streak counter.",
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

const benefits = [
  {
    icon: "🧠",
    title: "Boosts Brain Health",
    description:
      "Engages both hemispheres simultaneously, improving memory, concentration, and problem-solving skills.",
  },
  {
    icon: "😌",
    title: "Reduces Stress",
    description:
      "The meditative focus of puzzle-solving lowers cortisol and heart rate — nature's own stress relief.",
  },
  {
    icon: "👁️",
    title: "Improves Visual Perception",
    description:
      "Sorting and matching pieces sharpens spatial reasoning and fine detail recognition.",
  },
  {
    icon: "⏱️",
    title: "Flexible Time Commitment",
    description:
      "From a 10-minute 24-piece warm-up to a 45-minute 150-piece challenge — you choose the length.",
  },
  {
    icon: "💾",
    title: "Progress Saved Automatically",
    description:
      "Close the browser and come back later. Every piece position is saved until you finish.",
  },
  {
    icon: "📅",
    title: "New Puzzle Every Day",
    description:
      "A fresh daily puzzle each morning gives you a healthy mental exercise routine to look forward to.",
  },
];

// Pick 12 featured puzzles — weighted toward medium/hard difficulty for adults
const featuredPuzzles = categories
  .flatMap((cat) =>
    puzzles
      .filter((p) => p.category === cat.slug && p.difficulty >= 2)
      .slice(0, 2)
  )
  .slice(0, 12);

export default function JigsawPuzzlesForAdultsPage() {
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
          <span className="text-slate-600 font-medium">Jigsaw Puzzles for Adults</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-800 mb-4 leading-tight">
            Jigsaw Puzzles for Adults
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Free online jigsaw puzzles designed for adult enjoyment. Relax, sharpen your
            mind, and challenge yourself with beautiful imagery across eight categories —
            no download or account needed.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link
              href="/daily"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              🧩 Start Today&apos;s Daily Puzzle
            </Link>
            <Link
              href="/puzzles/landscapes"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              Browse Challenging Puzzles
            </Link>
          </div>
        </div>

        {/* Ad */}
        <div className="flex justify-center mb-10">
          <AdSlot format="leaderboard" className="hidden md:flex" />
          <AdSlot format="mobile-banner" className="md:hidden" />
        </div>

        {/* Benefits grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Why Adults Love Online Jigsaw Puzzles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl"
              >
                <span className="text-3xl flex-shrink-0">{b.icon}</span>
                <div>
                  <h3 className="font-semibold text-slate-800 mb-1">{b.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured puzzles */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Featured Adult Puzzles
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Challenging medium and hard puzzles hand-picked from every category.
          </p>
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
            The Best Free Online Jigsaw Puzzles for Adults
          </h2>
          <div className="space-y-4 text-slate-600 leading-relaxed text-sm">
            <p>
              Jigsaw puzzles have always been a favourite adult pastime, and free online
              jigsaw puzzles have made the hobby more accessible than ever. Online Jigsaws
              offers over 500 beautiful puzzles spanning eight categories — all completely
              free to play in your browser without any download.
            </p>
            <p>
              Unlike many puzzle sites that use blurry stock images or repetitive clip
              art, every image in our collection is a high-resolution, professionally
              composed photograph. From sweeping alpine landscapes and close-up wildlife
              portraits to vibrant abstract art and mouthwatering food photography, there
              is genuinely something to suit every taste.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-6">
              Jigsaw Puzzles and Brain Health
            </h3>
            <p>
              A growing body of research supports the cognitive benefits of regular puzzle
              activity. A 2022 study published in the <em>International Journal of
              Environmental Research and Public Health</em> found that adults who regularly
              engaged in jigsaw puzzles showed significantly better visuospatial cognition
              compared to those who did not. Regular puzzling has also been associated with
              a delayed onset of dementia symptoms in at-risk populations.
            </p>
            <p>
              The mechanism is well understood: jigsaw puzzles require you to hold a
              mental image (the finished picture) while simultaneously sorting, rotating,
              and fitting individual pieces — a demanding exercise for working memory. Each
              successful snap triggers a small dopamine release, reinforcing the habit loop
              and making it easy to spend a rewarding hour without noticing the time pass.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-6">
              Puzzles as Stress Relief for Adults
            </h3>
            <p>
              Many adults turn to jigsaw puzzles specifically as a way to decompress after
              a busy day. The focused, repetitive nature of the task — scan, sort, try,
              confirm — creates a flow state that quiets anxious thoughts. Unlike passive
              entertainment such as scrolling social media, puzzles give your mind
              something constructive to do, which tends to produce more lasting relaxation.
            </p>
            <p>
              Our 24-piece easy puzzles are perfect for a quick mental reset during a
              lunch break, while the 96 and 150-piece options provide a deeper, more
              absorbing experience for evenings when you want to truly switch off.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-6">
              Jigsaw Puzzles for Seniors
            </h3>
            <p>
              Online Jigsaws is particularly popular with adults aged 60 and over. Our
              site is designed with simplicity and accessibility at its core: there are no
              confusing menus, no intrusive pop-ups, and the puzzle canvas fills most of
              the screen so pieces are large and easy to see. Progress is saved
              automatically, so there is never any pressure to finish in one sitting.
            </p>
            <p>
              For seniors who are newer to online puzzles, we recommend starting with the{" "}
              <Link href="/puzzles/animals" className="text-indigo-600 hover:underline">
                animals category
              </Link>{" "}
              at 24 pieces — the vivid, colourful images make it easy to distinguish
              pieces, and the quick solve time builds confidence before moving on to more
              challenging puzzles.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-6">
              Build a Daily Puzzle Habit
            </h3>
            <p>
              One of the most effective ways to enjoy the cognitive benefits of puzzles is
              to make them a daily habit. Our{" "}
              <Link href="/daily" className="text-indigo-600 hover:underline">
                Daily Jigsaw Puzzle
              </Link>{" "}
              gives you a fresh, handpicked puzzle every single morning. Complete it each
              day and your streak counter grows — a satisfying reminder of your commitment
              to keeping your mind active.
            </p>
            <p>
              Many of our regular users describe the daily puzzle as a morning ritual on
              par with their crossword or Wordle — a few quiet minutes of focused
              enjoyment before the day begins.
            </p>

            <h3 className="text-lg font-semibold text-slate-800 mt-6">
              Turn Your Own Photos Into Puzzles
            </h3>
            <p>
              Our{" "}
              <Link href="/create" className="text-indigo-600 hover:underline">
                custom puzzle creator
              </Link>{" "}
              lets you upload any image — a family holiday photo, a picture of a
              grandchild, a beloved pet — and play it as a jigsaw puzzle in seconds. It is
              completely free and a wonderful way to add a personal touch to your puzzle
              time.
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
