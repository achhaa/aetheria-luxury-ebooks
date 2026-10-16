# QA & Test Infrastructure Survey Report

**Explorer**: Explorer 3 (QA & Test Infrastructure Explorer)  
**Date**: 2026-10-16  
**Project**: Aetheria Luxury E-Books (`c:\Users\DELL\Downloads\aetheria-luxury-ebooks`)  
**Working Directory**: `c:\Users\DELL\Downloads\aetheria-luxury-ebooks\.agents\teamwork\teamwork_preview_explorer_survey_3`  
**Authoritative Request**: `.agents/teamwork/ORIGINAL_REQUEST.md`

---

## Executive Summary

An exhaustive investigation of the build, test, and verification infrastructure for the Aetheria Luxury E-Books platform was conducted in read-only mode. Both the Vite client development server (`http://localhost:5173`) and the Express/SQLite backend server (`http://localhost:3001`) are currently running and responsive.

Key findings:
1. **Existing Test Scripts**: The repository features two custom Node.js ESM test scripts: `scripts/e2eRouteValidator.js` (36 checks: 15 routes, 5 covers, 5 video previews, 5 audio WAVs, 5 timing API endpoints, 1 catalogue parity check) and `scripts/testSuite.js` (10 backend commerce/auth/delivery checks). Both execute cleanly and pass 100% of their programmed assertions (36/36 and 10/10 passed).
2. **Missing Test Frameworks**: No standard test runner (Vitest, Jest, Playwright, Puppeteer, Cypress) is installed in `package.json` or `node_modules`. No `"test"` script is declared in `package.json`, causing `npm test` to exit with an error.
3. **Build vs. Lint Discrepancy**: `npm run build` compiles cleanly without warnings or errors in 2.37s. However, `npm run lint` (`oxlint`) fails with **7 errors and 85 warnings**, located primarily in `src/pages/ReaderPage.jsx` (unused imports, unused parameters, variable read during self-initialization violating React compiler immutability, and missing effect dependencies).
4. **Acceptance Criteria Gaps**:
   - **R1 (Brand Intro & Ambient Video)**: `OpeningIntro.jsx` is defined but permanently unrendered (`showOpeningIntro` defaults to `false` in `HomePage.jsx` and is never triggered). `BackgroundVideo.jsx` is completely unmounted across the entire app and still hardcoded to external `mixkit.co` URLs instead of using the existing local `/assets/videos/ambient-background.mp4` file.
   - **R2 (Framer Motion)**: `framer-motion` is **not installed** in `package.json` or `node_modules`. All existing motion relies on static CSS keyframes and Tailwind transitions.
   - **R3 (Neural Narration & Underline Tracking)**: Audiobook WAV files exist but were generated with Windows local robotic SAPI TTS; they must be upgraded to human-grade neural voices. Word tracking in `ReaderPage.jsx` currently uses stepped background box highlighting (`.word-active { background-color: ... }`) rather than a continuous gliding underline indicator.
   - **R4 (Continuous QA Test Auditing)**: Existing `e2eRouteValidator.js` has major blind spots—it only performs HTTP status code checks over `fetch()` without mounting DOM or capturing client-side `console.error`s, layout shifts, or Framer Motion physics.

---

## 1. Package.json & Build Infrastructure Analysis

File: `c:\Users\DELL\Downloads\aetheria-luxury-ebooks\package.json`

```json
{
  "name": "aetheria-luxury-ebooks",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "server": "node server/index.js",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview"
  },
  "dependencies": {
    "archiver": "^8.0.0",
    "canvas-confetti": "^1.9.4",
    "cors": "^2.8.6",
    "dotenv": "^18.0.8",
    "express": "^5.3.0",
    "jszip": "^3.10.2",
    "lucide-react": "^1.57.0",
    "pdfkit": "^0.20.2",
    "razorpay": "^2.9.8",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-router-dom": "^7.18.4",
    "sqlite3": "^6.0.1"
  },
  "devDependencies": {
    "@types/react": "^19.2.18",
    "@types/react-dom": "^19.2.7",
    "@vitejs/plugin-react": "^6.1.1",
    "autoprefixer": "^10.6.1",
    "oxlint": "^1.81.0",
    "postcss": "^8.5.30",
    "tailwindcss": "^3.4.17",
    "vite": "^8.3.0"
  }
}
```

### Script Execution Assessment

