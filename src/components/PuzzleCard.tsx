"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Puzzle } from "@/data/puzzles";

interface PuzzleCardProps {
  puzzle: Puzzle;
  priority?: boolean;
}

const difficultyLabel = ["", "Easy", "Medium", "Hard"];
const difficultyColor = [
  "",
  "text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200/60",
  "text-amber-700 bg-amber-50 ring-1 ring-amber-200/60",
  "text-rose-700 bg-rose-50 ring-1 ring-rose-200/60",
];

const categoryGradients: Record<string, string> = {
  animals: "from-emerald-100 to-teal-200",
  nature: "from-green-100 to-emerald-200",
  art: "from-purple-100 to-pink-200",
  architecture: "from-slate-100 to-blue-200",
  food: "from-orange-100 to-amber-200",
  travel: "from-sky-100 to-blue-200",
  science: "from-indigo-100 to-violet-200",
  sports: "from-red-100 to-rose-200",
};

export default function PuzzleCard({ puzzle, priority = false }: PuzzleCardProps) {
  const [imgError, setImgError] = useState(false);
  const gradient = categoryGradients[puzzle.category] ?? "from-slate-100 to-slate-200";

  return (
    <Link
      href={`/puzzles/${puzzle.category}/${puzzle.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
    >
      <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${gradient}`}>
        {!imgError && (
          <Image
            src={puzzle.thumbnailUrl}
            alt={puzzle.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            onError={() => setImgError(true)}
          />
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white text-slate-900 font-semibold text-sm px-5 py-2 rounded-full shadow-md flex items-center gap-2">
            Play
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

        <div className="absolute top-2.5 right-2.5">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[puzzle.difficulty]}`}>
            {difficultyLabel[puzzle.difficulty]}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-slate-800 text-sm group-hover:text-slate-900 transition-colors truncate">
          {puzzle.title}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 leading-relaxed">
          {puzzle.description}
        </p>
      </div>
    </Link>
  );
}
