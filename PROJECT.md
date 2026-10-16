# Project: Aetheria Luxury E-Books Platform Elevation

## Architecture
Aetheria Luxury E-Books is a React 19 + Vite 8 SPA styled with Tailwind CSS, backed by an Express 5 REST API and SQLite database.
- **Visual & Motion Layer**: Global application wrapper in `src/App.jsx` orchestrating the 3-5s Apple-style monogram opening intro (`OpeningIntro.jsx`) with session storage gating, full-bleed ambient luxury background video (`BackgroundVideo.jsx`) with editorial scrims for WCAG AAA contrast, and Framer Motion spring physics across hero sections, book cards, category filters, and modal dialogs.
- **Reading & Audio Layer**: Distraction-free reader (`/read/:bookId`) in `src/pages/ReaderPage.jsx` with chapter pagination, page-flip sound synthesis, and a microsecond-synchronized fluid layout underline glider tracking natural human neural audio narration (`en-US-ChristopherNeural`, `en-US-GuyNeural`, `en-US-JennyNeural`).
- **QA & Testing Layer**: Parallel continuous test auditor running 4 tiers: Static Health & Linter (`oxlint`, `vite build`), Backend Commerce API Suite (`scripts/testSuite.js`), Expanded Route & Media Asset Validation (`scripts/e2eRouteValidator.js`), and Client DOM / Console Error validation across all 15 SPA routes.

## Code Layout
- `src/App.jsx`: Global route definitions (15 SPA routes), root layout, background video, and opening intro mounting.
- `src/components/OpeningIntro.jsx`: Apple-style 4-phase monogram launch sequence with "Skip Intro" and `prefers-reduced-motion` compliance.
- `src/components/BackgroundVideo.jsx`: Full-bleed ambient video player with editorial gradient scrims and 60fps performance optimization.
- `src/components/WordUnderlineGlider.jsx`: Floating layout underline indicator tracking active spoken words with spring physics.
- `src/pages/ReaderPage.jsx`: Multi-chapter reader, typography controls, page auto-advance, sound feedback, and word alignment.
- `src/pages/HomePage.jsx`: Hero presentation, catalogue showcase, animated book cards, and category transitions.
- `src/pages/CatalogPage.jsx`: Filterable catalogue with Framer Motion spring micro-interactions.
- `src/components/CheckoutModal.jsx`: Secure purchasing modal with React Hook order compliance.
- `src/data/booksData.js`: 5 catalogue titles metadata, chapter text content, audio references.
- `src/data/*-timing.json`: Synchronized microsecond word boundary maps for Chapter 01 audiobooks.
- `public/assets/videos/`: Local video assets (`ambient-background.mp4`, `brand-intro.mp4`).
- `public/assets/audio/`: Neural audio narration WAV files for all 5 catalogue titles.
- `scripts/e2eRouteValidator.js`: Expanded end-to-end validator covering 15 routes, static media, timing APIs, and video assets.
- `scripts/testSuite.js`: Backend commerce, HMAC verification, download tokens, and reading progress suite.
- `scripts/continuousQAAuditor.js`: 4-tier automated continuous quality assurance runner.
- `scripts/generateAllAudiobooks.js`: Edge Neural speech synthesizer and microsecond timing map generator.

