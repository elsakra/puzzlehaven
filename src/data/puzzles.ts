import { puzzleImageUrl, puzzleThumbUrl } from "@/lib/cloudinary";

export interface Puzzle {
  id: string;
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  description: string;
  difficulty: 1 | 2 | 3;
  attribution: string;
  tags: string[];
}

export const puzzles: Puzzle[] = [
  // ===== ANIMALS =====
  {
    id: "a1",
    slug: "cute-orange-cat",
    title: "Cute Orange Cat",
    category: "animals",
    imageUrl: puzzleImageUrl("cute-orange-cat"),
    thumbnailUrl: puzzleThumbUrl("cute-orange-cat"),
    description: "An adorable orange tabby cat with bright green eyes lounging in the sunshine.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["cat", "pet", "orange", "cute"],
  },
  {
    id: "a2",
    slug: "golden-retriever-puppy",
    title: "Golden Retriever Puppy",
    category: "animals",
    imageUrl: puzzleImageUrl("golden-retriever-puppy"),
    thumbnailUrl: puzzleThumbUrl("golden-retriever-puppy"),
    description: "A happy golden retriever puppy playing in a meadow full of wildflowers.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["dog", "puppy", "golden retriever", "pet"],
  },
  {
    id: "a3",
    slug: "colorful-parrot",
    title: "Colorful Parrot",
    category: "animals",
    imageUrl: puzzleImageUrl("colorful-parrot"),
    thumbnailUrl: puzzleThumbUrl("colorful-parrot"),
    description: "A vibrant scarlet macaw perched on a tropical branch, showing off brilliant red, blue, and yellow feathers.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["bird", "parrot", "macaw", "tropical", "colorful"],
  },
  {
    id: "a4",
    slug: "butterfly-on-flower",
    title: "Butterfly on a Flower",
    category: "animals",
    imageUrl: puzzleImageUrl("butterfly-on-flower"),
    thumbnailUrl: puzzleThumbUrl("butterfly-on-flower"),
    description: "A delicate monarch butterfly resting on a purple coneflower in a summer garden.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["butterfly", "insect", "flower", "garden"],
  },
  {
    id: "a5",
    slug: "underwater-sea-turtle",
    title: "Sea Turtle",
    category: "animals",
    imageUrl: puzzleImageUrl("underwater-sea-turtle"),
    thumbnailUrl: puzzleThumbUrl("underwater-sea-turtle"),
    description: "A graceful sea turtle gliding through crystal-clear tropical waters.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["turtle", "ocean", "underwater", "marine"],
  },
  {
    id: "a7",
    slug: "two-kittens-playing",
    title: "Kittens at Play",
    category: "animals",
    imageUrl: puzzleImageUrl("two-kittens-playing"),
    thumbnailUrl: puzzleThumbUrl("two-kittens-playing"),
    description: "Two fluffy kittens playing together on a cozy blanket.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["cat", "kitten", "cute", "pet", "playing"],
  },
  {
    id: "a8",
    slug: "majestic-lion",
    title: "Majestic Lion",
    category: "animals",
    imageUrl: puzzleImageUrl("majestic-lion"),
    thumbnailUrl: puzzleThumbUrl("majestic-lion"),
    description: "A powerful male lion with a magnificent mane resting on the African savanna.",
    difficulty: 3,
    attribution: "Cloudinary",
    tags: ["lion", "wildlife", "africa", "big cat"],
  },
  {
    id: "a9",
    slug: "hummingbird-in-flight",
    title: "Hummingbird in Flight",
    category: "animals",
    imageUrl: puzzleImageUrl("hummingbird-in-flight"),
    thumbnailUrl: puzzleThumbUrl("hummingbird-in-flight"),
    description: "A tiny hummingbird frozen in mid-flight, wings outstretched near a bright flower.",
    difficulty: 3,
    attribution: "Cloudinary",
    tags: ["bird", "hummingbird", "flight", "nature"],
  },
  {
    id: "a10",
    slug: "rabbits-in-garden",
    title: "Rabbits in the Garden",
    category: "animals",
    imageUrl: puzzleImageUrl("rabbits-in-garden"),
    thumbnailUrl: puzzleThumbUrl("rabbits-in-garden"),
    description: "Fluffy rabbits nibbling on fresh greens in a spring garden.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["rabbit", "bunny", "garden", "cute", "spring"],
  },

  // ===== NATURE =====
  {
    id: "n1",
    slug: "cherry-blossoms",
    title: "Cherry Blossoms in Spring",
    category: "nature",
    imageUrl: puzzleImageUrl("cherry-blossoms"),
    thumbnailUrl: puzzleThumbUrl("cherry-blossoms"),
    description: "Delicate pink cherry blossoms framing a serene spring landscape.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["cherry blossom", "spring", "flowers", "pink"],
  },
  {
    id: "n2",
    slug: "autumn-forest-path",
    title: "Autumn Forest Path",
    category: "nature",
    imageUrl: puzzleImageUrl("autumn-forest-path"),
    thumbnailUrl: puzzleThumbUrl("autumn-forest-path"),
    description: "A winding path through a forest ablaze with golden and crimson autumn leaves.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["autumn", "forest", "path", "fall", "leaves"],
  },
  {
    id: "n3",
    slug: "sunflower-field",
    title: "Sunflower Field",
    category: "nature",
    imageUrl: puzzleImageUrl("sunflower-field"),
    thumbnailUrl: puzzleThumbUrl("sunflower-field"),
    description: "An endless field of bright sunflowers stretching to the horizon under a blue sky.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["sunflower", "field", "yellow", "summer"],
  },
  {
    id: "n5",
    slug: "lavender-fields",
    title: "Lavender Fields of Provence",
    category: "nature",
    imageUrl: puzzleImageUrl("lavender-fields"),
    thumbnailUrl: puzzleThumbUrl("lavender-fields"),
    description: "Rolling rows of fragrant purple lavender stretching into the distance under a warm Provençal sky.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["lavender", "provence", "purple", "flowers", "field"],
  },
  {
    id: "n6",
    slug: "tropical-beach-palms",
    title: "Tropical Beach Palms",
    category: "nature",
    imageUrl: puzzleImageUrl("tropical-beach-palms"),
    thumbnailUrl: puzzleThumbUrl("tropical-beach-palms"),
    description: "Swaying palm trees along a pristine tropical beach with turquoise waters.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["beach", "palm", "tropical", "ocean", "summer"],
  },
  {
    id: "n7",
    slug: "forest-stream",
    title: "Forest Stream",
    category: "nature",
    imageUrl: puzzleImageUrl("forest-stream"),
    thumbnailUrl: puzzleThumbUrl("forest-stream"),
    description: "A crystal-clear stream winding through a lush green forest with dappled sunlight.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["stream", "forest", "water", "green", "peaceful"],
  },
  {
    id: "n9",
    slug: "snowy-pine-trees",
    title: "Snowy Pine Forest",
    category: "nature",
    imageUrl: puzzleImageUrl("snowy-pine-trees"),
    thumbnailUrl: puzzleThumbUrl("snowy-pine-trees"),
    description: "Snow-covered pine trees in a peaceful winter wonderland scene.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["snow", "winter", "pine", "forest", "cold"],
  },

  // ===== LANDSCAPES =====
  {
    id: "l1",
    slug: "mountain-lake-reflection",
    title: "Mountain Lake Reflection",
    category: "landscapes",
    imageUrl: puzzleImageUrl("mountain-lake-reflection"),
    thumbnailUrl: puzzleThumbUrl("mountain-lake-reflection"),
    description: "A perfectly still mountain lake reflecting snow-capped peaks and blue sky.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["mountain", "lake", "reflection", "alpine"],
  },
  {
    id: "l2",
    slug: "tuscan-rolling-hills",
    title: "Tuscan Rolling Hills",
    category: "landscapes",
    imageUrl: puzzleImageUrl("tuscan-rolling-hills"),
    thumbnailUrl: puzzleThumbUrl("tuscan-rolling-hills"),
    description: "The iconic rolling green hills of Tuscany dotted with cypress trees under golden light.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["tuscany", "italy", "hills", "countryside"],
  },
  {
    id: "l3",
    slug: "ocean-sunset",
    title: "Ocean Sunset",
    category: "landscapes",
    imageUrl: puzzleImageUrl("ocean-sunset"),
    thumbnailUrl: puzzleThumbUrl("ocean-sunset"),
    description: "A breathtaking golden sunset over a calm ocean with dramatic clouds.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["sunset", "ocean", "sky", "golden"],
  },
  {
    id: "l4",
    slug: "northern-lights",
    title: "Northern Lights",
    category: "landscapes",
    imageUrl: puzzleImageUrl("northern-lights"),
    thumbnailUrl: puzzleThumbUrl("northern-lights"),
    description: "The mesmerizing aurora borealis dancing across the night sky in brilliant greens and purples.",
    difficulty: 3,
    attribution: "Cloudinary",
    tags: ["aurora", "northern lights", "night", "sky"],
  },
  {
    id: "l5",
    slug: "desert-dunes",
    title: "Desert Sand Dunes",
    category: "landscapes",
    imageUrl: puzzleImageUrl("desert-dunes"),
    thumbnailUrl: puzzleThumbUrl("desert-dunes"),
    description: "Sweeping golden sand dunes creating mesmerizing patterns in the desert.",
    difficulty: 3,
    attribution: "Cloudinary",
    tags: ["desert", "sand", "dunes", "golden"],
  },
  {
    id: "l7",
    slug: "coastal-cliffs",
    title: "Coastal Cliffs",
    category: "landscapes",
    imageUrl: puzzleImageUrl("coastal-cliffs"),
    thumbnailUrl: puzzleThumbUrl("coastal-cliffs"),
    description: "Dramatic coastal cliffs dropping into deep blue waters with crashing waves.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["coast", "cliffs", "ocean", "dramatic"],
  },

  // ===== ART =====
  {
    id: "ar1",
    slug: "starry-night-inspired",
    title: "Starry Night Sky",
    category: "art",
    imageUrl: puzzleImageUrl("starry-night-inspired"),
    thumbnailUrl: puzzleThumbUrl("starry-night-inspired"),
    description: "A swirling night sky painting inspired by classic Impressionist masterpieces.",
    difficulty: 3,
    attribution: "Cloudinary",
    tags: ["starry night", "painting", "impressionist", "night"],
  },
  {
    id: "ar2",
    slug: "colorful-abstract-painting",
    title: "Colorful Abstract",
    category: "art",
    imageUrl: puzzleImageUrl("colorful-abstract-painting"),
    thumbnailUrl: puzzleThumbUrl("colorful-abstract-painting"),
    description: "Bold splashes of vibrant color creating an energetic abstract composition.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["abstract", "colorful", "painting", "modern"],
  },
  {
    id: "ar5",
    slug: "stained-glass-window",
    title: "Stained Glass Window",
    category: "art",
    imageUrl: puzzleImageUrl("stained-glass-window"),
    thumbnailUrl: puzzleThumbUrl("stained-glass-window"),
    description: "A magnificent stained glass window with rich jewel-tone colors and intricate patterns.",
    difficulty: 3,
    attribution: "Cloudinary",
    tags: ["stained glass", "window", "church", "colorful"],
  },

  // ===== FOOD =====
  {
    id: "f1",
    slug: "fresh-fruit-arrangement",
    title: "Fresh Fruit Arrangement",
    category: "food",
    imageUrl: puzzleImageUrl("fresh-fruit-arrangement"),
    thumbnailUrl: puzzleThumbUrl("fresh-fruit-arrangement"),
    description: "A colorful arrangement of fresh seasonal fruits beautifully displayed.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["fruit", "fresh", "colorful", "healthy"],
  },
  {
    id: "f2",
    slug: "bakery-pastries",
    title: "Bakery Pastries",
    category: "food",
    imageUrl: puzzleImageUrl("bakery-pastries"),
    thumbnailUrl: puzzleThumbUrl("bakery-pastries"),
    description: "Freshly baked golden pastries and bread arranged on a rustic wooden board.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["bakery", "pastries", "bread", "baked"],
  },
  {
    id: "f3",
    slug: "colorful-macarons",
    title: "Colorful Macarons",
    category: "food",
    imageUrl: puzzleImageUrl("colorful-macarons"),
    thumbnailUrl: puzzleThumbUrl("colorful-macarons"),
    description: "Rows of perfectly made French macarons in every color of the rainbow.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["macarons", "french", "colorful", "dessert"],
  },
  {
    id: "f4",
    slug: "cozy-coffee-scene",
    title: "Cozy Coffee Scene",
    category: "food",
    imageUrl: puzzleImageUrl("cozy-coffee-scene"),
    thumbnailUrl: puzzleThumbUrl("cozy-coffee-scene"),
    description: "A warm cup of coffee with latte art on a cozy morning with a good book.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["coffee", "cozy", "morning", "latte"],
  },
  {
    id: "f5",
    slug: "farmers-market-vegetables",
    title: "Farmers Market Vegetables",
    category: "food",
    imageUrl: puzzleImageUrl("farmers-market-vegetables"),
    thumbnailUrl: puzzleThumbUrl("farmers-market-vegetables"),
    description: "A vibrant display of fresh vegetables at a local farmers market.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["vegetables", "market", "fresh", "colorful"],
  },

  // ===== TRAVEL =====
  {
    id: "t2",
    slug: "venetian-canals",
    title: "Venice Canals",
    category: "travel",
    imageUrl: puzzleImageUrl("venetian-canals"),
    thumbnailUrl: puzzleThumbUrl("venetian-canals"),
    description: "Charming gondolas floating along the historic canals of Venice, Italy.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["venice", "italy", "canals", "gondola"],
  },
  {
    id: "t3",
    slug: "japanese-temple",
    title: "Japanese Temple",
    category: "travel",
    imageUrl: puzzleImageUrl("japanese-temple"),
    thumbnailUrl: puzzleThumbUrl("japanese-temple"),
    description: "A serene Japanese temple surrounded by cherry blossoms and traditional gardens.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["japan", "temple", "cherry blossom", "traditional"],
  },
  {
    id: "t4",
    slug: "santorini-greece",
    title: "Santorini, Greece",
    category: "travel",
    imageUrl: puzzleImageUrl("santorini-greece"),
    thumbnailUrl: puzzleThumbUrl("santorini-greece"),
    description: "The iconic white and blue buildings of Santorini perched on volcanic cliffs above the Aegean Sea.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["santorini", "greece", "white", "blue", "mediterranean"],
  },
  {
    id: "t5",
    slug: "new-york-skyline",
    title: "New York Skyline",
    category: "travel",
    imageUrl: puzzleImageUrl("new-york-skyline"),
    thumbnailUrl: puzzleThumbUrl("new-york-skyline"),
    description: "The magnificent Manhattan skyline glittering at twilight with the Brooklyn Bridge in view.",
    difficulty: 3,
    attribution: "Cloudinary",
    tags: ["new york", "skyline", "city", "bridge", "night"],
  },

  // ===== HOLIDAYS =====
  {
    id: "h2",
    slug: "autumn-pumpkins",
    title: "Autumn Pumpkins",
    category: "holidays",
    imageUrl: puzzleImageUrl("autumn-pumpkins"),
    thumbnailUrl: puzzleThumbUrl("autumn-pumpkins"),
    description: "A harvest display of colorful pumpkins and gourds celebrating the autumn season.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["pumpkin", "autumn", "harvest", "fall", "halloween"],
  },
  {
    id: "h3",
    slug: "spring-easter-eggs",
    title: "Spring Easter Eggs",
    category: "holidays",
    imageUrl: puzzleImageUrl("spring-easter-eggs"),
    thumbnailUrl: puzzleThumbUrl("spring-easter-eggs"),
    description: "Brightly painted Easter eggs nestled among spring flowers and fresh green grass.",
    difficulty: 1,
    attribution: "Cloudinary",
    tags: ["easter", "eggs", "spring", "colorful", "holiday"],
  },

  // ===== ABSTRACT =====
  {
    id: "ab1",
    slug: "rainbow-gradient",
    title: "Rainbow Gradient",
    category: "abstract",
    imageUrl: puzzleImageUrl("rainbow-gradient"),
    thumbnailUrl: puzzleThumbUrl("rainbow-gradient"),
    description: "A mesmerizing smooth gradient flowing through all the colors of the rainbow.",
    difficulty: 2,
    attribution: "Cloudinary",
    tags: ["rainbow", "gradient", "colorful", "smooth"],
  },
  {
    id: "ab2",
    slug: "geometric-shapes",
    title: "Geometric Shapes",
    category: "abstract",
    imageUrl: puzzleImageUrl("geometric-shapes"),
    thumbnailUrl: puzzleThumbUrl("geometric-shapes"),
    description: "Bold geometric shapes and patterns in vibrant contrasting colors.",
    difficulty: 3,
    attribution: "Cloudinary",
    tags: ["geometric", "shapes", "bold", "pattern"],
  },
  {
    id: "ab5",
    slug: "neon-lights",
    title: "Neon Lights",
    category: "abstract",
    imageUrl: puzzleImageUrl("neon-lights"),
    thumbnailUrl: puzzleThumbUrl("neon-lights"),
    description: "Glowing neon light trails creating mesmerizing patterns against a dark background.",
    difficulty: 3,
    attribution: "Cloudinary",
    tags: ["neon", "lights", "glow", "dark", "trails"],
  },

  // ===== ANIMALS (continued) =====
  { id: "a11", slug: "african-elephants", title: "African Elephants", category: "animals", imageUrl: puzzleImageUrl("african-elephants"), thumbnailUrl: puzzleThumbUrl("african-elephants"), description: "A herd of majestic African elephants roaming the savanna at golden hour.", difficulty: 2, attribution: "Cloudinary", tags: ["elephant", "africa", "wildlife", "herd"] },
  { id: "a14", slug: "white-horse-field", title: "White Horse in a Field", category: "animals", imageUrl: puzzleImageUrl("white-horse-field"), thumbnailUrl: puzzleThumbUrl("white-horse-field"), description: "A beautiful white horse galloping freely across a lush green meadow.", difficulty: 2, attribution: "Cloudinary", tags: ["horse", "white", "meadow", "gallop"] },
  { id: "a16", slug: "polar-bear-cub", title: "Polar Bear and Cub", category: "animals", imageUrl: puzzleImageUrl("polar-bear-cub"), thumbnailUrl: puzzleThumbUrl("polar-bear-cub"), description: "A polar bear mother with her playful cub on the Arctic ice floe.", difficulty: 2, attribution: "Cloudinary", tags: ["polar bear", "arctic", "cub", "ice"] },
  { id: "a23", slug: "glowing-jellyfish", title: "Glowing Jellyfish", category: "animals", imageUrl: puzzleImageUrl("glowing-jellyfish"), thumbnailUrl: puzzleThumbUrl("glowing-jellyfish"), description: "A translucent jellyfish glowing with bioluminescent light in the deep ocean.", difficulty: 2, attribution: "Cloudinary", tags: ["jellyfish", "ocean", "glow", "deep sea"] },
  { id: "a28", slug: "meerkat-family", title: "Meerkat Family", category: "animals", imageUrl: puzzleImageUrl("meerkat-family"), thumbnailUrl: puzzleThumbUrl("meerkat-family"), description: "An adorable group of meerkats standing alert and scanning for predators.", difficulty: 1, attribution: "Cloudinary", tags: ["meerkat", "family", "africa", "cute"] },
  { id: "a30", slug: "white-swan-lake", title: "White Swan on a Lake", category: "animals", imageUrl: puzzleImageUrl("white-swan-lake"), thumbnailUrl: puzzleThumbUrl("white-swan-lake"), description: "A graceful white swan gliding serenely across a still reflective lake.", difficulty: 2, attribution: "Cloudinary", tags: ["swan", "lake", "white", "elegant"] },

  // ===== NATURE (continued) =====
  { id: "n12", slug: "aurora-over-mountains", title: "Aurora Over the Mountains", category: "nature", imageUrl: puzzleImageUrl("aurora-over-mountains"), thumbnailUrl: puzzleThumbUrl("aurora-over-mountains"), description: "A spectacular aurora borealis painting the sky above a snowy mountain range.", difficulty: 3, attribution: "Cloudinary", tags: ["aurora", "mountains", "night", "northern lights"] },
  { id: "n15", slug: "lotus-lily-pond", title: "Lotus Lily Pond", category: "nature", imageUrl: puzzleImageUrl("lotus-lily-pond"), thumbnailUrl: puzzleThumbUrl("lotus-lily-pond"), description: "Pink lotus blossoms rising serenely above their broad leaves on a still pond.", difficulty: 2, attribution: "Cloudinary", tags: ["lotus", "lily", "pond", "pink"] },
  { id: "n18", slug: "bamboo-forest", title: "Bamboo Forest", category: "nature", imageUrl: puzzleImageUrl("bamboo-forest"), thumbnailUrl: puzzleThumbUrl("bamboo-forest"), description: "Towering bamboo stalks creating a green cathedral in a Japanese bamboo grove.", difficulty: 2, attribution: "Cloudinary", tags: ["bamboo", "japan", "forest", "green"] },
  { id: "n20", slug: "frozen-lake-winter", title: "Frozen Lake in Winter", category: "nature", imageUrl: puzzleImageUrl("frozen-lake-winter"), thumbnailUrl: puzzleThumbUrl("frozen-lake-winter"), description: "A perfectly frozen lake with cracked ice patterns reflecting a cold winter sky.", difficulty: 3, attribution: "Cloudinary", tags: ["frozen", "lake", "winter", "ice"] },
  { id: "n21", slug: "jungle-waterfall-tropics", title: "Hidden Jungle Waterfall", category: "nature", imageUrl: puzzleImageUrl("jungle-waterfall-tropics"), thumbnailUrl: puzzleThumbUrl("jungle-waterfall-tropics"), description: "A hidden waterfall cascading into an emerald jungle pool deep in a tropical forest.", difficulty: 2, attribution: "Cloudinary", tags: ["waterfall", "jungle", "tropical", "green"] },
  { id: "n22", slug: "majestic-oak-tree", title: "Majestic Oak Tree", category: "nature", imageUrl: puzzleImageUrl("majestic-oak-tree"), thumbnailUrl: puzzleThumbUrl("majestic-oak-tree"), description: "A grand, ancient oak tree with sprawling branches in a field at golden hour.", difficulty: 2, attribution: "Cloudinary", tags: ["oak", "tree", "golden", "ancient"] },
  { id: "n27", slug: "desert-cactus-bloom", title: "Desert Cactus in Bloom", category: "nature", imageUrl: puzzleImageUrl("desert-cactus-bloom"), thumbnailUrl: puzzleThumbUrl("desert-cactus-bloom"), description: "A tall saguaro cactus bursting into rare white bloom in the Sonoran Desert.", difficulty: 2, attribution: "Cloudinary", tags: ["cactus", "desert", "bloom", "saguaro"] },
  { id: "n34", slug: "spring-cherry-tree", title: "Spring Cherry Tree", category: "nature", imageUrl: puzzleImageUrl("spring-cherry-tree"), thumbnailUrl: puzzleThumbUrl("spring-cherry-tree"), description: "A lone cherry tree in full pink blossom against a soft blue spring sky.", difficulty: 2, attribution: "Cloudinary", tags: ["cherry blossom", "spring", "pink", "tree"] },
  { id: "n56", slug: "redwood-forest-tall", title: "Redwood Forest", category: "nature", imageUrl: puzzleImageUrl("redwood-forest-tall"), thumbnailUrl: puzzleThumbUrl("redwood-forest-tall"), description: "Ancient giant redwood trees towering hundreds of feet above the forest floor.", difficulty: 2, attribution: "Cloudinary", tags: ["redwood", "forest", "giant", "california"] },
  { id: "n57", slug: "water-lily-pond-close", title: "Water Lily Close-Up", category: "nature", imageUrl: puzzleImageUrl("water-lily-pond-close"), thumbnailUrl: puzzleThumbUrl("water-lily-pond-close"), description: "A perfect white water lily floating serenely on a still, dark pond.", difficulty: 2, attribution: "Cloudinary", tags: ["water lily", "pond", "white", "serene"] },
  { id: "n59", slug: "daffodil-field-spring", title: "Daffodil Field", category: "nature", imageUrl: puzzleImageUrl("daffodil-field-spring"), thumbnailUrl: puzzleThumbUrl("daffodil-field-spring"), description: "Thousands of cheerful yellow daffodils carpeting a hillside in early spring.", difficulty: 1, attribution: "Cloudinary", tags: ["daffodil", "yellow", "spring", "field"] },

  // ===== LANDSCAPES (continued) =====
  { id: "l20", slug: "lofoten-islands", title: "Lofoten Islands Norway", category: "landscapes", imageUrl: puzzleImageUrl("lofoten-islands"), thumbnailUrl: puzzleThumbUrl("lofoten-islands"), description: "Colorful fishing villages of the Lofoten Islands nestled below dramatic mountain peaks.", difficulty: 3, attribution: "Cloudinary", tags: ["lofoten", "norway", "fishing village", "mountains"] },

  // ===== ART (continued) =====
  { id: "ar6", slug: "oil-painting-landscape", title: "Classic Oil Landscape", category: "art", imageUrl: puzzleImageUrl("oil-painting-landscape"), thumbnailUrl: puzzleThumbUrl("oil-painting-landscape"), description: "A richly textured oil painting of a rolling countryside landscape in warm earth tones.", difficulty: 2, attribution: "Cloudinary", tags: ["oil painting", "landscape", "classic", "textured"] },
  { id: "ar7", slug: "watercolor-bird-branch", title: "Watercolor Bird on a Branch", category: "art", imageUrl: puzzleImageUrl("watercolor-bird-branch"), thumbnailUrl: puzzleThumbUrl("watercolor-bird-branch"), description: "A delicate watercolor painting of a songbird perched on a blossoming branch.", difficulty: 2, attribution: "Cloudinary", tags: ["watercolor", "bird", "branch", "delicate"] },
  { id: "ar11", slug: "pop-art-portrait", title: "Pop Art Portrait", category: "art", imageUrl: puzzleImageUrl("pop-art-portrait"), thumbnailUrl: puzzleThumbUrl("pop-art-portrait"), description: "A vibrant Andy Warhol-inspired pop art portrait in bold, flat color blocks.", difficulty: 2, attribution: "Cloudinary", tags: ["pop art", "warhol", "colorful", "portrait"] },
  { id: "ar15", slug: "charcoal-drawing-still-life", title: "Charcoal Still Life", category: "art", imageUrl: puzzleImageUrl("charcoal-drawing-still-life"), thumbnailUrl: puzzleThumbUrl("charcoal-drawing-still-life"), description: "An expressive charcoal still life drawing with dramatic contrasts of light and shadow.", difficulty: 2, attribution: "Cloudinary", tags: ["charcoal", "still life", "drawing", "shadow"] },
  { id: "ar18", slug: "cubist-face-painting", title: "Cubist Face", category: "art", imageUrl: puzzleImageUrl("cubist-face-painting"), thumbnailUrl: puzzleThumbUrl("cubist-face-painting"), description: "A Picasso-inspired cubist portrait with fragmented geometric planes of color.", difficulty: 3, attribution: "Cloudinary", tags: ["cubism", "picasso", "geometric", "portrait"] },
  { id: "ar19", slug: "digital-art-galaxy", title: "Digital Galaxy Art", category: "art", imageUrl: puzzleImageUrl("digital-art-galaxy"), thumbnailUrl: puzzleThumbUrl("digital-art-galaxy"), description: "A spectacular piece of digital art depicting a swirling galaxy with nebulae.", difficulty: 3, attribution: "Cloudinary", tags: ["digital art", "galaxy", "space", "nebula"] },
  { id: "ar21", slug: "japanese-woodblock-wave", title: "Japanese Wave Print", category: "art", imageUrl: puzzleImageUrl("japanese-woodblock-wave"), thumbnailUrl: puzzleThumbUrl("japanese-woodblock-wave"), description: "A stunning Japanese woodblock print of a great ocean wave in the Hokusai style.", difficulty: 3, attribution: "Cloudinary", tags: ["japanese", "wave", "woodblock", "hokusai"] },
  { id: "ar28", slug: "kinetic-sculpture-chrome", title: "Kinetic Sculpture", category: "art", imageUrl: puzzleImageUrl("kinetic-sculpture-chrome"), thumbnailUrl: puzzleThumbUrl("kinetic-sculpture-chrome"), description: "A gleaming chrome kinetic sculpture with spiral forms catching the light.", difficulty: 3, attribution: "Cloudinary", tags: ["sculpture", "chrome", "kinetic", "modern"] },
  { id: "ar33", slug: "studio-pottery-ceramic", title: "Studio Pottery", category: "art", imageUrl: puzzleImageUrl("studio-pottery-ceramic"), thumbnailUrl: puzzleThumbUrl("studio-pottery-ceramic"), description: "Beautiful hand-thrown ceramic vessels with textured glazes in earth tones.", difficulty: 2, attribution: "Cloudinary", tags: ["pottery", "ceramic", "hand-thrown", "craft"] },
  { id: "ar34", slug: "oil-paint-close-texture", title: "Oil Paint Texture Close-Up", category: "art", imageUrl: puzzleImageUrl("oil-paint-close-texture"), thumbnailUrl: puzzleThumbUrl("oil-paint-close-texture"), description: "A macro view of thick oil paint brushstrokes revealing incredible texture and color.", difficulty: 2, attribution: "Cloudinary", tags: ["oil paint", "texture", "macro", "brushstroke"] },

  // ===== FOOD (continued) =====
  { id: "f6", slug: "strawberry-shortcake", title: "Strawberry Shortcake", category: "food", imageUrl: puzzleImageUrl("strawberry-shortcake"), thumbnailUrl: puzzleThumbUrl("strawberry-shortcake"), description: "A beautiful strawberry shortcake layered with whipped cream and fresh strawberries.", difficulty: 1, attribution: "Cloudinary", tags: ["cake", "strawberry", "dessert", "cream"] },
  { id: "f8", slug: "hot-chocolate-cozy", title: "Cozy Hot Chocolate", category: "food", imageUrl: puzzleImageUrl("hot-chocolate-cozy"), thumbnailUrl: puzzleThumbUrl("hot-chocolate-cozy"), description: "A steaming mug of rich hot chocolate topped with fluffy marshmallows and cocoa.", difficulty: 1, attribution: "Cloudinary", tags: ["hot chocolate", "cozy", "winter", "marshmallows"] },
  { id: "f12", slug: "avocado-toast-brunch", title: "Avocado Toast Brunch", category: "food", imageUrl: puzzleImageUrl("avocado-toast-brunch"), thumbnailUrl: puzzleThumbUrl("avocado-toast-brunch"), description: "Perfectly smashed avocado on sourdough toast with eggs, microgreens, and chili flakes.", difficulty: 1, attribution: "Cloudinary", tags: ["avocado", "toast", "brunch", "healthy"] },
  { id: "f13", slug: "wood-fired-pizza", title: "Wood-Fired Pizza", category: "food", imageUrl: puzzleImageUrl("wood-fired-pizza"), thumbnailUrl: puzzleThumbUrl("wood-fired-pizza"), description: "A rustic wood-fired pizza with charred crust, fresh mozzarella, and basil.", difficulty: 2, attribution: "Cloudinary", tags: ["pizza", "italian", "wood-fired", "mozzarella"] },
  { id: "f15", slug: "ice-cream-scoops", title: "Ice Cream Scoops", category: "food", imageUrl: puzzleImageUrl("ice-cream-scoops"), thumbnailUrl: puzzleThumbUrl("ice-cream-scoops"), description: "Colorful scoops of artisan ice cream in a waffle cone on a summer day.", difficulty: 1, attribution: "Cloudinary", tags: ["ice cream", "colorful", "summer", "dessert"] },
  { id: "f16", slug: "ramen-bowl-japanese", title: "Japanese Ramen Bowl", category: "food", imageUrl: puzzleImageUrl("ramen-bowl-japanese"), thumbnailUrl: puzzleThumbUrl("ramen-bowl-japanese"), description: "A rich tonkotsu ramen bowl with chashu pork, soft-boiled egg, and nori.", difficulty: 2, attribution: "Cloudinary", tags: ["ramen", "japanese", "noodles", "pork"] },
  { id: "f18", slug: "breakfast-acai-bowl", title: "Acai Bowl", category: "food", imageUrl: puzzleImageUrl("breakfast-acai-bowl"), thumbnailUrl: puzzleThumbUrl("breakfast-acai-bowl"), description: "A vibrant purple acai bowl topped with granola, fresh fruits, and coconut flakes.", difficulty: 2, attribution: "Cloudinary", tags: ["acai", "bowl", "healthy", "colorful"] },
  { id: "f19", slug: "seafood-paella", title: "Seafood Paella", category: "food", imageUrl: puzzleImageUrl("seafood-paella"), thumbnailUrl: puzzleThumbUrl("seafood-paella"), description: "A sizzling pan of saffron paella loaded with prawns, mussels, and calamari.", difficulty: 3, attribution: "Cloudinary", tags: ["paella", "seafood", "spanish", "saffron"] },
  { id: "f23", slug: "chocolate-fondue", title: "Chocolate Fondue", category: "food", imageUrl: puzzleImageUrl("chocolate-fondue"), thumbnailUrl: puzzleThumbUrl("chocolate-fondue"), description: "A rich dark chocolate fondue fountain surrounded by strawberries and marshmallows.", difficulty: 2, attribution: "Cloudinary", tags: ["chocolate", "fondue", "dessert", "strawberries"] },
  { id: "f26", slug: "french-cheese-wine", title: "French Cheese and Wine", category: "food", imageUrl: puzzleImageUrl("french-cheese-wine"), thumbnailUrl: puzzleThumbUrl("french-cheese-wine"), description: "A classic French arrangement of aged cheeses with a glass of red wine.", difficulty: 2, attribution: "Cloudinary", tags: ["cheese", "wine", "french", "classic"] },
  { id: "f28", slug: "sashimi-platter-fish", title: "Sashimi Platter", category: "food", imageUrl: puzzleImageUrl("sashimi-platter-fish"), thumbnailUrl: puzzleThumbUrl("sashimi-platter-fish"), description: "Glistening slices of premium salmon, tuna, and yellowtail sashimi on crushed ice.", difficulty: 3, attribution: "Cloudinary", tags: ["sashimi", "salmon", "japanese", "fresh"] },
  { id: "f29", slug: "donuts-glazed-colorful", title: "Colorful Glazed Donuts", category: "food", imageUrl: puzzleImageUrl("donuts-glazed-colorful"), thumbnailUrl: puzzleThumbUrl("donuts-glazed-colorful"), description: "A tempting display of vibrant glazed donuts with sprinkles in every color.", difficulty: 1, attribution: "Cloudinary", tags: ["donuts", "glazed", "colorful", "sweet"] },
  { id: "f30", slug: "garden-salad-fresh", title: "Garden Fresh Salad", category: "food", imageUrl: puzzleImageUrl("garden-salad-fresh"), thumbnailUrl: puzzleThumbUrl("garden-salad-fresh"), description: "A vibrant farm-to-table salad bursting with colorful vegetables and herbs.", difficulty: 2, attribution: "Cloudinary", tags: ["salad", "fresh", "vegetables", "healthy"] },

  // ===== TRAVEL (continued) =====
  { id: "t6", slug: "rome-colosseum", title: "Colosseum, Rome", category: "travel", imageUrl: puzzleImageUrl("rome-colosseum"), thumbnailUrl: puzzleThumbUrl("rome-colosseum"), description: "The ancient Roman Colosseum standing proud against a dramatic evening sky.", difficulty: 2, attribution: "Cloudinary", tags: ["rome", "colosseum", "italy", "ancient"] },
  { id: "t7", slug: "barcelona-sagrada-familia", title: "Sagrada Família, Barcelona", category: "travel", imageUrl: puzzleImageUrl("barcelona-sagrada-familia"), thumbnailUrl: puzzleThumbUrl("barcelona-sagrada-familia"), description: "Gaudí's magnificent unfinished cathedral of Sagrada Família reaching skyward.", difficulty: 3, attribution: "Cloudinary", tags: ["barcelona", "gaudi", "cathedral", "spain"] },
  { id: "t8", slug: "london-big-ben", title: "Big Ben, London", category: "travel", imageUrl: puzzleImageUrl("london-big-ben"), thumbnailUrl: puzzleThumbUrl("london-big-ben"), description: "The iconic Big Ben clock tower reflected in the Thames at twilight.", difficulty: 2, attribution: "Cloudinary", tags: ["london", "big ben", "england", "thames"] },
  { id: "t9", slug: "dubai-skyline-night", title: "Dubai Skyline at Night", category: "travel", imageUrl: puzzleImageUrl("dubai-skyline-night"), thumbnailUrl: puzzleThumbUrl("dubai-skyline-night"), description: "The glittering futuristic skyline of Dubai reflected in the Persian Gulf at night.", difficulty: 3, attribution: "Cloudinary", tags: ["dubai", "skyline", "night", "modern"] },
  { id: "t10", slug: "taj-mahal-india", title: "Taj Mahal, India", category: "travel", imageUrl: puzzleImageUrl("taj-mahal-india"), thumbnailUrl: puzzleThumbUrl("taj-mahal-india"), description: "The gleaming white marble Taj Mahal reflected in its long reflecting pool.", difficulty: 2, attribution: "Cloudinary", tags: ["taj mahal", "india", "marble", "reflection"] },
  { id: "t12", slug: "maui-beach-hawaii", title: "Maui Beach, Hawaii", category: "travel", imageUrl: puzzleImageUrl("maui-beach-hawaii"), thumbnailUrl: puzzleThumbUrl("maui-beach-hawaii"), description: "A pristine Hawaiian beach with turquoise waters, palm trees, and volcanic black rock.", difficulty: 2, attribution: "Cloudinary", tags: ["hawaii", "maui", "beach", "tropical"] },
  { id: "t20", slug: "berlin-wall-art", title: "Berlin Wall Art", category: "travel", imageUrl: puzzleImageUrl("berlin-wall-art"), thumbnailUrl: puzzleThumbUrl("berlin-wall-art"), description: "Vivid street art murals covering the remaining sections of the Berlin Wall.", difficulty: 2, attribution: "Cloudinary", tags: ["berlin", "wall", "street art", "germany"] },
  { id: "t25", slug: "lisbon-tram-streets", title: "Lisbon Trams", category: "travel", imageUrl: puzzleImageUrl("lisbon-tram-streets"), thumbnailUrl: puzzleThumbUrl("lisbon-tram-streets"), description: "A classic yellow tram climbing the steep cobbled streets of Lisbon.", difficulty: 2, attribution: "Cloudinary", tags: ["lisbon", "tram", "portugal", "yellow"] },
  { id: "t28", slug: "hong-kong-skyline-night", title: "Hong Kong Night Skyline", category: "travel", imageUrl: puzzleImageUrl("hong-kong-skyline-night"), thumbnailUrl: puzzleThumbUrl("hong-kong-skyline-night"), description: "The spectacular neon-lit night skyline of Hong Kong reflected in Victoria Harbour.", difficulty: 3, attribution: "Cloudinary", tags: ["hong kong", "skyline", "night", "neon"] },

  // ===== HOLIDAYS (continued) =====
  { id: "h23", slug: "back-to-school-supplies", title: "Back to School", category: "holidays", imageUrl: puzzleImageUrl("back-to-school-supplies"), thumbnailUrl: puzzleThumbUrl("back-to-school-supplies"), description: "A colorful flat lay of back-to-school supplies: pencils, notebooks, and a ruler.", difficulty: 1, attribution: "Cloudinary", tags: ["school", "supplies", "colorful", "pencils"] },

  // ===== ABSTRACT (continued) =====
  { id: "ab6", slug: "fluid-blue-ocean-abstract", title: "Ocean Wave Abstract", category: "abstract", imageUrl: puzzleImageUrl("fluid-blue-ocean-abstract"), thumbnailUrl: puzzleThumbUrl("fluid-blue-ocean-abstract"), description: "Fluid abstract art evoking the motion and color of rolling ocean waves.", difficulty: 2, attribution: "Cloudinary", tags: ["fluid", "blue", "wave", "abstract"] },
  { id: "ab11", slug: "fractal-nature-spiral", title: "Fractal Spiral", category: "abstract", imageUrl: puzzleImageUrl("fractal-nature-spiral"), thumbnailUrl: puzzleThumbUrl("fractal-nature-spiral"), description: "A mathematically perfect fractal spiral pattern in vivid emerald and gold.", difficulty: 3, attribution: "Cloudinary", tags: ["fractal", "spiral", "mathematical", "pattern"] },
  { id: "ab12", slug: "colorful-smoke-art", title: "Colorful Smoke Art", category: "abstract", imageUrl: puzzleImageUrl("colorful-smoke-art"), thumbnailUrl: puzzleThumbUrl("colorful-smoke-art"), description: "Swirling plumes of vibrant colored smoke creating a dynamic abstract composition.", difficulty: 2, attribution: "Cloudinary", tags: ["smoke", "colorful", "abstract", "dynamic"] },
  { id: "ab16", slug: "ink-in-water-abstract", title: "Ink in Water", category: "abstract", imageUrl: puzzleImageUrl("ink-in-water-abstract"), thumbnailUrl: puzzleThumbUrl("ink-in-water-abstract"), description: "Tendrils of black ink dispersing through water in billowing abstract forms.", difficulty: 2, attribution: "Cloudinary", tags: ["ink", "water", "dispersing", "abstract"] },
  { id: "ab17", slug: "concentric-circles-abstract", title: "Concentric Circles", category: "abstract", imageUrl: puzzleImageUrl("concentric-circles-abstract"), thumbnailUrl: puzzleThumbUrl("concentric-circles-abstract"), description: "Perfectly concentric circles in contrasting colors creating a hypnotic bullseye effect.", difficulty: 2, attribution: "Cloudinary", tags: ["concentric", "circles", "geometric", "hypnotic"] },

  // ===== FOOD (more) =====
  { id: "f31", slug: "tacos-street-food", title: "Colorful Street Tacos", category: "food", imageUrl: puzzleImageUrl("tacos-street-food"), thumbnailUrl: puzzleThumbUrl("tacos-street-food"), description: "Vibrant Mexican street tacos loaded with bright toppings and fresh salsa.", difficulty: 2, attribution: "Cloudinary", tags: ["tacos", "mexican", "street food", "colorful"] },

  // ===== ANIMALS (final batch) =====
  { id: "a61", slug: "flamingo-flock-pink", title: "Flamingo Flock", category: "animals", imageUrl: puzzleImageUrl("flamingo-flock-pink"), thumbnailUrl: puzzleThumbUrl("flamingo-flock-pink"), description: "A vibrant flock of pink flamingos wading in shallow tropical waters.", difficulty: 2, attribution: "Cloudinary", tags: ["flamingo", "flock", "pink", "tropical"] },
  { id: "a62", slug: "arctic-fox-snow", title: "Arctic Fox in Snow", category: "animals", imageUrl: puzzleImageUrl("arctic-fox-snow"), thumbnailUrl: puzzleThumbUrl("arctic-fox-snow"), description: "A fluffy white arctic fox blending perfectly into a snowy winter landscape.", difficulty: 1, attribution: "Cloudinary", tags: ["arctic fox", "snow", "white", "winter"] },

  // ===== NATURE (final batch) =====
  { id: "n63", slug: "thunderstorm-lightning-sky", title: "Thunderstorm Lightning", category: "nature", imageUrl: puzzleImageUrl("thunderstorm-lightning-sky"), thumbnailUrl: puzzleThumbUrl("thunderstorm-lightning-sky"), description: "Dramatic bolts of lightning branching across a stormy dark sky at night.", difficulty: 3, attribution: "Cloudinary", tags: ["lightning", "thunderstorm", "storm", "dramatic"] },

  // ===== LANDSCAPES (final batch) =====
  { id: "l61", slug: "canadian-rockies-moraine-lake", title: "Moraine Lake, Canadian Rockies", category: "landscapes", imageUrl: puzzleImageUrl("canadian-rockies-moraine-lake"), thumbnailUrl: puzzleThumbUrl("canadian-rockies-moraine-lake"), description: "The iconic turquoise waters of Moraine Lake ringed by the Valley of the Ten Peaks.", difficulty: 3, attribution: "Cloudinary", tags: ["moraine lake", "canadian rockies", "turquoise", "mountains"] },
  { id: "l62", slug: "kerala-backwaters-india", title: "Kerala Backwaters", category: "landscapes", imageUrl: puzzleImageUrl("kerala-backwaters-india"), thumbnailUrl: puzzleThumbUrl("kerala-backwaters-india"), description: "A traditional houseboat gliding through the lush green backwaters of Kerala, India.", difficulty: 2, attribution: "Cloudinary", tags: ["kerala", "backwaters", "india", "houseboat"] },

  // ===== FOOD (final batch) =====
  { id: "f62", slug: "sushi-platter-colorful", title: "Colorful Sushi Platter", category: "food", imageUrl: puzzleImageUrl("sushi-platter-colorful"), thumbnailUrl: puzzleThumbUrl("sushi-platter-colorful"), description: "A stunning sushi platter with rolls, nigiri, and sashimi arranged artfully on slate.", difficulty: 3, attribution: "Cloudinary", tags: ["sushi", "platter", "japanese", "colorful"] },
  { id: "f64", slug: "hot-chocolate-marshmallows", title: "Hot Chocolate and Marshmallows", category: "food", imageUrl: puzzleImageUrl("hot-chocolate-marshmallows"), thumbnailUrl: puzzleThumbUrl("hot-chocolate-marshmallows"), description: "A cozy mug of rich hot chocolate topped with melting marshmallows and cocoa dust.", difficulty: 1, attribution: "Cloudinary", tags: ["hot chocolate", "marshmallows", "cozy", "winter"] },
];

