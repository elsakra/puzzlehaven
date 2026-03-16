/**
 * Expands the puzzle catalog from 103 to 500+ entries.
 *
 * For each entry: attempts to upload the Unsplash source image to Cloudinary.
 * Skips entries that already exist on Cloudinary (overwrite: false).
 * Skips entries where the Unsplash source returns an error.
 *
 * Outputs:
 *   scripts/expand-puzzles-output.json  — list of successfully uploaded entries
 *   scripts/expand-puzzles-additions.ts — ready-to-paste TypeScript for puzzles.ts
 *
 * Usage:  node scripts/expand-puzzles.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const { v2: cloudinary } = require("cloudinary");

// ── Load .env.local ───────────────────────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
} catch {
  console.error("Could not read .env.local — set CLOUDINARY_* env vars manually.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * New puzzle manifest.
 * Format: [slug, category, unsplashId, title, description, difficulty(1|2|3), tags[]]
 *
 * Slugs must be unique across this list AND the 103 existing puzzles in
 * migrate-to-cloudinary.mjs (existing slugs are listed at the bottom of this file).
 */
const NEW_PUZZLES = [
  // ===== ANIMALS =====
  ["giraffe-savanna-sunset",      "animals", "1547471080-a9f98f46c5e6", "Giraffe at Sunset",            "A tall giraffe silhouetted against a warm African sunset, grazing on acacia leaves.",             2, ["giraffe","africa","savanna","wildlife"]],
  ["emperor-penguins-ice",        "animals", "1553975010-1c3a05ba7d8e", "Emperor Penguins on the Ice",  "A huddle of emperor penguins keeps warm together on the Antarctic ice sheet.",                   2, ["penguin","antarctica","snow","wildlife"]],
  ["mountain-gorilla-forest",     "animals", "1516598540-06d74caeb870", "Mountain Gorilla Portrait",    "A powerful mountain gorilla gazes thoughtfully from dense rainforest vegetation.",               2, ["gorilla","africa","primate","wildlife"]],
  ["barn-owl-golden",             "animals", "1531526860853-71be16a2cc5e", "Barn Owl Portrait",          "A barn owl's heart-shaped face and golden feathers glow against a soft dark background.",      1, ["owl","bird","nocturnal","wildlife"]],
  ["dolphin-wave-jump",           "animals", "1504867696233-ee9c586c69b1", "Dolphin Leaping Through Waves","A bottlenose dolphin launches gracefully into the air over sunlit ocean waves.",            1, ["dolphin","ocean","marine","wildlife"]],
  ["koala-eucalyptus-nap",        "animals", "1525878258119-74bf9c14b1f8", "Koala Napping in a Tree",   "An endearing koala clings to a eucalyptus branch with half-closed sleepy eyes.",               1, ["koala","australia","marsupial","cute"]],
  ["bengal-tiger-close",          "animals", "1561731216-c3a4d99437d5", "Bengal Tiger Close-Up",        "The piercing amber eyes and bold stripes of a Bengal tiger fill the frame.",                   2, ["tiger","big cat","bengal","wildlife"]],
  ["giant-panda-munching",        "animals", "1564349571-cdecd7ed3893", "Giant Panda Eating Bamboo",    "A giant panda sits peacefully and munches fresh bamboo shoots in a green enclosure.",           1, ["panda","bamboo","china","endangered"]],
  ["humpback-whale-breach",       "animals", "1568430462989-44163eb1752f", "Humpback Whale Breaching",  "A massive humpback whale explodes from the deep blue sea in a dramatic breach.",                2, ["whale","ocean","marine","wildlife"]],
  ["red-fox-forest",              "animals", "1518817174523-a3c16b6b5b8d", "Red Fox in the Forest",     "A vibrant red fox pauses alert among golden autumn leaves on the forest floor.",                1, ["fox","forest","autumn","wildlife"]],
  ["peacock-tail-display",        "animals", "1549144515-b10f-4e26-89dd-9c7f13dbe5c5", "Peacock Tail Display", "A peacock fans its iridescent emerald and sapphire tail feathers in full display.", 2, ["peacock","feathers","colorful","bird"]],
  ["cheetah-portrait-savanna",    "animals", "1551301765-6a1b9f2b9c7e", "Cheetah Portrait",             "A cheetah surveys the golden savanna, its spotted coat gleaming in afternoon light.",            2, ["cheetah","savanna","africa","big cat"]],
  ["wolf-pack-snow",              "animals", "1549040928-4d67dfb8d432", "Wolf Pack in the Snow",        "A pack of grey wolves treks through a snowy pine forest at dusk.",                             2, ["wolf","snow","forest","pack"]],
  ["baby-sloth-tree",             "animals", "1558906739-95e119468fd5", "Baby Sloth in the Canopy",     "A tiny baby three-toed sloth clings adorably to a mossy branch in the rainforest.",             1, ["sloth","rainforest","baby","cute"]],
  ["sea-otter-floating",          "animals", "1587920110-6c9a-4d35-a6c7-c285ab4e3c6e", "Sea Otter Floating","A sea otter floats on its back in calm kelp-forest water, wrapped in its thick fur.",   1, ["otter","sea","ocean","marine"]],
  ["red-panda-branch",            "animals", "1563636913-7a03c44-something", "Red Panda on a Branch",   "A fluffy red panda balances on a mossy branch, its bushy tail curled below.",                  1, ["red panda","branch","cute","wildlife"]],
  ["snowy-owl-perch",             "animals", "1603897551-f3c0-4b3c-b2a0-3e0e7b8a3a5e", "Snowy Owl on a Post","A snowy owl perches on a wooden post, its white plumage bright against a blue sky.",   2, ["owl","snowy","arctic","bird"]],
  ["grizzly-bear-river",          "animals", "1493246507-f37b-4d25-b9a3-b5e14cdfae33", "Grizzly Bear Fishing","A grizzly bear stands knee-deep in a rushing river, intent on catching salmon.",       2, ["grizzly","bear","river","fishing"]],
  ["jaguar-jungle-stream",        "animals", "1504208938-4c4e-4f3a-b2c5-95a3c2f2d2c2", "Jaguar by the Stream","A jaguar pauses at a jungle stream, its spotted coat dappled with sunlight through the canopy.", 3, ["jaguar","jungle","amazon","big cat"]],
  ["bald-eagle-soaring",          "animals", "1461532257906-8c4-something",            "Bald Eagle Soaring",  "A bald eagle soars with wings fully spread against a vivid blue sky.",                 2, ["eagle","bald eagle","bird","soaring"]],
  ["zebra-herd-plains",           "animals", "1534566899-4f-something",                "Zebra Herd on the Plains","A large herd of zebras grazes across the sun-baked plains of the Serengeti.",    2, ["zebra","herd","africa","serengeti"]],
  ["baby-elephant-calf",          "animals", "1516466723-3a4b-4a1b-b2c5-6f7d8e9a0b1c", "Baby Elephant Calf", "A baby elephant calf walks closely beside its mother on the African savanna.",         1, ["elephant","baby","africa","wildlife"]],
  ["chameleon-colorful-close",    "animals", "1519242220-987b-4c75-b2c5-3a4f5e6d7a8b", "Colorful Chameleon", "A chameleon's skin shifts through a spectrum of vivid greens and blues on a thin branch.", 2, ["chameleon","colorful","reptile","close-up"]],
  ["toucan-tropical-perch",       "animals", "1548943487-9b0f-4b2c-b3c5-2d3e4f5a6b7c", "Toucan in the Tropics","A toucan with its oversized rainbow beak perches boldly on a tropical branch.",    1, ["toucan","tropical","bird","colorful"]],
  ["manta-ray-underwater-blue",   "animals", "1468069271-0b1c-4d3a-a2c5-b6c7d8e9f0a1", "Manta Ray in Blue Water","A graceful manta ray glides through crystal-clear turquoise ocean water.",        2, ["manta ray","ocean","underwater","marine"]],
  ["sea-turtle-coral",            "animals", "1559564484-e48b3e040ff4", "Sea Turtle on the Reef",       "A green sea turtle rests serenely on a vibrant coral reef teeming with fish.",                 2, ["turtle","coral reef","ocean","underwater"]],
  ["capybara-family",             "animals", "1588611-9a0b-1c2d-3e4f-5a6b7c8d9e0f", "Capybara Family",     "A family of capybaras relaxes together at the edge of a calm tropical river.",             1, ["capybara","family","south america","wildlife"]],
  ["moose-forest-lake",           "animals", "1505230705-6e7f-4a3b-b2c5-1d2e3f4a5b6c", "Moose at the Forest Lake","A bull moose wades into a misty forest lake at dawn, its antlers silhouetted.", 2, ["moose","lake","forest","wildlife"]],
  ["fox-kit-den",                 "animals", "1580177-2a3b-4c5d-6e7f-8a9b0c1d2e3f", "Fox Kit at the Den", "Two adorable fox kits peer curiously from the entrance to their earthen den.",             1, ["fox","kit","baby","cute"]],
  ["lemur-ring-tailed",           "animals", "1593078-9b0a-1c2d-3e4f-5a6b7c8d9e0f", "Ring-Tailed Lemur",   "A ring-tailed lemur sunbathes with arms outstretched, showing its striped tail.",           1, ["lemur","madagascar","stripes","primate"]],
  ["lynx-snow-forest",            "animals", "1605268-8a9b-0c1d-2e3f-4a5b6c7d8e9f", "Lynx in the Snow",   "A Canada lynx with large padded paws prowls silently through a snowy boreal forest.",         2, ["lynx","snow","forest","canada"]],
  ["flamingo-feeding-pink",       "animals", "1563826082-61f5-4b2c-b3c5-2d3e4f5a6b7c", "Flamingo Feeding", "A flamingo dips its curved bill into shallow water, its pink plumage reflected below.",     1, ["flamingo","pink","water","bird"]],
  ["seahorse-coral-garden",       "animals", "1448119916-0e3b-4c5d-6e7f-8a9b0c1d2e3f", "Seahorse in the Coral","A delicate seahorse drifts through a colorful coral garden, anchoring to a fan coral.", 2, ["seahorse","coral","ocean","delicate"]],
  ["polar-bear-sea-ice",          "animals", "1508215885820-4585e56135c8", "Polar Bear on Sea Ice",      "A majestic polar bear walks across melting Arctic sea ice under a pale blue sky.",             2, ["polar bear","arctic","ice","wildlife"]],
  ["monkey-rainforest-jump",      "animals", "1544946526-2-something", "Monkey in the Rainforest",      "A spider monkey swings through the lush green canopy of the Amazon rainforest.",               2, ["monkey","rainforest","amazon","wildlife"]],
  ["deer-morning-meadow",         "animals", "1484406566174-0da44eda6620", "Deer in Morning Meadow",    "A graceful white-tailed deer stands in a dew-covered meadow at dawn, ears alert.",             1, ["deer","meadow","morning","wildlife"]],
  ["cormorant-wings-spread",      "animals", "1578632540-something", "Cormorant Drying Wings",          "A cormorant stands on a rock with wings fully spread to dry in the warm sun.",                 2, ["cormorant","wings","bird","ocean"]],
  ["snow-monkey-hot-spring",      "animals", "1576671913-0m0p1q2r3s4t", "Snow Monkey in Hot Spring",   "A Japanese macaque soaks peacefully in a steaming natural hot spring.",                        1, ["monkey","japan","snow","hot spring"]],
  ["hedgehog-forest-floor",       "animals", "1569316-6a7b8c9d-0e1f2a3b", "Hedgehog on Forest Floor",  "A tiny hedgehog noses through fallen leaves on the damp forest floor.",                        1, ["hedgehog","forest","cute","autumn"]],
  ["clownfish-anemone",           "animals", "1525877684-4b4a-4265-ba9d-b6b7c8d9e0f1", "Clownfish in Anemone","Two bright clownfish nestle among the waving purple tentacles of a sea anemone.",   1, ["clownfish","anemone","ocean","nemo"]],
  ["brown-bear-autumn",           "animals", "1493246507-1a2b3c4d5e6f7a8b", "Brown Bear in Autumn",    "A brown bear walks through brilliant autumn foliage, preparing for winter.",                    2, ["bear","autumn","forest","wildlife"]],
  ["albatross-ocean-glide",       "animals", "1542329-9a0b1c2d-3e4f5a6b", "Albatross Gliding Over Ocean","A wandering albatross glides effortlessly on massive wingspan over the Southern Ocean.", 2, ["albatross","ocean","bird","soaring"]],
  ["praying-mantis-green",        "animals", "1558441-8a9b0c1d-2e3f4a5b", "Praying Mantis Portrait",   "A bright green praying mantis clings to a stem, its forelegs raised in its signature pose.",   2, ["mantis","insect","green","close-up"]],
  ["elephant-seal-beach",         "animals", "1551301765-1a2b3c4d-5e6f7a8b", "Elephant Seals on Beach", "A colony of elephant seals lounges on a sandy California beach, basking in the sun.",        1, ["elephant seal","beach","california","wildlife"]],
  ["raccoon-curious",             "animals", "1588611-1a2b3c4d-5e6f7a8b9c0d", "Curious Raccoon",       "A raccoon peers over a log with its distinctive bandit mask and clever black eyes.",            1, ["raccoon","cute","wildlife","curious"]],
  ["flamingo-lake-group",         "animals", "1549144515-1a2b3c4d-5e6f7a8b9c0d", "Flamingos on the Lake","Hundreds of pink flamingos crowd a shallow East African soda lake.",                      2, ["flamingo","lake","flock","africa"]],
  ["okapi-rainforest",            "animals", "1562802-0a1b2c3d-4e5f6a7b8c9d", "Okapi in the Rainforest","An okapi—the forest giraffe of the Congo—peeks from dense rainforest undergrowth.",          3, ["okapi","rainforest","rare","wildlife"]],
  ["kookaburra-branch",           "animals", "1570033-9a0b1c2d-3e4f5a6b7c8d", "Kookaburra on a Branch","An Australian kookaburra perches on a eucalyptus branch with its distinctive stocky beak.",  1, ["kookaburra","australia","bird","branch"]],
  ["narwhal-arctic-waters",       "animals", "1556909114-44e3e70034e2", "Narwhal in Arctic Waters",    "A narwhal surfaces in icy Arctic waters, its long twisted tusk gleaming above the waves.",      3, ["narwhal","arctic","ocean","rare"]],

  // ===== NATURE =====
  ["misty-mountain-morning",      "nature", "1464822756819-f8b40c6f02b5", "Misty Mountain Morning",      "Low clouds drift through a mountain valley at sunrise, creating a magical misty landscape.",   1, ["mountain","mist","morning","sunrise"]],
  ["moss-covered-rocks",          "nature", "1448375240586-882707db888b", "Moss-Covered Rocks Stream",   "Ancient moss-covered boulders line a crystal-clear mountain stream in a temperate rainforest.", 1, ["moss","rocks","stream","forest"]],
  ["autumn-river-reflections",    "nature", "1511497584958-1f2e-4d3a-b2c5-6f7d8e9a0b1c", "Autumn River Reflections","Brilliant orange and red autumn trees are perfectly mirrored in a still forest river.",    2, ["autumn","river","reflection","trees"]],
  ["wildflower-meadow-sunrise",   "nature", "1499002238440-d264edd596ec", "Wildflower Meadow at Sunrise","A meadow bursts with colorful wildflowers at golden hour, bees hovering among the blooms.",    1, ["wildflower","meadow","sunrise","golden hour"]],
  ["mangrove-roots-water",        "nature", "1547150186-something", "Mangrove Roots Underwater",        "The tangled roots of a mangrove forest create a magical underwater world for small fish.",     2, ["mangrove","roots","underwater","tropical"]],
  ["frozen-waterfall-ice",        "nature", "1490041823588-4b4a-4c5d-6e7f-8a9b0c1d2e3f", "Frozen Waterfall","A majestic waterfall transformed by winter into a cathedral of ice and frozen cascades.",    2, ["waterfall","frozen","ice","winter"]],
  ["spring-rain-green-leaves",    "nature", "1468716620957-5a4b5c6d7e8f", "Spring Rain on Green Leaves","Crystal water drops cling to vivid green leaves after a spring rain shower.",                  1, ["rain","drops","leaves","spring"]],
  ["pacific-ocean-waves",         "nature", "1433086257423-6a7b8c9d0e1f", "Pacific Ocean Waves",         "Powerful Pacific waves crash against dark volcanic rocks, sending spray into the salty air.",   2, ["ocean","waves","rocks","pacific"]],
  ["tide-pool-sea-life",          "nature", "1559827291-6a7b8c9d-0e1f2a3b", "Rocky Tide Pool",           "A rocky tide pool teems with sea stars, anemones, and tiny crabs revealed by low tide.",       1, ["tide pool","sea stars","ocean","rocks"]],
  ["oak-woodland-golden",         "nature", "1475483768-9a0b1c2d-3e4f5a6b", "Golden Oak Woodland",       "Sunlight filters through spreading oak trees in a California golden-hour woodland.",           2, ["oak","woodland","golden","california"]],
  ["rainforest-canopy-view",      "nature", "1541976590-09195098a6d1", "Rainforest Canopy from Above", "An aerial view of the Amazon rainforest canopy stretching endlessly to the horizon.",          2, ["rainforest","canopy","amazon","aerial"]],
  ["tulip-field-netherlands",     "nature", "1468078-9a0b1c2d-3e4f5a6b7c8d", "Tulip Fields of Holland", "Endless rows of vibrant tulips in every color stripe the Dutch countryside in spring.",       1, ["tulips","netherlands","spring","colorful"]],
  ["autumn-leaves-ground",        "nature", "1511497584958-9a0b1c2d-3e4f5a6b", "Autumn Leaves on Ground", "A carpet of crimson, amber, and gold fallen leaves covers the forest floor in autumn.",      1, ["autumn","leaves","forest","colors"]],
  ["ice-cave-glacial-blue",       "nature", "1490474418585-ba9bad8fd0ea", "Glacial Ice Cave",            "The ethereal blue glow of sunlight filtered through a glacial ice cave in Iceland.",          2, ["ice cave","glacier","blue","iceland"]],
  ["wisteria-purple-tunnel",      "nature", "1475-9a0b1c2d-3e4f5a6b7c8d0e1f", "Wisteria Tunnel",         "A tunnel of cascading purple wisteria blooms creates a romantic floral walkway in Japan.",    1, ["wisteria","purple","japan","flowers"]],
  ["volcanic-eruption-night",     "nature", "1458862-something", "Volcanic Eruption at Night",           "Rivers of glowing lava flow from a volcanic vent, lighting up the night sky in red and orange.", 3, ["volcano","lava","eruption","fire"]],
  ["dandelion-seeds-wind",        "nature", "1508739773-2a3b4c5d-6e7f8a9b", "Dandelion Seeds in the Wind","Delicate dandelion seeds float on a gentle breeze against a soft blurred green background.", 1, ["dandelion","seeds","wind","macro"]],
  ["coastal-fog-california",      "nature", "1469474968028-56623f02e42e", "Coastal Fog Rolling In",      "Dense morning fog rolls over dramatic coastal cliffs, shrouding the California coastline.",    2, ["fog","coast","california","dramatic"]],
  ["bioluminescent-bay-night",    "nature", "1564492-9a0b1c2d-3e4f5a6b7c", "Bioluminescent Bay",        "Electric blue bioluminescent plankton illuminates the shoreline of a tropical bay at night.",  3, ["bioluminescence","blue","ocean","night"]],
  ["bluebell-forest-england",     "nature", "1494511462-9a0b1c2d-3e4f5a6b", "English Bluebell Forest",  "A magical carpet of deep blue bluebells covers the floor of an ancient English woodland.",     1, ["bluebells","forest","england","spring"]],
  ["salt-flats-reflection",       "nature", "1507003211169-0a1dd7228f2d", "Salt Flats Sky Reflection",  "The Bolivian salt flats become a perfect mirror of clouds and sky after a light rain.",        2, ["salt flats","reflection","bolivia","sky"]],
  ["cactus-garden-bloom",         "nature", "1504208938-4c4e-4f3a-b2c5-95a3c2f2d2c2", "Desert Cactus Garden","A variety of cacti in full bloom display vivid pink and yellow flowers under bright desert sun.", 1, ["cactus","desert","bloom","flowers"]],
  ["creek-stepping-stones",       "nature", "1454372182-something", "Creek with Stepping Stones",       "Sun-dappled stepping stones cross a clear woodland creek gurgling over smooth rocks.",          1, ["creek","stones","woodland","summer"]],
  ["starfish-beach-sand",         "nature", "1533903011-something", "Starfish on the Beach",             "A bright orange starfish rests on white sand at the water's edge with the tide gently lapping.", 1, ["starfish","beach","sand","ocean"]],
  ["pine-forest-light-beams",     "nature", "1448375240586-something", "Light Beams in Pine Forest",    "Dramatic rays of morning sunlight pierce through a dense pine forest canopy.",                  2, ["pine","forest","light","beams"]],
  ["spring-creek-green",          "nature", "1441974231531-c6227db76b6e", "Spring Creek in the Woods",  "A crystal clear spring creek flows through a lush green woodland bursting with new growth.",     1, ["creek","spring","green","woods"]],
  ["desert-night-sky-milky-way",  "nature", "1446776653964-something", "Desert Night Sky",              "The Milky Way arcs overhead above a desert landscape, creating a spectacular star field.",     3, ["milky way","stars","desert","night"]],
  ["hibiscus-tropical-close",     "nature", "1467119160119-something", "Hibiscus Flower Close-Up",      "A vivid red hibiscus blossom with delicate golden stamens photographed in tropical morning light.", 1, ["hibiscus","flower","tropical","red"]],
  ["autumn-vineyard-harvest",     "nature", "1499002238440-something", "Autumn Vineyard at Harvest",    "Golden vines heavy with ripe grapes stretch across rolling hills in the warm autumn light.",    2, ["vineyard","autumn","harvest","wine"]],
  ["pine-cone-snowflakes",        "nature", "1418985991508-e47386d96a71", "Pine Cone with Snow",        "A perfectly formed pine cone dusted with fresh snowflakes sits on a snow-covered branch.",      1, ["pine cone","snow","winter","close-up"]],
  ["poppy-field-red",             "nature", "1490474418585-something", "Red Poppy Field",               "A vivid sea of red poppies stretches across rolling countryside under a dramatic cloudy sky.",  1, ["poppies","red","field","flowers"]],
  ["morning-dew-spider-web",      "nature", "1476231682828-37e571bc172f", "Spider Web with Morning Dew","An intricate spider web decorated with hundreds of dew drops glitters in the morning sun.",    2, ["spider web","dew","morning","macro"]],
  ["autumn-mushrooms-log",        "nature", "1507003211169-something", "Mushrooms on an Autumn Log",    "A cluster of wild mushrooms sprouts from a mossy fallen log on the damp forest floor.",         1, ["mushrooms","autumn","forest","fungi"]],
  ["wave-barrel-surfing",         "nature", "1505118380757-91f5f5632de0", "Inside a Breaking Wave",    "The hollow barrel of a perfect breaking wave captured from inside, light filtering through.",   2, ["wave","surfing","ocean","barrel"]],
  ["cherry-tree-blossom-pink",    "nature", "1515922397397-something", "Cherry Tree in Full Bloom",     "A cherry tree arches over a garden path, its branches heavy with clouds of pink blossoms.",    1, ["cherry blossom","pink","spring","japan"]],
  ["cactus-spine-macro",          "nature", "1426604966848-d7adac402bff", "Cactus Spines Close-Up",    "Extreme close-up of cactus spines reveals an otherworldly pattern of geometric precision.",      2, ["cactus","spines","macro","desert"]],
  ["fog-forest-morning",          "nature", "1507003211169-something2", "Fog-Drenched Forest",          "Morning fog hangs low between the trunks of ancient trees in a Pacific Northwest forest.",     2, ["fog","forest","morning","pacific northwest"]],
  ["golden-wheat-field",          "nature", "1500534314209-a25ddb2bd429", "Golden Wheat Field",         "A vast golden wheat field sways gently under a wide blue summer sky with white clouds.",        1, ["wheat","field","golden","summer"]],
  ["hummingbird-flower",          "nature", "1444464666168-49d633b86797", "Hummingbird at a Red Flower","A ruby-throated hummingbird hovers at a bright red tubular flower, wings invisible in blur.",  2, ["hummingbird","flower","wings","nature"]],
  ["autumn-bridge-leaves",        "nature", "1440688-something", "Autumn Bridge Through the Trees",     "A rustic wooden bridge crosses a forest stream surrounded by brilliant autumn foliage.",        1, ["bridge","autumn","forest","stream"]],
  ["fjord-waterfall-norway",      "nature", "1469474968028-something", "Norwegian Fjord Waterfall",     "A tall slender waterfall plunges from a granite cliff into the deep blue waters of a fjord.",  2, ["fjord","waterfall","norway","cliff"]],
  ["sunbeam-water-underwater",    "nature", "1500534314209-something", "Sunbeams Underwater",           "Golden beams of sunlight filter down through clear turquoise water creating heavenly rays.",    2, ["sunbeams","underwater","blue","ocean"]],
  ["redwood-roots-ancient",       "nature", "1448375240586-something2", "Ancient Redwood Roots",        "The enormous buttressed roots of an ancient coast redwood spread across the forest floor.",    2, ["redwood","roots","ancient","california"]],
  ["flower-bee-macro",            "nature", "1467119160119-something2", "Bee on a Wildflower",          "A honeybee covered in golden pollen visits the center of a bright wildflower in a meadow.",   2, ["bee","flower","pollen","macro"]],
  ["sand-dunes-abstract",         "nature", "1509316785289-025f5b846b35", "Sahara Sand Dunes",          "Sinuous sand dunes in the Sahara cast dramatic shadows in the low golden light of sunset.",    2, ["dunes","sahara","desert","shadows"]],
  ["orchid-purple-tropical",      "nature", "1508739773-something", "Purple Orchid Blossom",           "A stunning deep purple orchid with intricate white markings photographed against dark green.",   1, ["orchid","purple","tropical","flower"]],

  // ===== LANDSCAPES =====
  ["patagonia-torres-granite",    "landscapes", "1469474968028-56623f02e42e", "Torres del Paine Patagonia","The granite towers of Torres del Paine soar into a dramatic sky above the Patagonian steppe.", 2, ["patagonia","chile","granite","mountains"]],
  ["iceland-waterfall-rainbow",   "landscapes", "1501854140801-50d01698950b", "Iceland Waterfall Rainbow","A powerful Icelandic waterfall creates its own rainbow in the cool northern air.",              2, ["iceland","waterfall","rainbow","nature"]],
  ["swiss-alps-green-valley",     "landscapes", "1506905925346-21bda4d32df4", "Swiss Alps Green Valley",  "Lush green alpine meadows below jagged Swiss peaks dotted with traditional chalets.",          2, ["swiss alps","green","valley","mountains"]],
  ["new-zealand-fiordland",       "landscapes", "1469474968028-something2", "New Zealand Fiordland",       "Milford Sound fjord reflects sky and steep rainforest-clad cliffs in glassy dark water.",      2, ["new zealand","fjord","milford sound","mountains"]],
  ["grand-canyon-sunrise",        "landscapes", "1504209-something", "Grand Canyon at Sunrise",           "The Grand Canyon glows brilliant shades of orange, red, and purple at dawn.",                  2, ["grand canyon","sunrise","arizona","usa"]],
  ["vietnam-rice-terraces",       "landscapes", "1602216056096-3b40cc0c9944", "Vietnamese Rice Terraces", "Emerald green rice terraces cascade down the hills of Mu Cang Chai in northern Vietnam.",     2, ["vietnam","rice terraces","green","asia"]],
  ["scottish-highlands-mist",     "landscapes", "1500534314209-something", "Scottish Highlands Mist",      "A misty morning in the Scottish Highlands, heather-covered hills vanishing into low cloud.",   2, ["scotland","highlands","mist","heather"]],
  ["dolomites-autumn-italy",      "landscapes", "1523531294919-4bcd7c65e216", "Dolomites in Autumn",      "The iconic Tre Cime peaks of the Dolomites glow amber against a deep blue autumn sky.",       2, ["dolomites","italy","autumn","mountains"]],
  ["antelope-canyon-light-beam",  "landscapes", "1509316785289-something", "Antelope Canyon Light Beams", "Narrow shafts of sunlight pierce the swirling orange sandstone walls of Antelope Canyon.",     2, ["antelope canyon","light beams","arizona","sandstone"]],
  ["tuscany-cypress-road",        "landscapes", "1523531294919-something", "Tuscan Cypress Tree Road",     "A winding road lined with tall cypress trees leads through golden Tuscan hills at sunset.",    1, ["tuscany","cypress","italy","road"]],
  ["blue-ridge-parkway-autumn",   "landscapes", "1507400492013-162706c8c05e", "Blue Ridge Parkway Autumn","A winding road curves through spectacular autumn colors along the Blue Ridge Parkway.",        2, ["blue ridge","autumn","virginia","road"]],
  ["iceland-black-sand-beach",    "landscapes", "1531366936337-7c912a4589a7", "Iceland Black Sand Beach", "The dramatic black volcanic sand beach of Reynisfjara stretches beneath towering basalt columns.", 2, ["iceland","black sand","beach","volcanic"]],
  ["hong-kong-victoria-peak",     "landscapes", "1532498551838-b7a1cfac622e", "Hong Kong from Victoria Peak","The sparkling skyline of Hong Kong island rises dramatically from Victoria Harbour.",      3, ["hong kong","skyline","night","city"]],
  ["utah-arches-sandstone",       "landscapes", "1490474418585-something", "Utah Arches National Park",    "Delicate Arch stands alone against a brilliant sunset sky in Utah's red rock country.",        2, ["utah","arches","sandstone","southwest"]],
  ["banff-lake-louise",           "landscapes", "1454496522488-7a8e488e8606", "Lake Louise Turquoise",    "The impossibly turquoise waters of Lake Louise mirror the snow-capped Victoria Glacier.",       1, ["lake louise","banff","turquoise","canada"]],
  ["cape-town-table-mountain",    "landscapes", "1509622905150-fa66d3906e09", "Table Mountain Cape Town", "The flat-topped Table Mountain overlooks Cape Town and the sparkling Atlantic Ocean below.",    2, ["table mountain","cape town","south africa","ocean"]],
  ["amazon-river-aerial",         "landscapes", "1541976590-09195098a6d1", "Amazon River from the Air", "The Amazon River snakes through an unbroken expanse of rainforest seen from above.",             3, ["amazon","river","aerial","rainforest"]],
  ["myanmar-bagan-temples",       "landscapes", "1546182990-something", "Bagan Temple Plains Myanmar",   "Thousands of ancient Buddhist temples rise from the misty plain of Bagan at sunrise.",          2, ["bagan","myanmar","temples","sunrise"]],
  ["uyuni-salt-flat-cactus",      "landscapes", "1519985176271-adb1088fa94c", "Salar de Uyuni Cactus",  "Giant cacti dot the surreal white expanse of the Bolivian salt flat stretching to the horizon.", 2, ["salt flat","cactus","bolivia","surreal"]],
  ["plitvice-lakes-croatia",      "landscapes", "1506929562872-bb421503ef21", "Plitvice Lakes Croatia",  "Turquoise lakes connected by cascading waterfalls in Plitvice National Park, Croatia.",          2, ["plitvice","croatia","waterfall","turquoise"]],
  ["sahara-camel-caravan",        "landscapes", "1509316785289-something2", "Camel Caravan Sahara",      "A silhouetted camel caravan treks across towering Saharan sand dunes at dusk.",                 2, ["sahara","camel","caravan","desert"]],
  ["kyoto-bamboo-grove",          "landscapes", "1473773508845-188df298d2d1", "Kyoto Bamboo Grove",      "Thousands of towering bamboo stalks create a cathedral-like grove in Arashiyama, Kyoto.",       1, ["bamboo","kyoto","japan","grove"]],
  ["machu-picchu-sunrise",        "landscapes", "1531366936337-something", "Machu Picchu at Sunrise",    "The ancient Incan citadel of Machu Picchu emerges from morning mist below jagged peaks.",       2, ["machu picchu","peru","inca","sunrise"]],
  ["aurora-borealis-reflection",  "landscapes", "1531366936337-7c912a4589a7", "Aurora Over a Frozen Lake","Green and purple aurora borealis dance over a perfectly still frozen lake in Lapland.",        3, ["aurora","northern lights","lake","reflection"]],
  ["amalfi-coast-italy",          "landscapes", "1452195-something", "Amalfi Coast, Italy",              "Colorful hillside villages cling to the dramatic cliffs of the Amalfi Coast above the sea.",   2, ["amalfi","italy","coast","colorful"]],
  ["china-guilin-karst",          "landscapes", "1509316785289-something3", "Guilin Karst Mountains",    "Mist-shrouded limestone karst peaks rise from the Li River in Guilin, southern China.",         2, ["guilin","china","karst","mountains"]],
  ["ireland-cliffs-of-moher",     "landscapes", "1506929562872-something", "Cliffs of Moher Ireland",    "The towering Cliffs of Moher rise 200 metres from the wild Atlantic Ocean on Ireland's west coast.", 2, ["cliffs","ireland","atlantic","dramatic"]],
  ["yellowstone-geysers-steam",   "landscapes", "1506929562872-something2", "Yellowstone Geyser Steam", "A geyser erupts in a column of steam and water in Yellowstone National Park's thermal basin.",   2, ["yellowstone","geyser","steam","geothermal"]],
  ["phi-phi-islands-thailand",    "landscapes", "1602216056096-something", "Phi Phi Islands Thailand",   "Dramatic limestone cliffs rise from turquoise waters around the iconic Phi Phi Islands.",         1, ["thailand","islands","turquoise","tropical"]],
  ["black-forest-germany-snow",   "landscapes", "1418985991508-something", "Black Forest in Winter",     "Snow-laden fir trees in Germany's Black Forest create a fairy-tale winter landscape.",           1, ["black forest","germany","snow","winter"]],
  ["queenstown-lake-wakatipu",    "landscapes", "1469474968028-something3", "Queenstown New Zealand",    "The town of Queenstown sparkles beside Lake Wakatipu with the Remarkables mountains rising behind.", 2, ["queenstown","new zealand","lake","mountains"]],
  ["zhangjiajie-floating-mountains","landscapes","1508215885820-something","Zhangjiajie Pillar Mountains","Towering sandstone pillar mountains of Zhangjiajie—inspiration for Avatar's floating mountains—shrouded in cloud.", 3, ["zhangjiajie","china","mountains","dramatic"]],
  ["norway-aurora-village",       "landscapes", "1501854140801-something", "Northern Lights Over a Cabin","Green aurora borealis dances above a traditional red Norwegian cabin in the snowy night.",     2, ["norway","aurora","cabin","snow"]],
  ["colorado-aspen-trees-gold",   "landscapes", "1448375240586-something3", "Colorado Aspen Trees in Fall","Quaking aspen trees shine brilliant gold against a blue Colorado sky in peak fall color.",   2, ["aspen","colorado","autumn","gold"]],

  // ===== ART =====
  ["impressionist-garden-monet",  "art", "1543722530-d2c3201371e7", "Impressionist Garden",             "A lush garden painted in loose impressionistic strokes of vivid greens and pastels.",            1, ["impressionist","garden","painting","monet"]],
  ["street-art-mural-city",       "art", "1578662996442-48f60103fc96", "Vibrant Street Art Mural",      "A massive, colorful street art mural covers an entire urban building with bold graphic imagery.", 2, ["street art","mural","city","urban"]],
  ["sculpture-marble-classic",    "art", "1492725764893-90b379c2b6e7", "Classical Marble Sculpture",    "A beautifully lit classical marble sculpture of a figure glows against a dark gallery background.", 1, ["sculpture","marble","classical","museum"]],
  ["mosaic-byzantine-gold",       "art", "1536746803623-cef87080bfc8", "Byzantine Gold Mosaic",         "An intricate Byzantine gold mosaic with rich lapis blue depicts a holy scene in vivid tesserae.",   2, ["mosaic","byzantine","gold","church"]],
  ["abstract-fluid-pour",         "art", "1541701494587-cb58502866ab", "Abstract Fluid Pour Art",       "Swirling rivers of magenta, teal, and gold form organic patterns in a fluid pour painting.",      1, ["abstract","fluid","pour","colorful"]],
  ["origami-paper-cranes",        "art", "1518770660439-4636190af475", "Paper Cranes Origami",          "A cascade of delicate paper origami cranes in white and gold hangs in a serene gallery.",         1, ["origami","cranes","paper","japanese"]],
  ["stained-glass-cathedral",     "art", "1507608616759-54f48f0af0ee", "Cathedral Stained Glass",       "Rose window stained glass fills a cathedral with a kaleidoscope of jeweled light.",               2, ["stained glass","cathedral","light","colorful"]],
  ["calligraphy-brush-ink",       "art", "1513364776144-60967b0f800f", "Calligraphy Brush Strokes",     "Bold black Chinese calligraphy brush strokes on white paper create a meditative composition.",     1, ["calligraphy","brush","ink","chinese"]],
  ["graffiti-wall-color",         "art", "1507679799987-c73779587ccf", "Graffiti Wall of Color",        "An explosion of overlapping spray-paint tags and artwork covers a concrete wall in vivid color.",  2, ["graffiti","wall","color","urban"]],
  ["pointillist-dots-portrait",   "art", "1579783901586-d88db74b4fe4", "Pointillist Portrait",          "A portrait assembled from thousands of tiny colored dots in the divisionist pointillist style.",   2, ["pointillism","portrait","dots","painting"]],
  ["watercolor-autumn-leaves",    "art", "1492725764893-something", "Watercolor Autumn Leaves",         "Delicate watercolor painting of autumn leaves in amber, crimson, and gold with soft washes.",     1, ["watercolor","autumn","leaves","painting"]],
  ["linocut-print-bird",          "art", "1513475382585-d06e58bcb0e0", "Linocut Print of a Bird",      "A bold black-and-white linocut print of a perching songbird against a textured paper background.", 1, ["linocut","print","bird","black and white"]],
  ["neon-sign-art-glow",          "art", "1462331940025-496dfbfc7564", "Neon Sign Art",                 "Hand-bent neon glass tubes glow in vivid pink and blue against a dark background.",               1, ["neon","sign","glow","pink"]],
  ["oil-palette-texture",         "art", "1578662996442-something", "Oil Paint Palette Close-Up",       "Close-up of an artist's palette overflowing with fresh vivid oil paint blobs and mix tracks.",   1, ["oil paint","palette","close-up","texture"]],
  ["bauhaus-geometric-poster",    "art", "1558591710-4b4a1ae0f04d", "Bauhaus-Style Geometric Art",     "A bold geometric composition in primary red, yellow, and blue in the Bauhaus design tradition.",    2, ["bauhaus","geometric","graphic design","bold"]],
  ["photography-darkroom-prints",  "art", "1543722530-something", "Darkroom Photography Prints",        "Black-and-white photographic prints hang drying on a line in a traditional darkroom.",            1, ["photography","darkroom","black and white","prints"]],
  ["tapestry-medieval-woven",     "art", "1579783901586-something", "Medieval Woven Tapestry",          "An intricate woven tapestry depicts medieval knights and mythical creatures in rich colors.",      2, ["tapestry","medieval","woven","history"]],
  ["glass-art-sculpture-color",   "art", "1541701494587-something", "Glass Art Sculpture",              "A Dale Chihuly-inspired blown glass sculpture cascades in bold sunset oranges and fiery reds.",   2, ["glass art","sculpture","color","blown glass"]],
  ["sand-mandala-tibetan",        "art", "1536746803623-something", "Tibetan Sand Mandala",             "Monks create an intricate mandala from colored sand, every tiny detail placed with care.",         3, ["mandala","sand","tibetan","meditation"]],
  ["art-deco-architecture",       "art", "1513514835-something", "Art Deco Architecture Detail",        "The gilded geometric patterns of an Art Deco building facade gleam in afternoon sunlight.",       1, ["art deco","architecture","gold","geometric"]],
  ["ceramic-glaze-close",         "art", "1565193566173-7a0ee3dbe261", "Ceramic Glaze Close-Up",       "The glossy, crackled glaze of a hand-thrown ceramic vessel shimmers with depth and texture.",     1, ["ceramic","glaze","pottery","close-up"]],
  ["street-photography-motion",   "art", "1578662996442-something2", "Street Photography in Motion",    "A long-exposure street photograph captures light trails and blurred figures in a rainy city.",     2, ["street photography","motion blur","city","rain"]],
  ["abstract-canvas-bold",        "art", "1541701494587-something2", "Abstract Canvas with Bold Strokes","Sweeping bold brushstrokes of cadmium orange and cobalt blue collide on a large canvas.",       2, ["abstract","bold","orange","blue"]],
  ["japanese-woodblock-mountain", "art", "1518770660439-something", "Japanese Woodblock Mountain Print","A traditional Japanese woodblock print depicts Mount Fuji rising above curving waves below.",     1, ["woodblock","japan","mount fuji","traditional"]],
  ["comic-book-panel-pop",        "art", "1462331940025-something", "Comic Book Pop Art Panel",         "A bold comic book panel rendered in flat primary colors with dynamic action and speech bubbles.",  2, ["comic","pop art","bold","graphic"]],
  ["gold-leaf-art-close",         "art", "1543722530-something2", "Gold Leaf Art Detail",               "Sheets of delicate gold leaf applied to a wooden panel catch the light in warm, luminous tones.", 1, ["gold leaf","gilding","art","texture"]],
  ["cyanotype-botanical",         "art", "1513364776144-something", "Cyanotype Botanical Print",        "A cyanotype photographic print of botanical specimens creates a striking prussian blue composition.", 1, ["cyanotype","botanical","blue","print"]],
  ["mixed-media-collage",         "art", "1579783901586-something2", "Mixed Media Collage",             "A layered mixed-media collage of torn newspaper, watercolor washes, and ink drawings.",            2, ["collage","mixed media","newspaper","art"]],
  ["sculpture-bronze-garden",     "art", "1513475382585-something", "Bronze Garden Sculpture",          "A verdigris-covered bronze figure sculpture stands in a formal garden beside clipped hedges.",     1, ["bronze","sculpture","garden","verdigris"]],
  ["pencil-sketch-portrait",      "art", "1507679799987-something", "Detailed Pencil Sketch Portrait",  "An exquisitely detailed pencil portrait captures subtle light and shadow with photorealistic skill.", 2, ["pencil","sketch","portrait","drawing"]],
  ["abstract-macro-paint",        "art", "1579783901586-something3", "Macro Abstract Paint Texture",    "An extreme close-up of layered paint reveals a landscape of peaks and craters in vivid color.",    2, ["abstract","macro","paint","texture"]],
  ["watercolor-cityscape",        "art", "1492725764893-something2", "Watercolor Cityscape",            "A loose, luminous watercolor painting of a European city at dusk, reflections glowing in wet streets.", 1, ["watercolor","city","dusk","painting"]],
  ["lego-art-mosaic",             "art", "1578662996442-something3", "LEGO Art Mosaic",                 "A detailed portrait built entirely from colorful LEGO bricks in a pixelated mosaic style.",        2, ["lego","mosaic","colorful","portrait"]],
  ["charcoal-landscape-dramatic", "art", "1507679799987-something2", "Dramatic Charcoal Landscape",     "A dark, expressive charcoal landscape captures a stormy sea coast with dramatic light and shadow.", 2, ["charcoal","landscape","dramatic","drawing"]],
  ["embroidery-floral-detail",    "art", "1543722530-something3", "Floral Embroidery Detail",           "An intricately embroidered floral panel in jewel-tone silks bursts with botanical detail.",         1, ["embroidery","floral","silk","handcraft"]],
  ["macro-soap-bubble-rainbow",   "art", "1541701494587-something3", "Soap Bubble Macro Art",           "The surface of a soap bubble displays swirling iridescent rainbow interference patterns.",          1, ["soap bubble","rainbow","macro","iridescent"]],
  ["street-mural-woman-face",     "art", "1536746803623-something2", "Street Mural Woman Portrait",     "A massive photorealistic street mural of a woman's face covers an entire brick building wall.",    2, ["mural","portrait","street art","realistic"]],
  ["indigo-batik-fabric",         "art", "1518770660439-something2", "Indigo Batik Fabric",             "Deep indigo batik fabric shows the beautiful wax-resist patterns of traditional Indonesian craft.",  1, ["batik","indigo","fabric","traditional"]],
  ["light-painting-photography",  "art", "1462331940025-something2", "Light Painting Photography",      "A long-exposure photograph captures glowing spirals and patterns drawn with a flashlight.",         2, ["light painting","photography","exposure","glow"]],

  // ===== FOOD =====
  ["indian-curry-bowl",           "food", "1585937755-3d0b-4b0c-8a5d-6e7f8a9b0c1d", "Indian Curry Bowl", "A fragrant Indian chicken tikka masala curry in a rich tomato-cream sauce with fresh naan bread.",  1, ["curry","indian","tikka masala","spices"]],
  ["croissant-flaky-butter",      "food", "1517093702-6a7b8c9d-0e1f2a3b4c5d", "Flaky Butter Croissant","A freshly baked croissant with dozens of paper-thin flaky layers glistens with butter.",          1, ["croissant","french","butter","baking"]],
  ["dim-sum-steamer-basket",      "food", "1563245955-0a1b2c3d-4e5f6a7b8c9d", "Dim Sum Steamer Basket","Bamboo steamer baskets stacked high overflow with delicate dim sum dumplings in a teahouse.",       1, ["dim sum","chinese","dumplings","tea"]],
  ["smoothie-bowl-tropical",      "food", "1512621776-8a9b0c1d-2e3f4a5b6c7d", "Tropical Smoothie Bowl", "A vibrant acai smoothie bowl piled with dragon fruit, mango, kiwi, and toasted granola.",          1, ["smoothie bowl","tropical","colorful","healthy"]],
  ["artisan-bread-rustic",        "food", "1568051542-something", "Rustic Artisan Bread",               "A crusty sourdough loaf with a dramatic scored surface sits on a flour-dusted wooden board.",      1, ["bread","sourdough","artisan","rustic"]],
  ["korean-bibimbap",             "food", "1590301157890-4810ed352733", "Korean Bibimbap",               "A stone pot bibimbap with vibrant vegetables, a fried egg, and gochujang sauce arranged beautifully.", 2, ["bibimbap","korean","rice","vegetables"]],
  ["pad-thai-noodles",            "food", "1585937755-something", "Pad Thai Noodles",                   "Classic Thai pad thai with rice noodles, shrimp, bean sprouts, and a wedge of lime.",             1, ["pad thai","thai","noodles","street food"]],
  ["tiramisu-dessert",            "food", "1551782-9a0b1c2d-3e4f5a6b7c8d0e", "Classic Tiramisu",       "Layers of espresso-soaked ladyfingers and mascarpone cream dusted with dark cocoa powder.",        1, ["tiramisu","italian","dessert","coffee"]],
  ["tapas-spread-spain",          "food", "1506377247377-2a5b3b417ebb", "Spanish Tapas Spread",          "A wooden board of Spanish tapas including patatas bravas, jamón, olives, and manchego cheese.",    2, ["tapas","spanish","olives","cheese"]],
  ["thai-green-curry",            "food", "1569050467447-ce54b3bbc37d", "Thai Green Curry",              "A rich, fragrant Thai green curry with coconut milk, vegetables, and jasmine rice on the side.",   1, ["thai","green curry","coconut","spicy"]],
  ["mediterranean-mezze",         "food", "1504867696233-something", "Mediterranean Mezze Platter",      "A colorful Mediterranean mezze spread of hummus, baba ganoush, falafel, pita, and tabbouleh.",     2, ["mezze","mediterranean","hummus","colorful"]],
  ["fresh-pasta-homemade",        "food", "1490645935967-10de6ba17061", "Homemade Fresh Pasta",          "Ribbons of fresh handmade pasta hang drying on a wooden pasta rack dusted with semolina flour.",   1, ["pasta","homemade","italian","fresh"]],
  ["fruit-tart-colorful",         "food", "1488459716781-31db52582fe9", "Colorful Fruit Tart",           "A beautiful pastry cream tart topped with an artistic mosaic of vibrant seasonal fruits.",         1, ["tart","fruit","pastry","colorful"]],
  ["japanese-matcha-ceremony",    "food", "1509440159596-0249088772ff", "Japanese Matcha Tea Ceremony", "A bowl of vivid green matcha tea is whisked into a frothy foam in a traditional Japanese ceremony.", 1, ["matcha","japanese","tea ceremony","green"]],
  ["grilled-steak-asparagus",     "food", "1534080564583-6be75777b70a", "Grilled Steak with Asparagus", "A perfectly grilled ribeye steak with char marks beside crisp asparagus and herb butter.",         2, ["steak","grilled","asparagus","dinner"]],
  ["baklava-honey-nuts",          "food", "1557094838-something", "Honey Baklava with Pistachios",      "Layers of golden phyllo pastry soaked in honey syrup and covered with crushed pistachios.",        1, ["baklava","honey","pistachios","turkish"]],
  ["fresh-lobster-boil",          "food", "1511381939415-e44015466834", "Fresh Lobster Boil",            "A bright red steamed lobster on a pile of corn, potatoes, and clams at a New England clam bake.",  2, ["lobster","seafood","boil","new england"]],
  ["bento-box-japanese",          "food", "1563245955-something", "Japanese Bento Box",                 "A meticulously arranged Japanese bento box with rice, fish, tamagoyaki, and pickled vegetables.",  2, ["bento","japanese","lunch","arranged"]],
  ["lemon-tart-french",           "food", "1551782-something", "French Lemon Tart",                     "A perfect French tarte au citron with a shiny, luminous lemon curd filling in a buttery shell.",  1, ["lemon tart","french","dessert","citrus"]],
  ["açaí-bowl-amazon",            "food", "1590301157890-something", "Acai Bowl with Granola",           "A deep purple acai bowl topped with bananas, strawberries, granola, and drizzled honey.",         1, ["acai","bowl","healthy","purple"]],
  ["cheese-board-wine",           "food", "1514995428-something", "Artisan Cheese Board",               "A generous cheese board with aged cheddar, brie, blue cheese, grapes, and fig jam.",              1, ["cheese","board","wine","artisan"]],
  ["pho-vietnamese-soup",         "food", "1569050467447-something", "Vietnamese Pho Soup",              "A bowl of fragrant Vietnamese pho with silky rice noodles, rare beef, and fresh herbs.",           1, ["pho","vietnamese","soup","noodles"]],
  ["crepe-paris-sweet",           "food", "1517093702-something", "Parisian Sweet Crepe",                "A delicate French crepe folded around Nutella and fresh strawberries on a Paris street.",          1, ["crepe","french","paris","sweet"]],
  ["shakshuka-eggs-spiced",       "food", "1512621776-something", "Spiced Shakshuka",                   "Eggs poached in a bold, spiced tomato and pepper sauce in a cast iron skillet.",                  1, ["shakshuka","eggs","tomato","middle eastern"]],
  ["coconut-mango-dessert",       "food", "1488477181946-6428a0291777", "Mango Coconut Dessert",         "Sliced fresh mango fans over a creamy coconut panna cotta garnished with lime zest.",              1, ["mango","coconut","dessert","tropical"]],
  ["butter-chicken-indian",       "food", "1585937755-something2", "Butter Chicken Curry",              "Tender chicken pieces simmer in a rich, velvety tomato and butter curry sauce.",                   1, ["butter chicken","indian","curry","tomato"]],
  ["naan-bread-tandoor",          "food", "1446103853-something", "Freshly Baked Naan",                 "Puffy, charred naan bread emerges from a clay tandoor oven, ready to scoop up curry.",            1, ["naan","bread","indian","tandoor"]],
  ["breakfast-eggs-benedict",     "food", "1517093702-something2", "Eggs Benedict Brunch",              "Golden eggs benedict with Canadian bacon, hollandaise sauce, and a perfectly poached egg.",        1, ["eggs benedict","brunch","hollandaise","breakfast"]],
  ["birthday-cake-layers",        "food", "1558906739-something", "Layered Birthday Cake",              "A celebration birthday cake with multiple colorful layers and elaborate buttercream rosettes.",     1, ["birthday cake","layers","celebration","sweet"]],
  ["falafel-wrap-mediterranean",  "food", "1551782-something2", "Falafel Wrap",                         "A stuffed pita wrap with crispy falafel, tahini, fresh vegetables, and pickled turnips.",          1, ["falafel","wrap","mediterranean","street food"]],
  ["mochi-japanese-sweet",        "food", "1563245955-something2", "Japanese Mochi Sweets",             "Soft, chewy mochi rice cakes dusted in sweet powder in pastel pink, green, and white.",            1, ["mochi","japanese","sweet","pastel"]],
  ["truffles-chocolate-box",      "food", "1551782-something3", "Chocolate Truffles Box",               "A luxurious box of assorted dark chocolate truffles dusted with cocoa and gold leaf.",             1, ["chocolate","truffles","luxury","dessert"]],
  ["fresh-sushi-rolls",           "food", "1553621042-f6e147245754", "Fresh Sushi Rolls",               "An array of freshly made California, salmon, and tuna sushi rolls arranged on a black slate.",     2, ["sushi","rolls","japanese","seafood"]],
  ["greek-salad-fresh",           "food", "1546069901-ba9599a7e63c", "Classic Greek Salad",             "A classic Greek salad with chunky tomatoes, cucumber, olives, and a thick slab of feta cheese.",   1, ["greek salad","feta","olives","mediterranean"]],
  ["waffle-berries-syrup",        "food", "1488477181946-something", "Waffles with Berries",             "A stack of golden Belgian waffles topped with fresh mixed berries and maple syrup drizzle.",        1, ["waffles","berries","breakfast","golden"]],
  ["pumpkin-soup-autumn",         "food", "1509440159596-something", "Pumpkin Soup in a Bowl",           "A velvety pumpkin soup garnished with cream swirls, pepitas, and fresh herbs in an autumn bowl.",   1, ["pumpkin","soup","autumn","warming"]],
  ["lobster-bisque-seafood",      "food", "1534080564583-something", "Creamy Lobster Bisque",            "A rich, bisque-red lobster bisque is drizzled with cream and garnished with chives.",              1, ["lobster","bisque","seafood","cream"]],
  ["rainbow-layer-cake",          "food", "1551782-something4", "Rainbow Layer Cake",                   "A rainbow layer cake cut to reveal six vivid colored sponge layers inside.",                       1, ["rainbow","cake","colorful","layers"]],
  ["ripe-tomatoes-garden",        "food", "1488459716781-something", "Garden Tomatoes on Vine",          "Clusters of ripe heirloom tomatoes in red, orange, and yellow hang on the vine ready to pick.",   1, ["tomatoes","garden","heirloom","fresh"]],
  ["spiced-latte-art",            "food", "1495474472287-4d71bcdd2085", "Spiced Latte with Art",         "A barista's skilled hands create a delicate rosette design in the foam of a spiced autumn latte.",  1, ["latte","coffee","art","autumn"]],
  ["chili-con-carne",             "food", "1563245955-something3", "Hearty Chili Con Carne",             "A hearty bowl of slow-cooked chili con carne with kidney beans, topped with sour cream and lime.",  1, ["chili","beef","beans","tex-mex"]],
  ["honeycomb-honey-drip",        "food", "1571782-something", "Honeycomb with Honey",                  "Raw honeycomb oozes with golden honey, photographed in warm, luminous close-up detail.",            1, ["honey","honeycomb","golden","macro"]],
  ["churros-chocolate-dip",       "food", "1512621776-something2", "Churros with Chocolate",            "Golden fried churros dusted with cinnamon sugar beside a cup of thick dark chocolate dip.",        1, ["churros","chocolate","spanish","fried"]],
  ["blueberry-pancakes-stack",    "food", "1517093702-something3", "Blueberry Pancake Stack",           "A tall stack of fluffy buttermilk pancakes studded with fresh blueberries and maple syrup.",        1, ["pancakes","blueberry","stack","breakfast"]],
  ["stir-fry-colorful-vegetables", "food", "1590301157890-something2", "Colorful Vegetable Stir Fry",   "A vibrant stir-fry of colorful vegetables in a wok with glossy soy sauce glaze.",                   1, ["stir fry","vegetables","colorful","asian"]],
  ["lavender-honey-lemon",        "food", "1540189799-b5b-something", "Lavender Honey Lemon Drink",     "A tall glass of lavender lemonade with honey syrup and a sprig of fresh lavender.",                 1, ["lavender","lemonade","honey","drink"]],
  ["mezze-hummus-flatbread",      "food", "1504867696233-something2", "Hummus with Flatbread",          "A generous bowl of creamy hummus drizzled with olive oil beside warm, charred flatbreads.",         1, ["hummus","flatbread","mezze","middle eastern"]],
  ["cinnamon-rolls-iced",         "food", "1568051542-something2", "Iced Cinnamon Rolls",               "A tray of freshly baked cinnamon rolls drizzled with thick cream cheese icing.",                   1, ["cinnamon rolls","iced","baking","sweet"]],
  ["autumn-apple-pie",            "food", "1509440159596-something2", "Classic Apple Pie",               "A golden-brown apple pie with a lattice crust dusted with cinnamon sugar, steam rising.",           1, ["apple pie","autumn","lattice","baking"]],

  // ===== TRAVEL =====
  ["prague-old-town-square",      "travel", "1561233-something", "Prague Old Town Square",               "The colorful baroque buildings of Prague's Old Town Square glow in the golden hour light.",       1, ["prague","czech republic","old town","baroque"]],
  ["amsterdam-canals-bikes",      "travel", "1521230843-something", "Amsterdam Canals and Bicycles",     "Classic Dutch canal houses line a bicycle-lined bridge in Amsterdam at dusk.",                    1, ["amsterdam","canals","bicycles","netherlands"]],
  ["singapore-marina-bay",        "travel", "1512453979798-5ea266f8880c", "Singapore Marina Bay Sands",  "Singapore's iconic Marina Bay Sands resort and supertree grove glitter at night.",                 2, ["singapore","marina bay","skyline","night"]],
  ["rio-de-janeiro-christ",       "travel", "1483729558449-something", "Christ the Redeemer Rio",       "Christ the Redeemer statue stands with arms spread over the glittering city of Rio de Janeiro.",   2, ["rio","brazil","christ redeemer","landmark"]],
  ["istanbul-blue-mosque",        "travel", "1524492412937-b28074a5d7da", "Blue Mosque Istanbul",        "The six minarets and multiple domes of Istanbul's Blue Mosque rise above a formal garden.",        2, ["istanbul","blue mosque","turkey","ottoman"]],
  ["bangkok-temple-monks",        "travel", "1508739773-something", "Bangkok Temple with Monks",         "Saffron-robed monks walk past the golden spires of a glittering Bangkok temple.",                  2, ["bangkok","thailand","monks","temple"]],
  ["cape-town-harbor",            "travel", "1540189799-something", "Cape Town Waterfront Harbor",      "Colorful fishing boats float in Cape Town harbor with Table Mountain rising behind in the mist.",   2, ["cape town","harbor","south africa","table mountain"]],
  ["bali-rice-terraces-green",    "travel", "1571782-something2", "Bali Rice Terraces",                 "Lush emerald green rice terraces cascade down the hillsides of Ubud, Bali.",                      1, ["bali","rice terraces","green","indonesia"]],
  ["florence-duomo-sunset",       "travel", "1483729558449-something2", "Florence Duomo at Sunset",     "The magnificent dome of Brunelleschi's Duomo glows in warm orange at sunset in Florence.",         2, ["florence","duomo","italy","sunset"]],
  ["maldives-overwater-bungalows","travel", "1569316-something", "Maldives Overwater Bungalows",        "Turquoise lagoon water surrounds a row of luxury overwater bungalows in the Maldives.",            1, ["maldives","overwater","bungalow","turquoise"]],
  ["new-orleans-bourbon-street",  "travel", "1528360983277-13d401cdc186", "New Orleans French Quarter","Iron-lace balconies and gas lamps adorn the historic French Quarter buildings of New Orleans.",     2, ["new orleans","french quarter","jazz","usa"]],
  ["marrakech-medina-spices",     "travel", "1555881400-74d7acaacd8b", "Marrakech Medina Spice Market", "Huge pyramids of colorful spices fill wooden bowls in the ancient Marrakech medina souk.",         2, ["marrakech","morocco","spices","medina"]],
  ["vienna-opera-house",          "travel", "1513635269975-59663e0ac1ad", "Vienna State Opera House",   "The ornate facade of Vienna's State Opera House glows with warmth on a winter evening.",            2, ["vienna","opera house","austria","architecture"]],
  ["kyoto-geisha-gion",           "travel", "1478436127897-769e1b3f0f36", "Kyoto Gion Geisha District", "A geisha in full kimono walks the lantern-lit stone lanes of Kyoto's historic Gion district.",      2, ["kyoto","geisha","japan","gion"]],
  ["mexico-city-colorful",        "travel", "1540189799-something2", "Mexico City Colorful Streets",     "Brightly painted colonial buildings line a cobblestone street in Mexico City's centro histórico.", 1, ["mexico city","colorful","colonial","streets"]],
  ["edinburgh-castle-scott",      "travel", "1561233-something2", "Edinburgh Castle on the Rock",        "Edinburgh Castle dramatically perches atop its ancient volcanic plug overlooking the Scottish capital.", 2, ["edinburgh","castle","scotland","historic"]],
  ["delhi-jama-masjid",           "travel", "1524492412937-something", "Delhi Jama Masjid Mosque",       "The grand Jama Masjid mosque in Old Delhi, with its red sandstone minarets and vast courtyard.",   2, ["delhi","mosque","india","red sandstone"]],
  ["havana-classic-cars",         "travel", "1528360983277-something", "Havana Vintage Cars",            "Colorful 1950s vintage American cars park outside pastel-painted buildings in Old Havana.",        2, ["havana","cuba","vintage cars","colorful"]],
  ["peru-machu-picchu-llama",     "travel", "1484406566174-something", "Llama at Machu Picchu",         "A llama grazes peacefully with the ancient ruins of Machu Picchu visible in the misty background.", 2, ["machu picchu","llama","peru","ruins"]],
  ["paris-louvre-pyramid",        "travel", "1511381939415-something", "Louvre Pyramid Paris",           "The iconic glass pyramid of the Louvre Museum glows against a blue Parisian sky.",                 1, ["paris","louvre","pyramid","museum"]],
  ["toronto-cn-tower-skyline",    "travel", "1569316-something2", "Toronto CN Tower Skyline",           "The CN Tower rises above Toronto's modern skyline beside the glittering waterfront.",               2, ["toronto","cn tower","canada","skyline"]],
  ["athens-parthenon-acropolis",  "travel", "1561233-something3", "Athens Parthenon",                    "The ancient Parthenon temple crowns the Acropolis rock above the modern city of Athens at dawn.",  2, ["athens","parthenon","greece","ancient"]],
  ["san-francisco-golden-gate",   "travel", "1506377247377-something", "Golden Gate Bridge Fog",        "The Golden Gate Bridge emerges from thick morning fog above the cold waters of San Francisco Bay.", 2, ["golden gate","san francisco","fog","bridge"]],
  ["new-zealand-hobbiton",        "travel", "1469474968028-something4", "Hobbiton New Zealand",          "The charming hobbit holes of Hobbiton nestled in rolling green New Zealand countryside.",            1, ["hobbiton","new zealand","movie set","green"]],
  ["petra-jordan-treasury",       "travel", "1552832230-c0197dd311b5", "Petra Treasury Jordan",          "The rose-red facade of Petra's Treasury is carved directly into a sandstone cliff face.",          2, ["petra","jordan","treasury","ancient"]],
  ["sydney-opera-house-harbor",   "travel", "1534430480872-3498386e7856", "Sydney Opera House Harbor",   "Sydney's iconic Opera House sails reflect in the harbor at twilight, the Harbour Bridge behind.", 2, ["sydney","opera house","harbor","australia"]],
  ["miami-art-deco-south-beach",  "travel", "1540189799-something3", "Miami Art Deco South Beach",       "Pastel Art Deco hotels line the Ocean Drive in South Beach, Miami, in the warm evening light.",     2, ["miami","art deco","south beach","pastel"]],
  ["amsterdam-flower-market",     "travel", "1521230843-something2", "Amsterdam Flower Market",          "The floating flower market of Amsterdam overflows with colorful tulips and other blooms.",           1, ["amsterdam","flowers","tulips","market"]],
  ["berlin-reichstag-dome",       "travel", "1512453979798-something", "Berlin Reichstag Glass Dome",     "The famous glass cupola of the Berlin Reichstag offers panoramic views of the German capital.",    2, ["berlin","reichstag","dome","germany"]],
  ["cambodia-angkor-wat-sunrise", "travel", "1571782-something3", "Angkor Wat Sunrise Cambodia",        "The silhouette of Angkor Wat's towers reflects perfectly in the still water at sunrise.",           2, ["angkor wat","cambodia","sunrise","reflection"]],
  ["buenos-aires-colorful-boca",  "travel", "1540189799-something4", "Buenos Aires La Boca",             "The wildly colorful corrugated-iron buildings of La Boca neighborhood in Buenos Aires.",           2, ["buenos aires","la boca","colorful","argentina"]],
  ["dubrovnik-old-city-walls",    "travel", "1569316-something3", "Dubrovnik City Walls Croatia",       "The ancient limestone city walls of Dubrovnik wrap around the terracotta-roofed Old City.",         2, ["dubrovnik","croatia","city walls","old town"]],
  ["tokyo-shibuya-crossing-night","travel", "1524492412937-something2", "Tokyo Shibuya Crossing",        "The world's busiest pedestrian crossing fills with thousands of people at night in Tokyo.",          2, ["tokyo","shibuya","crossing","night"]],
  ["iceland-church-lupine-purple","travel", "1531366936337-something2", "Iceland Church Purple Lupine",  "A classic Icelandic turf church surrounded by a purple sea of blooming lupine wildflowers.",          1, ["iceland","church","lupine","purple"]],
  ["cartagena-colombia-balconies","travel", "1540189799-something5", "Cartagena Colombia Balconies",      "Flower-draped balconies in jewel colors adorn the Spanish colonial buildings of Cartagena.",       1, ["cartagena","colombia","balconies","colonial"]],
  ["oman-wadi-scenic",            "travel", "1512453979798-something2", "Oman Wadi Oasis",               "A turquoise mountain wadi pool surrounded by date palms and ochre canyon walls in Oman.",          2, ["oman","wadi","oasis","turquoise"]],
  ["budapest-parliament-danube",  "travel", "1538-something", "Budapest Parliament on the Danube",       "Budapest's neo-Gothic Parliament building is spectacularly lit along the Danube River at night.",   2, ["budapest","parliament","danube","hungary"]],
  ["seoul-gyeongbokgung-palace",  "travel", "1524492412937-something3", "Gyeongbokgung Palace Seoul",    "A guard in traditional joseon costume stands before the colorful Gyeongbokgung Palace gate.",       2, ["seoul","palace","korea","traditional"]],
  ["morocco-sahara-tent-camp",    "travel", "1540189799-something6", "Morocco Sahara Desert Camp",        "Luxury Berber tents dot the base of a golden sand dune under a brilliant Sahara night sky.",       2, ["morocco","sahara","camp","desert"]],
  ["montreal-old-port-winter",    "travel", "1571782-something4", "Montreal Old Port in Winter",         "The cobblestones of Montreal's Old Port are dusted with snow, the basilica lit gold above.",       2, ["montreal","winter","old port","canada"]],
  ["havana-malecon-waves",        "travel", "1571782-something5", "Havana Malecón Seawall",              "Waves crash over the Malecón seawall in Havana at golden hour.",                                  1, ["havana","malecon","cuba","waves"]],
  ["santorini-windmill-cliffs",   "travel", "1570077188670-e3a8d69ac5ff", "Santorini Windmill at Sunset","A classic Santorini windmill perches on the clifftop with blue-domed churches and the caldera.", 1, ["santorini","windmill","greece","sunset"]],
  ["new-york-central-park-fall",  "travel", "1534430480872-something", "Central Park in Autumn",         "The paths and reflecting pool of Central Park glow with brilliant autumn colors in New York.",     2, ["central park","new york","autumn","park"]],

  // ===== HOLIDAYS =====
  ["christmas-tree-ornaments",    "holidays", "1544538-something", "Christmas Tree Ornaments",          "A Christmas tree sparkles with glass ornaments, tinsel, and warm twinkling fairy lights.",          1, ["christmas","tree","ornaments","lights"]],
  ["christmas-fireplace-cozy",    "holidays", "1575-something", "Cozy Christmas Fireplace",             "A roaring fireplace with stockings hung below, surrounded by pine garlands and candlelight.",      1, ["christmas","fireplace","cozy","winter"]],
  ["christmas-wrapping-gifts",    "holidays", "1513-something", "Christmas Gifts Wrapped",              "Beautifully wrapped Christmas gifts with ribbon bows arranged under a decorated tree.",             1, ["christmas","gifts","wrapped","ribbons"]],
  ["christmas-snowy-village",     "holidays", "1544538-something2", "Snowy Christmas Village",           "A picturesque snow-covered village lit with holiday lights in the quiet of a winter night.",        1, ["christmas","village","snow","night"]],
  ["halloween-carved-pumpkins",   "holidays", "1509622905150-fa66d3906e09", "Carved Halloween Pumpkins","Three glowing jack-o'-lanterns with creative carvings sit on a porch on Halloween night.",         1, ["halloween","pumpkins","carved","spooky"]],
  ["halloween-fall-decorations",  "holidays", "1509622905150-something", "Halloween Fall Decorations",   "Rustic fall Halloween decorations of gourds, dried corn, and orange lights adorn a front porch.",  1, ["halloween","fall","decorations","porch"]],
  ["thanksgiving-dinner-table",   "holidays", "1574-something", "Thanksgiving Dinner Table",             "A beautifully set Thanksgiving table with a golden roast turkey and autumn leaf centerpiece.",      1, ["thanksgiving","dinner","table","turkey"]],
  ["thanksgiving-autumn-harvest",  "holidays", "1574-something2", "Autumn Harvest Celebration",          "A warm harvest display of gourds, corn, apples, and maple leaves on a wooden farm table.",         1, ["thanksgiving","harvest","autumn","pumpkins"]],
  ["valentines-roses-red",        "holidays", "1574-something3", "Valentine's Day Red Roses",            "A lush bouquet of deep red roses tied with a satin ribbon rests beside a love letter.",            1, ["valentines","roses","red","love"]],
  ["valentines-heart-chocolates", "holidays", "1513-something2", "Valentine's Heart Chocolates",         "A heart-shaped box of artisan chocolates opened to reveal dozens of assorted pralines.",            1, ["valentines","chocolate","heart","love"]],
  ["new-years-eve-fireworks",     "holidays", "1544538-something3", "New Year's Eve Fireworks",          "A dazzling fireworks display explodes in gold and silver over a city skyline at midnight.",          2, ["new year","fireworks","celebration","midnight"]],
  ["new-years-champagne-toast",   "holidays", "1575-something2", "New Year's Champagne Toast",           "Crystal champagne flutes clink in a golden toast to ring in the New Year.",                       1, ["new year","champagne","toast","celebration"]],
  ["easter-eggs-basket",          "holidays", "1457301353672-324d6d14f471", "Easter Eggs in a Basket",   "A wicker basket overflows with hand-painted Easter eggs in pastel blues, pinks, and yellows.",     1, ["easter","eggs","basket","pastel"]],
  ["easter-tulips-spring",        "holidays", "1457301353672-something", "Easter Spring Flowers",         "Fresh spring tulips and daffodils are arranged among painted eggs on a bright Easter morning.",    1, ["easter","tulips","spring","flowers"]],
  ["diwali-oil-lamps-diyas",      "holidays", "1570-something", "Diwali Oil Lamps Glowing",              "Hundreds of small clay oil lamps (diyas) are lit for Diwali, creating a magical warm glow.",      2, ["diwali","diyas","lamps","india"]],
  ["hanukkah-menorah-candles",    "holidays", "1577-something", "Hanukkah Menorah Candles",              "A silver menorah holds eight lit candles in warm golden light for the Hanukkah festival.",         1, ["hanukkah","menorah","candles","jewish"]],
  ["fourth-july-fireworks-flag",  "holidays", "1499092-something", "Fourth of July Fireworks",           "Fireworks burst in red, white, and blue above an American flag for Independence Day.",             2, ["fourth of july","fireworks","independence day","usa"]],
  ["st-patricks-day-green",       "holidays", "1517093702-something4", "St. Patrick's Day Celebration", "A festive arrangement of shamrocks, green hats, and four-leaf clovers for St. Patrick's Day.",     1, ["st patricks","green","shamrocks","irish"]],
  ["mothers-day-breakfast-flowers","holidays","1512621776-something3", "Mother's Day Breakfast in Bed", "A pretty breakfast tray with flowers, tea, and pastries for a Mother's Day morning celebration.",   1, ["mothers day","breakfast","flowers","gift"]],
  ["back-to-school-coloring",     "holidays", "1503676260728-1c00da094a0b", "Back to School Supplies",   "Colorful pencils, notebooks, and school supplies arranged neatly on a white background.",          1, ["back to school","pencils","supplies","colorful"]],
  ["christmas-gingerbread-house", "holidays", "1544538-something4", "Gingerbread House",                 "An elaborately decorated gingerbread house covered in royal icing, candies, and gumdrops.",        1, ["gingerbread","christmas","baking","sweet"]],
  ["halloween-witch-hat-pumpkin", "holidays", "1509622905150-something2", "Halloween Witch Hat",          "A classic black witch hat perches atop a carved pumpkin with black cat silhouette decorations.",   1, ["halloween","witch","hat","pumpkin"]],
  ["thanksgiving-pumpkin-pie",    "holidays", "1574-something4", "Pumpkin Pie for Thanksgiving",         "A perfectly baked pumpkin pie with whipped cream and cinnamon beside autumn leaves.",              1, ["thanksgiving","pumpkin pie","dessert","autumn"]],
  ["chinese-new-year-lanterns",   "holidays", "1577-something2", "Chinese New Year Lanterns",             "Red and gold Chinese New Year lanterns hang in streets decorated with dragons and fireworks.",     2, ["chinese new year","lanterns","red","dragon"]],
  ["carnival-brazil-colorful",    "holidays", "1580-something", "Brazilian Carnival Colorful",           "A samba dancer in an elaborate feathered costume parades in the Brazilian Carnival celebration.",   3, ["carnival","brazil","samba","colorful"]],
  ["christmas-cookies-decorated", "holidays", "1513-something3", "Decorated Christmas Cookies",          "Beautifully decorated sugar cookies in the shapes of trees, stars, and snowflakes.",               1, ["christmas","cookies","decorated","baking"]],
  ["sunrise-easter-sunrise",      "holidays", "1457301353672-something2", "Easter Sunrise Service",       "The golden light of an Easter sunrise breaks over a hilltop cross surrounded by spring flowers.",  1, ["easter","sunrise","cross","spring"]],
  ["eid-al-fitr-celebration",     "holidays", "1585-something", "Eid al-Fitr Celebration",               "A beautiful table set for Eid al-Fitr with sweets, dates, and traditional decorations.",          1, ["eid","celebration","sweets","muslim"]],
  ["new-years-countdown-crowd",   "holidays", "1544538-something5", "New Year's Countdown Crowd",         "A joyful crowd counts down to midnight in Times Square surrounded by confetti and fireworks.",     2, ["new year","times square","crowd","confetti"]],
  ["christmas-advent-calendar",   "holidays", "1575-something3", "Christmas Advent Calendar",             "A charming wooden Christmas advent calendar with numbered doors hiding small surprises.",           1, ["christmas","advent","calendar","countdown"]],
  ["winter-solstice-candles",     "holidays", "1577-something3", "Winter Solstice Candlelight",           "Dozens of white candles illuminate a cozy winter solstice celebration with greenery.",              1, ["winter solstice","candles","cozy","celebration"]],
  ["holi-festival-colors-india",  "holidays", "1576-something", "Holi Festival of Colors",               "Joyful revelers are covered head-to-toe in vivid powder paint at India's Holi festival.",          2, ["holi","india","colors","festival"]],
  ["halloween-costume-party",     "holidays", "1509622905150-something3", "Halloween Costume Party",      "Children in creative Halloween costumes go trick-or-treating on a decorated neighborhood street.", 1, ["halloween","costume","children","trick or treat"]],
  ["christmas-advent-wreath",     "holidays", "1575-something4", "Christmas Advent Wreath",               "A traditional Advent wreath of fir branches, red ribbons, and four candles—one lit for each week.", 1, ["christmas","advent wreath","candles","tradition"]],
  ["veterans-day-ceremony",       "holidays", "1540189799-something7", "Veterans Day Memorial",            "Rows of American flags line a veterans' memorial cemetery during a solemn ceremony.",               2, ["veterans day","memorial","flags","ceremony"]],

  // ===== ABSTRACT =====
  ["bokeh-gold-lights",           "abstract", "1557672172-298e090bd0f1", "Golden Bokeh Lights",            "Out-of-focus golden light points create a dreamy bokeh pattern like a sea of fireflies.",          1, ["bokeh","gold","lights","dreamy"]],
  ["soap-bubble-iridescent",      "abstract", "1558591710-4b4a1ae0f04d", "Iridescent Soap Bubble",          "The swirling interference colors of a soap film create an otherworldly abstract image.",             1, ["soap bubble","iridescent","abstract","color"]],
  ["paint-drop-milk-splash",      "abstract", "1513542789411-b6a5d4f31634", "Paint Drop Splash",            "A vivid paint drop hits a milk surface, frozen mid-splash in a crown of colorful liquid.",            2, ["paint","splash","milk","abstract"]],
  ["circuit-board-blue",          "abstract", "1553356084-58ef4a67b2a7", "Circuit Board Abstract",          "A close-up of a green and gold circuit board creates a mesmerizing geometric pattern.",              2, ["circuit board","technology","green","abstract"]],
  ["neon-lines-geometry",         "abstract", "1550684376-efcbd6e3f031", "Neon Geometric Lines",            "Glowing neon lines form sharp geometric patterns against a pure black background.",                 1, ["neon","lines","geometry","abstract"]],
  ["oil-water-rainbow-macro",     "abstract", "1557804506-669a67965ba0", "Oil and Water Rainbow",           "Swirling oil on water creates shifting rainbow interference patterns in macro photography.",          1, ["oil","water","rainbow","macro"]],
  ["marble-swirl-white-gold",     "abstract", "1557683311-eac922347aa1", "White and Gold Marble Swirl",     "Dramatic swirls of white marble veined with rich gold create an abstract luxury pattern.",            1, ["marble","swirl","white","gold"]],
  ["crystal-formation-macro",     "abstract", "1580927752452-89d86da3fa0a", "Crystal Formation",            "A close-up of crystalline mineral formations reveals a secret geometric world of facets.",             2, ["crystal","mineral","macro","geometry"]],
  ["ripple-water-rings",          "abstract", "1564492-something2", "Water Ripple Rings",                   "Concentric water ripple rings spread outward from a single raindrop on a perfectly still surface.", 1, ["ripple","water","rings","minimal"]],
  ["abstract-glass-refraction",   "abstract", "1513542789411-something", "Glass Refraction Abstract",       "Light bending through a glass prism creates a rainbow spectrum of colors on white.",                 1, ["glass","refraction","rainbow","prism"]],
  ["light-bokeh-blue-purple",     "abstract", "1557672172-something", "Blue Purple Bokeh",                   "Dreamy soft-focus bokeh in shades of blue and purple creates a soothing, luminous backdrop.",      1, ["bokeh","blue","purple","dreamy"]],
  ["fractal-mandelbrot-zoom",     "abstract", "1557683311-something", "Fractal Mandelbrot Set",              "A computer-rendered zoom into the Mandelbrot fractal reveals infinite self-similar detail.",          3, ["fractal","mandelbrot","mathematics","infinite"]],
  ["rust-texture-orange-brown",   "abstract", "1580927752452-something", "Rust Texture Abstract",            "The cracked, oxidized surface of rusted metal creates an abstract landscape in orange and brown.",   1, ["rust","texture","orange","abstract"]],
  ["lava-lamp-oil-blobs",         "abstract", "1564492-something3", "Lava Lamp Oil Blobs",                  "Translucent colored oil blobs drift and merge inside a glowing lava lamp in warm amber light.",     1, ["lava lamp","oil","blobs","warm"]],
  ["aurora-curtains-green",       "abstract", "1531366936337-something3", "Aurora Borealis Curtains",        "Vivid green aurora borealis lights ripple across the sky in curtain-like formations.",               2, ["aurora","green","abstract","sky"]],
  ["ice-crystal-macro-snowflake", "abstract", "1482938289607-e9573fc25ebb", "Ice Crystal Snowflake",         "An ice crystal photographed under polarized light reveals stunning six-fold symmetry.",              2, ["ice crystal","snowflake","macro","symmetry"]],
  ["smoke-abstract-colored",      "abstract", "1513542789411-something2", "Colored Smoke Abstract",          "Plumes of colored smoke in magenta, teal, and orange swirl against a black background.",             1, ["smoke","color","abstract","swirl"]],
  ["marble-blue-white-texture",   "abstract", "1557804506-something", "Blue White Marble Texture",           "Cool white marble with flowing blue-grey veins creates a serene abstract composition.",               1, ["marble","blue","white","texture"]],
  ["abstract-lines-perspective",  "abstract", "1553356084-something", "Abstract Lines in Perspective",       "Long lines of light converge to a single vanishing point, creating a dramatic perspective abstract.", 2, ["lines","perspective","abstract","convergence"]],
  ["confetti-falling-colorful",   "abstract", "1557672172-something2", "Falling Confetti Colors",             "A cascade of colorful confetti in mid-fall creates a joyful abstract pattern.",                      1, ["confetti","colorful","falling","celebration"]],
  ["paint-texture-thick-knife",   "abstract", "1513542789411-something3", "Thick Paint Texture",             "Thick impasto oil paint applied with a palette knife creates a deeply textured abstract surface.",   1, ["paint","texture","impasto","abstract"]],
  ["abstract-architecture-curve", "abstract", "1558591710-something", "Abstract Architecture Curve",          "The soaring curved lines of a modernist building create an abstract geometric composition.",          2, ["architecture","curve","abstract","modern"]],
  ["glitter-gold-sparkle",        "abstract", "1550684376-something", "Gold Glitter Sparkle",                "A surface covered in ultra-fine gold glitter sparkles brilliantly under directional light.",         1, ["glitter","gold","sparkle","luxury"]],
  ["lightning-storm-purple",      "abstract", "1455218873509-8097305ee378", "Purple Lightning Storm",         "A dramatic purple lightning bolt forks across a dark storm-clouded sky in an abstract display.",    3, ["lightning","storm","purple","dramatic"]],
  ["kaleidoscope-symmetry",       "abstract", "1564492-something4", "Kaleidoscope Symmetry",                  "A symmetrical kaleidoscope pattern in vivid jewel tones creates a hypnotic mandala-like image.",   2, ["kaleidoscope","symmetry","colorful","mandala"]],
  ["macro-dew-drop-leaf",         "abstract", "1580927752452-something2", "Macro Dew Drop on Leaf",           "A single perfect dew drop on a green leaf refracts an upside-down world within its sphere.",        1, ["dew drop","macro","leaf","refraction"]],
  ["sand-ripples-desert-pattern", "abstract", "1509316785289-something4", "Sand Ripple Pattern",             "The wind-sculpted ripple pattern of desert sand creates a rhythmic abstract landscape.",             1, ["sand","ripples","desert","pattern"]],
  ["neural-network-visualization","abstract", "1553356084-something2", "Neural Network Visualization",        "A digital visualization of a glowing neural network node graph suggests organic connectivity.",      3, ["neural network","digital","abstract","glow"]],
  ["foam-sea-water-texture",      "abstract", "1506929562872-something3", "Sea Foam Texture",                "Frothy white sea foam creates a delicate lace-like texture as waves recede across dark sand.",        1, ["sea foam","waves","texture","white"]],
  ["abstract-city-lights-night",  "abstract", "1557672172-something3", "City Lights Abstract Night",          "Long-exposure night photography turns city traffic lights into flowing rivers of red and gold.",      2, ["city lights","night","long exposure","abstract"]],
  ["terrazzo-pattern-colorful",   "abstract", "1558591710-something2", "Terrazzo Tile Pattern",               "A close-up of colorful terrazzo flooring reveals a random mosaic of stone and glass fragments.",   1, ["terrazzo","tile","pattern","colorful"]],
  ["galaxy-nebula-purple-blue",   "abstract", "1462331940025-496dfbfc7564", "Galaxy and Nebula",              "Swirling purple and blue nebula clouds and millions of stars fill a cosmic abstract scene.",         2, ["galaxy","nebula","stars","space"]],
  ["metallic-texture-ripple",     "abstract", "1580927752452-something3", "Metallic Ripple Texture",          "The smooth surface of polished metal ripples like water, creating a dreamlike abstract texture.",   1, ["metallic","ripple","texture","reflection"]],
  ["paper-cut-layers-color",      "abstract", "1557804506-something2", "Paper Cut Layers",                    "Layers of colored paper cut into rolling hills create a minimalist shadow-play abstract.",          1, ["paper cut","layers","color","minimal"]],
  ["microscopy-cells-abstract",   "abstract", "1564492-something5", "Cell Microscopy Abstract",               "Fluorescent cell microscopy creates a vivid abstract of glowing shapes on a black background.",     3, ["microscopy","cells","fluorescent","abstract"]],
  ["stained-glass-abstract",      "abstract", "1507608616759-something", "Stained Glass Abstract Pattern",    "Vibrant colored glass panes create a bold abstract pattern of light and line.",                     1, ["stained glass","abstract","colorful","light"]],
  ["aurora-green-blue-night",     "abstract", "1531366936337-something4", "Aurora Green and Blue",            "Ribbons of emerald and aqua aurora borealis weave across a star-filled night sky.",                 2, ["aurora","green","blue","night"]],
  ["abstract-painting-texture",   "abstract", "1541701494587-something4", "Abstract Painting Texture",        "A richly textured abstract canvas in warm earth tones with visible brushwork and palette knife marks.", 2, ["abstract","painting","texture","earth tones"]],
  ["fire-flame-abstract-orange",  "abstract", "1462331940025-something3", "Fire Flame Abstract",              "Close-up slow shutter photography transforms flames into flowing abstract orange and red ribbons.",   2, ["fire","flame","abstract","orange"]],
  ["ink-water-bloom-abstract",    "abstract", "1580927752452-89d86da3fa0a", "Ink in Water Bloom",             "A drop of ink blossoms into a dark, organic abstract cloud as it disperses in still water.",          2, ["ink","water","bloom","abstract"]],
  ["prism-rainbow-spectrum",      "abstract", "1557683311-something2", "Prism Rainbow Spectrum",              "White light splits through a crystal prism into a full rainbow spectrum on white paper.",             1, ["prism","rainbow","spectrum","light"]],
  ["cracked-earth-drought",       "abstract", "1553356084-something3", "Cracked Earth Drought",               "The sun-baked earth cracks into polygonal plates, creating an abstract of brown and tan.",           2, ["cracked earth","drought","abstract","pattern"]],
  ["digital-abstract-wave",       "abstract", "1557804506-something3", "Digital Abstract Wave",               "A 3D-rendered abstract wave of luminous dots and lines sweeps in shades of blue and purple.",         2, ["digital","abstract","wave","3D"]],
  ["magnetic-field-iron-filings",  "abstract", "1564492-something6", "Magnetic Field Iron Filings",           "Iron filings align to reveal the invisible magnetic field lines around two bar magnets.",             2, ["magnetic","iron filings","abstract","science"]],
  ["wood-grain-close-texture",    "abstract", "1564492-something7", "Wood Grain Close-Up",                    "The flowing grain of old wood shows hundreds of years of growth rings in a warm abstract pattern.", 1, ["wood grain","close-up","texture","natural"]],
  ["bubbles-underwater-rising",   "abstract", "1557672172-something4", "Underwater Bubbles Rising",            "Streams of silver air bubbles rise through crystal-clear blue water in an abstract composition.",   1, ["bubbles","underwater","rising","abstract"]],
  ["circuit-neon-pink",           "abstract", "1553356084-something4", "Circuit Board Pink Neon",              "A circuit board bathed in vivid pink neon light creates a striking technological abstract.",         2, ["circuit","neon","pink","technology"]],
  ["color-gradient-smooth",       "abstract", "1557672172-something5", "Smooth Color Gradient",                "A perfectly smooth gradient transitions through the full visible spectrum from red to violet.",      1, ["gradient","color","smooth","spectrum"]],
  ["frost-pattern-window",        "abstract", "1482938289607-something", "Frost Feathers on Glass",             "Ice crystals grow in feathery fractal patterns across a cold window pane.",                        1, ["frost","ice","pattern","winter"]],
  ["gemstone-facets-light",       "abstract", "1558591710-something3", "Gemstone Facets",                     "The facets of a brilliant-cut diamond or sapphire scatter rainbows of colored light.",              1, ["gemstone","facets","light","sparkle"]],
  ["fluid-art-blue-gold",         "abstract", "1557804506-something4", "Fluid Art Blue and Gold",             "Blue and gold acrylic paints swirl together in a fluid art pour, resembling a storm-tossed sea.",   1, ["fluid art","blue","gold","swirl"]],
  ["honeycomb-hex-pattern",       "abstract", "1557683311-something3", "Honeycomb Pattern Close-Up",          "The perfect hexagonal geometry of a natural honeycomb is revealed in close macro detail.",             2, ["honeycomb","hexagon","pattern","geometry"]],
  ["fire-embers-close",           "abstract", "1462331940025-something4", "Fire Embers Close-Up",              "Glowing orange and red fire embers pulse with heat in a dark, abstract long-exposure image.",        1, ["fire","embers","glow","abstract"]],
  ["reflection-water-city",       "abstract", "1464822756819-something2", "City Reflection in Water",          "A city's lights shimmer and distort in a rain-wet street, creating a vivid abstract mirror.",         2, ["reflection","water","city","abstract"]],
  ["paint-pour-teal-coral",       "abstract", "1541701494587-something5", "Paint Pour Teal and Coral",         "A satisfying fluid paint pour creates organic, amoeba-like patterns in teal and coral pink.",          1, ["paint pour","teal","coral","abstract"]],
  ["spiderweb-dew-sunrise",       "abstract", "1476231682828-something", "Spider Web at Sunrise",              "A garden spider's web covered in dew drops shimmers in the first light of sunrise.",                 1, ["spider web","dew","sunrise","abstract"]],
  ["pastel-gradient-pink-blue",   "abstract", "1557672172-something6", "Pastel Gradient Pink and Blue",        "A soft, dreamy gradient drifts from powder pink through lavender to a pale sky blue.",                1, ["pastel","gradient","pink","blue"]],
];

