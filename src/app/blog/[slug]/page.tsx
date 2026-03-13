import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts, getBlogPost } from "@/data/blog";
import AdSlot from "@/components/layout/AdSlot";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "PuzzleHaven",
    },
  };

  const paragraphs = post.content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-stone-700">Blog</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-stone-500">
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="flex justify-center mb-8">
          <AdSlot format="leaderboard" className="hidden md:flex" />
          <AdSlot format="mobile-banner" className="md:hidden" />
        </div>

        <div className="prose prose-stone prose-lg max-w-none">
          {paragraphs.map((para, i) => {
            if (para.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="text-2xl font-bold text-stone-800 mt-10 mb-4"
                >
                  {para.replace("## ", "")}
                </h2>
              );
            }
            if (para.startsWith("### ")) {
              return (
                <h3
                  key={i}
                  className="text-xl font-semibold text-stone-800 mt-8 mb-3"
                >
                  {para.replace("### ", "")}
                </h3>
              );
            }
            if (para.startsWith("- ")) {
              return (
                <li key={i} className="text-stone-600 leading-relaxed ml-4">
                  {para.replace("- ", "")}
                </li>
              );
            }
            if (para.startsWith("**") && para.endsWith("**")) {
              return (
                <p key={i} className="text-stone-700 font-semibold leading-relaxed">
                  {para.replace(/\*\*/g, "")}
                </p>
              );
            }
            return (
              <p key={i} className="text-stone-600 leading-relaxed mb-4">
                {para}
              </p>
            );
          })}
        </div>

        <div className="mt-12 p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <h3 className="font-semibold text-stone-800 mb-2">
            Ready to Start Puzzling?
          </h3>
          <p className="text-stone-600 text-sm mb-4">
            Try our free daily puzzle challenge — no downloads or sign-ups required.
          </p>
          <Link
            href="/daily"
            className="inline-block px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors"
          >
            Play Today&apos;s Puzzle
          </Link>
        </div>
      </article>
    </>
  );
}
