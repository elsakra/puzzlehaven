"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl" role="img" aria-label="puzzle piece">
              🧩
            </span>
            <span className="text-lg font-bold text-stone-800 group-hover:text-amber-600 transition-colors">
              PuzzleHaven
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/daily">Daily Puzzle</NavLink>
            <NavLink href="/puzzles/animals">Animals</NavLink>
            <NavLink href="/puzzles/nature">Nature</NavLink>
            <NavLink href="/puzzles/art">Art</NavLink>
            <NavLink href="/create">Create</NavLink>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-stone-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white">
          <nav className="flex flex-col py-2 px-4">
            <MobileNavLink href="/" onClick={() => setMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="/daily" onClick={() => setMenuOpen(false)}>Daily Puzzle</MobileNavLink>
            <MobileNavLink href="/puzzles/animals" onClick={() => setMenuOpen(false)}>Animals</MobileNavLink>
            <MobileNavLink href="/puzzles/nature" onClick={() => setMenuOpen(false)}>Nature</MobileNavLink>
            <MobileNavLink href="/puzzles/art" onClick={() => setMenuOpen(false)}>Art</MobileNavLink>
            <MobileNavLink href="/create" onClick={() => setMenuOpen(false)}>Create Your Own</MobileNavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors min-h-[44px] flex items-center"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 py-3 text-base font-medium text-stone-700 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors min-h-[48px] flex items-center"
    >
      {children}
    </Link>
  );
}