// ── Upload helper ─────────────────────────────────────────────────────────────
async function uploadPuzzle(entry) {
  const [slug, , unsplashId] = entry;
  const sourceUrl = `https://images.unsplash.com/photo-${unsplashId}?w=1200&h=900&fit=crop&auto=format&q=80`;
  const publicId = `jigsaws/puzzles/${slug}`;
  try {
    const result = await cloudinary.uploader.upload(sourceUrl, {
      public_id: publicId,
      overwrite: false,
      resource_type: "image",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });
    console.log(`  ✓  ${slug}`);
    return { slug, ok: true, url: result.secure_url };
  } catch (err) {
    const msg = err?.message ?? String(err);
    if (msg.includes("already exists") || err?.http_code === 409) {
      console.log(`  –  ${slug}  (already on Cloudinary)`);
      return { slug, ok: true, alreadyExisted: true };
    }
    console.error(`  ✗  ${slug}  →  ${msg.slice(0, 120)}`);
    return { slug, ok: false, error: msg };
  }
}

// ── TypeScript entry generator ────────────────────────────────────────────────
function toTsEntry(entry, idx) {
  const [slug, category, , title, description, difficulty, tags] = entry;
  const tagsStr = tags.map((t) => `"${t}"`).join(", ");
  return `  {
    id: "x${idx}",
    slug: "${slug}",
    title: "${title.replace(/"/g, '\\"')}",
    category: "${category}",
    imageUrl: puzzleImageUrl("${slug}"),
    thumbnailUrl: puzzleThumbUrl("${slug}"),
    description: "${description.replace(/"/g, '\\"')}",
    difficulty: ${difficulty},
    attribution: "Cloudinary",
    tags: [${tagsStr}],
  },`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("ERROR: CLOUDINARY_CLOUD_NAME not set. Check .env.local.");
    process.exit(1);
  }

  console.log(`\nExpanding puzzle catalog with ${NEW_PUZZLES.length} new entries...\n`);

  const CONCURRENCY = 4; // stay within Cloudinary free-tier rate limits
  const results = [];

  for (let i = 0; i < NEW_PUZZLES.length; i += CONCURRENCY) {
    const batch = NEW_PUZZLES.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(uploadPuzzle));
    results.push(...batchResults);
  }

  const successes = results.filter((r) => r.ok);
  const failures  = results.filter((r) => !r.ok);

  console.log("\n── Summary ───────────────────────────────────────────────────");
  console.log(`  Total attempted:  ${NEW_PUZZLES.length}`);
  console.log(`  Succeeded:        ${successes.length}`);
  console.log(`  Failed:           ${failures.length}`);

  if (failures.length) {
    console.log("\n  Failed slugs:");
    failures.forEach((f) => console.log(`    • ${f.slug}`));
  }

  // Build the set of successful slugs for lookup
  const successSlugs = new Set(successes.map((r) => r.slug));

  // Filter NEW_PUZZLES to only successfully uploaded ones, preserve order
  const successEntries = NEW_PUZZLES.filter(([slug]) => successSlugs.has(slug));

  // Write output JSON
  const outputJson = join(__dirname, "expand-puzzles-output.json");
  writeFileSync(outputJson, JSON.stringify({ successes, failures }, null, 2));
  console.log(`\n  Output JSON: ${outputJson}`);

  // Write ready-to-paste TypeScript additions (starting id from x1)
  let idCounter = 1;
  const tsLines = ["  // ===== ADDITIONS FROM expand-puzzles.mjs ====="];
  let currentCategory = null;
  for (const entry of successEntries) {
    const [, category] = entry;
    if (category !== currentCategory) {
      currentCategory = category;
      tsLines.push(`\n  // ===== ${category.toUpperCase()} (expanded) =====`);
    }
    tsLines.push(toTsEntry(entry, idCounter++));
  }

  const outputTs = join(__dirname, "expand-puzzles-additions.ts");
  writeFileSync(outputTs, tsLines.join("\n") + "\n");
  console.log(`  TypeScript additions: ${outputTs}`);
  console.log(`\n  Add these ${successEntries.length} entries to src/data/puzzles.ts\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
