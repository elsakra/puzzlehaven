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
    <footer className="bg-amber-50/60 border-t border-amber-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-800">Online Jigsaws</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Free online jigsaw puzzles. Play daily challenges, create custom
              puzzles from your photos, and solve together with friends.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Categories</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm text-slate-500 hover:text-amber-700 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Resources</h3>
            <ul className="space-y-2">
              {resources.map((res) => (
                <li key={res.href}>
                  <Link
                    href={res.href}
                    className="text-sm text-slate-500 hover:text-amber-700 transition-colors"
                  >
                    {res.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Stay Updated</h3>
            <p className="text-sm text-slate-500 mb-3">
              Get a new puzzle in your inbox every morning.
            </p>
            <EmailForm className="flex flex-col gap-2" />
          </div>
        </div>

        <div className="border-t border-slate-200/60 mt-10 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Online Jigsaws. All rights reserved. Free online jigsaw puzzles.
        </div>
      </div>
    </footer>
  );
}
