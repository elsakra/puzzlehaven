"use client";

import { useState, useCallback, useRef } from "react";
import { PIECE_PRESETS } from "@/engine/types";
import { analytics } from "@/lib/gtag";

type UploadState = "idle" | "uploading" | "error";

export default function CreatePuzzle() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pieceCount, setPieceCount] = useState(48);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadAndRedirect = useCallback(
    async (file: File, count: number) => {
      setUploadState("uploading");
      setUploadError(null);

      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Upload failed");
        }

        analytics.customPuzzleCreated();
        URL.revokeObjectURL(localUrl);
        window.location.href = `/play/${encodeURIComponent(data.publicId)}?pieces=${count}`;
      } catch (err) {
        setUploadState("error");
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        URL.revokeObjectURL(localUrl);
        setPreviewUrl(null);
      }
    },
    []
  );

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setUploadError("Please upload an image file (JPEG, PNG, etc.)");
        setUploadState("error");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Image must be under 10MB");
        setUploadState("error");
        return;
      }

      setFileName(file.name);
      uploadAndRedirect(file, pieceCount);
    },
    [pieceCount, uploadAndRedirect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file || !file.type.startsWith("image/")) return;

      if (file.size > 10 * 1024 * 1024) {
        setUploadError("Image must be under 10MB");
        setUploadState("error");
        return;
      }

      setFileName(file.name);
      uploadAndRedirect(file, pieceCount);
    },
    [pieceCount, uploadAndRedirect]
  );

  const handleRetry = useCallback(() => {
    setUploadState("idle");
    setUploadError(null);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  }, []);

  if (uploadState === "uploading") {
    return (
      <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-12 text-center bg-indigo-50">
        {previewUrl && (
          <div className="mb-6 flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 rounded-xl object-contain shadow-md"
            />
          </div>
        )}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
        </div>
        <p className="text-indigo-700 font-semibold text-base mb-1">
          Uploading your photo…
        </p>
        <p className="text-indigo-400 text-sm truncate max-w-[240px] mx-auto">
          {fileName}
        </p>
      </div>
    );
  }

  if (uploadState === "error") {
    return (
      <div className="border-2 border-dashed border-red-300 rounded-2xl p-12 text-center bg-red-50">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-red-700 mb-2">
          Upload failed
        </h3>
        <p className="text-red-500 text-sm mb-6">{uploadError}</p>
        <button
          onClick={handleRetry}
          className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-slate-600">
          Piece count:
        </label>
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
        <p className="text-stone-400 text-xs mt-1">
          Your photo is uploaded securely and generates a shareable puzzle link
        </p>
      </div>
    </div>
  );
}
