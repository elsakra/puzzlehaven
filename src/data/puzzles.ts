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

function unsplash(id: string, w: number = 1200, h: number = 900): string {
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;
}

function thumb(id: string): string {
  return unsplash(id, 400, 300);
}

export const puzzles: Puzzle[] = [
  // ===== ANIMALS =====
  {
    id: "a1",
    slug: "cute-orange-cat",
    title: "Cute Orange Cat",
    category: "animals",
    imageUrl: unsplash("1574158622682-e40e69881006"),
    thumbnailUrl: thumb("1574158622682-e40e69881006"),
    description: "An adorable orange tabby cat with bright green eyes lounging in the sunshine.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["cat", "pet", "orange", "cute"],
  },
  {
    id: "a2",
    slug: "golden-retriever-puppy",
    title: "Golden Retriever Puppy",
    category: "animals",
    imageUrl: unsplash("1587300003388-59208cc962cb"),
    thumbnailUrl: thumb("1587300003388-59208cc962cb"),
    description: "A happy golden retriever puppy playing in a meadow full of wildflowers.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["dog", "puppy", "golden retriever", "pet"],
  },
  {
    id: "a3",
    slug: "colorful-parrot",
    title: "Colorful Parrot",
    category: "animals",
    imageUrl: unsplash("1552728089-57bdde30beb3"),
    thumbnailUrl: thumb("1552728089-57bdde30beb3"),
    description: "A vibrant scarlet macaw perched on a tropical branch, showing off brilliant red, blue, and yellow feathers.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["bird", "parrot", "macaw", "tropical", "colorful"],
  },
  {
    id: "a4",
    slug: "butterfly-on-flower",
    title: "Butterfly on a Flower",
    category: "animals",
    imageUrl: unsplash("1559564484-e48b3e040ff4"),
    thumbnailUrl: thumb("1559564484-e48b3e040ff4"),
    description: "A delicate monarch butterfly resting on a purple coneflower in a summer garden.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["butterfly", "insect", "flower", "garden"],
  },
  {
    id: "a5",
    slug: "underwater-sea-turtle",
    title: "Sea Turtle",
    category: "animals",
    imageUrl: unsplash("1544551763-46a013bb70d5"),
    thumbnailUrl: thumb("1544551763-46a013bb70d5"),
    description: "A graceful sea turtle gliding through crystal-clear tropical waters.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["turtle", "ocean", "underwater", "marine"],
  },
  {
    id: "a7",
    slug: "two-kittens-playing",
    title: "Kittens at Play",
    category: "animals",
    imageUrl: unsplash("1526336024174-e58f5cdd8e13"),
    thumbnailUrl: thumb("1526336024174-e58f5cdd8e13"),
    description: "Two fluffy kittens playing together on a cozy blanket.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["cat", "kitten", "cute", "pet", "playing"],
  },
  {
    id: "a8",
    slug: "majestic-lion",
    title: "Majestic Lion",
    category: "animals",
    imageUrl: unsplash("1546182990-dffeafbe841d"),
    thumbnailUrl: thumb("1546182990-dffeafbe841d"),
    description: "A powerful male lion with a magnificent mane resting on the African savanna.",
    difficulty: 3,
    attribution: "Unsplash",
    tags: ["lion", "wildlife", "africa", "big cat"],
  },
  {
    id: "a9",
    slug: "hummingbird-in-flight",
    title: "Hummingbird in Flight",
    category: "animals",
    imageUrl: unsplash("1444464666168-49d633b86797"),
    thumbnailUrl: thumb("1444464666168-49d633b86797"),
    description: "A tiny hummingbird frozen in mid-flight, wings outstretched near a bright flower.",
    difficulty: 3,
    attribution: "Unsplash",
    tags: ["bird", "hummingbird", "flight", "nature"],
  },
  {
    id: "a10",
    slug: "rabbits-in-garden",
    title: "Rabbits in the Garden",
    category: "animals",
    imageUrl: unsplash("1585110396000-c9ffd4e4b308"),
    thumbnailUrl: thumb("1585110396000-c9ffd4e4b308"),
    description: "Fluffy rabbits nibbling on fresh greens in a spring garden.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["rabbit", "bunny", "garden", "cute", "spring"],
  },

  // ===== NATURE =====
  {
    id: "n1",
    slug: "cherry-blossoms",
    title: "Cherry Blossoms in Spring",
    category: "nature",
    imageUrl: unsplash("1522383225653-ed111181a951"),
    thumbnailUrl: thumb("1522383225653-ed111181a951"),
    description: "Delicate pink cherry blossoms framing a serene spring landscape.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["cherry blossom", "spring", "flowers", "pink"],
  },
  {
    id: "n2",
    slug: "autumn-forest-path",
    title: "Autumn Forest Path",
    category: "nature",
    imageUrl: unsplash("1507003211169-0a1dd7228f2d"),
    thumbnailUrl: thumb("1507003211169-0a1dd7228f2d"),
    description: "A winding path through a forest ablaze with golden and crimson autumn leaves.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["autumn", "forest", "path", "fall", "leaves"],
  },
  {
    id: "n3",
    slug: "sunflower-field",
    title: "Sunflower Field",
    category: "nature",
    imageUrl: unsplash("1470509037663-253afd7f0f51"),
    thumbnailUrl: thumb("1470509037663-253afd7f0f51"),
    description: "An endless field of bright sunflowers stretching to the horizon under a blue sky.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["sunflower", "field", "yellow", "summer"],
  },
  {
    id: "n5",
    slug: "lavender-fields",
    title: "Lavender Fields of Provence",
    category: "nature",
    imageUrl: unsplash("1499002238440-d264edd596ec"),
    thumbnailUrl: thumb("1499002238440-d264edd596ec"),
    description: "Rolling rows of fragrant purple lavender stretching into the distance under a warm Provençal sky.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["lavender", "provence", "purple", "flowers", "field"],
  },
  {
    id: "n6",
    slug: "tropical-beach-palms",
    title: "Tropical Beach Palms",
    category: "nature",
    imageUrl: unsplash("1507525428034-b723cf961d3e"),
    thumbnailUrl: thumb("1507525428034-b723cf961d3e"),
    description: "Swaying palm trees along a pristine tropical beach with turquoise waters.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["beach", "palm", "tropical", "ocean", "summer"],
  },
  {
    id: "n7",
    slug: "forest-stream",
    title: "Forest Stream",
    category: "nature",
    imageUrl: unsplash("1441974231531-c6227db76b6e"),
    thumbnailUrl: thumb("1441974231531-c6227db76b6e"),
    description: "A crystal-clear stream winding through a lush green forest with dappled sunlight.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["stream", "forest", "water", "green", "peaceful"],
  },
  {
    id: "n9",
    slug: "snowy-pine-trees",
    title: "Snowy Pine Forest",
    category: "nature",
    imageUrl: unsplash("1418985991508-e47386d96a71"),
    thumbnailUrl: thumb("1418985991508-e47386d96a71"),
    description: "Snow-covered pine trees in a peaceful winter wonderland scene.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["snow", "winter", "pine", "forest", "cold"],
  },

  // ===== LANDSCAPES =====
  {
    id: "l1",
    slug: "mountain-lake-reflection",
    title: "Mountain Lake Reflection",
    category: "landscapes",
    imageUrl: unsplash("1506905925346-21bda4d32df4"),
    thumbnailUrl: thumb("1506905925346-21bda4d32df4"),
    description: "A perfectly still mountain lake reflecting snow-capped peaks and blue sky.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["mountain", "lake", "reflection", "alpine"],
  },
  {
    id: "l2",
    slug: "tuscan-rolling-hills",
    title: "Tuscan Rolling Hills",
    category: "landscapes",
    imageUrl: unsplash("1523531294919-4bcd7c65e216"),
    thumbnailUrl: thumb("1523531294919-4bcd7c65e216"),
    description: "The iconic rolling green hills of Tuscany dotted with cypress trees under golden light.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["tuscany", "italy", "hills", "countryside"],
  },
  {
    id: "l3",
    slug: "ocean-sunset",
    title: "Ocean Sunset",
    category: "landscapes",
    imageUrl: unsplash("1507400492013-162706c8c05e"),
    thumbnailUrl: thumb("1507400492013-162706c8c05e"),
    description: "A breathtaking golden sunset over a calm ocean with dramatic clouds.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["sunset", "ocean", "sky", "golden"],
  },
  {
    id: "l4",
    slug: "northern-lights",
    title: "Northern Lights",
    category: "landscapes",
    imageUrl: unsplash("1531366936337-7c912a4589a7"),
    thumbnailUrl: thumb("1531366936337-7c912a4589a7"),
    description: "The mesmerizing aurora borealis dancing across the night sky in brilliant greens and purples.",
    difficulty: 3,
    attribution: "Unsplash",
    tags: ["aurora", "northern lights", "night", "sky"],
  },
  {
    id: "l5",
    slug: "desert-dunes",
    title: "Desert Sand Dunes",
    category: "landscapes",
    imageUrl: unsplash("1509316785289-025f5b846b35"),
    thumbnailUrl: thumb("1509316785289-025f5b846b35"),
    description: "Sweeping golden sand dunes creating mesmerizing patterns in the desert.",
    difficulty: 3,
    attribution: "Unsplash",
    tags: ["desert", "sand", "dunes", "golden"],
  },
  {
    id: "l7",
    slug: "coastal-cliffs",
    title: "Coastal Cliffs",
    category: "landscapes",
    imageUrl: unsplash("1506929562872-bb421503ef21"),
    thumbnailUrl: thumb("1506929562872-bb421503ef21"),
    description: "Dramatic coastal cliffs dropping into deep blue waters with crashing waves.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["coast", "cliffs", "ocean", "dramatic"],
  },

  // ===== ART =====
  {
    id: "ar1",
    slug: "starry-night-inspired",
    title: "Starry Night Sky",
    category: "art",
    imageUrl: unsplash("1543722530-d2c3201371e7"),
    thumbnailUrl: thumb("1543722530-d2c3201371e7"),
    description: "A swirling night sky painting inspired by classic Impressionist masterpieces.",
    difficulty: 3,
    attribution: "Unsplash",
    tags: ["starry night", "painting", "impressionist", "night"],
  },
  {
    id: "ar2",
    slug: "colorful-abstract-painting",
    title: "Colorful Abstract",
    category: "art",
    imageUrl: unsplash("1541701494587-cb58502866ab"),
    thumbnailUrl: thumb("1541701494587-cb58502866ab"),
    description: "Bold splashes of vibrant color creating an energetic abstract composition.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["abstract", "colorful", "painting", "modern"],
  },
  {
    id: "ar5",
    slug: "stained-glass-window",
    title: "Stained Glass Window",
    category: "art",
    imageUrl: unsplash("1507608616759-54f48f0af0ee"),
    thumbnailUrl: thumb("1507608616759-54f48f0af0ee"),
    description: "A magnificent stained glass window with rich jewel-tone colors and intricate patterns.",
    difficulty: 3,
    attribution: "Unsplash",
    tags: ["stained glass", "window", "church", "colorful"],
  },

  // ===== FOOD =====
  {
    id: "f1",
    slug: "fresh-fruit-arrangement",
    title: "Fresh Fruit Arrangement",
    category: "food",
    imageUrl: unsplash("1490474418585-ba9bad8fd0ea"),
    thumbnailUrl: thumb("1490474418585-ba9bad8fd0ea"),
    description: "A colorful arrangement of fresh seasonal fruits beautifully displayed.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["fruit", "fresh", "colorful", "healthy"],
  },
  {
    id: "f2",
    slug: "bakery-pastries",
    title: "Bakery Pastries",
    category: "food",
    imageUrl: unsplash("1509440159596-0249088772ff"),
    thumbnailUrl: thumb("1509440159596-0249088772ff"),
    description: "Freshly baked golden pastries and bread arranged on a rustic wooden board.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["bakery", "pastries", "bread", "baked"],
  },
  {
    id: "f3",
    slug: "colorful-macarons",
    title: "Colorful Macarons",
    category: "food",
    imageUrl: unsplash("1569864358642-9d1684040f43"),
    thumbnailUrl: thumb("1569864358642-9d1684040f43"),
    description: "Rows of perfectly made French macarons in every color of the rainbow.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["macarons", "french", "colorful", "dessert"],
  },
  {
    id: "f4",
    slug: "cozy-coffee-scene",
    title: "Cozy Coffee Scene",
    category: "food",
    imageUrl: unsplash("1495474472287-4d71bcdd2085"),
    thumbnailUrl: thumb("1495474472287-4d71bcdd2085"),
    description: "A warm cup of coffee with latte art on a cozy morning with a good book.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["coffee", "cozy", "morning", "latte"],
  },
  {
    id: "f5",
    slug: "farmers-market-vegetables",
    title: "Farmers Market Vegetables",
    category: "food",
    imageUrl: unsplash("1488459716781-31db52582fe9"),
    thumbnailUrl: thumb("1488459716781-31db52582fe9"),
    description: "A vibrant display of fresh vegetables at a local farmers market.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["vegetables", "market", "fresh", "colorful"],
  },

  // ===== TRAVEL =====
  {
    id: "t2",
    slug: "venetian-canals",
    title: "Venice Canals",
    category: "travel",
    imageUrl: unsplash("1523906834658-6e24ef2386f9"),
    thumbnailUrl: thumb("1523906834658-6e24ef2386f9"),
    description: "Charming gondolas floating along the historic canals of Venice, Italy.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["venice", "italy", "canals", "gondola"],
  },
  {
    id: "t3",
    slug: "japanese-temple",
    title: "Japanese Temple",
    category: "travel",
    imageUrl: unsplash("1478436127897-769e1b3f0f36"),
    thumbnailUrl: thumb("1478436127897-769e1b3f0f36"),
    description: "A serene Japanese temple surrounded by cherry blossoms and traditional gardens.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["japan", "temple", "cherry blossom", "traditional"],
  },
  {
    id: "t4",
    slug: "santorini-greece",
    title: "Santorini, Greece",
    category: "travel",
    imageUrl: unsplash("1570077188670-e3a8d69ac5ff"),
    thumbnailUrl: thumb("1570077188670-e3a8d69ac5ff"),
    description: "The iconic white and blue buildings of Santorini perched on volcanic cliffs above the Aegean Sea.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["santorini", "greece", "white", "blue", "mediterranean"],
  },
  {
    id: "t5",
    slug: "new-york-skyline",
    title: "New York Skyline",
    category: "travel",
    imageUrl: unsplash("1534430480872-3498386e7856"),
    thumbnailUrl: thumb("1534430480872-3498386e7856"),
    description: "The magnificent Manhattan skyline glittering at twilight with the Brooklyn Bridge in view.",
    difficulty: 3,
    attribution: "Unsplash",
    tags: ["new york", "skyline", "city", "bridge", "night"],
  },

  // ===== HOLIDAYS =====
  {
    id: "h2",
    slug: "autumn-pumpkins",
    title: "Autumn Pumpkins",
    category: "holidays",
    imageUrl: unsplash("1509622905150-fa66d3906e09"),
    thumbnailUrl: thumb("1509622905150-fa66d3906e09"),
    description: "A harvest display of colorful pumpkins and gourds celebrating the autumn season.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["pumpkin", "autumn", "harvest", "fall", "halloween"],
  },
  {
    id: "h3",
    slug: "spring-easter-eggs",
    title: "Spring Easter Eggs",
    category: "holidays",
    imageUrl: unsplash("1457301353672-324d6d14f471"),
    thumbnailUrl: thumb("1457301353672-324d6d14f471"),
    description: "Brightly painted Easter eggs nestled among spring flowers and fresh green grass.",
    difficulty: 1,
    attribution: "Unsplash",
    tags: ["easter", "eggs", "spring", "colorful", "holiday"],
  },

  // ===== ABSTRACT =====
  {
    id: "ab1",
    slug: "rainbow-gradient",
    title: "Rainbow Gradient",
    category: "abstract",
    imageUrl: unsplash("1557672172-298e090bd0f1"),
    thumbnailUrl: thumb("1557672172-298e090bd0f1"),
    description: "A mesmerizing smooth gradient flowing through all the colors of the rainbow.",
    difficulty: 2,
    attribution: "Unsplash",
    tags: ["rainbow", "gradient", "colorful", "smooth"],
  },
  {
    id: "ab2",
    slug: "geometric-shapes",
    title: "Geometric Shapes",
    category: "abstract",
    imageUrl: unsplash("1558591710-4b4a1ae0f04d"),
    thumbnailUrl: thumb("1558591710-4b4a1ae0f04d"),
    description: "Bold geometric shapes and patterns in vibrant contrasting colors.",
    difficulty: 3,
    attribution: "Unsplash",
    tags: ["geometric", "shapes", "bold", "pattern"],
  },
  {
    id: "ab5",
    slug: "neon-lights",
    title: "Neon Lights",
    category: "abstract",
    imageUrl: unsplash("1550684376-efcbd6e3f031"),
    thumbnailUrl: thumb("1550684376-efcbd6e3f031"),
    description: "Glowing neon light trails creating mesmerizing patterns against a dark background.",
    difficulty: 3,
    attribution: "Unsplash",
    tags: ["neon", "lights", "glow", "dark", "trails"],
  },

  // ===== ANIMALS (continued) =====
  { id: "a11", slug: "african-elephants", title: "African Elephants", category: "animals", imageUrl: unsplash("1518717758536-85ae29035b6d"), thumbnailUrl: thumb("1518717758536-85ae29035b6d"), description: "A herd of majestic African elephants roaming the savanna at golden hour.", difficulty: 2, attribution: "Unsplash", tags: ["elephant", "africa", "wildlife", "herd"] },
  { id: "a14", slug: "white-horse-field", title: "White Horse in a Field", category: "animals", imageUrl: unsplash("1425082661705-1834bfd09dca"), thumbnailUrl: thumb("1425082661705-1834bfd09dca"), description: "A beautiful white horse galloping freely across a lush green meadow.", difficulty: 2, attribution: "Unsplash", tags: ["horse", "white", "meadow", "gallop"] },
  { id: "a16", slug: "polar-bear-cub", title: "Polar Bear and Cub", category: "animals", imageUrl: unsplash("1508215885820-4585e56135c8"), thumbnailUrl: thumb("1508215885820-4585e56135c8"), description: "A polar bear mother with her playful cub on the Arctic ice floe.", difficulty: 2, attribution: "Unsplash", tags: ["polar bear", "arctic", "cub", "ice"] },
  { id: "a23", slug: "glowing-jellyfish", title: "Glowing Jellyfish", category: "animals", imageUrl: unsplash("1548247416-ec66f4900b2e"), thumbnailUrl: thumb("1548247416-ec66f4900b2e"), description: "A translucent jellyfish glowing with bioluminescent light in the deep ocean.", difficulty: 2, attribution: "Unsplash", tags: ["jellyfish", "ocean", "glow", "deep sea"] },
  { id: "a28", slug: "meerkat-family", title: "Meerkat Family", category: "animals", imageUrl: unsplash("1560743641-3914f2c45636"), thumbnailUrl: thumb("1560743641-3914f2c45636"), description: "An adorable group of meerkats standing alert and scanning for predators.", difficulty: 1, attribution: "Unsplash", tags: ["meerkat", "family", "africa", "cute"] },
  { id: "a30", slug: "white-swan-lake", title: "White Swan on a Lake", category: "animals", imageUrl: unsplash("1476231682828-37e571bc172f"), thumbnailUrl: thumb("1476231682828-37e571bc172f"), description: "A graceful white swan gliding serenely across a still reflective lake.", difficulty: 2, attribution: "Unsplash", tags: ["swan", "lake", "white", "elegant"] },

  // ===== NATURE (continued) =====
  { id: "n12", slug: "aurora-over-mountains", title: "Aurora Over the Mountains", category: "nature", imageUrl: unsplash("1501854140801-50d01698950b"), thumbnailUrl: thumb("1501854140801-50d01698950b"), description: "A spectacular aurora borealis painting the sky above a snowy mountain range.", difficulty: 3, attribution: "Unsplash", tags: ["aurora", "mountains", "night", "northern lights"] },
  { id: "n15", slug: "lotus-lily-pond", title: "Lotus Lily Pond", category: "nature", imageUrl: unsplash("1500534314209-a25ddb2bd429"), thumbnailUrl: thumb("1500534314209-a25ddb2bd429"), description: "Pink lotus blossoms rising serenely above their broad leaves on a still pond.", difficulty: 2, attribution: "Unsplash", tags: ["lotus", "lily", "pond", "pink"] },
  { id: "n18", slug: "bamboo-forest", title: "Bamboo Forest", category: "nature", imageUrl: unsplash("1473773508845-188df298d2d1"), thumbnailUrl: thumb("1473773508845-188df298d2d1"), description: "Towering bamboo stalks creating a green cathedral in a Japanese bamboo grove.", difficulty: 2, attribution: "Unsplash", tags: ["bamboo", "japan", "forest", "green"] },
  { id: "n20", slug: "frozen-lake-winter", title: "Frozen Lake in Winter", category: "nature", imageUrl: unsplash("1482938289607-e9573fc25ebb"), thumbnailUrl: thumb("1482938289607-e9573fc25ebb"), description: "A perfectly frozen lake with cracked ice patterns reflecting a cold winter sky.", difficulty: 3, attribution: "Unsplash", tags: ["frozen", "lake", "winter", "ice"] },
  { id: "n21", slug: "jungle-waterfall-tropics", title: "Hidden Jungle Waterfall", category: "nature", imageUrl: unsplash("1449824913935-59a10b8d2000"), thumbnailUrl: thumb("1449824913935-59a10b8d2000"), description: "A hidden waterfall cascading into an emerald jungle pool deep in a tropical forest.", difficulty: 2, attribution: "Unsplash", tags: ["waterfall", "jungle", "tropical", "green"] },
  { id: "n22", slug: "majestic-oak-tree", title: "Majestic Oak Tree", category: "nature", imageUrl: unsplash("1518020382113-a7e8fc38eac9"), thumbnailUrl: thumb("1518020382113-a7e8fc38eac9"), description: "A grand, ancient oak tree with sprawling branches in a field at golden hour.", difficulty: 2, attribution: "Unsplash", tags: ["oak", "tree", "golden", "ancient"] },
  { id: "n27", slug: "desert-cactus-bloom", title: "Desert Cactus in Bloom", category: "nature", imageUrl: unsplash("1426604966848-d7adac402bff"), thumbnailUrl: thumb("1426604966848-d7adac402bff"), description: "A tall saguaro cactus bursting into rare white bloom in the Sonoran Desert.", difficulty: 2, attribution: "Unsplash", tags: ["cactus", "desert", "bloom", "saguaro"] },
  { id: "n34", slug: "spring-cherry-tree", title: "Spring Cherry Tree", category: "nature", imageUrl: unsplash("1518780664697-55e3ad937233"), thumbnailUrl: thumb("1518780664697-55e3ad937233"), description: "A lone cherry tree in full pink blossom against a soft blue spring sky.", difficulty: 2, attribution: "Unsplash", tags: ["cherry blossom", "spring", "pink", "tree"] },
  { id: "n56", slug: "redwood-forest-tall", title: "Redwood Forest", category: "nature", imageUrl: unsplash("1448375240586-882707db888b"), thumbnailUrl: thumb("1448375240586-882707db888b"), description: "Ancient giant redwood trees towering hundreds of feet above the forest floor.", difficulty: 2, attribution: "Unsplash", tags: ["redwood", "forest", "giant", "california"] },
  { id: "n57", slug: "water-lily-pond-close", title: "Water Lily Close-Up", category: "nature", imageUrl: unsplash("1556909114-44e3e70034e2"), thumbnailUrl: thumb("1556909114-44e3e70034e2"), description: "A perfect white water lily floating serenely on a still, dark pond.", difficulty: 2, attribution: "Unsplash", tags: ["water lily", "pond", "white", "serene"] },
  { id: "n59", slug: "daffodil-field-spring", title: "Daffodil Field", category: "nature", imageUrl: unsplash("1519985176271-adb1088fa94c"), thumbnailUrl: thumb("1519985176271-adb1088fa94c"), description: "Thousands of cheerful yellow daffodils carpeting a hillside in early spring.", difficulty: 1, attribution: "Unsplash", tags: ["daffodil", "yellow", "spring", "field"] },

  // ===== LANDSCAPES (continued) =====
  { id: "l20", slug: "lofoten-islands", title: "Lofoten Islands Norway", category: "landscapes", imageUrl: unsplash("1469474968028-56623f02e42e"), thumbnailUrl: thumb("1469474968028-56623f02e42e"), description: "Colorful fishing villages of the Lofoten Islands nestled below dramatic mountain peaks.", difficulty: 3, attribution: "Unsplash", tags: ["lofoten", "norway", "fishing village", "mountains"] },

  // ===== ART (continued) =====
  { id: "ar6", slug: "oil-painting-landscape", title: "Classic Oil Landscape", category: "art", imageUrl: unsplash("1579783901586-d88db74b4fe4"), thumbnailUrl: thumb("1579783901586-d88db74b4fe4"), description: "A richly textured oil painting of a rolling countryside landscape in warm earth tones.", difficulty: 2, attribution: "Unsplash", tags: ["oil painting", "landscape", "classic", "textured"] },
  { id: "ar7", slug: "watercolor-bird-branch", title: "Watercolor Bird on a Branch", category: "art", imageUrl: unsplash("1492725764893-90b379c2b6e7"), thumbnailUrl: thumb("1492725764893-90b379c2b6e7"), description: "A delicate watercolor painting of a songbird perched on a blossoming branch.", difficulty: 2, attribution: "Unsplash", tags: ["watercolor", "bird", "branch", "delicate"] },
  { id: "ar11", slug: "pop-art-portrait", title: "Pop Art Portrait", category: "art", imageUrl: unsplash("1578662996442-48f60103fc96"), thumbnailUrl: thumb("1578662996442-48f60103fc96"), description: "A vibrant Andy Warhol-inspired pop art portrait in bold, flat color blocks.", difficulty: 2, attribution: "Unsplash", tags: ["pop art", "warhol", "colorful", "portrait"] },
  { id: "ar15", slug: "charcoal-drawing-still-life", title: "Charcoal Still Life", category: "art", imageUrl: unsplash("1507679799987-c73779587ccf"), thumbnailUrl: thumb("1507679799987-c73779587ccf"), description: "An expressive charcoal still life drawing with dramatic contrasts of light and shadow.", difficulty: 2, attribution: "Unsplash", tags: ["charcoal", "still life", "drawing", "shadow"] },
  { id: "ar18", slug: "cubist-face-painting", title: "Cubist Face", category: "art", imageUrl: unsplash("1536746803623-cef87080bfc8"), thumbnailUrl: thumb("1536746803623-cef87080bfc8"), description: "A Picasso-inspired cubist portrait with fragmented geometric planes of color.", difficulty: 3, attribution: "Unsplash", tags: ["cubism", "picasso", "geometric", "portrait"] },
  { id: "ar19", slug: "digital-art-galaxy", title: "Digital Galaxy Art", category: "art", imageUrl: unsplash("1462331940025-496dfbfc7564"), thumbnailUrl: thumb("1462331940025-496dfbfc7564"), description: "A spectacular piece of digital art depicting a swirling galaxy with nebulae.", difficulty: 3, attribution: "Unsplash", tags: ["digital art", "galaxy", "space", "nebula"] },
  { id: "ar21", slug: "japanese-woodblock-wave", title: "Japanese Wave Print", category: "art", imageUrl: unsplash("1518770660439-4636190af475"), thumbnailUrl: thumb("1518770660439-4636190af475"), description: "A stunning Japanese woodblock print of a great ocean wave in the Hokusai style.", difficulty: 3, attribution: "Unsplash", tags: ["japanese", "wave", "woodblock", "hokusai"] },
  { id: "ar28", slug: "kinetic-sculpture-chrome", title: "Kinetic Sculpture", category: "art", imageUrl: unsplash("1513475382585-d06e58bcb0e0"), thumbnailUrl: thumb("1513475382585-d06e58bcb0e0"), description: "A gleaming chrome kinetic sculpture with spiral forms catching the light.", difficulty: 3, attribution: "Unsplash", tags: ["sculpture", "chrome", "kinetic", "modern"] },
  { id: "ar33", slug: "studio-pottery-ceramic", title: "Studio Pottery", category: "art", imageUrl: unsplash("1565193566173-7a0ee3dbe261"), thumbnailUrl: thumb("1565193566173-7a0ee3dbe261"), description: "Beautiful hand-thrown ceramic vessels with textured glazes in earth tones.", difficulty: 2, attribution: "Unsplash", tags: ["pottery", "ceramic", "hand-thrown", "craft"] },
  { id: "ar34", slug: "oil-paint-close-texture", title: "Oil Paint Texture Close-Up", category: "art", imageUrl: unsplash("1513364776144-60967b0f800f"), thumbnailUrl: thumb("1513364776144-60967b0f800f"), description: "A macro view of thick oil paint brushstrokes revealing incredible texture and color.", difficulty: 2, attribution: "Unsplash", tags: ["oil paint", "texture", "macro", "brushstroke"] },

  // ===== FOOD (continued) =====
  { id: "f6", slug: "strawberry-shortcake", title: "Strawberry Shortcake", category: "food", imageUrl: unsplash("1488477181946-6428a0291777"), thumbnailUrl: thumb("1488477181946-6428a0291777"), description: "A beautiful strawberry shortcake layered with whipped cream and fresh strawberries.", difficulty: 1, attribution: "Unsplash", tags: ["cake", "strawberry", "dessert", "cream"] },
  { id: "f8", slug: "hot-chocolate-cozy", title: "Cozy Hot Chocolate", category: "food", imageUrl: unsplash("1517487881594-2787fef5ebf7"), thumbnailUrl: thumb("1517487881594-2787fef5ebf7"), description: "A steaming mug of rich hot chocolate topped with fluffy marshmallows and cocoa.", difficulty: 1, attribution: "Unsplash", tags: ["hot chocolate", "cozy", "winter", "marshmallows"] },
  { id: "f12", slug: "avocado-toast-brunch", title: "Avocado Toast Brunch", category: "food", imageUrl: unsplash("1546069901-ba9599a7e63c"), thumbnailUrl: thumb("1546069901-ba9599a7e63c"), description: "Perfectly smashed avocado on sourdough toast with eggs, microgreens, and chili flakes.", difficulty: 1, attribution: "Unsplash", tags: ["avocado", "toast", "brunch", "healthy"] },
  { id: "f13", slug: "wood-fired-pizza", title: "Wood-Fired Pizza", category: "food", imageUrl: unsplash("1513104890138-7c749659a591"), thumbnailUrl: thumb("1513104890138-7c749659a591"), description: "A rustic wood-fired pizza with charred crust, fresh mozzarella, and basil.", difficulty: 2, attribution: "Unsplash", tags: ["pizza", "italian", "wood-fired", "mozzarella"] },
  { id: "f15", slug: "ice-cream-scoops", title: "Ice Cream Scoops", category: "food", imageUrl: unsplash("1501443762994-82bd5dace89a"), thumbnailUrl: thumb("1501443762994-82bd5dace89a"), description: "Colorful scoops of artisan ice cream in a waffle cone on a summer day.", difficulty: 1, attribution: "Unsplash", tags: ["ice cream", "colorful", "summer", "dessert"] },
  { id: "f16", slug: "ramen-bowl-japanese", title: "Japanese Ramen Bowl", category: "food", imageUrl: unsplash("1569050467447-ce54b3bbc37d"), thumbnailUrl: thumb("1569050467447-ce54b3bbc37d"), description: "A rich tonkotsu ramen bowl with chashu pork, soft-boiled egg, and nori.", difficulty: 2, attribution: "Unsplash", tags: ["ramen", "japanese", "noodles", "pork"] },
  { id: "f18", slug: "breakfast-acai-bowl", title: "Acai Bowl", category: "food", imageUrl: unsplash("1590301157890-4810ed352733"), thumbnailUrl: thumb("1590301157890-4810ed352733"), description: "A vibrant purple acai bowl topped with granola, fresh fruits, and coconut flakes.", difficulty: 2, attribution: "Unsplash", tags: ["acai", "bowl", "healthy", "colorful"] },
  { id: "f19", slug: "seafood-paella", title: "Seafood Paella", category: "food", imageUrl: unsplash("1534080564583-6be75777b70a"), thumbnailUrl: thumb("1534080564583-6be75777b70a"), description: "A sizzling pan of saffron paella loaded with prawns, mussels, and calamari.", difficulty: 3, attribution: "Unsplash", tags: ["paella", "seafood", "spanish", "saffron"] },
  { id: "f23", slug: "chocolate-fondue", title: "Chocolate Fondue", category: "food", imageUrl: unsplash("1511381939415-e44015466834"), thumbnailUrl: thumb("1511381939415-e44015466834"), description: "A rich dark chocolate fondue fountain surrounded by strawberries and marshmallows.", difficulty: 2, attribution: "Unsplash", tags: ["chocolate", "fondue", "dessert", "strawberries"] },
  { id: "f26", slug: "french-cheese-wine", title: "French Cheese and Wine", category: "food", imageUrl: unsplash("1506377247377-2a5b3b417ebb"), thumbnailUrl: thumb("1506377247377-2a5b3b417ebb"), description: "A classic French arrangement of aged cheeses with a glass of red wine.", difficulty: 2, attribution: "Unsplash", tags: ["cheese", "wine", "french", "classic"] },
  { id: "f28", slug: "sashimi-platter-fish", title: "Sashimi Platter", category: "food", imageUrl: unsplash("1534482421-64566f976cfa"), thumbnailUrl: thumb("1534482421-64566f976cfa"), description: "Glistening slices of premium salmon, tuna, and yellowtail sashimi on crushed ice.", difficulty: 3, attribution: "Unsplash", tags: ["sashimi", "salmon", "japanese", "fresh"] },
  { id: "f29", slug: "donuts-glazed-colorful", title: "Colorful Glazed Donuts", category: "food", imageUrl: unsplash("1558961363-fa8fdf82db35"), thumbnailUrl: thumb("1558961363-fa8fdf82db35"), description: "A tempting display of vibrant glazed donuts with sprinkles in every color.", difficulty: 1, attribution: "Unsplash", tags: ["donuts", "glazed", "colorful", "sweet"] },
  { id: "f30", slug: "garden-salad-fresh", title: "Garden Fresh Salad", category: "food", imageUrl: unsplash("1490645935967-10de6ba17061"), thumbnailUrl: thumb("1490645935967-10de6ba17061"), description: "A vibrant farm-to-table salad bursting with colorful vegetables and herbs.", difficulty: 2, attribution: "Unsplash", tags: ["salad", "fresh", "vegetables", "healthy"] },

  // ===== TRAVEL (continued) =====
  { id: "t6", slug: "rome-colosseum", title: "Colosseum, Rome", category: "travel", imageUrl: unsplash("1552832230-c0197dd311b5"), thumbnailUrl: thumb("1552832230-c0197dd311b5"), description: "The ancient Roman Colosseum standing proud against a dramatic evening sky.", difficulty: 2, attribution: "Unsplash", tags: ["rome", "colosseum", "italy", "ancient"] },
  { id: "t7", slug: "barcelona-sagrada-familia", title: "Sagrada Família, Barcelona", category: "travel", imageUrl: unsplash("1539037116277-4db20889f2d4"), thumbnailUrl: thumb("1539037116277-4db20889f2d4"), description: "Gaudí's magnificent unfinished cathedral of Sagrada Família reaching skyward.", difficulty: 3, attribution: "Unsplash", tags: ["barcelona", "gaudi", "cathedral", "spain"] },
  { id: "t8", slug: "london-big-ben", title: "Big Ben, London", category: "travel", imageUrl: unsplash("1513635269975-59663e0ac1ad"), thumbnailUrl: thumb("1513635269975-59663e0ac1ad"), description: "The iconic Big Ben clock tower reflected in the Thames at twilight.", difficulty: 2, attribution: "Unsplash", tags: ["london", "big ben", "england", "thames"] },
  { id: "t9", slug: "dubai-skyline-night", title: "Dubai Skyline at Night", category: "travel", imageUrl: unsplash("1512453979798-5ea266f8880c"), thumbnailUrl: thumb("1512453979798-5ea266f8880c"), description: "The glittering futuristic skyline of Dubai reflected in the Persian Gulf at night.", difficulty: 3, attribution: "Unsplash", tags: ["dubai", "skyline", "night", "modern"] },
  { id: "t10", slug: "taj-mahal-india", title: "Taj Mahal, India", category: "travel", imageUrl: unsplash("1524492412937-b28074a5d7da"), thumbnailUrl: thumb("1524492412937-b28074a5d7da"), description: "The gleaming white marble Taj Mahal reflected in its long reflecting pool.", difficulty: 2, attribution: "Unsplash", tags: ["taj mahal", "india", "marble", "reflection"] },
  { id: "t12", slug: "maui-beach-hawaii", title: "Maui Beach, Hawaii", category: "travel", imageUrl: unsplash("1505118380757-91f5f5632de0"), thumbnailUrl: thumb("1505118380757-91f5f5632de0"), description: "A pristine Hawaiian beach with turquoise waters, palm trees, and volcanic black rock.", difficulty: 2, attribution: "Unsplash", tags: ["hawaii", "maui", "beach", "tropical"] },
  { id: "t20", slug: "berlin-wall-art", title: "Berlin Wall Art", category: "travel", imageUrl: unsplash("1528360983277-13d401cdc186"), thumbnailUrl: thumb("1528360983277-13d401cdc186"), description: "Vivid street art murals covering the remaining sections of the Berlin Wall.", difficulty: 2, attribution: "Unsplash", tags: ["berlin", "wall", "street art", "germany"] },
  { id: "t25", slug: "lisbon-tram-streets", title: "Lisbon Trams", category: "travel", imageUrl: unsplash("1555881400-74d7acaacd8b"), thumbnailUrl: thumb("1555881400-74d7acaacd8b"), description: "A classic yellow tram climbing the steep cobbled streets of Lisbon.", difficulty: 2, attribution: "Unsplash", tags: ["lisbon", "tram", "portugal", "yellow"] },
  { id: "t28", slug: "hong-kong-skyline-night", title: "Hong Kong Night Skyline", category: "travel", imageUrl: unsplash("1532498551838-b7a1cfac622e"), thumbnailUrl: thumb("1532498551838-b7a1cfac622e"), description: "The spectacular neon-lit night skyline of Hong Kong reflected in Victoria Harbour.", difficulty: 3, attribution: "Unsplash", tags: ["hong kong", "skyline", "night", "neon"] },

  // ===== HOLIDAYS (continued) =====
  { id: "h23", slug: "back-to-school-supplies", title: "Back to School", category: "holidays", imageUrl: unsplash("1503676260728-1c00da094a0b"), thumbnailUrl: thumb("1503676260728-1c00da094a0b"), description: "A colorful flat lay of back-to-school supplies: pencils, notebooks, and a ruler.", difficulty: 1, attribution: "Unsplash", tags: ["school", "supplies", "colorful", "pencils"] },

  // ===== ABSTRACT (continued) =====
  { id: "ab6", slug: "fluid-blue-ocean-abstract", title: "Ocean Wave Abstract", category: "abstract", imageUrl: unsplash("1557804506-669a67965ba0"), thumbnailUrl: thumb("1557804506-669a67965ba0"), description: "Fluid abstract art evoking the motion and color of rolling ocean waves.", difficulty: 2, attribution: "Unsplash", tags: ["fluid", "blue", "wave", "abstract"] },
  { id: "ab11", slug: "fractal-nature-spiral", title: "Fractal Spiral", category: "abstract", imageUrl: unsplash("1557683311-eac922347aa1"), thumbnailUrl: thumb("1557683311-eac922347aa1"), description: "A mathematically perfect fractal spiral pattern in vivid emerald and gold.", difficulty: 3, attribution: "Unsplash", tags: ["fractal", "spiral", "mathematical", "pattern"] },
  { id: "ab12", slug: "colorful-smoke-art", title: "Colorful Smoke Art", category: "abstract", imageUrl: unsplash("1513542789411-b6a5d4f31634"), thumbnailUrl: thumb("1513542789411-b6a5d4f31634"), description: "Swirling plumes of vibrant colored smoke creating a dynamic abstract composition.", difficulty: 2, attribution: "Unsplash", tags: ["smoke", "colorful", "abstract", "dynamic"] },
  { id: "ab16", slug: "ink-in-water-abstract", title: "Ink in Water", category: "abstract", imageUrl: unsplash("1580927752452-89d86da3fa0a"), thumbnailUrl: thumb("1580927752452-89d86da3fa0a"), description: "Tendrils of black ink dispersing through water in billowing abstract forms.", difficulty: 2, attribution: "Unsplash", tags: ["ink", "water", "dispersing", "abstract"] },
  { id: "ab17", slug: "concentric-circles-abstract", title: "Concentric Circles", category: "abstract", imageUrl: unsplash("1553356084-58ef4a67b2a7"), thumbnailUrl: thumb("1553356084-58ef4a67b2a7"), description: "Perfectly concentric circles in contrasting colors creating a hypnotic bullseye effect.", difficulty: 2, attribution: "Unsplash", tags: ["concentric", "circles", "geometric", "hypnotic"] },

  // ===== ART (more) =====

  // ===== FOOD (more) =====
  { id: "f31", slug: "tacos-street-food", title: "Colorful Street Tacos", category: "food", imageUrl: unsplash("1565299585323-38d6b0865b47"), thumbnailUrl: thumb("1565299585323-38d6b0865b47"), description: "Vibrant Mexican street tacos loaded with bright toppings and fresh salsa.", difficulty: 2, attribution: "Unsplash", tags: ["tacos", "mexican", "street food", "colorful"] },

  // ===== TRAVEL (more) =====

  // ===== HOLIDAYS (more) =====

  // ===== ABSTRACT (more) =====

  // ===== TRAVEL (final batch) =====

  // ===== HOLIDAYS (final batch) =====

  // ===== ABSTRACT (final batch) =====

  // ===== ANIMALS (final batch) =====
  { id: "a61", slug: "flamingo-flock-pink", title: "Flamingo Flock", category: "animals", imageUrl: unsplash("1516690561799-46d8f74f9abf"), thumbnailUrl: thumb("1516690561799-46d8f74f9abf"), description: "A vibrant flock of pink flamingos wading in shallow tropical waters.", difficulty: 2, attribution: "Unsplash", tags: ["flamingo", "flock", "pink", "tropical"] },
  { id: "a62", slug: "arctic-fox-snow", title: "Arctic Fox in Snow", category: "animals", imageUrl: unsplash("1474511320723-9a56873867b5"), thumbnailUrl: thumb("1474511320723-9a56873867b5"), description: "A fluffy white arctic fox blending perfectly into a snowy winter landscape.", difficulty: 1, attribution: "Unsplash", tags: ["arctic fox", "snow", "white", "winter"] },

  // ===== NATURE (final batch) =====
  { id: "n63", slug: "thunderstorm-lightning-sky", title: "Thunderstorm Lightning", category: "nature", imageUrl: unsplash("1455218873509-8097305ee378"), thumbnailUrl: thumb("1455218873509-8097305ee378"), description: "Dramatic bolts of lightning branching across a stormy dark sky at night.", difficulty: 3, attribution: "Unsplash", tags: ["lightning", "thunderstorm", "storm", "dramatic"] },

  // ===== LANDSCAPES (final batch) =====
  { id: "l61", slug: "canadian-rockies-moraine-lake", title: "Moraine Lake, Canadian Rockies", category: "landscapes", imageUrl: unsplash("1454496522488-7a8e488e8606"), thumbnailUrl: thumb("1454496522488-7a8e488e8606"), description: "The iconic turquoise waters of Moraine Lake ringed by the Valley of the Ten Peaks.", difficulty: 3, attribution: "Unsplash", tags: ["moraine lake", "canadian rockies", "turquoise", "mountains"] },
  { id: "l62", slug: "kerala-backwaters-india", title: "Kerala Backwaters", category: "landscapes", imageUrl: unsplash("1602216056096-3b40cc0c9944"), thumbnailUrl: thumb("1602216056096-3b40cc0c9944"), description: "A traditional houseboat gliding through the lush green backwaters of Kerala, India.", difficulty: 2, attribution: "Unsplash", tags: ["kerala", "backwaters", "india", "houseboat"] },

  // ===== FOOD (final batch) =====
  { id: "f62", slug: "sushi-platter-colorful", title: "Colorful Sushi Platter", category: "food", imageUrl: unsplash("1553621042-f6e147245754"), thumbnailUrl: thumb("1553621042-f6e147245754"), description: "A stunning sushi platter with rolls, nigiri, and sashimi arranged artfully on slate.", difficulty: 3, attribution: "Unsplash", tags: ["sushi", "platter", "japanese", "colorful"] },
  { id: "f64", slug: "hot-chocolate-marshmallows", title: "Hot Chocolate and Marshmallows", category: "food", imageUrl: unsplash("1542990253-0d0f5be5f0ed"), thumbnailUrl: thumb("1542990253-0d0f5be5f0ed"), description: "A cozy mug of rich hot chocolate topped with melting marshmallows and cocoa dust.", difficulty: 1, attribution: "Unsplash", tags: ["hot chocolate", "marshmallows", "cozy", "winter"] },
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
