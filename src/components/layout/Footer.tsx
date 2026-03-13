import Link from "next/link";
import EmailForm from "./EmailForm";

const categories = [
  { name: "Animals", href: "/puzzles/animals" },
  { name: "Nature", href: "/puzzles/nature" },
  { name: "Landscapes", href: "/puzzles/landscapes" },
  { name: "Art", href: "/puzzles/art" },
  { name: "Food", href: "/puzzles/food" },
  { name: "Travel", href: "/puzzles/travel" },
  { name: "Holidays", href: "/puzzles/holidays" },
  { name: "Abstract", href: "/puzzles/abstract" },
];

const resources = [
  { name: "Daily Puzzle", href: "/daily" },
  { name: "Create Your Own", href: "/create" },
  { name: "How to Solve Puzzles", href: "/blog/how-to-solve-jigsaw-puzzles-faster" },
  { name: "Brain Health Benefits", href: "/blog/benefits-of-jigsaw-puzzles-for-brain-health" },
];

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🧩</span>
              <span className="text-lg font-bold text-stone-800">PuzzleHaven</span>
            </Link>
            <p className="text-sm text-stone-500 leading-relaxed">
              Free online jigsaw puzzles. Play daily challenges, create custom
              puzzles from your photos, and solve together with friends.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-800 mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-stone-500 hover:text-amber-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-800 mb-3">Resources</h3>
            <ul className="space-y-2">
              {resources.map((res) => (
                <li key={res.href}>
                  <Link
                    href={res.href}
                    className="text-sm text-stone-500 hover:text-amber-600 transition-colors"
                  >
                    {res.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-800 mb-3">Stay Updated</h3>
            <p className="text-sm text-stone-500 mb-3">
              Get a new puzzle in your inbox every morning.
            </p>
            <EmailForm className="flex flex-col gap-2" />
          </div>
        </div>

        <div className="border-t border-stone-200 mt-10 pt-6 text-center text-xs text-stone-400">
          &copy; {new Date().getFullYear()} PuzzleHaven. All rights reserved. Free online jigsaw puzzles.
        </div>
      </div>
    </footer>
  );
}