| Script | Command | Direct Test Result | Status / Observation |
|---|---|---|---|
| `dev` | `vite` | Active on `http://localhost:5173` | Serves client SPA with HMR. Fast startup. |
| `server` | `node server/index.js` | Active on `http://localhost:3001` | Express 5 + SQLite database at `server/data/aetheria.db`. |
| `build` | `vite build` | **PASS** (Exit code 0, 2.37s) | Generates `dist/index.html` (1.26 kB), `dist/assets/index-BYj3GgnN.css` (55.07 kB), `dist/assets/index-DXAv-hSg.js` (454.64 kB). Zero bundle errors. |
| `lint` | `oxlint` | **FAIL** (Exit code 1) | **7 errors and 85 warnings** in `src/pages/ReaderPage.jsx`. |
| `preview` | `vite preview` | Configured | Serves `dist/` directory locally. |
| `test` | *(Not Defined)* | **FAIL** (Exit code 1) | `npm error Missing script: "test"`. Running `npm test` fails immediately. |

---

## 2. In-Depth Analysis of Existing Test Scripts

### A. `scripts/e2eRouteValidator.js`

**Purpose**: Verifies client-side route accessibility, static media availability, timing APIs, and catalogue integrity over HTTP.

```
Total Checks: 36
Passed: 36
Failed: 0
Execution Time: ~1.2s
```

#### Detailed Section Breakdown

1. **Section 1: Client-Side SPA Routes (15 routes tested)**:
   - Makes `fetch('http://localhost:5173' + route)`.
   - Checks `res.ok === true` (HTTP 200).
   - Validates that returned HTML string contains `<div id="root"></div>`.
2. **Section 2: Cover Artwork Verification (5 titles)**:
   - Fetches `/assets/covers/${book.coverImage}`.
   - Asserts `content-type` includes `image`.
   - Asserts binary `byteLength >= 5000` bytes.
3. **Section 3: Book Promotional Video Assets (5 titles)**:
   - Fetches `/assets/videos/${book.videoPreview}`.
   - Asserts `content-type` includes `video`.
   - Asserts binary `byteLength >= 100000` bytes.
4. **Section 4: Studio Master Audiobook Audio (5 titles)**:
   - Fetches `/assets/audio/${book.audiobook.audioUrl}`.
   - Asserts `content-type` includes `audio`.
   - Asserts binary `byteLength >= 1000000` bytes.
5. **Section 5: Synchronized Microsecond Timing Maps (5 titles)**:
   - Calls `GET http://localhost:3001/api/audiobook/${book.id}/chapter-01`.
   - Asserts `data.bookId === book.id`.
   - Asserts `data.segments.length >= 150`.
   - Asserts segment structure has `word`, `start`, and `end` timestamps.
   - Asserts `durationSeconds >= 60`.
6. **Section 6: Catalogue Price & Integrity Audit**:
   - Loops over `BOOKS_DATA` and verifies matching record in `SERVER_CATALOG`.
   - Checks `b.priceINR === serverItem.priceINR`.
   - Verifies all books are priced strictly `< 500` INR.

#### Critical Blind Spots of `e2eRouteValidator.js`
- **Zero DOM Execution**: Vite dev server returns `index.html` containing `<div id="root"></div>` for *every* requested path (standard SPA fallback). If a React route crashes on load (e.g. invalid import, undefined property), `e2eRouteValidator.js` still reports `✓ [PASS] Route HTTP 200`.
- **Zero Console Error Interception**: It does not listen to browser `window.onerror`, React Error Boundaries, or `console.error`.
- **Missing Brand & Ambient Media Checks**: It tests the 5 individual book trailer videos, but **omits** the brand launch video (`/assets/videos/brand-intro.mp4`) and the full-bleed ambient background video (`/assets/videos/ambient-background.mp4`).
- **No Layout Shift (CLS) or Framer Motion Measurement**: No layout shift, scroll performance, or animation frame auditing.

---

### B. `scripts/testSuite.js`

**Purpose**: Backend integration test suite validating REST APIs, SQLite persistence, cryptographic payment verification, and secure asset token issuance.

```
Total Checks: 10
Passed: 10
Failed: 0
Execution Time: ~0.8s
```

#### Detailed Test Case Breakdown