export function getPuzzleBySlug(category: string, slug: string): Puzzle | undefined {
  return puzzles.find((p) => p.category === category && p.slug === slug);
}

export function getPuzzlesByCategory(category: string): Puzzle[] {
  return puzzles.filter((p) => p.category === category);
}

/** Return one puzzle from each of `count` other categories, deterministically varied by puzzleId. */
export function getCrossCategory(
  currentCategory: string,
  puzzleId: string,
  count: number = 4
): Puzzle[] {
  // Simple deterministic hash so SSG pages always get the same suggestions
  let hash = 0;
  for (let i = 0; i < puzzleId.length; i++) {
    hash = (hash * 31 + puzzleId.charCodeAt(i)) & 0x7fffffff;
  }

  const otherCategories = Array.from(new Set(puzzles.map((p) => p.category))).filter(
    (c) => c !== currentCategory
  );
  // Rotate the category list so different puzzle pages highlight different categories first
  const offset = hash % otherCategories.length;
  const rotated = [
    ...otherCategories.slice(offset),
    ...otherCategories.slice(0, offset),
  ];

  return rotated.slice(0, count).map((cat) => {
    const catPuzzles = puzzles.filter((p) => p.category === cat);
    return catPuzzles[hash % catPuzzles.length];
  });
}

export function getFeaturedPuzzles(count: number = 8): Puzzle[] {
  const shuffled = [...puzzles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getDailyPuzzle(): Puzzle {
  const today = new Date();
  const dayIndex =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();
  const index = dayIndex % puzzles.length;
  return puzzles[index];
}
