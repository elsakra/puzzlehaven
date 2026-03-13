import Image from "next/image";
import Link from "next/link";
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

export default function PuzzleCard({ puzzle, priority = false }: PuzzleCardProps) {
  return (
    <Link
      href={`/puzzles/${puzzle.category}/${puzzle.slug}`}
      className="group block rounded-2xl overflow-hidden bg-white border-2 border-slate-100 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100/60 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={puzzle.thumbnailUrl}
          alt={puzzle.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
        />

        {/* Hover overlay with Play Now button */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white text-slate-900 font-bold text-sm px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2">
            Play Now
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

        <div className="absolute top-2.5 right-2.5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyColor[puzzle.difficulty]}`}>
            {difficultyLabel[puzzle.difficulty]}
          </span>
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-bold text-slate-800 text-sm group-hover:text-amber-700 transition-colors truncate">
          {puzzle.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed flex-1 mr-2">
            {puzzle.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