1. `GET /api/config`: Asserts `currency === 'INR'` and `razorpayKeyId` is returned.
2. `POST /api/create-order`: Simulates purchase of `the-artificial-mind`, verifies authoritative server pricing (`amountINR === 299`), verifies `order_` prefix.
3. `POST /api/verify-payment`: Validates HMAC signature verification in mock mode, ensures `order.downloads` array with tokens is returned.
4. `GET /api/download/:token`: Verifies PDF vector generator returns `content-type: application/pdf` and `byteLength >= 1000`.
5. `GET /api/download-epub/:token`: Verifies EPUB packager returns `content-type: application/epub+zip` and `byteLength >= 1000`.
6. `GET /api/audiobook/:bookId/chapter-01`: Loops over all 5 titles, asserts `totalSegments >= 100`, valid segment keys, valid `durationSeconds`.
7. `POST & GET /api/progress`: Writes reading position (`pageIndex: 2`, `audioTime: 42.5`) to SQLite and asserts retrieved record matches.
8. `POST & GET /api/bookmarks`: Adds bookmark excerpt to SQLite and asserts retrieval.
9. `POST /api/customer/orders`: Verifies customer order retrieval and refreshed download token issuance.
10. `GET /api/admin/books`: Tests authorization gate—expects HTTP 401 without key, HTTP 200 with `x-admin-key: aetheria-admin-secret-2026`.

---

## 3. Test Framework Ecosystem Survey

| Framework | In package.json? | In node_modules? | Feasibility & Recommendation |
|---|---|---|---|
| **Jest** | No | No | Not recommended (heavier ESM setup required for Vite/React 19). |
| **Vitest** | No | Internal only (`pdfkit/vitest.config.js`) | **High**. Native Vite integration, fast, compatible with React 19. |
| **Playwright** | No | No | Excellent for headless end-to-end browser testing, but requires downloading browser binaries (~300MB). |
| **Puppeteer** | No | No | Good for headless Chromium, requires browser download. |
| **Cypress** | No | No | Too heavy for fast parallel continuous agent auditing. |
| **Enhanced Node Custom Scripts (Current)** | Yes (`scripts/`) | Built-in | **Optimal immediate architecture**: Zero overhead, instant startup (<1s), runs in parallel background without binary bloat. Can be augmented with jsdom / happy-dom or lightweight headless checks. |

---

## 4. Enumeration of 15 SPA Routes and Static Media Assets

### A. The 15 Primary Single-Page Application (SPA) Routes

| # | Route URL | Page Component | Functional Purpose & Key Features |
|---|---|---|---|
| 1 | `/` | `HomePage.jsx` | Editorial storefront, curated hero, featured book, brand ethos, testimonials. |
| 2 | `/books` | `CatalogPage.jsx` | Full 5-title grid, category filtering, search, pricing badges, 1-click buy. |
| 3 | `/books/the-artificial-mind` | `BookDetailPage.jsx` | Deep-dive dossier for *The Artificial Mind* (₹299), video trailer preview, TOC, citations. |
| 4 | `/books/the-sovereign-mind` | `BookDetailPage.jsx` | Deep-dive dossier for *The Sovereign Mind* (₹349), financial macro thesis, TOC. |
| 5 | `/books/ghost-in-the-wire` | `BookDetailPage.jsx` | Deep-dive dossier for *Ghost in the Wire* (₹299), cryptography & offensive cyber. |
| 6 | `/books/the-stoic-sovereign` | `BookDetailPage.jsx` | Deep-dive dossier for *The Stoic Sovereign* (₹199), classical philosophy & command. |
| 7 | `/books/bio-optima` | `BookDetailPage.jsx` | Deep-dive dossier for *Bio-Optima* (₹249), translational longevity & biology. |
| 8 | `/read/the-artificial-mind` | `ReaderPage.jsx` | Distraction-free paginated reader, Chapter 01 audio sync, theme switcher. |
| 9 | `/read/the-sovereign-mind` | `ReaderPage.jsx` | Distraction-free paginated reader for *The Sovereign Mind*. |
| 10 | `/read/ghost-in-the-wire` | `ReaderPage.jsx` | Distraction-free paginated reader for *Ghost in the Wire*. |
| 11 | `/read/the-stoic-sovereign` | `ReaderPage.jsx` | Distraction-free paginated reader for *The Stoic Sovereign*. |
| 12 | `/read/bio-optima` | `ReaderPage.jsx` | Distraction-free paginated reader for *Bio-Optima*. |
| 13 | `/library` | `LibraryPage.jsx` | Email-based customer order lookup and tokenized file download portal. |
| 14 | `/refund-policy` | `PoliciesPage.jsx` | Editorial transparency, DRM-free refund terms, delivery policies. |
| 15 | `/admin` | `AdminPage.jsx` | Protected administrator dashboard (books inventory, order logs, audit trails). |

