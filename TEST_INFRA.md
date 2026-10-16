# Aetheria Luxury E-Books — Continuous QA & Test Infrastructure

## Overview

The Aetheria Luxury E-Books platform employs an automated **4-Tier Continuous Quality Assurance & Test Audit Architecture**. This framework provides deterministic, regression-free verification of static code health, cryptographic commerce pipelines, static media integrity (video, audio, artwork), SPA route resolution, and client-side DOM/console error safety.

---

## 4-Tier Testing Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│               CONTINUOUS PARALLEL TEST AUDITOR ENGINE                  │
│                   (scripts/continuousQAAuditor.js)                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌───────────────────────┐   ┌───────────────────────┐   ┌───────────────────────┐
│       TIER 1          │   │       TIER 2          │   │       TIER 3          │
│ Static Code Health    │   │ Backend Commerce API  │   │ Expanded Route/Media  │
│  - oxlint (0 errors)  │   │  - HMAC verification  │   │  - 15 SPA routes      │
│  - vite build         │   │  - PDF/EPUB delivery  │   │  - 5 covers, 5 trailers│
│  - bundle metrics     │   │  - SQLite progress    │   │  - brand & ambient vid│
│                       │   │  - Audiobook API      │   │  - Neural audio format│
└───────────────────────┘   └───────────────────────┘   └───────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────────┐
                        │       TIER 4          │
                        │ Client DOM & UX Audit │
                        │  - Zero console errors│
                        │  - Word glider check  │
                        │  - Reduced-motion mode│
                        │  - Layout shift guard │
                        └───────────────────────┘
