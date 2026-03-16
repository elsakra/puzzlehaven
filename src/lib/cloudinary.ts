const CLOUD_NAME = "dil14r8je";
const PUZZLE_FOLDER = "jigsaws/puzzles";

/**
 * Full-size puzzle image URL served via Cloudinary CDN.
 * Delivers WebP/AVIF automatically, cropped to 4:3.
 */
export function puzzleImageUrl(slug: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1200,h_900,c_fill,f_auto,q_auto/${PUZZLE_FOLDER}/${slug}`;
}

/**
 * Thumbnail URL (400×300) for puzzle cards and grids.
 */
export function puzzleThumbUrl(slug: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_400,h_300,c_fill,f_auto,q_auto/${PUZZLE_FOLDER}/${slug}`;
}

/**
 * URL for a custom (user-uploaded) puzzle image stored in the
 * custom-puzzles Cloudinary folder.
 */
export function customPuzzleUrl(publicId: string): string {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto/${publicId}`;
}
