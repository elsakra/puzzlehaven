import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Jigsaw Puzzle Tips, Guides & Articles",
  description:
    "Read expert tips on solving jigsaw puzzles faster, the brain benefits of puzzling, best free online puzzles in 2026, and guides for seniors and beginners.",
  openGraph: {
    title: "Jigsaw Puzzle Tips, Guides & Articles — Online Jigsaws",
    description:
      "Expert jigsaw puzzle tips, brain health guides, and free puzzle recommendations.",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
        <Link href="/" className="hover:text-amber-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-stone-700">Blog</span>
      </nav>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 leading-tight">
          Jigsaw Puzzle Tips &amp; Guides
        </h1>
        <p className="text-slate-500 mt-3 text-lg max-w-2xl">
          Expert advice on solving faster, the science behind puzzling, and
          everything you need to enjoy jigsaw puzzles online.
        </p>
      </header>

      <div className="grid gap-6">
        {sortedPosts.map((post) => (
          <article
            key={post.slug}
            className="group bg-white border border-stone-200 rounded-2xl p-6 hover:border-amber-300 hover:shadow-md transition-all duration-200"
          >
            <Link href={`/blog/${post.slug}`} className="block">
              <div className="flex items-center gap-3 text-sm text-stone-400 mb-3">
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors leading-snug mb-2">
                {post.title}
              </h2>
              <p className="text-stone-500 leading-relaxed line-clamp-2">
                {post.description}
              </p>
              <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-amber-600 group-hover:gap-2 transition-all">
                Read article
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center">
        <h3 className="font-semibold text-stone-800 mb-2">
          Ready to Put It Into Practice?
        </h3>
        <p className="text-stone-600 text-sm mb-4">
          Play today&apos;s free daily puzzle — no downloads or sign-ups required.
        </p>
        <Link
          href="/daily"
          className="inline-block px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
        >
          Play Today&apos;s Puzzle
        </Link>
      </div>
    </div>
  );
}
