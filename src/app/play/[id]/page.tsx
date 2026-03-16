"use client";

import { use } from "react";
import PuzzleCanvas from "@/components/puzzle/PuzzleCanvas";
import { customPuzzleUrl } from "@/lib/cloudinary";

interface PlayPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pieces?: string }>;
}

export default function PlayPage({ params, searchParams }: PlayPageProps) {
  const { id } = use(params);
  const { pieces } = use(searchParams);
  const publicId = decodeURIComponent(id);
  const imageUrl = customPuzzleUrl(publicId);
  const validPieces = [24, 48, 96, 150].includes(Number(pieces)) ? Number(pieces) : 48;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Custom Puzzle</h1>
        <p className="text-slate-500 text-sm mt-1">
          Someone shared this puzzle with you — good luck!
        </p>
      </div>
      <PuzzleCanvas
        imageUrl={imageUrl}
        puzzleId={`custom-${publicId}`}
        puzzleTitle="Custom Puzzle"
        puzzleCategory="custom"
        initialPieceCount={validPieces}
      />
    </main>
  );
}
