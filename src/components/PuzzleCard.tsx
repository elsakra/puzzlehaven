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
      className="group block rounded-2xl overflow-hidden bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2.5 right-2.5">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyColor[puzzle.difficulty]}`}>
            {difficultyLabel[puzzle.difficulty]}
          </span>
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors truncate">
          {puzzle.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {puzzle.description}
        </p>
      </div>
    </Link>
  );
}
