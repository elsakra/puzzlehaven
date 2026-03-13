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

## Current State (as of commit 8)

### What works
- Fully playable jigsaw puzzles at 24, 48, 96, and 150 pieces
- Drag-and-drop with snap-to-position and group merging
- Dark canvas background with polished piece rendering
- Daily puzzle with deterministic seed
- **Streak tracking** — `updateStreak()` and `markDailyCompleted()` are called on daily puzzle completion
- Custom puzzle creation from uploaded photos
- Game progress auto-saved to localStorage
- Timer, move counter, progress bar, preview toggle, fullscreen
- Completion modal with star rating and share text
- **500 puzzles** across 8 categories (animals, nature, landscapes, art, food, travel, holidays, abstract)
- **Blog index page** at `/blog` listing all 5 articles with SEO metadata
- 5 SEO blog post articles
- **`/free-jigsaw-puzzles`** landing page — targets #1 head keyword, 12 featured puzzles, 600+ word SEO content, FAQPage schema
- **`/jigsaw-puzzles-for-adults`** landing page — targets senior/adult demographic keyword, benefits grid, FAQPage schema
- **FAQPage JSON-LD schema** on all 8 category pages — 5 dynamically-tailored Q&As per category
- Full sitemap (527 URLs: 500 puzzle pages + 8 categories + 5 blog posts + 2 landing pages + static), robots.txt, schema markup
- Mobile-responsive layout
- AdSense slot placeholders ready for activation

### What does NOT work
- **Email capture**: Form submits to nowhere (no backend integration)
- **Custom puzzle sharing**: Uses `blob:` URLs that break on refresh/share
- **Analytics**: Zero tracking -- no GA4 or any analytics (needs GA4 Measurement ID)
- **No pan/zoom**: 96+ piece puzzles are impractical on mobile
- **No sound**: Completely silent -- no feedback loop
- **No undo/hint**: Players have no recourse when stuck

### Blocked (needs credentials)
- **GA4 analytics** (`add-analytics`): Needs a GA4 Measurement ID (G-XXXXXXXXXX) from Google Analytics console
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