## Feature Inventory
| # | Feature | Description | Milestone | Source | Status |
|---|---------|-------------|-----------|--------|--------|
| 1 | Framer Motion Integration | Install `framer-motion@14.3.0` and configure spring motion across UI | M1 | Survey 1 | DONE |
| 2 | Brand Opening Intro | 3-5s Apple monogram reveal, Skip Intro button, prefers-reduced-motion, sessionStorage gating | M1 | ORIGINAL_REQUEST R1 | DONE |
| 3 | Ambient Background Video | Full-bleed ambient video (`ambient-background.mp4`) with editorial scrims and WCAG AAA contrast | M1 | ORIGINAL_REQUEST R1 | DONE |
| 4 | Editorial Micro-Interactions | Framer Motion reveals and hover springs on Hero, Book Cards, and Category tabs | M1 | ORIGINAL_REQUEST R2 | DONE |
| 5 | Neural Audio Narration | Upgrade all 5 book Chapter 01 audiobooks to Microsoft Edge Neural voices (Christopher, Guy, Jenny) | M2 | ORIGINAL_REQUEST R3 | DONE |
| 6 | Audio/Reader Desync Fix | Render and index chapter title and subtitle on Page 1 to ensure zero-offset word tracking | M2 | Survey 2 | DONE |
| 7 | Fluid Underline Tracking | Replace stepped background box highlight with smoothly gliding layout underline animation | M2 | ORIGINAL_REQUEST R3 | DONE |
| 8 | Reader Page Flip & Controls | Multi-chapter pagination, Web Audio page flip sound, Ivory/Sepia/Night themes, font scaling | M2 | ORIGINAL_REQUEST R3 | DONE |
| 9 | Reader Linter Fixes | Fix 7 oxlint errors in `src/pages/ReaderPage.jsx` for clean build & lint | M2 | Survey 3 | DONE |
| 10 | Continuous QA Test Suite | Create parallel automated test runner, add `npm test` script, expand `e2eRouteValidator.js` | M3 | ORIGINAL_REQUEST R4 | DONE |
| 11 | 15 SPA Routes & Asset Audit | Automated audit of all 15 routes, covers, video trailers, ambient video, neural audio, and timing APIs | M3 | ORIGINAL_REQUEST R4 | DONE |
| 12 | Zero Console Errors & 60fps | Verify zero console errors, zero layout shifts, and 60fps scroll across all pages | M3 | ORIGINAL_REQUEST R4 | DONE |
| 13 | Forensic Integrity Verification | Binary veto audit ensuring genuine implementation, no dummy facades, no hardcoded overrides | M4 | System Prompt Audit | DONE |
| 14 | Final Production Build Gate | Clean `npm run build` and 100% passing automated test runs | M4 | ORIGINAL_REQUEST Acceptance | DONE |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Visual & Motion Architecture | Framer Motion installation, Opening Intro, Ambient Video with scrims, Card/Hero springs | none | DONE |
| M2 | Audio & Word-Level Synchronization | Edge Neural voice generation, title sync fix, fluid underline glider, ReaderPage oxlint fixes | none | DONE |
| M3 | Continuous QA & E2E Testing Track | Continuous test runner, expanded e2eRouteValidator, 15 routes, zero console errors | none | DONE |
| M4 | Final Integration, Adversarial Hardening & Audit Gate | 100% test pass, challenger stress tests, forensic integrity audit, production build | M1, M2, M3 | DONE |

## Interface Contracts
### Visual & Motion ↔ App Layout
- `OpeningIntro`: Props `{ onComplete: () => void }`. Stored in `sessionStorage.getItem('aetheria_intro_shown')`. Hidden when `isReaderView === true`.
- `BackgroundVideo`: Props `{ src: string, isDark?: boolean }`. Default source `/assets/videos/ambient-background.mp4`. Hidden in reader mode.
- Editorial Scrim: CSS classes `.scrim-editorial-light` (`bg-white/92 backdrop-blur-md`) and `.scrim-editorial-dark` (`bg-[#121214]/90 backdrop-blur-md`) ensuring contrast ratio >= 7:1 against body text.

### Audio Narration ↔ Web Reader Engine
- Audio Format: 24,000 Hz 16-bit Mono RIFF PCM WAV in `/assets/audio/<book-id>-chapter-01.wav` (> 5.3 MB each).
- Timing Map: JSON at `/api/audiobook/<book-id>/chapter-01` returning `{ bookId, chapterId, duration, segments: [{ word, start, end, characterPosition }] }`.
- Word Indexing: Word `0` corresponds to the first spoken word of Chapter 01 (Title word 1). Page 1 renders Title and Subtitle with sequential word indices matching timing segments.
- Underline Glider: Absolutely positioned indicator tracking `[data-word-idx="..."]` DOM bounding rect relative to the reader text container with spring physics and luxury theme glow.

### Testing Track ↔ Application
- Test Runner: `npm test` runs `node scripts/e2eRouteValidator.js && node scripts/testSuite.js`.
- All-in-one continuous auditor: `node scripts/continuousQAAuditor.js` (Tiers 1-4).
- Health check: `http://localhost:5173/` and `http://localhost:3001/`.
- Exit code: 0 for full pass, 1 for any failure.
