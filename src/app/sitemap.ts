import type { MetadataRoute } from "next";
import { puzzles } from "@/data/puzzles";
import { categories } from "@/data/categories";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://online-jigsaws.com";

const blogSlugs = [
  "how-to-solve-jigsaw-puzzles-faster",
  "benefits-of-jigsaw-puzzles-for-brain-health",
  "best-free-online-jigsaw-puzzles-2026",
  "how-to-make-custom-jigsaw-puzzle-from-photo",
  "jigsaw-puzzles-for-seniors-complete-guide",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/daily`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/free-jigsaw-puzzles`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/jigsaw-puzzles-for-adults`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/create`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/puzzles/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const puzzlePages: MetadataRoute.Sitemap = puzzles.map((p) => ({
    url: `${BASE_URL}/puzzles/${p.category}/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...categoryPages, ...puzzlePages, ...blogPages];
}
