import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Online Jigsaws",
    short_name: "Online Jigsaws",
    description:
      "Free online jigsaw puzzles. Play daily challenges, create custom puzzles from your photos, and challenge friends.",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf9f3",
    theme_color: "#f59e0b",
    orientation: "any",
    categories: ["games", "entertainment"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
