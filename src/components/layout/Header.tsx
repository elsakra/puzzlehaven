"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#fdf9f3]/95 backdrop-blur-xl border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200/60">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7 1.49 0 2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5S21.88 11 20.5 11z"/>
              </svg>
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors tracking-tight">
                Online Jigsaws
              </span>
              <span className="hidden sm:block text-[10px] font-semibold text-amber-600 uppercase tracking-widest leading-none -mt-0.5">
                500+ Free Puzzles
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/daily">Daily Puzzle</NavLink>
            <NavLink href="/puzzles/animals">Animals</NavLink>
            <NavLink href="/puzzles/nature">Nature</NavLink>
            <NavLink href="/puzzles/art">Art</NavLink>
            <NavLink href="/create" highlight>+ Create</NavLink>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-amber-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-slate-700"
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
        <div className="md:hidden border-t border-amber-100 bg-[#fdf9f3]/98 backdrop-blur-xl">
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

function NavLink({ href, children, highlight }: { href: string; children: React.ReactNode; highlight?: boolean }) {
  if (highlight) {
    return (
      <Link
        href={href}
        className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm shadow-amber-200 min-h-[36px] flex items-center"
      >
        {children}
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="px-3 py-2 text-sm font-semibold text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors min-h-[44px] flex items-center"
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
      className="px-3 py-3 text-base font-semibold text-slate-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors min-h-[48px] flex items-center"
    >
      {children}
    </Link>
  );
}
