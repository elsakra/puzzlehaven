# PuzzleHaven -- Build Log

Everything that was built, in what order, and what bugs were fixed.

---

## Project Overview

**PuzzleHaven** is a free online jigsaw puzzle website monetized through display ads, targeting the 65+ female US demographic ($15-30 RPM). Modeled after [online-solitaire.com](https://online-solitaire.com/) which earns ~$15K/mo from a simple ad-supported web game.

- **Live URL**: https://puzzlehaven.vercel.app
- **Repository**: https://github.com/elsakra/puzzlehaven
- **Deployment**: Vercel (auto-deploys on push to `master`)

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
│   ├── puzzles.ts          # 55 curated puzzles across 8 categories
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

---

## Current State (as of commit `bc8293d`)

### What works
- Fully playable jigsaw puzzles at 24, 48, 96, and 150 pieces
- Drag-and-drop with snap-to-position and group merging
- Dark canvas background with polished piece rendering
- Daily puzzle with deterministic seed
- Custom puzzle creation from uploaded photos
- Game progress auto-saved to localStorage
- Timer, move counter, progress bar, preview toggle, fullscreen
- Completion modal with star rating and share text
- 55 puzzles across 8 categories
- 5 SEO blog posts
- Full sitemap, robots.txt, schema markup
- Mobile-responsive layout
- AdSense slot placeholders ready for activation

### What does NOT work
- **Streaks**: `updateStreak()` and `markDailyCompleted()` exist in `storage.ts` but are never called
- **Email capture**: Form submits to nowhere (no backend integration)
- **Custom puzzle sharing**: Uses `blob:` URLs that break on refresh/share
- **Analytics**: Zero tracking -- no GA4 or any analytics
- **No pan/zoom**: 96+ piece puzzles are impractical on mobile
- **No sound**: Completely silent -- no feedback loop
- **No undo/hint**: Players have no recourse when stuck

### Pending Plans

Two detailed plan files exist with all pending work:

- `.cursor/plans/10x_engagement_overhaul_93aed70e.plan.md` -- Sound, animation, scoring, undo, hints, pan/zoom, game modes, streaks, achievements, settings
- `.cursor/plans/20k_revenue_growth_plan_397f4194.plan.md` -- Fix bugs, scale to 500+ puzzles, SEO landing pages, ad optimization, viral loops, Cloudinary migration, custom domain

---

## Environment

- `.env.local` contains: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_ADSENSE_ID`, Cloudinary credentials, and other API keys
- Node.js 20+ required (Next.js 16 dependency)
- `nvm use 20` to switch versions if needed

---

## Related Files

- [MISSION.md](MISSION.md) -- Strategic playbook for reaching $20K/mo revenue
