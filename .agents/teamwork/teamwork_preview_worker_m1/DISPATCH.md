## 2026-10-16T10:24:46Z
You are Worker M1 (Visual & Motion Architecture Worker).
Your working directory: c:\Users\DELL\Downloads\aetheria-luxury-ebooks\.agents\teamwork\teamwork_preview_worker_m1
Project root: c:\Users\DELL\Downloads\aetheria-luxury-ebooks
Authoritative request file: c:\Users\DELL\Downloads\aetheria-luxury-ebooks\.agents\teamwork\ORIGINAL_REQUEST.md
Scope document: c:\Users\DELL\Downloads\aetheria-luxury-ebooks\PROJECT.md
Survey analysis: c:\Users\DELL\Downloads\aetheria-luxury-ebooks\.agents\teamwork\teamwork_preview_explorer_survey_1\analysis.md

MANDATORY FIRST STEP: Read c:\Users\DELL\Downloads\aetheria-luxury-ebooks\.agents\teamwork\ORIGINAL_REQUEST.md and c:\Users\DELL\Downloads\aetheria-luxury-ebooks\PROJECT.md before starting work.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

EXCLUSIVE WRITE BOUNDARY:
You own:
- `src/App.jsx`
- `src/components/OpeningIntro.jsx`
- `src/components/BackgroundVideo.jsx`
- `src/pages/HomePage.jsx`
- `package.json` (for installing framer-motion and setting up test script)
- Any new component or CSS for hero/cards/modals motion
You MUST NOT write to: `src/pages/ReaderPage.jsx`, `public/assets/audio/*`, `src/data/*-timing.json`, or `scripts/*`.

TASK DETAILS:
1. Install `framer-motion` cleanly via `npm install framer-motion` (version 14.3.0 is verified compatible with React 19). In `package.json`, also add `"test": "node scripts/e2eRouteValidator.js && node scripts/testSuite.js"`.
2. Configure Apple-style Brand Opening Intro:
   - Mount `OpeningIntro` in `src/App.jsx` so it activates on initial entry.
   - Use `sessionStorage` (`aetheria_intro_shown`) so it shows once per session and never interrupts reader routes (`/read/:bookId`).
   - Ensure the accessible "Skip Intro" button dismisses the intro immediately with a smooth fade-out.
   - Ensure `prefers-reduced-motion` immediately skips or shows minimal static branding.
3. Ambient Background Video:
   - In `src/components/BackgroundVideo.jsx`, update source to local `/assets/videos/ambient-background.mp4`.
   - Mount `<BackgroundVideo />` globally in `src/App.jsx` behind storefront content.
   - Apply editorial scrims and translucent glass styling (`bg-white/92 backdrop-blur-md` in light mode, dark obsidian glass in dark mode) ensuring WCAG AAA text contrast and smooth 60fps scrolling. Hide or dim appropriately on `/read/:bookId`.
4. Framer Motion Micro-Interactions:
   - Enhance `src/pages/HomePage.jsx` hero section with restrained entrance reveals and spring animations.
   - Enhance book cards with hover lift, spring scale, and staggered entry.
   - Enhance category transitions and modal overlays with spring physics.
   - Ensure zero layout shifts and 60fps performance.
5. Run `npm run build` and verify that the production build completes with 0 errors.

OUTPUT:
Write your full implementation report to `c:\Users\DELL\Downloads\aetheria-luxury-ebooks\.agents\teamwork\teamwork_preview_worker_m1\handoff.md`.
Send a message to the orchestrator with your results, build logs, and files modified.