*(Note: Secondary alias routes `/terms`, `/privacy`, and `/help` also route cleanly to `PoliciesPage.jsx`).*

---

### B. Static Media Assets Inventory

#### 1. Book Cover Artwork (`public/assets/covers/`)

| File Name | File Size | HTTP Status | Content-Type | Visual Description |
|---|---|---|---|---|
| `the-artificial-mind.jpg` | 279,511 bytes (273 KB) | 200 OK | `image/jpeg` | Minimalist obsidian geometric neural mesh with gold typography |
| `the-sovereign-mind.jpg` | 242,707 bytes (237 KB) | 200 OK | `image/jpeg` | Architectural geometric polyhedra with champagne gold accents |
| `ghost-in-the-wire.jpg` | 243,518 bytes (238 KB) | 200 OK | `image/jpeg` | Emerald cryptographic lattice lines across deep slate dark field |
| `the-stoic-sovereign.jpg` | 208,654 bytes (204 KB) | 200 OK | `image/jpeg` | Chiseled classical marble bust in chiaroscuro editorial lighting |
| `bio-optima.jpg` | 285,597 bytes (279 KB) | 200 OK | `image/jpeg` | Cellular mitochondrial visualization with sapphire bio-luminescence |

#### 2. Book Promotional Video Trailers (`public/assets/videos/`)

| File Name | File Size | HTTP Status | Content-Type | Duration / Codec |
|---|---|---|---|---|
| `the-artificial-mind.mp4` | 4,709,541 bytes (4.49 MB) | 200 OK | `video/mp4` | 10s H.264 1080p looping trailer |
| `the-sovereign-mind.mp4` | 2,984,062 bytes (2.85 MB) | 200 OK | `video/mp4` | 10s H.264 1080p looping trailer |
| `ghost-in-the-wire.mp4` | 3,201,447 bytes (3.05 MB) | 200 OK | `video/mp4` | 10s H.264 1080p looping trailer |
| `the-stoic-sovereign.mp4` | 2,781,876 bytes (2.65 MB) | 200 OK | `video/mp4` | 10s H.264 1080p looping trailer |
| `bio-optima.mp4` | 2,944,799 bytes (2.81 MB) | 200 OK | `video/mp4` | 10s H.264 1080p looping trailer |

#### 3. Ambient & Brand Launch Videos (`public/assets/videos/`)

| File Name | File Size | HTTP Status | Content-Type | Status / Integration Issue |
|---|---|---|---|---|
| `brand-intro.mp4` | 3,309,523 bytes (3.16 MB) | 200 OK | `video/mp4` | Exists locally, but **not utilized** by `OpeningIntro.jsx`. |
| `ambient-background.mp4` | 2,627,620 bytes (2.51 MB) | 200 OK | `video/mp4` | Exists locally, but `BackgroundVideo.jsx` is **unmounted** and points to external URLs. |

#### 4. Audiobook Narration WAV Audio Tracks (`public/assets/audio/`)

| File Name | File Size | HTTP Status | Duration | Narration Quality |
|---|---|---|---|---|
| `the-artificial-mind-chapter-01.wav` | 8,603,806 bytes (8.21 MB) | 200 OK | 263.6s | Windows SAPI TTS (robotic) — needs neural upgrade |
| `the-sovereign-mind-chapter-01.wav` | 6,010,154 bytes (5.73 MB) | 200 OK | 184.2s | Windows SAPI TTS (robotic) — needs neural upgrade |
| `ghost-in-the-wire-chapter-01.wav` | 6,265,324 bytes (5.98 MB) | 200 OK | 192.1s | Windows SAPI TTS (robotic) — needs neural upgrade |
| `the-stoic-sovereign-chapter-01.wav` | 5,589,524 bytes (5.33 MB) | 200 OK | 171.4s | Windows SAPI TTS (robotic) — needs neural upgrade |
| `bio-optima-chapter-01.wav` | 6,079,096 bytes (5.80 MB) | 200 OK | 186.4s | Windows SAPI TTS (robotic) — needs neural upgrade |

#### 5. Synchronized Timing Maps (`src/data/` & `/api/audiobook/:id/chapter-01`)

