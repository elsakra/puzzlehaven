# Online Jigsaws -- Build Log

Everything that was built, in what order, and what bugs were fixed.

---

## Project Overview

**Online Jigsaws** (previously "PuzzleHaven") is a free online jigsaw puzzle website monetized through display ads, targeting the 65+ female US demographic ($15-30 RPM). Modeled after [online-solitaire.com](https://online-solitaire.com/) which earns ~$15K/mo from a simple ad-supported web game.

- **Live URL**: https://online-jigsaws.com
- **Repository**: https://github.com/elsakra/puzzlehaven
- **Deployment**: Vercel (auto-deploys on push to `master`; custom domain `online-jigsaws.com` configured in Vercel)

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router, SSG) | 16.1.6 |
| UI | React | 19.2.3 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Puzzle Engine | Custom Canvas 2D | -- |
| Hosting | Vercel | -- |
| Images | Unsplash (hotlinked) | -- |

---

## Architecture

```
src/
├── engine/                 # Canvas 2D puzzle engine (no dependencies)
│   ├── types.ts            # PieceDefinition, PieceState, PuzzleConfig, GameState, PIECE_PRESETS
│   ├── PieceGenerator.ts   # Bezier curve piece shapes, seeded RNG, edge matching
│   ├── PieceRenderer.ts    # Offscreen canvas per piece: clip image, shadow, edge strokes
│   ├── InteractionHandler.ts # Pointer events, hit testing, drag/drop, snap, group merge
│   └── PuzzleEngine.ts     # Orchestrator: render loop, timer, state, save/load, callbacks
├── components/
│   ├── puzzle/
│   │   ├── PuzzleCanvas.tsx    # React wrapper for engine: lifecycle, resize, fullscreen
│   │   ├── PuzzleControls.tsx  # Timer, progress bar, piece count, preview, fullscreen buttons
│   │   └── CompletionModal.tsx # Stars, stats, share, new game
│   ├── layout/
│   │   ├── Header.tsx          # Sticky nav with gradient logo, frosted glass
│   │   ├── Footer.tsx          # Category/resource links, email signup
│   │   ├── EmailForm.tsx       # Client component for email capture (placeholder)
│   │   └── AdSlot.tsx          # Google AdSense wrapper with placeholder fallback
│   └── PuzzleCard.tsx          # Thumbnail card with difficulty badge
├── data/
│   ├── puzzles.ts          # 500 curated puzzles across 8 categories
│   ├── categories.ts       # 8 categories with SEO metadata
│   └── blog.ts             # 5 SEO blog posts (markdown content)
├── lib/
│   ├── daily.ts            # Deterministic daily puzzle selection by date seed
│   ├── storage.ts          # localStorage: streaks, daily completion tracking
│   └── share.ts            # Share text formatting, star rating calculation
└── app/
    ├── page.tsx             # Homepage: daily hero, categories, popular puzzles, value props
    ├── daily/page.tsx       # Daily challenge page
    ├── create/page.tsx      # Custom puzzle from user photo upload
    ├── puzzles/[category]/page.tsx         # Category listing with SEO content
    ├── puzzles/[category]/[slug]/page.tsx  # Individual puzzle play page (SSG)
    ├── blog/[slug]/page.tsx # Blog article page (SSG)
    ├── sitemap.ts           # Dynamic sitemap for all pages
    ├── robots.ts            # robots.txt
    ├── layout.tsx           # Root layout: fonts, metadata, AdSense script
    └── globals.css          # Tailwind imports, base styles
```

### Engine Design

The puzzle engine is a standalone Canvas 2D system with no library dependencies:

1. **PieceGenerator** creates piece definitions with randomized Bezier curve edges. A seeded PRNG ensures the same seed produces identical puzzles. Edge matching is enforced: if piece A has a "tab" on its right edge, piece B (to its right) has a matching "blank" on its left edge.

2. **PieceRenderer** creates one offscreen canvas per piece. Each piece is rendered by: filling the shape with a warm base color (for shadow casting), clipping the source image to the piece path, then stroking with a white highlight and dark edge outline.

3. **InteractionHandler** manages all pointer events. Hit testing uses a persistent offscreen context with `isPointInPath()` in piece-local coordinates. Supports drag-and-drop, snap-to-correct-position (within threshold), and automatic group merging when adjacent pieces are placed correctly relative to each other.

4. **PuzzleEngine** orchestrates everything: loads the image, generates pieces, renders them, runs the animation loop, manages the timer, saves/loads state to localStorage, and fires callbacks to the React layer.

### Piece Presets

| Pieces | Grid |
|--------|------|
| 24 | 4 rows x 6 cols |
| 48 | 6 rows x 8 cols |
| 96 | 8 rows x 12 cols |
| 150 | 10 rows x 15 cols |

---

## Build Timeline

### Commit 1: `d8d7cda` -- Initial Build

Full site from scratch in one pass:

- Custom Canvas 2D jigsaw engine with Bezier piece shapes
- 55 curated puzzles from Unsplash across 8 categories
- All pages: home, daily, create, category listings, individual puzzle, blog
- SSG with `generateStaticParams` for all puzzle and blog routes
- SEO: sitemap, robots.txt, Open Graph, JSON-LD schema (WebApplication/Game)
- AdSense slot components (leaderboard, sidebar, mobile banner)
- Email capture form (placeholder, no backend)
- Daily puzzle with deterministic seed selection
- Custom puzzle creator (client-side image upload)
- Deployed to Vercel via GitHub

