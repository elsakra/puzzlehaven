# MISSION: Online Jigsaws to $20K/mo

This is the strategic playbook for getting **Online Jigsaws** (online-jigsaws.com) from its current state to $20,000/month in ad revenue. Any agent or developer picking up this project should read this file first.

> **Brand note**: The site was previously named "PuzzleHaven" (puzzlehaven.vercel.app). It has been rebranded to **Online Jigsaws** at **https://online-jigsaws.com**. The GitHub repo remains at `github.com/elsakra/puzzlehaven`. All code now uses `Online Jigsaws` as the brand name.

---

## Origin Story

**Inspiration**: [online-solitaire.com](https://online-solitaire.com/) by Holger Sindbaek earns ~$15K/mo (~$200K/yr) from a simple ad-monetized solitaire game. The model: build a high-quality free browser game targeting an older US demographic, rank for evergreen search terms, and monetize with premium display ads.

**Why jigsaw puzzles were chosen** (over solitaire, sudoku, mahjong, typing tests):

| Factor | Jigsaw Advantage |
|--------|-----------------|
| Competition | Fewer dominant players: thejigsawpuzzles.com ~9M visits, jigsawexplorer.com ~4M, jigidi.com ~2.6M. Compare to solitaire (8+ sites with millions) or sudoku.com (~46M). |
| Demographics | 65+ US women are the core audience. This demo commands $15-30 RPM from advertisers (vs $3-5 for younger/international). |
| Session length | 10-30 minutes per puzzle (vs ~6:32 for sudoku). Longer sessions = more ad impressions per visit. |
| Viral potential | Upload-your-photo creates puzzles to share with family. Daily challenge creates Wordle-style sharing. |
| Validation | Holger Sindbaek himself launched a jigsaw site as his next project after solitaire. |

---

## Revenue Math

The formula: **Monthly Revenue = Pageviews x RPM / 1000**

| RPM Level | Network | Pageviews Needed for $20K/mo |
|-----------|---------|------------------------------|
| $8 | AdSense | 2,500,000 |
| $15 | Ezoic | 1,333,000 |
| $25 | Mediavine | 800,000 |
| $30 | Raptive | 667,000 |

With an average 2.5 pages/session, $20K/mo at Mediavine RPM requires ~320,000 monthly sessions.

**Current state**: ~500+ indexable puzzle pages + blog + category pages, streaks wired, domain live at online-jigsaws.com.

---

## Revenue Milestones

| Milestone | Monthly PVs | RPM | Revenue | What Gets You There |
|-----------|-------------|-----|---------|---------------------|
| Current | ~5K→growing | $8 | ~$40 | 500 puzzles live, domain set, streaks wired |
| +Ezoic, fix UX, landing pages | ~100K | $18 | ~$1,800 | Programmatic SEO scale, mobile pan/zoom |
| +viral loops, push notifs | ~300K | $22 | ~$6,600 | Custom puzzle sharing, email list, social |
| +Mediavine, ad refresh | ~500K | $30 | ~$15,000 | Premium ads, longer sessions, more impressions |
| +content authority, backlinks | ~750K | $28 | ~$21,000 | Blog authority, guest posts, PR mentions |

---

## Phase 1: Fix What's Broken (Days 1-3)

These bugs actively destroy retention and revenue. Fix them first.

### 1.1 Wire streak tracking ✓ DONE

`updateStreak()` and `markDailyCompleted()` are now called in `PuzzleCanvas.tsx` `onComplete` callback when `puzzleId` starts with `daily-`. Streaks are live.

### 1.2 Add Google Analytics 4

Zero visibility into traffic or user behavior. Add GA4 to `src/app/layout.tsx` with custom events: `puzzle_start`, `puzzle_complete`, `piece_count_change`, `daily_completed`, `custom_puzzle_created`. Without analytics, every optimization is a guess.

### 1.3 Wire email capture

`EmailForm.tsx` calls `e.preventDefault()` and does nothing. Integrate a free-tier service (Buttondown or ConvertKit) or a Vercel serverless endpoint. Email is the second-best retention channel after streaks. The 65+ demo has 40-50% email open rates.

### 1.4 Fix custom puzzle sharing

`CreatePuzzle.tsx` generates `blob:` URLs that break on refresh/share. Upload to Cloudinary (credentials already in `.env.local`) and generate permalinks. The share flow in CompletionModal generates URLs that lead nowhere for custom puzzles.

---

## Phase 2: Programmatic SEO Scale (Days 3-7)

Currently 55 puzzles = 55 indexable pages. Competitors have thousands. This is the single biggest traffic lever.

### 2.1 Scale to 500+ puzzle pages ✓ DONE

500 unique puzzle entries live across all 8 categories. Sitemap now covers 500+ indexable URLs.

**File**: `src/data/puzzles.ts` (500 entries ✓)

### 2.2 Blog index page ✓ DONE

`src/app/blog/page.tsx` created — lists all 5 blog posts with SEO metadata, breadcrumbs, and a daily puzzle CTA.

### 2.3 High-intent landing pages

Create dedicated pages targeting head keywords:
- `/free-jigsaw-puzzles` -- targets the #1 head keyword
- `/jigsaw-puzzles-for-adults` -- massive demographic keyword
- Each features a playable puzzle + rich SEO content (500+ words)

### 2.4 FAQ schema markup

Add `FAQPage` schema to category and landing pages. Questions like "How to play jigsaw puzzles online?", "Are online puzzles free?", "What is the best jigsaw puzzle website?" This earns rich results in Google SERPs and dramatically improves CTR.

### 2.5 Internal linking

Every puzzle page should link to 4-6 related puzzles (currently 4). Add cross-category "You might also like" sections. Blog posts should embed playable puzzle components. Breadcrumbs already exist.

---

## Phase 3: Engagement and Session Depth (Days 7-14)

More engagement = more pages/session = more ad impressions per user. Also improves SEO signals.

### 3.1 Canvas pan and zoom (CRITICAL for mobile)

50%+ of traffic will be mobile. Without pinch-to-zoom and drag-to-pan, 96+ piece puzzles are unplayable on phones. Add multi-touch handling to `src/engine/InteractionHandler.ts`. Mouse wheel zoom for desktop.

### 3.2 Sound effects

The game is completely silent. Add Web Audio API synthesized sounds (no external files needed):
- Pickup: soft pop (~100ms sine burst)
- Snap: satisfying click + chime (~200ms)
- Completion: ascending arpeggio (~1s)
- Mute toggle persisted to localStorage

Create `src/engine/SoundManager.ts`.

### 3.3 Hint system

Find the unsnapped piece closest to its correct position, highlight it with a pulsing glow for 3 seconds. 10-second cooldown between hints. Prevents the #1 reason people quit (frustration).

### 3.4 Undo system

Move history stack (max 50), undo method that animates pieces back. Wire to UI button and Ctrl+Z. Low effort, high retention impact.

### 3.5 Scoring system

+10 per snap, +5 per group merge, combo bonus for consecutive snaps within 5 seconds, time bonus at completion. Display in controls bar. Floating "+10" text animation on canvas.

---

## Phase 4: Monetization Optimization (Days 14-21)

### 4.1 Add missing ad placements

Current gaps:
- **Homepage**: Zero ad slots. Add leaderboard between sections.
- **Between puzzle cards**: Inject native ad units every 4th card in grids.
- **Puzzle page**: Add leaderboard above puzzle, rectangle below puzzle, sticky sidebar.
- Target: 3-4 ad impressions per pageview.

**Critical rule**: No ads during active puzzle play. Ads appear around the puzzle, never overlaying it.

### 4.2 Ad network progression

| Phase | Traffic Threshold | Network | Expected RPM |
|-------|-------------------|---------|-------------|
| Now | 0 | Google AdSense | $8-12 |
| 10K sessions | None required | Ezoic | $15-20 |
| 50K sessions | Required | Mediavine | $20-35 |
| 100K pageviews | Required | Raptive (ex-AdThrive) | $25-40+ |

Strategy: Apply to Ezoic immediately (no minimum). Migrate to Mediavine at 50K sessions/month. The RPM difference alone can 2-3x revenue with zero traffic increase.

### 4.3 Ad refresh on long sessions

Jigsaw sessions are 5-30 minutes. Implement viewable ad refresh every 30-60 seconds. Ezoic and Mediavine handle this automatically once integrated. This can 3-5x ad revenue per session vs static ads.

### 4.4 Consent management (GDPR/CCPA)

Required for compliance and ad network approval. Use Quantcast or Cookiebot (free tiers). Without this, ad networks may reject the site or serve lower-paying ads.

---

## Phase 5: Viral and Retention Loops (Days 14-21)

### 5.1 Shareable custom puzzle URLs

Upload to Cloudinary (env vars already configured), generate permalink `/play/[shortId]`. Viral loop: create puzzle -> share link -> friend plays -> friend creates their own.

### 5.2 Social sharing buttons

Add Pinterest, Twitter/X, Facebook share buttons on completion. **Pinterest is critical** -- it's the #1 social platform for the 65+ female demographic. Pre-populate share images with puzzle thumbnails.

### 5.3 Browser push notifications

"Your daily puzzle is ready!" at 9am local time. Push API is free, no backend needed. Expect 5-10% opt-in rate, 30%+ click-through on daily reminders.

### 5.4 "Challenge a friend" mode

Generate a link that starts the same puzzle with the same seed. Compare completion times via URL params. Social competition drives shares.

---

## Phase 6: Technical Performance (Days 21-28)

### 6.1 Migrate images to Cloudinary

Unsplash hotlinking is slow and may violate ToS at scale. Upload curated images to Cloudinary, serve via CDN with automatic WebP/AVIF conversion. Use responsive `srcset` for thumbnails (200px, 400px) and full images (800px, 1200px). Cloudinary credentials are already in `.env.local`.

### 6.2 PWA / Service worker

Cache static assets, puzzle data, and recent images. Enable "Add to Home Screen." PWA users have 2-3x higher retention.

### 6.3 Core Web Vitals

Target: LCP < 2.5s, CLS < 0.1, INP < 200ms. Lazy-load below-fold images and ad slots. Preconnect to image CDN domains. Google rewards good Core Web Vitals with higher rankings.

### 6.4 Custom domain ✓ DONE

Domain `online-jigsaws.com` is configured in Vercel. All code updated to use the new domain.

---

## SEO Keyword Targets

### Head terms (high volume, high competition)
- "jigsaw puzzles"
- "free jigsaw puzzles"
- "online jigsaw puzzles"
- "jigsaw puzzles online free"

### Long-tail (lower volume, lower competition, higher intent)
- "free online jigsaw puzzles for adults"
- "daily jigsaw puzzle"
- "jigsaw puzzle for seniors"
- "animal jigsaw puzzles online"
- "free [category] jigsaw puzzle online" (for each category)

### Informational (blog targets)
- "how to solve jigsaw puzzles faster"
- "benefits of jigsaw puzzles for brain health"
- "best free online jigsaw puzzles 2026"
- "jigsaw puzzles for dementia patients"

---

## Engagement Gap: Us vs. the Competition

| Feature | online-solitaire.com | Online Jigsaws (current) |
|---------|---------------------|----------------------|
| Sound effects | Every action | Silent |
| Undo + Hint | Yes | None |
| Score display | Score + Time + Moves | Timer only |
| Game modes | 6 per game type | 1 mode (random scatter) |
| Settings | Card decks, backgrounds | None |
| Daily challenge | With habit loop | Exists but streaks wired ✓ |
| Animations | Smooth card movement | Pieces teleport on snap |
| Game variations | 320 across types | 500 puzzles, 1 game type |

Closing this gap is what turns one-time visitors into daily users.

---

## Marketing Channels

### Week 1-2 (launch push)
- Reddit: r/JigsawPuzzles, r/puzzles, r/WebGames, r/InternetIsBeautiful
- Product Hunt launch
- Hacker News "Show HN"
- IndieHackers community

### Week 2-4 (community seeding)
- Facebook groups: "Jigsaw Puzzle Lovers" and similar (massive 65+ audience)
- Pinterest: pin every puzzle image with link back
- TikTok/Instagram: satisfying puzzle-solving clips

### Ongoing
- Daily puzzle newsletter (email list)
- Google Discover optimization (high-quality images, engaging titles)
- PWA push notifications for daily puzzle

---

## Key File Paths

| What | Where |
|------|-------|
| Puzzle engine | `src/engine/` (types, PieceGenerator, PieceRenderer, InteractionHandler, PuzzleEngine) |
| React puzzle UI | `src/components/puzzle/` (PuzzleCanvas, PuzzleControls, CompletionModal) |
| Layout components | `src/components/layout/` (Header, Footer, EmailForm, AdSlot) |
| Puzzle data | `src/data/puzzles.ts` (55 entries -- needs 500+) |
| Category data | `src/data/categories.ts` (8 categories) |
| Blog data | `src/data/blog.ts` (5 posts) |
| Daily logic | `src/lib/daily.ts` |
| Streak/storage | `src/lib/storage.ts` (exists but not wired) |
| Homepage | `src/app/page.tsx` |
| Puzzle page | `src/app/puzzles/[category]/[slug]/page.tsx` |
| Daily page | `src/app/daily/page.tsx` |
| Create page | `src/app/create/page.tsx` |
| Root layout | `src/app/layout.tsx` (add GA4 here) |
| Environment | `.env.local` (AdSense ID, Cloudinary creds, site URL) |
| Build log | `BUILD_LOG.md` |
| Engagement plan | `.cursor/plans/10x_engagement_overhaul_93aed70e.plan.md` |
| Revenue plan | `.cursor/plans/20k_revenue_growth_plan_397f4194.plan.md` |

---

## Critical Rules

1. **No ads during active play.** Ads appear around the puzzle area, never overlaying the canvas.
2. **US traffic is the priority.** 65+ US women are worth 5-10x international traffic in RPM.
3. **Mobile-first.** 50%+ of traffic will be mobile. Pan/zoom is mandatory.
4. **Accessibility matters.** Large touch targets (44px minimum), high contrast, readable fonts. The target audience may have vision or motor limitations.
5. **Session depth over bounce rate.** Every feature should either extend sessions or encourage return visits.
6. **Speed is SEO.** Core Web Vitals directly impact rankings. Never sacrifice page load for features.
7. **Content scales linearly.** Every new puzzle page is a new keyword target. 500 pages = 10x the indexable surface area.

---

## Related Files

- [BUILD_LOG.md](BUILD_LOG.md) -- Technical record of everything built so far
