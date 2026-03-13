import Image from "next/image";
import Link from "next/link";
import { Puzzle } from "@/data/puzzles";

interface PuzzleCardProps {
  puzzle: Puzzle;
  priority?: boolean;
}

const difficultyLabel = ["", "Easy", "Medium", "Hard"];
const difficultyColor = ["", "text-green-600 bg-green-50", "text-amber-600 bg-amber-50", "text-red-600 bg-red-50"];

export default function PuzzleCard({ puzzle, priority = false }: PuzzleCardProps) {
  return (
    <Link
      href={`/puzzles/${puzzle.category}/${puzzle.slug}`}
      className="group block rounded-xl overflow-hidden bg-white border border-stone-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <Image
          src={puzzle.thumbnailUrl}
          alt={puzzle.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          priority={priority}
        />
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor[puzzle.difficulty]}`}>
            {difficultyLabel[puzzle.difficulty]}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-stone-800 text-sm group-hover:text-amber-600 transition-colors truncate">
          {puzzle.title}
        </h3>
        <p className="text-xs text-stone-500 mt-1 line-clamp-2">
          {puzzle.description}
        </p>
      </div>
    </Link>
  );
}