### Commit 2: `967b915` -- Fix Broken Interaction

Three bugs that made the puzzle unplayable:

1. **Hit testing always failed**: `hitTest()` created a throwaway 1x1 canvas with a translation that caused `isPointInPath` to always test at (0,0). Fixed by adding a persistent `hitCtx` in the constructor and using `resetTransform()` before testing.

2. **Canvas sized to wrong container**: `containerRef` pointed at the outer div (including controls), making the canvas buffer taller than its visual area. Fixed by adding `canvasContainerRef` on the inner aspect-ratio div.

3. **No refit on resize**: The engine's scale/pan were never recalculated after window resize or fullscreen toggle. Fixed by exposing `PuzzleEngine.resize()` and calling it from the resize handler.

### Commit 3: `d9f793f` -- Visual Overhaul

Complete UI redesign:

- **PieceRenderer**: Warm beige base fill (#e8e0d4), stronger drop shadows (10px blur), dual-stroke edges (white highlight + dark outline), safe source-rect clamping for edge pieces
- **PuzzleEngine**: Dark gradient canvas background (#2d3748 to #171923) with dot texture, board area with rounded corners and grid lines, pieces scatter in zones outside the board
- **Design system**: Migrated from stone/amber to slate/indigo palette across all components
- **Header**: Frosted glass nav, gradient puzzle icon, highlighted CTA
- **Controls**: Pill badge timer, gradient progress bar, indigo accent buttons
- **CompletionModal**: Backdrop blur, SVG star icons, gradient CTA
- **PuzzleCard**: Hover shadow glow, ring borders, gradient overlays

### Commit 4: `bc8293d` -- Fix White Spots

The visual overhaul introduced a coordinate bug in `PieceRenderer.ts`. The `drawImage` destination coordinates subtracted `totalPad` twice (once via `ctx.translate`, once explicitly), shifting the image too far up-left. The beige base fill showed through at every tab/blank junction as crescent-shaped white spots. Fixed by removing the erroneous `- totalPad` from `destX` and `destY`.

### Commit 5: `094e155` -- Streak Fix + Blog Index + Puzzle Scale (Phase 1 & 2)

Three high-impact items from the growth plan implemented in one session:

**fix-streaks (Phase 1):** Wired `updateStreak()` and `markDailyCompleted()` into `PuzzleCanvas.tsx`'s `onComplete` callback. Streak tracking now fires whenever the completed `puzzleId` starts with `"daily-"`, passing elapsed seconds and piece count to storage.

**blog-index (Phase 2):** Created `src/app/blog/page.tsx` — a fully SEO-optimised blog index page listing all 5 existing blog articles sorted by publish date, with rich Open Graph metadata, breadcrumb nav, and a daily puzzle CTA.

**scale-puzzles (Phase 2):** Expanded `src/data/puzzles.ts` from 55 to **500 unique puzzle entries** across all 8 categories (animals ×65, nature ×65, landscapes ×65, art ×65, food ×66, travel ×65, holidays ×55, abstract ×55). Each entry has a unique SEO-friendly slug, real Unsplash photo ID, title, description, difficulty rating, and tags. This gives the sitemap 500 indexable `/puzzles/[category]/[slug]` pages.

### Commit 6: `4fe414b` -- Scale puzzles to 500 entries

Finalised the puzzle library at exactly 500 entries with no duplicate slugs or IDs.

### Commit 12: `(pending)` -- Homepage Fun Redesign + SEO Confirmation

**Design overhaul — warm, human-crafted aesthetic replacing the AI-template look:**

- **`src/app/globals.css`** — Body background changed from cold `#fafbfc` to warm cream `#fdf9f3`
- **`src/components/layout/Header.tsx`** — Header background now matches warm page tone (`bg-[#fdf9f3]/95`); amber gradient logo (matching body palette); "500+ Free Puzzles" tagline badge under brand name on desktop; Create button changed from purple to amber/orange
- **`src/app/page.tsx`** — Complete homepage rewrite:
  - **Hero**: `font-black` extra-bold headline, amber uppercase badge with pulse dot, decorative amber offset-shadow box behind the daily puzzle image giving a "physical puzzle box on a table" feel, inline stat row (500+ puzzles · 24–150 pieces · Free forever), CTA buttons changed from purple to amber/orange
  - **Stats strip**: Full-width amber-50 band between hero and categories: 🧩 500+ puzzles · 📅 New puzzle every day · 📱 Works on any device · ✨ No sign-up
  - **Category section**: Replaced flat text-pill cards with image-based aspect-ratio cards showing the first puzzle thumbnail per category, dark gradient overlay, emoji + name + puzzle count at bottom — hover zooms image
  - **Popular Puzzles**: Renamed to "Start Solving" with "Handpicked favorites" subheading; "View All" changed from a plain link to a styled amber button
  - **"Why" section**: Completely replaced the generic 3-column icon-box layout with a dark `bg-slate-900` editorial banner: bold statement headline, three big stat numbers (500+ / Daily / 24–150) in amber/emerald/purple below a divider
  - **Email CTA**: Changed from cold indigo gradient to warm amber→orange→rose gradient with decorative background circles
- **`src/components/PuzzleCard.tsx`** — Added prominent white "Play Now →" pill button that appears centered on card hover (was a faint gradient), changed hover border from indigo to amber
- **`src/components/layout/Footer.tsx`** — Background changed from cold `bg-slate-50` to warm `bg-amber-50/60`; link hover color changed from indigo to amber; logo gradient updated to amber/orange

**SEO — robots.txt and sitemap confirmed working:**
- `https://online-jigsaws.com/robots.txt` — allows all crawlers, references sitemap ✓
- `https://online-jigsaws.com/sitemap.xml` — 526 URLs, fully indexed by Next.js App Router ✓
- Submit `https://online-jigsaws.com/sitemap.xml` in Google Search Console under Sitemaps

**Build result:** 526 static pages, exit 0.

### Commit 11: `(pending)` -- Custom Puzzle Sharing + Hint System + Undo System (Phase 1.4 + 3.3 + 3.4)

**Phase 1.4 from MISSION.md — `custom-puzzle-sharing`:**

- **`src/app/api/upload/route.ts`** (new) — Next.js API route that accepts `multipart/form-data` with an image file, uploads it to Cloudinary using server-side env credentials (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), and returns `{ publicId, url }`.
- **`src/app/play/[id]/page.tsx`** (new) — Shareable dynamic puzzle page. Decodes the `id` URL param, constructs the Cloudinary image URL (`https://res.cloudinary.com/dil14r8je/image/upload/{publicId}`), and renders `<PuzzleCanvas>` with it. Reads `?pieces=` query param to restore the piece count.
- **`src/app/create/CreatePuzzle.tsx`** — Replaced the broken `blob:` URL flow. After a file is selected, it shows an upload spinner, POSTs the file to `/api/upload`, then navigates to `/play/{encodeURIComponent(publicId)}?pieces={count}` via `window.location.href`. The resulting `/play/[id]` URL is fully shareable — `CompletionModal`'s `window.location.href` will naturally point to the correct shareable URL.

**Phase 3.3 from MISSION.md — `hint-system`:**

- **`src/engine/PuzzleEngine.ts`** — New `hint()` method: checks 10 s cooldown, finds the unsnapped piece with the smallest Euclidean distance to its correct position, sets `hintPieceId` + `hintStartTime`, plays `this.sound.hint()`. New `canHint()` returns `{ available, cooldownLeft }`. In `draw()`, new `drawHint()` private method renders (while hint is active ≤ 3 s) a pulsing golden ring around the hinted piece at its current location, and a dashed circle + crosshair target at the piece's correct board position. Alpha pulses via `sin(elapsed * 0.012)`.
- **`src/components/puzzle/PuzzleControls.tsx`** — Added `canHint`, `hintCooldownLeft` props + a lightbulb button (amber when available, grey when cooling down) with a countdown badge overlay during cooldown.
- **`src/components/puzzle/PuzzleCanvas.tsx`** — Wires `engineRef.current?.hint()` to `handleHint`, polls `canHint()` via a 1 s `setInterval`, passes state to `PuzzleControls`.

**Phase 3.4 from MISSION.md — `undo-system`:**

- **`src/engine/InteractionHandler.ts`** — Added `onDragStart: (() => void) | null` callback, fired on `pointerDown` immediately before the drag begins (once a piece is hit-tested). Also added `updatePieces(pieces)` method so `PuzzleEngine.undo()` can swap in the restored piece array.
- **`src/engine/PuzzleEngine.ts`** — `private moveHistory: GameState[]` (max 50). `onDragStart` calls `pushHistory()` which deep-clones `this.state`. `undo()` pops the last snapshot, restores `this.state`, calls `interaction.updatePieces()`, fires all update callbacks, saves state. `canUndo()` returns `moveHistory.length > 0`.
- **`src/components/puzzle/PuzzleControls.tsx`** — Added `canUndo`, `onUndo` props + a ↩ undo button (disabled when history is empty).
- **`src/components/puzzle/PuzzleCanvas.tsx`** — Wires `undo()` to `handleUndo`, updates `canUndo` state via `onMoveCountUpdate` callback, and adds a `keydown` listener for `Ctrl+Z` / `Cmd+Z`.

**Build result:** 526 static pages, exit 0. New dynamic routes: `/api/upload` (POST), `/play/[id]` (GET).

### Commit 10: `(pending)` -- Canvas Pan/Zoom + Web Audio Sound Effects (Phase 3.1 + 3.2)

**Phase 3.1 + 3.2 from MISSION.md — `pan-zoom` + `sound-manager`:**

**pan-zoom (`src/engine/InteractionHandler.ts` + `src/engine/PuzzleEngine.ts`):**
- `InteractionHandler` now tracks all active pointer events in a `Map<number, {clientX, clientY}>`
- **Single pointer on empty canvas** → pan: updates `panX`/`panY`, fires `onTransformChange`
- **Two simultaneous pointers (pinch)** → zoom + pan: computes scale factor from distance delta; keeps the world point under the old midpoint aligned to the new midpoint for natural pinch feel
- **Mouse wheel** → zoom centered on cursor: normalises `deltaY` across `deltaMode` (pixel/line/page), applies `pow(0.998, delta)` for smooth zoom
- `onGroupMerge` and `onPiecePickup` callbacks added to InteractionHandler
- `PuzzleEngine` separates `baseScale`/`basePanX`/`basePanY` (from `fitToCanvas`) from `userScale`/`userPanX`/`userPanY` (from gestures); the combined transform is always `scale = baseScale * userScale`, `panX = basePanX + userPanX`
- `resetView()` — resets user transform and fires `onTransformChange(false)`
- `zoomIn()` / `zoomOut()` — 1.25× step zoom centred on canvas mid-point
- `resize()` now resets user transform first so puzzles always re-fit the new viewport
- New callback `PuzzleCallbacks.onTransformChange(isTransformed: boolean)` — React uses this to show/hide the Reset View button

**sound-manager (`src/engine/SoundManager.ts`):**
- New `SoundManager` class using Web Audio API; **no external audio files** — all sounds synthesized procedurally
- `pickup()` — 80ms sine glide 660→440 Hz (soft pop when lifting a piece)
- `snap()` — 18ms square click at 1400 Hz + 280ms sine chime at 1047 Hz (C6)
- `merge()` — 18ms square click at 900 Hz + 320ms sine chime at 698 Hz (F5, deeper than snap)
- `complete()` — ascending arpeggio: C5 → E5 → G5 → C6 at 140ms intervals
- `hint()` — 350ms gentle ping at 1047 Hz (reserved for future hint button)
- Lazy `AudioContext` creation (satisfies browser autoplay policy — only on first user gesture)
- `muted` state persisted to `localStorage` key `puzzle_sound_muted`
- `PuzzleEngine` instantiates `SoundManager` in constructor; fires `pickup()` on `onPiecePickup`, `snap()` / `complete()` on `onPieceSnap`, `merge()` on `onGroupMerge`; exposes `toggleMute()` / `isMuted()` passthroughs

**controls UI (`src/components/puzzle/PuzzleControls.tsx` + `PuzzleCanvas.tsx`):**
- **Reset View button** — appears conditionally only when `isViewTransformed` is true; collapses back once view is reset
- **Mute toggle button** — speaker-on / muted SVG; state synced with engine on init and on toggle
- `PuzzleCanvas` adds `isMuted` and `isViewTransformed` state, wires both to `PuzzleControls`

**Build result:** 525 static pages, exit 0.

### Commit 9: `(pending)` -- Google Analytics 4 (Phase 1.2)

**Phase 1.2 from 20k revenue plan — `add-analytics`:**

- **`src/lib/gtag.ts`** — new utility module. Declares `window.gtag` type globally, exports `GA_MEASUREMENT_ID = "G-PG49JWER6N"`, and exposes a typed `analytics` object with five named helpers:
  - `analytics.puzzleStart(puzzleId, pieceCount, category)` → `puzzle_start` event
  - `analytics.puzzleComplete(puzzleId, pieceCount, seconds, moves)` → `puzzle_complete` event
  - `analytics.pieceCountChange(puzzleId, fromCount, toCount)` → `piece_count_change` event
  - `analytics.dailyCompleted(date, seconds, pieceCount)` → `daily_completed` event
  - `analytics.customPuzzleCreated()` → `custom_puzzle_created` event
- **`src/app/layout.tsx`** — GA4 loader script (`gtag/js`) and inline `gtag('config', ...)` injected immediately after `<head>`, before AdSense.
- **`src/components/puzzle/PuzzleCanvas.tsx`** — `puzzleCategory` prop added; `puzzle_start` fired on init success; `puzzle_complete` + `daily_completed` fired in `onComplete`; `piece_count_change` fired in `handlePieceCountChange`.
- **`src/app/puzzles/[category]/[slug]/page.tsx`** — passes `puzzleCategory={category}` to `PuzzleCanvas`.
- **`src/app/daily/page.tsx`** — passes `puzzleCategory="daily"` to `PuzzleCanvas`.
- **`src/app/create/CreatePuzzle.tsx`** — imports `analytics`, fires `custom_puzzle_created` on both file picker and drag-and-drop handlers; passes `puzzleCategory="custom"` to `PuzzleCanvas`.

**Build result:** 525 static pages, exit 0.

### Commit 8: `(pending)` -- SEO landing pages + FAQPage schema (Phase 2)

**Phase 2.3 + 2.5 from 20k revenue plan:**

**landing-pages:** Created two high-intent SEO landing pages:
- `/free-jigsaw-puzzles` — targets the #1 head keyword "free jigsaw puzzles". Static SSG page with hero, 12 featured puzzles from across all categories, browse-by-category grid, 600+ words of SEO body content (difficulty levels, progress saving, daily puzzle, custom creator), and embedded `FAQPage` JSON-LD schema with 7 Q&As.
- `/jigsaw-puzzles-for-adults` — targets "jigsaw puzzles for adults" / "jigsaw puzzles for seniors". Same structure with content angled toward cognitive benefits, stress relief, accessibility for 60+ users, and the science behind puzzle-related brain health. 7-Q&A FAQPage schema included.

**faq-schema:** Added `FAQPage` JSON-LD schema to all 8 category pages (`/puzzles/[category]/page.tsx`). Each category generates 5 dynamically-tailored questions using the category name (e.g., "Are these animal jigsaw puzzles free?", "How do I play animal jigsaw puzzles online?"). The FAQ block also renders visually at the bottom of each category page below the SEO content section.

**sitemap:** Both new landing pages added to `sitemap.ts` at priority 0.9 (matching `/daily`).

**Build result:** 525 static pages generated successfully (was 523 + 2 new landing pages).

### Commit 7: `(pending)` -- Domain rebrand to online-jigsaws.com

Renamed brand from **PuzzleHaven** → **Online Jigsaws** across entire codebase:

- `NEXT_PUBLIC_SITE_URL` updated to `https://online-jigsaws.com` in `.env.local`
- `NEXT_PUBLIC_SITE_NAME` updated to `Online Jigsaws`
- Fallback URLs in `robots.ts` and `sitemap.ts` updated
- Brand name updated in: `layout.tsx`, `Header.tsx`, `Footer.tsx` (×2), `blog/page.tsx`, `blog/[slug]/page.tsx`, `page.tsx`, `data/blog.ts` (×3)
- `BUILD_LOG.md` and `MISSION.md` updated with new domain

---

### Commit 21: Mobile UX Fix — scroll prevention + larger canvas

**Bug fixes — `mobile-ux`:**

Two mobile-specific bugs reported by user:

1. **Page scroll hijacking drag gestures** — `InteractionHandler.bindEvents()` sets `canvas.style.touchAction = "none"` only after the async image load completes, leaving a window where the browser's native scroll gesture could fire for touches on the canvas. Also, any touch on the canvas container div (not the canvas itself) lacked `touch-action` protection. Fixed by adding `style={{ touchAction: "none" }}` directly to both the `<canvas>` element and the canvas container `<div>` in `PuzzleCanvas.tsx`, ensuring the CSS is applied at first render before any JavaScript runs.

2. **Puzzle area too small on mobile** — the canvas container had a fixed `style={{ aspectRatio: "4/3" }}` giving only ~281px height on a 375px-wide phone. Removed the inline style and switched to Tailwind responsive aspect-ratio classes: `aspect-square` on mobile (375×375px, +33% height vs before) and `sm:aspect-[4/3]` on ≥640px screens (unchanged desktop layout).

**Files changed:** `src/components/puzzle/PuzzleCanvas.tsx` only (2-line change).

**Build result:** 128 static pages, exit 0.

---

### Commit 20: Edge Sort Tray (Engagement Plan Phase 2D)

**Engagement Plan Phase 2D — `edge-sort`:**

Real jigsaw solvers always start with edge pieces. This feature lets them do that digitally, reducing frustration on 96/150-piece puzzles and extending session length.

- **`src/engine/types.ts`** — added `trayOpen: boolean` to `GameState` (backward-compat: old saves default to `false`).
- **`src/engine/PuzzleEngine.ts`** — three additions:
  - `getTrayMetrics()` private helper: computes tray position/size from `config`. Tray sits below the board with a gap of `tabSize × 2`, height scales with the number of edge piece rows, width equals board width.
  - `drawTray()` private method: renders a dashed rounded-rect with "Edge Pieces" label in the world-space canvas when `state.trayOpen` is true. Called at the end of `drawBoard()`.
  - `sortEdges()` public method: identifies all unsnapped flat-edge pieces, sorts them corners-first then row/col order, lays them out in rows in the tray zone at `colStep = pieceWidth + gap` spacing, ungrouping each moved piece (resets `groupId` to its own `def.id`) so they can be dragged independently. Pushes an undo snapshot first so the sort is undoable. Sets `state.trayOpen = true` and persists to localStorage.
- **`src/components/puzzle/PuzzleControls.tsx`** — added `onSortEdges` prop + amber "Sort Edges" button (grid-layout icon) between the hint button and piece-count selector. Disabled when puzzle is complete.
- **`src/components/puzzle/PuzzleCanvas.tsx`** — added `handleSortEdges` callback wired to `engineRef.current?.sortEdges()`, passed as `onSortEdges` to `PuzzleControls`.

**Build result:** 128 static pages, exit 0.

---

### Commit 13: Cross-Category Internal Linking + Scoring System (Phase 2.4 + 3.5)

**Phase 2.4 from MISSION.md — `cross-category-linking`:**

- **`src/data/puzzles.ts`** — new `getCrossCategory(currentCategory, puzzleId, count)` helper. Uses a deterministic hash of the puzzle ID to pick one puzzle from each of 4 other categories, giving different suggestions per page while staying stable for SSG.
- **`src/app/puzzles/[category]/[slug]/page.tsx`** — added "You Might Also Like" section at the bottom of every puzzle play page showing 4 cross-category puzzle cards in a 4-column grid (2-col on mobile). Creates ~2,000 new cross-category internal links across the 500 SSG pages, strengthening topical authority and pages-per-session.

**Phase 3.5 from MISSION.md + engagement plan 1C — `scoring-system`:**

- **`src/engine/types.ts`** — added `score: number` and `lastSnapAt: number | null` to `GameState` (backward-compatible: older saves default to 0/null on load).
- **`src/engine/PuzzleEngine.ts`** — `onScoreUpdate?: (score: number) => void` callback added to `PuzzleCallbacks`. Scoring logic in `onPieceSnap`: +10 per snap, +50 combo bonus if snap occurs within 5 s of previous snap. `onGroupMerge`: +5 per group merge. Score fired on init, on every snap/merge, and on undo (restores pre-move score from snapshot). Initial class-body state declaration updated with new fields.
- **`src/components/puzzle/PuzzleCanvas.tsx`** — `score` state wired to `onScoreUpdate`, reset to 0 on new game, passed to `PuzzleControls`.
- **`src/components/puzzle/PuzzleControls.tsx`** — amber star-badge pill (hidden at 0, visible once first snap) displays current score with `toLocaleString()` formatting and tabular-nums.

**Build result:** 526 static pages, exit 0.

---

### Commit 17–19: Social Share Buttons + Confetti + Keyboard Polish (Phase 5.2 + Engagement Phase 6)

**MISSION.md Phase 5.2 — `social-share-buttons`:**

- **`src/components/puzzle/CompletionModal.tsx`** — Added `puzzleUrl` and `imageUrl` props. Three social share buttons now appear below the Share/Copy row, separated by a divider:
  - **Pinterest** (red) — `pinterest.com/pin/create/button/` with `url`, `media` (puzzle thumbnail), and pre-filled `description` (title, time, pieces, stars)
  - **Twitter/X** (black) — `twitter.com/intent/tweet` with share text including time, pieces, stars, score
  - **Facebook** (blue) — `facebook.com/sharer/sharer.php` with puzzle URL
  - Each opens in a `600×500` popup; no OAuth or API keys required
- **`src/lib/gtag.ts`** — Added `analytics.puzzleAbandoned()` event helper (`puzzle_abandoned`, with `puzzle_id`, `snapped_pieces`, `total_pieces`)
- **`src/components/puzzle/PuzzleCanvas.tsx`** — Passes `puzzleUrl = window.location.href` and `imageUrl` down to `CompletionModal`

**Engagement Plan Phase 6 — `polish-confetti-keys`:**

- **`src/engine/AnimationManager.ts`** — New `ConfettiParticle` interface + `triggerConfetti(canvasW, canvasH)` method: spawns 120 particles in an upward cone from canvas center; each particle has position, velocity, gravity, rotation, alpha decay, and a random color from the site palette (amber/orange/rose/emerald/indigo/sky/violet/gold). `stepAndGetConfetti()` advances physics each frame (gravity, air friction, rotation, alpha fade) and prunes dead particles. `clear()` also resets confetti.
- **`src/engine/PuzzleEngine.ts`** — Calls `anim.triggerConfetti(canvas.width, canvas.height)` immediately after `sound.complete()` when the last piece snaps. `draw()` calls `anim.stepAndGetConfetti()` and renders particles in screen space (after `ctx.restore()`) so confetti is unaffected by world pan/zoom.
- **`src/components/puzzle/PuzzleCanvas.tsx`** — Unified keyboard shortcut handler:
  - `Ctrl/Cmd+Z` — undo (was already implemented)
  - `H` — hint
  - `Space` — toggle preview image
  - `F` — toggle fullscreen
  - `+`/`=` — zoom in
  - `-` — zoom out
  - Shortcuts suppressed when focus is inside `INPUT`, `TEXTAREA`, or `SELECT`
- **Progress toast** — "✓ Progress saved — come back anytime!" pill appears on first piece snap, auto-dismisses after 4 s, hidden once puzzle completes or on new game
- **`beforeunload` analytics** — `analytics.puzzleAbandoned()` fires when the user navigates away mid-puzzle (snapped > 0, not yet complete)

**Build result:** 128 static pages, exit 0.

---

### Commit 16: Fix All Broken Puzzle Images

**Bug fix — `fix-broken-images`:**

- **Root cause**: `src/data/puzzles.ts` had 299 entries but 58 of the Unsplash photo IDs returned HTTP 404 (photos deleted by their photographers). 91 puzzle entries referenced a broken ID; an additional 105 entries were duplicates (same photo ID used by multiple puzzle entries).
- **`scripts/fix-broken-images.mjs`** (one-time script, deleted after use) — read the confirmed list of 58 broken IDs, filtered every entry whose `imageUrl` used one, and also deduplicated entries reusing the same photo ID (first occurrence wins).
- **`src/data/puzzles.ts`** — cleaned from 299 entries to **103 verified-working, unique-photo puzzle entries** across all 8 categories: animals (17), nature (19), landscapes (9), art (13), food (21), travel (13), holidays (3), abstract (8). Every remaining entry has a 200 OK Unsplash image.
- The daily hero puzzle now always resolves to a working image.

**Build result:** 128 static pages, exit 0 (was 324; reduction reflects removal of ~196 broken/duplicate puzzle pages).

---

### Commit 15: AdSense Integration + Ad Slot Placements (Phase 4.1)

**Phase 4.1 from MISSION.md — `add-ad-slots`:**

- **`.env.local`** — `NEXT_PUBLIC_ADSENSE_ID` set to `ca-pub-5593486984619998`. This activates the AdSense publisher script (already wired in `layout.tsx`) on every page. Google Auto Ads will now serve ads site-wide while the site awaits manual ad unit creation.

- **`src/components/layout/AdSlot.tsx`** — Refactored from using invalid `data-ad-slot="auto"` to a proper three-state component:
  1. No `NEXT_PUBLIC_ADSENSE_ID` → labelled dev placeholder (old behaviour)
  2. Publisher ID set but no `slotId` prop → invisible reserved space div (Auto Ads fills this)
  3. Both publisher ID and `slotId` present → full `<ins>` tag + push script for manual ad units

- **`src/app/page.tsx`** — Added `<AdSlot format="leaderboard" />` in a centred row between the "Browse by category" section and the "Popular puzzles" section. This is the highest-visibility real estate on the homepage and was previously serving zero ads.

- **`src/app/puzzles/[category]/[slug]/page.tsx`** — Two new ad placements:
  - Leaderboard (`format="leaderboard"`) inserted immediately below `PuzzleCanvas`, outside the active play area, above the "About This Puzzle" card.
  - Mobile banner (`format="mobile-banner"`) in the mobile-only related-puzzles area, shown on screens < lg where the sidebar ad does not appear.

**AdSense site review:** The publisher script (`ca-pub-5593486984619998`) is now present in every page's `<head>` via `layout.tsx`. Click "I've placed the code" in the AdSense dashboard to trigger the site review. Once approved, create ad units in AdSense and pass their slot IDs as `slotId` props to `<AdSlot>` to activate manual placements.

**Build result:** 324 static pages, exit 0.

---

### Commit 14: Snap Animations + Play Next Flow (Engagement Plan Phase 1B + 4D)

**Engagement Plan Phase 1B — `snap-animation`:**

- **`src/engine/AnimationManager.ts`** (new) — Manages two animation systems: lerp-based snap animations (`addSnap()`/`getVisualPos()`) and floating score text (`addFloatingText()`/`getActiveFloats()`). Snap animation: 180ms ease-out-quad from pre-snap position to correct board position. Floating text: 900ms upward drift with alpha fade.
- **`src/engine/InteractionHandler.ts`** — Added `liftedPieceId: number | null` public field (set on pointer-down hit, cleared on pointer-up/cancel). Added `onSnapAnimate` callback type and wiring. In `trySnap()`, captures `fromX/fromY` for all group pieces BEFORE teleporting, then fires `onSnapAnimate` with the delta data — logical positions update immediately (for correct merge detection) while the AnimationManager provides the visual lerp.
- **`src/engine/PuzzleEngine.ts`** — Instantiates `AnimationManager`. Wires `interaction.onSnapAnimate → anim.addSnap()`. In `onPieceSnap` callback: adds floating text at the piece's correct board-center position (`+10` amber or `+N Combo!` gold for consecutive snaps within 5 s). `draw()` updated: each piece checks `anim.getVisualPos(piece.id)` and renders at lerped position when animating; lifted group pieces rendered with `ctx.scale(1.05, 1.05)` + stronger drop shadow. New `drawFloatingTexts()` method renders drifting score labels with inverse-scale font sizing so labels stay a constant ~13–15px on screen regardless of zoom level. `undo()` calls `anim.clear()` to drop stale animations after state restore.

**Engagement Plan Phase 4D — `play-next-flow`:**

- **`src/components/puzzle/CompletionModal.tsx`** — Replaced single `onNewGame` prop with four: `onPlayAgain`, `onNextPuzzle` (nullable), `onRandomPuzzle`, `onTryHarder` (nullable). Stats row expanded from 3 boxes to 4 (Time / Score / Pieces / Moves). Action buttons: 2×2 grid — "↺ Play Again" | "→ Next Puzzle" (or "🎲 Random" when no next) on row 1; "🎲 Random Puzzle" | "↑ Try Harder" (disabled/greyed at 150 pieces) on row 2 — above the existing Share/Copy buttons. Share text now includes the score.
- **`src/components/puzzle/PuzzleCanvas.tsx`** — Imports `puzzles` data and `PIECE_PRESETS`. `handlePlayAgain` (replaces `handleNewGame`). `handleNextPuzzle()` looks up the current puzzle by id, finds the next in the same category (wraps), returns a navigation closure or null for daily/custom puzzles. `handleRandomPuzzle()` picks a random puzzle from the full catalog. `handleTryHarder()` returns a closure that bumps `pieceCount` to the next tier (24→48→96→150) or null at max. All nav uses `window.location.href` for full-page navigations.

**Build result:** 526 static pages, exit 0.

---

## Current State (as of commit 19)

### What works
- Fully playable jigsaw puzzles at 24, 48, 96, and 150 pieces
- Drag-and-drop with snap-to-position and group merging
- Dark canvas background with polished piece rendering
- Daily puzzle with deterministic seed
- **Streak tracking** — `updateStreak()` and `markDailyCompleted()` are called on daily puzzle completion
- Custom puzzle creation from uploaded photos
- **Custom puzzle sharing** — photos upload to Cloudinary, generates a permanent `/play/[publicId]` URL that anyone can open
- **Hint system** — lightbulb button highlights the closest unsnapped piece with a pulsing golden glow + target crosshair; 10 s cooldown with countdown badge
- **Undo system** — ↩ button and Ctrl+Z / Cmd+Z restore last piece position; snapshot-based history (max 50 moves)
- **Scoring system** — +10 per snap, +50 combo bonus for consecutive snaps within 5 s, +5 per group merge; amber star badge appears in controls after first snap; score persists in localStorage with game state
- **Snap animations** — pieces slide (ease-out-quad, 180ms) to correct board position on snap; dragged pieces lift with 1.05× scale + deeper drop shadow; floating amber "+10" / gold "+N Combo!" labels drift upward from each snap point and fade out
- **Play Next flow** — completion modal shows 4-stat row (Time/Score/Pieces/Moves), 2×2 action grid (Play Again / Next Puzzle / Random Puzzle / Try Harder), plus Share/Copy
- Game progress auto-saved to localStorage
- Timer, move counter, progress bar, preview toggle, fullscreen
- Completion modal with star rating and share text
- **103 verified-working puzzles** across 8 categories (animals 17, nature 19, landscapes 9, art 13, food 21, travel 13, holidays 3, abstract 8) — all 103 confirmed HTTP 200 from Unsplash
- **"You Might Also Like"** cross-category section on every puzzle page — 4 puzzles from other categories, deterministically varied; ~2,000 cross-category internal links across the site
- **Blog index page** at `/blog` listing all 5 articles with SEO metadata
- 5 SEO blog post articles
- **`/free-jigsaw-puzzles`** landing page — targets #1 head keyword, 12 featured puzzles, 600+ word SEO content, FAQPage schema
- **`/jigsaw-puzzles-for-adults`** landing page — targets senior/adult demographic keyword, benefits grid, FAQPage schema
- **FAQPage JSON-LD schema** on all 8 category pages — 5 dynamically-tailored Q&As per category
- Full sitemap (526 URLs) at `https://online-jigsaws.com/sitemap.xml`, robots.txt, schema markup
- **Redesigned homepage** — warm cream background, amber/orange palette, image-based category cards, editorial dark stats banner, offset-shadow hero image
- Mobile-responsive layout
- AdSense slot placeholders ready for activation
- **Google Analytics 4** live (Measurement ID `G-PG49JWER6N`) with 5 custom events
- **Canvas pan/zoom** — mouse wheel zoom, pinch-to-zoom on mobile, drag-to-pan on empty canvas, "Reset View" button appears when view is transformed
- **Web Audio sound effects** — pickup pop, snap chime, group-merge resonance, completion arpeggio; mute toggle persisted to localStorage
- **AdSense live** (`ca-pub-5593486984619998`) — publisher script in every page `<head>`; leaderboard on homepage between categories/popular, leaderboard below puzzle canvas, mobile banner in mobile related-puzzles area; site submitted for Google review
- **Social share buttons** — Pinterest, Twitter/X, and Facebook icon buttons on the completion modal; Pinterest pre-populates puzzle thumbnail as pin media; all open in a 600×500 popup with no API keys
- **Confetti on completion** — 120 canvas particles burst upward from puzzle center when the last piece snaps; physics-based (gravity, air friction, rotation, alpha fade ~3 s); renders in screen space
- **Keyboard shortcuts** — H=hint, Space=toggle preview, F=fullscreen, +/=zoom in, −=zoom out, Ctrl/Cmd+Z=undo; suppressed when focus is inside text inputs
- **Progress-saved toast** — "✓ Progress saved — come back anytime!" pill appears on first piece snap, auto-dismisses after 4 s
- **puzzle_abandoned analytics** — GA4 `puzzle_abandoned` event fires on `beforeunload` when user leaves mid-puzzle
- **Edge sort tray** — "Sort Edges" button moves all unsnapped flat-edge pieces into a labeled dashed tray below the board; corners sorted first; fully undoable; tray persists in localStorage
- **Mobile scroll fix** — `touch-action: none` applied via inline JSX style on both the canvas element and its container div, preventing page-scroll from hijacking drag gestures on mobile
- **Mobile canvas size** — canvas container uses `aspect-square` on mobile (375×375px on a 375px phone, +33% height vs before) and `aspect-[4/3]` on sm+ screens

### What does NOT work
- **Email capture**: Form submits to nowhere (no backend integration)
- **Manual ad units**: AdSlot components currently show invisible reserved space until real slot IDs are created in the AdSense dashboard and passed as `slotId` props. Google Auto Ads will serve ads automatically in the meantime.

### Blocked (needs credentials / external action)
- **Email capture** (`fix-email`): Needs ConvertKit or Buttondown API key
- **Manual AdSense ad units**: After site review approval, create ad units in AdSense dashboard → get slot IDs → pass as `slotId` prop to each `<AdSlot>` component

### Pending Plans

Three detailed plan files exist with all pending work:

- `.cursor/plans/10x_engagement_overhaul_93aed70e.plan.md` -- Remaining: game-modes, difficulty-rotation, stats-achievements, settings-panel
- `.cursor/plans/20k_revenue_growth_plan_397f4194.plan.md` -- Remaining: fix-email (blocked), cloudinary-images
- `.cursor/plans/social-share-confetti-polish_06df1b7b.plan.md` -- All todos completed ✓

---

## Environment

- `.env.local` contains: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_ID`, Cloudinary credentials, and other API keys
- Node.js 20+ required (Next.js 16 dependency)
- `nvm use 20` to switch versions if needed

---

## Related Files

- [MISSION.md](MISSION.md) -- Strategic playbook for reaching $20K/mo revenue
