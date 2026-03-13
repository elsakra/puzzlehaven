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

## Current State (as of commit 12)

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
- Game progress auto-saved to localStorage
- Timer, move counter, progress bar, preview toggle, fullscreen
- Completion modal with star rating and share text
- **500 puzzles** across 8 categories (animals, nature, landscapes, art, food, travel, holidays, abstract)
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

### What does NOT work
- **Email capture**: Form submits to nowhere (no backend integration)

### Blocked (needs credentials)
- **Email capture** (`fix-email`): Needs ConvertKit or Buttondown API key

### Pending Plans

Two detailed plan files exist with all pending work:

- `.cursor/plans/10x_engagement_overhaul_93aed70e.plan.md` -- Sound, animation, scoring, undo, hints, pan/zoom, game modes, streaks, achievements, settings
- `.cursor/plans/20k_revenue_growth_plan_397f4194.plan.md` -- SEO landing pages, ad optimization, viral loops, Cloudinary migration, GA4, email capture, custom puzzle sharing

---

## Environment

- `.env.local` contains: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_ID`, Cloudinary credentials, and other API keys
- Node.js 20+ required (Next.js 16 dependency)
- `nvm use 20` to switch versions if needed

---

## Related Files

- [MISSION.md](MISSION.md) -- Strategic playbook for reaching $20K/mo revenue