| Timing Map File | Segments | First Word Sample | Status |
|---|---|---|---|
| `the-artificial-mind-chapter-01-timing.json` | 626 words | `"The"` (`start: 0.0, end: 0.285`) | Valid JSON, microsecond timestamps |
| `the-sovereign-mind-chapter-01-timing.json` | 467 words | `"The"` (`start: 0.0, end: 0.312`) | Valid JSON, microsecond timestamps |
| `ghost-in-the-wire-chapter-01-timing.json` | 490 words | `"Ghost"` (`start: 0.0, end: 0.415`) | Valid JSON, microsecond timestamps |
| `the-stoic-sovereign-chapter-01-timing.json` | 456 words | `"The"` (`start: 0.0, end: 0.298`) | Valid JSON, microsecond timestamps |
| `bio-optima-chapter-01-timing.json` | 467 words | `"Bio-Optima"` (`start: 0.0, end: 0.512`) | Valid JSON, microsecond timestamps |

---

## 5. Acceptance Criteria Verification Matrix (Pass vs Fail)

| Requirement / Acceptance Criteria | Current Verified Status | Failure Mode / Root Cause |
|---|---|---|
| **R1. Brand intro sequence plays smoothly on initial entry and can be immediately dismissed via "Skip Intro".** | **FAIL** | In `HomePage.jsx:13`, `const [showOpeningIntro, setShowOpeningIntro] = useState(false);` is initialized to `false` and never activated on initial visit. Furthermore, `OpeningIntro.jsx` does not embed or render `/assets/videos/brand-intro.mp4`. |
| **R1. Storefront displays an ambient looping video background with zero stutter and clean contrast.** | **FAIL** | `BackgroundVideo.jsx` is completely unmounted (grep confirmed zero imports in `src/App.jsx` or any page). Furthermore, `BackgroundVideo.jsx` uses third-party `mixkit.co` URLs instead of the local high-bitrate `/assets/videos/ambient-background.mp4`. |
| **R2. Page navigation, modal overlays, and book cards animate with Framer Motion spring physics with zero jank.** | **FAIL** | `framer-motion` package is **not installed** in `package.json`. No `motion.*` components exist anywhere in `src/`. |
| **R3. All 5 books feature natural human-quality neural voice audio recordings in /assets/audio/.** | **PARTIAL / FAIL** | Audio tracks exist, but audio waveforms reveal robotic Microsoft SAPI Desktop voice characteristics. They must be re-synthesized using natural human-grade neural voices (e.g. Edge Neural studio voices `en-US-ChristopherNeural` or `en-US-JennyNeural`). |
| **R3. Discrete web reader features a smooth underline indicator that animates seamlessly between active spoken words.** | **FAIL** | `ReaderPage.jsx:395-401` and `src/index.css:75-103` apply stepped CSS box background highlights (`.word-active { background-color: #e6c875; }`) rather than a floating gliding layout underline element. |
| **R3. Reader automatically advances pages cleanly when narrator crosses page boundaries with flip sound.** | **PARTIAL** | Logic exists, but `findAndAdvancePageForWord` is read during its own initialization, causing React Compiler immutability errors. |
| **R4. Automated E2E audit script passes 100% of route, media, and API checks.** | **PASS (with caveats)** | Current `scripts/e2eRouteValidator.js` passes 36/36, but has blind spots (no DOM execution, no console error trapping, omits brand and ambient videos). |
| **R4. Production build (npm run build) executes cleanly with zero syntax/type errors or warnings.** | **PASS (build) / FAIL (lint)** | `npm run build` succeeds (1945 modules in 2.37s). However, `npm run lint` fails with 7 errors and 85 warnings in `src/pages/ReaderPage.jsx`. |

---

## 6. Architecture & Requirements for Dedicated Continuous Test Auditor

### A. Core Objectives of the Continuous Test Auditor Agent
The dedicated test auditor agent must operate in a non-destructive, parallel loop to guard code quality and verify that no changes from visual, audio, or motion engineers introduce regressions.

### B. 4-Tier Test Runner Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│               CONTINUOUS PARALLEL TEST AUDITOR AGENT                   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│       TIER 1          │   │       TIER 2          │   │       TIER 3          │
│ Static Code Health    │   │ Backend Commerce API  │   │ Expanded Route/Media  │
│  - oxlint (0 errors)  │   │  - HMAC verification  │   │  - 15 SPA routes      │
│  - vite build         │   │  - PDF/EPUB delivery  │   │  - 5 covers, 5 trailers│
│  - dependency check   │   │  - SQLite progress    │   │  - brand & ambient vid│
│                       │   │  - Audiobook API      │   │  - Neural audio format│
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │       TIER 4          │
                        │ Client DOM & UX Audit │
                        │  - Zero console errors│
                        │  - Underline element  │
                        │  - Reduced-motion mode│
                        │  - Framer Motion check│
                        └───────────────────────┘