```

---

### Tier 1: Static Code Health & Production Build Gate
- **Purpose**: Verify that TypeScript/JavaScript syntax, ESLint/Oxlint rules, React compiler rules, and bundler compilation succeed with zero syntax or bundling errors.
- **Tools**:
  - `npx oxlint`: High-performance static linter asserting 0 errors. Checks for unused imports, variable capture during initialization, and React hook dependencies.
  - `npx vite build`: Production asset pipeline compilation verifying Rollup/Vite module resolution, tree-shaking, CSS post-processing, and production bundle generation in `dist/`.
- **Target Metrics**:
  - Oxlint Errors: `0`
  - Vite Build Exit Code: `0`
  - Production Bundle: `dist/index.html`, `dist/assets/*.css`, `dist/assets/*.js`

---

### Tier 2: Backend Commerce, Cryptography & REST API Suite
- **Script**: `scripts/testSuite.js`
- **Target Server**: Express 5 on `http://localhost:3001`
- **Scope of Checks**:
  1. **Public Server Configuration** (`GET /api/config`): Verifies currency (`INR`) and Razorpay key presence.
  2. **Authoritative Order Creation** (`POST /api/create-order`): Asserts server-enforced pricing (e.g. ₹299 for *The Artificial Mind*) and `order_` prefix format.
  3. **Cryptographic Payment Verification** (`POST /api/verify-payment`): Verifies HMAC SHA-256 signature validation and secure download token issuance.
  4. **Personalized PDF Master Delivery** (`GET /api/download/:token`): Validates dynamic vector PDF generation (`application/pdf`, byteLength > 1,000 bytes).
  5. **Reflowable EPUB Master Delivery** (`GET /api/download-epub/:token`): Validates DRM-free EPUB packaging (`application/epub+zip`, byteLength > 1,000 bytes).
  6. **Audiobook Timing API for All 5 Books** (`GET /api/audiobook/:bookId/chapter-01`): Asserts `totalSegments >= 100`, valid segment keys (`word`, `start`, `end`), and valid `durationSeconds`.
  7. **Reading Progress Persistence** (`POST & GET /api/progress`): Verifies SQLite reading position synchronization (chapter, page, audio timestamp).
  8. **Bookmark Management** (`POST & GET /api/bookmarks`): Verifies excerpt creation, SQLite storage, and retrieval.
  9. **Customer Library Retrieval** (`POST /api/customer/orders`): Verifies order history retrieval by verified customer email and active token regeneration.
  10. **Admin Authorization Gate** (`GET /api/admin/books`): Asserts HTTP 401 Unauthorized without header, and HTTP 200 with valid `x-admin-key`.

---

### Tier 3: Expanded Route, Media & Audio Asset Validator
- **Script**: `scripts/e2eRouteValidator.js`
- **Target Servers**: Vite Client on `http://localhost:5173`, Express API on `http://localhost:3001`
- **Scope of Checks**:
  1. **15 Primary SPA Routes**:
     - Storefront & Catalogue: `/`, `/books`
     - Book Dossier Pages (5 titles):
       - `/books/the-artificial-mind`
       - `/books/the-sovereign-mind`
       - `/books/ghost-in-the-wire`
       - `/books/the-stoic-sovereign`
       - `/books/bio-optima`
     - Distraction-Free Web Readers (5 titles):
       - `/read/the-artificial-mind`
       - `/read/the-sovereign-mind`
       - `/read/ghost-in-the-wire`
       - `/read/the-stoic-sovereign`
       - `/read/bio-optima`
     - Supporting & Administrative: `/library`, `/refund-policy`, `/admin`
     - *Assertion*: HTTP 200 OK, Content-Type contains `text/html`, and HTML body contains the `<div id="root"></div>` mounting point.
  2. **5 Cover Artwork Images** (`/assets/covers/*.jpg`):
     - HTTP 200 OK, Content-Type contains `image`, binary size > 5,000 bytes (> 5 KB).
  3. **5 Book Promotional Video Trailers** (`/assets/videos/*.mp4`):
     - HTTP 200 OK, Content-Type contains `video`, binary size > 100,000 bytes (> 100 KB).
  4. **Ambient Background Video** (`/assets/videos/ambient-background.mp4`):
     - HTTP 200 OK, Content-Type contains `video`, binary size > 100,000 bytes (> 100 KB).
  5. **Brand Intro Opening Video** (`/assets/videos/brand-intro.mp4`):
     - HTTP 200 OK, Content-Type contains `video`, binary size > 100,000 bytes (> 100 KB).
  6. **5 Studio Audiobook WAV Narration Tracks** (`/assets/audio/*-chapter-01.wav`):
     - HTTP 200 OK, Content-Type contains `audio`.
     - Binary size > 1,000,000 bytes (> 1 MB).
     - Valid RIFF WAVE header structure (`RIFF` marker at offset 0, `WAVE` marker at offset 8, and valid `fmt ` subchunk).
     - Sample Rate >= 22,050 Hz (typically 22,050 Hz or 24,000 Hz Edge Neural PCM).
  7. **5 Microsecond Word-Level Timing Maps** (`/api/audiobook/:bookId/chapter-01`):
     - HTTP 200 OK, matching `bookId`.
     - Segment count >= 150 words.
     - Timestamp monotonicity: `start <= end` and `end >= 0`.
     - Duration >= 60 seconds.
  8. **Catalogue Parity & Pricing Constraint Audit**:
     - Parity check between frontend `BOOKS_DATA` and backend `SERVER_CATALOG`.
     - Exact price matching across both registries.
     - Price constraint check: All books priced strictly under ₹500 INR.

---

### Tier 4: Client DOM, Console Error & Interaction Interceptor
- **Script**: Integrated in `scripts/continuousQAAuditor.js` & `scripts/e2eRouteValidator.js`
- **Scope of Checks**:
  1. **Client DOM Root Mounting**:
     - Headless browser validation verifying that React 19 mounts into `#root` without throwing unhandled exceptions.
  2. **Zero Console Error Invariant**:
     - Interception of `console.error`, `console.warn` (critical), and unhandled window error events.
  3. **Word Underline Glider Verification**:
     - Reader DOM inspection verifying that word elements feature `data-word-idx` attributes and an active underline indicator / glider layout element is present during audio playback.
  4. **Reduced-Motion Preference Compliance**:
     - Verification that media query `@media (prefers-reduced-motion: reduce)` is respected by the opening intro and animations, providing immediate dismissal or transition bypass.
  5. **Zero Cumulative Layout Shift (CLS)**:
     - Ensures typography controls and reading containers do not produce unconstrained layout shifts.

---

## Execution Guide

### Running the Full All-in-One QA Auditor
```bash
node scripts/continuousQAAuditor.js
```

### Running Specific Tiers
```bash
# Tier 1 only (Lint & Build)
node scripts/continuousQAAuditor.js --tier=1

# Tier 2 only (Backend Commerce API Suite)
node scripts/continuousQAAuditor.js --tier=2

# Tier 3 only (Route & Media Asset Validator)
node scripts/continuousQAAuditor.js --tier=3

# Tier 4 only (Client DOM & Console Error Interceptor)
node scripts/continuousQAAuditor.js --tier=4
```

### Running Direct Test Scripts
```bash
# Backend Commerce Suite
node scripts/testSuite.js

# Route & Media Asset Validator
node scripts/e2eRouteValidator.js
```

---

## Exit Codes & CI/CD Gating
- `0`: All assertions passed across all active tiers. Production ready.
- `1`: One or more assertions failed. Details logged with file path, line number, and error payload.
