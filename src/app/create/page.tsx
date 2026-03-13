import type { Metadata } from "next";
import CreatePuzzle from "./CreatePuzzle";

export const metadata: Metadata = {
  title: "Create Your Own Jigsaw Puzzle — Upload a Photo",
  description:
    "Turn any photo into a free online jigsaw puzzle. Upload your image, choose the number of pieces, and share it with friends and family!",
};

export default function CreatePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-800">
          Create Your Own Jigsaw Puzzle
        </h1>
        <p className="text-stone-500 mt-3 max-w-lg mx-auto text-lg">
          Upload any photo and turn it into a jigsaw puzzle you can play and
          share with friends and family.
        </p>
      </div>

      <CreatePuzzle />

      <section className="mt-12 max-w-2xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-stone-800 mb-3">
          How It Works
        </h2>
        <div className="grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-2xl mb-2">1. Upload</div>
            <p className="text-stone-500">
              Choose a photo from your device. Family photos, vacation shots,
              and pet pictures make great puzzles!
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">2. Customize</div>
            <p className="text-stone-500">
              Pick how many pieces you want — from an easy 24 pieces to a
              challenging 150 pieces.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">3. Play & Share</div>
            <p className="text-stone-500">
              Start solving right away and share the puzzle link with anyone you
              like!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
