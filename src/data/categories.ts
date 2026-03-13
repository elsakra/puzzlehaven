export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  {
    id: "animals",
    name: "Animals",
    slug: "animals",
    description:
      "Adorable animals from around the world. From cute kittens and playful puppies to majestic wildlife and colorful birds, these animal jigsaw puzzles are perfect for nature lovers of all ages.",
    seoTitle: "Animal Jigsaw Puzzles - Free Online",
    seoDescription:
      "Play free animal jigsaw puzzles online. Cute cats, dogs, birds, wildlife and more. No download required.",
    icon: "🐾",
    color: "amber",
  },
  {
    id: "nature",
    name: "Nature",
    slug: "nature",
    description:
      "Immerse yourself in the beauty of the natural world. From blooming flower gardens and peaceful forests to stunning sunsets and crystal-clear lakes, these nature puzzles bring the outdoors to your screen.",
    seoTitle: "Nature Jigsaw Puzzles - Free Online",
    seoDescription:
      "Play free nature jigsaw puzzles online. Beautiful flowers, forests, sunsets and scenic landscapes. No download required.",
    icon: "🌿",
    color: "green",
  },
  {
    id: "landscapes",
    name: "Landscapes",
    slug: "landscapes",
    description:
      "Travel the world through jigsaw puzzles. Breathtaking mountain vistas, serene beaches, rolling countryside, and iconic landmarks from every continent await your puzzle-solving skills.",
    seoTitle: "Landscape Jigsaw Puzzles - Free Online",
    seoDescription:
      "Play free landscape jigsaw puzzles online. Mountains, beaches, countryside and scenic views. No download required.",
    icon: "🏔️",
    color: "blue",
  },
  {
    id: "art",
    name: "Art",
    slug: "art",
    description:
      "Piece together masterpieces from the world's greatest artists. Classic paintings, modern art, colorful illustrations, and creative designs make these puzzles a feast for the eyes.",
    seoTitle: "Art Jigsaw Puzzles - Free Online",
    seoDescription:
      "Play free art jigsaw puzzles online. Classic paintings, modern art and beautiful illustrations. No download required.",
    icon: "🎨",
    color: "purple",
  },
  {
    id: "food",
    name: "Food & Drink",
    slug: "food",
    description:
      "Delicious puzzles for food lovers. From fresh fruit arrangements and gourmet dishes to cozy coffee scenes and colorful market stalls, these puzzles are a treat for the senses.",
    seoTitle: "Food Jigsaw Puzzles - Free Online",
    seoDescription:
      "Play free food and drink jigsaw puzzles online. Delicious dishes, fresh fruit, coffee and more. No download required.",
    icon: "🍰",
    color: "red",
  },
  {
    id: "travel",
    name: "Travel",
    slug: "travel",
    description:
      "Explore the world one puzzle at a time. Famous cities, hidden villages, ancient temples, and iconic landmarks from every corner of the globe.",
    seoTitle: "Travel Jigsaw Puzzles - Free Online",
    seoDescription:
      "Play free travel jigsaw puzzles online. Famous cities, landmarks and destinations worldwide. No download required.",
    icon: "✈️",
    color: "sky",
  },
  {
    id: "holidays",
    name: "Holidays",
    slug: "holidays",
    description:
      "Celebrate every season with festive jigsaw puzzles. Christmas scenes, autumn harvests, spring flowers, and summer fun — there's a puzzle for every time of year.",
    seoTitle: "Holiday Jigsaw Puzzles - Free Online",
    seoDescription:
      "Play free holiday and seasonal jigsaw puzzles online. Christmas, autumn, spring and summer themes. No download required.",
    icon: "🎄",
    color: "rose",
  },
  {
    id: "abstract",
    name: "Abstract",
    slug: "abstract",
    description:
      "Challenge yourself with abstract patterns and designs. Colorful gradients, geometric shapes, and mesmerizing textures that will test even experienced puzzlers.",
    seoTitle: "Abstract Jigsaw Puzzles - Free Online",
    seoDescription:
      "Play free abstract jigsaw puzzles online. Colorful patterns, geometric designs and challenging textures. No download required.",
    icon: "🔮",
    color: "violet",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