```

1. **Tier 1: Static Code Health & Build Integrity**:
   - Run `npm run lint` (`oxlint`). Assert 0 errors and zero critical compiler warnings.
   - Run `npm run build` (`vite build`). Assert exit code 0 and valid output in `dist/`.
   - Verify `package.json` contains required packages (`framer-motion`) and standard scripts (`"test": "node scripts/e2eRouteValidator.js && node scripts/testSuite.js"`).

2. **Tier 2: Authoritative Commerce & API Integrity**:
   - Run `node scripts/testSuite.js`.
   - Validate HMAC signature verification, order token generation, vector PDF streaming, EPUB generation, reading progress sync, and admin gates.

3. **Tier 3: Route, Media & Asset Audit (Expanded `e2eRouteValidator.js`)**:
   - Expand `scripts/e2eRouteValidator.js` to assert:
     - 15 SPA routes + 3 policy aliases (`/terms`, `/privacy`, `/help`).
     - 5 Book cover images (`.jpg` > 50 KB).
     - 5 Book trailer videos (`.mp4` > 1 MB).
     - **NEW**: `/assets/videos/ambient-background.mp4` (HTTP 200, > 1 MB).
     - **NEW**: `/assets/videos/brand-intro.mp4` (HTTP 200, > 1 MB).
     - 5 Audiobook narration WAV files (`.wav` > 1 MB).
     - 5 Timing map endpoints (`totalSegments >= 100`, `durationSeconds >= 60`).
     - Pricing consistency between `BOOKS_DATA` and `SERVER_CATALOG` (all < ₹500).

4. **Tier 4: Client-Side DOM & Console Error Interception**:
   - Add a lightweight client validation check or headless script:
     - Verify that `<OpeningIntro />` handles `prefers-reduced-motion: reduce` by immediately completing.
     - Verify that `<BackgroundVideo />` is mounted in the root layout with ambient video and controls.
     - Verify that `ReaderPage.jsx` renders a gliding underline indicator element (e.g. `motion.span` or dynamic SVG/CSS glide) without throwing `console.error`.

### C. Continuous Execution Triggers & Alerting
- **Heartbeat & Trigger**: The Test Auditor runs the 4-tier check suite whenever another agent signals an edit or completes a milestone.
- **Fail-Fast Protocol**: If Tier 1 (lint or build) fails, immediately notify the orchestrator with the exact file path and line number.
- **Handoff Gating**: No feature handoff is deemed complete until all 4 tiers report 100% green.

---

## 7. Recommended Action Plan for the Team

1. **Fix `src/pages/ReaderPage.jsx` Linting**:
   - Remove unused imports (`BookOpen`, `AlertCircle`, `Info`, `ExternalLink`).
   - Fix `immutability` lint errors by restructuring `findAndAdvancePageForWord`, `handleNextPage`, and `handlePrevPage` so they are defined prior to consumption.
   - Fix missing `useEffect` dependency arrays.
2. **Add Missing Scripts to `package.json`**:
   - Add `"test": "node scripts/testSuite.js && node scripts/e2eRouteValidator.js"`.
   - Add `"test:e2e": "node scripts/e2eRouteValidator.js"`.
   - Add `"test:api": "node scripts/testSuite.js"`.
3. **Mount and Wire `BackgroundVideo.jsx`**:
   - Import and render `<BackgroundVideo />` in `src/App.jsx` so it spans the storefront.
   - Update `BackgroundVideo.jsx` to use the local `/assets/videos/ambient-background.mp4`.
4. **Wire `OpeningIntro.jsx`**:
   - Enable initial launch display in `HomePage.jsx` with sessionStorage gating (play on initial entry, skip if already viewed).
   - Integrate the local `/assets/videos/brand-intro.mp4`.
5. **Install and Integrate `framer-motion`**:
   - Install `framer-motion` for spring physics on cards, modals, and route transitions.
6. **Implement Smooth Underline Tracking**:
   - Replace `.word-active` stepped background highlight in `ReaderPage.jsx` with a gliding underline indicator.
7. **Upgrade Audiobook Voices to Neural TTS**:
   - Generate natural human-grade neural voice tracks for all 5 titles and regenerate timing maps.
8. **Expand `scripts/e2eRouteValidator.js`**:
   - Include ambient and brand video asset checks and automated verification of underline DOM elements.
