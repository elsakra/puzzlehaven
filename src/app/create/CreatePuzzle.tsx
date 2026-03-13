"use client";

import { useState, useCallback, useRef } from "react";
import PuzzleCanvas from "@/components/puzzle/PuzzleCanvas";
import { PIECE_PRESETS } from "@/engine/types";

export default function CreatePuzzle() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [pieceCount, setPieceCount] = useState(48);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB");
      return;
    }

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setFileName(file.name);
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  const handleReset = useCallback(() => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  }, [imageUrl]);

  if (imageUrl) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500 truncate max-w-[200px]">
              {fileName}
            </span>
            <select
              value={pieceCount}
              onChange={(e) => setPieceCount(Number(e.target.value))}
              className="px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg min-h-[44px]"
            >
              {Object.keys(PIECE_PRESETS).map((k) => (
                <option key={k} value={k}>
                  {k} pieces
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 min-h-[44px]"
          >
            Upload New Photo
          </button>
        </div>

        <PuzzleCanvas
          imageUrl={imageUrl}
          puzzleId={`custom-${fileName}`}
          puzzleTitle="My Custom Puzzle"
          initialPieceCount={pieceCount}
          seed={Date.now()}
        />
      </div>
    );
  }

  return (
    <div
      className="border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center hover:border-amber-400 transition-colors cursor-pointer bg-stone-50"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileRef.current?.click()}
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      <div className="text-5xl mb-4">📷</div>
      <h3 className="text-lg font-semibold text-stone-700 mb-2">
        Drop your photo here
      </h3>
      <p className="text-stone-500 text-sm mb-4">
        or click to browse your files
      </p>
      <p className="text-stone-400 text-xs">
        Supports JPEG, PNG, WebP — up to 10MB
      </p>
    </div>
  );
}
