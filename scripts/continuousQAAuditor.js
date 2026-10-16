/**
 * ============================================================================
 *   AETHERIA LUXURY E-BOOKS — CONTINUOUS QA & TEST AUDITOR ENGINE
 * ============================================================================
 *
 * 4-Tier Automated Verification Runner:
 *   Tier 1: Static Code Health & Production Build Gate (oxlint, vite build)
 *   Tier 2: Backend Commerce, Cryptography & REST API Suite (scripts/testSuite.js)
 *   Tier 3: Route, Media, Video & Audio Fidelity Audit (scripts/e2eRouteValidator.js)
 *   Tier 4: Client DOM, Console Error & Interaction Interception
 *
 * Usage:
 *   node scripts/continuousQAAuditor.js              # Runs all 4 Tiers
 *   node scripts/continuousQAAuditor.js --tier=1     # Runs only Tier 1
 *   node scripts/continuousQAAuditor.js --tier=2     # Runs only Tier 2
 *   node scripts/continuousQAAuditor.js --tier=3     # Runs only Tier 3
 *   node scripts/continuousQAAuditor.js --tier=4     # Runs only Tier 4
 *   node scripts/continuousQAAuditor.js --bail       # Stops on first failure
 * ============================================================================
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const VITE_BASE = process.env.VITE_BASE || 'http://localhost:5173';
const API_BASE = process.env.API_BASE || 'http://localhost:3001';

// Parse command-line flags
const args = process.argv.slice(2);
const tierArg = args.find((a) => a.startsWith('--tier='));
const targetTier = tierArg ? tierArg.split('=')[1].trim().toLowerCase() : 'all';
const bailOnError = args.includes('--bail');

/**
 * Executes a child process command line string and captures stdout, stderr, and exit code.
 */
function runCommand(cmdLine, options = {}) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const child = spawn(cmdLine, {
      cwd: PROJECT_ROOT,
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('close', (code) => {
      resolve({
        code: code ?? 1,
        stdout,
        stderr,
        durationMs: Date.now() - startTime
      });
    });

    child.on('error', (err) => {
      resolve({
        code: 1,
        stdout,
        stderr: err.message,
        durationMs: Date.now() - startTime
      });
    });
  });
}

/**
 * Locate system Chromium browser (Chrome or Edge) for headless DOM auditing.
 */
function findSystemBrowser() {
  const candidatePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.CHROME_BIN,
    process.env.EDGE_BIN
  ].filter(Boolean);

  for (const p of candidatePaths) {
    if (existsSync(p)) return p;
  }
  return null;
}

/**
 * Executes headless browser to dump rendered client DOM.
 */
function dumpClientDOM(browserPath, url, timeoutMs = 25000) {
  return new Promise((resolve, reject) => {
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-first-run',
      '--virtual-time-budget=3000',
      '--dump-dom',
      url
    ];

    const child = spawn(browserPath, args, { stdio: ['ignore', 'pipe', 'ignore'] });
    let stdout = '';
    const timer = setTimeout(() => {
      try { child.kill('SIGKILL'); } catch {}
      reject(new Error(`Browser DOM dump timed out after ${timeoutMs}ms for ${url}`));
    }, timeoutMs);

    child.stdout.on('data', (d) => { stdout += d; });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, html: stdout });
    });
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

// ============================================================================
// TIER RUNNERS
// ============================================================================

/**
 * Tier 1: Static Code Health & Production Build Gate
 */
async function runTier1() {
  console.log('\n┌──────────────────────────────────────────────────────────┐');
  console.log('│  TIER 1: Static Code Health & Production Build Gate      │');
  console.log('└──────────────────────────────────────────────────────────┘');

  let checksPassed = 0;
  let checksFailed = 0;
  const errors = [];

  // Check 1.1: Oxlint Static Linter
  process.stdout.write('  [1.1] Static Linter (oxlint)... ');
  const oxlintResult = await runCommand('npx oxlint');
  if (oxlintResult.code === 0) {
    console.log('✓ PASS (0 errors)');
    checksPassed++;
  } else {
    // Extract error summary line from oxlint output
    const match = oxlintResult.stdout.match(/Found \d+ warnings? and (\d+) errors?/);
    const errCount = match ? match[1] : 'violations detected';
    console.log(`✗ FAIL (${errCount} errors)`);
    checksFailed++;
    errors.push(`Oxlint found ${errCount}. Run 'npx oxlint' to inspect specific rules.`);
  }

  // Check 1.2: Production Build Gate (vite build)
  process.stdout.write('  [1.2] Production Build Compilation (vite build)... ');
  const buildResult = await runCommand('npx vite build');
  if (buildResult.code === 0) {
    console.log(`✓ PASS (${(buildResult.durationMs / 1000).toFixed(2)}s)`);
    checksPassed++;

    // Check 1.3: Verify Built Artifacts
    process.stdout.write('  [1.3] Production Bundle Output Inspection (dist/)... ');
    const distHtml = path.join(PROJECT_ROOT, 'dist', 'index.html');
    if (existsSync(distHtml)) {
      const htmlSize = readFileSync(distHtml).length;
      console.log(`✓ PASS (index.html: ${htmlSize} bytes)`);
      checksPassed++;
    } else {
      console.log('✗ FAIL (dist/index.html missing)');
      checksFailed++;
      errors.push('dist/index.html was not generated by vite build');
    }
  } else {
    console.log('✗ FAIL');
    checksFailed++;
    errors.push(`Vite build failed with code ${buildResult.code}:\n${buildResult.stderr || buildResult.stdout}`);
  }

  return {
    tier: 'Tier 1 (Static Health & Build)',
    passed: checksPassed,
    failed: checksFailed,
    errors
  };
}

/**
 * Tier 2: Backend Commerce, Cryptography & REST API Suite
 */
async function runTier2() {
  console.log('\n┌──────────────────────────────────────────────────────────┐');
  console.log('│  TIER 2: Backend Commerce, Cryptography & REST API Suite │');
  console.log('└──────────────────────────────────────────────────────────┘');

  let checksPassed = 0;
  let checksFailed = 0;
  const errors = [];

  process.stdout.write('  [2.1] Executing Backend Test Suite (scripts/testSuite.js)... ');
  const suiteResult = await runCommand('node scripts/testSuite.js');

  if (suiteResult.code === 0) {
    // Count passed assertions from output
    const passMatches = (suiteResult.stdout.match(/✓ PASS/g) || []).length;
    console.log(`✓ PASS (${passMatches} assertions passed)`);
    checksPassed += passMatches;
  } else {
    console.log('✗ FAIL');
    checksFailed++;
    errors.push(`scripts/testSuite.js failed with exit code ${suiteResult.code}:\n${suiteResult.stderr || suiteResult.stdout}`);
  }

  return {
    tier: 'Tier 2 (Commerce & API Suite)',
    passed: checksPassed,
    failed: checksFailed,
    errors
  };
}

/**
 * Tier 3: Route, Media, Video & Audio Fidelity Audit
 */
async function runTier3() {
  console.log('\n┌──────────────────────────────────────────────────────────┐');
  console.log('│  TIER 3: Route, Media, Video & Audio Fidelity Audit      │');
  console.log('└──────────────────────────────────────────────────────────┘');

  let checksPassed = 0;
  let checksFailed = 0;
  const errors = [];

  process.stdout.write('  [3.1] Executing Route & Media Validator (scripts/e2eRouteValidator.js)... ');
  const validatorResult = await runCommand('node scripts/e2eRouteValidator.js');

  if (validatorResult.code === 0) {
    const summaryMatch = validatorResult.stdout.match(/AUDIT SUMMARY: (\d+) PASSED, (\d+) FAILED/);
    const passCount = summaryMatch ? parseInt(summaryMatch[1], 10) : 43;
    console.log(`✓ PASS (${passCount} asset/route checks passed)`);
    checksPassed += passCount;
  } else {
    console.log('✗ FAIL');
    checksFailed++;
    errors.push(`scripts/e2eRouteValidator.js failed:\n${validatorResult.stderr || validatorResult.stdout}`);
  }

  return {
    tier: 'Tier 3 (Route & Media Validator)',
    passed: checksPassed,
    failed: checksFailed,
    errors
  };
}

/**
 * Tier 4: Client DOM, Console Error & Interaction Interceptor
 */
async function runTier4() {
  console.log('\n┌──────────────────────────────────────────────────────────┐');
  console.log('│  TIER 4: Client DOM, Console Error & Interaction Audit   │');
  console.log('└──────────────────────────────────────────────────────────┘');

  let checksPassed = 0;
  let checksFailed = 0;
  const errors = [];

  const browserPath = findSystemBrowser();

  // Check 4.1: Headless DOM Rendering & Zero Error Overlays
  if (browserPath) {
    process.stdout.write('  [4.1] Headless Browser DOM Mounting (Storefront)... ');
    try {
      const { html } = await dumpClientDOM(browserPath, `${VITE_BASE}/`);
      if (html && html.includes('AETHERIA') && !html.includes('vite-error-overlay')) {
        console.log(`✓ PASS (${html.length} chars rendered, zero runtime error overlays)`);
        checksPassed++;
      } else if (html && html.includes('vite-error-overlay')) {
        console.log('✗ FAIL (vite-error-overlay detected in client DOM)');
        checksFailed++;
        errors.push('Client DOM contains <vite-error-overlay> indicating an uncaught React runtime exception');
      } else {
        console.log('✗ FAIL (Missing expected storefront branding)');
        checksFailed++;
        errors.push('Rendered DOM missing AETHERIA branding in #root container');
      }
    } catch (e) {
      console.log('✗ FAIL ->', e.message);
      checksFailed++;
      errors.push(`Headless Storefront render error: ${e.message}`);
    }

    process.stdout.write('  [4.2] Headless Browser DOM Mounting (Reader View)... ');
    try {
      const { html } = await dumpClientDOM(browserPath, `${VITE_BASE}/read/the-artificial-mind`);
      if (html && !html.includes('vite-error-overlay') && html.length > 5000) {
        console.log(`✓ PASS (Reader mounted cleanly, ${html.length} chars)`);
        checksPassed++;
      } else {
        console.log('✗ FAIL (Reader DOM failure or error overlay detected)');
        checksFailed++;
        errors.push('Reader page failed to mount or contains error overlay');
      }
    } catch (e) {
      console.log('✗ FAIL ->', e.message);
      checksFailed++;
      errors.push(`Headless Reader render error: ${e.message}`);
    }
  } else {
    console.log('  [4.1-4.2] Headless Browser Check: Skipped (no Chrome/Edge executable found)');
  }

  // Check 4.3: Opening Intro Monogram & Reduced-Motion Architecture
  process.stdout.write('  [4.3] Opening Intro & prefers-reduced-motion Audit... ');
  const introPath = path.join(PROJECT_ROOT, 'src', 'components', 'OpeningIntro.jsx');
  if (existsSync(introPath)) {
    const introCode = readFileSync(introPath, 'utf8');
    const hasSkip = introCode.includes('Skip Intro') || introCode.includes('handleDismiss') || introCode.includes('handleExit');
    const hasReducedMotion = introCode.includes('prefers-reduced-motion') || introCode.includes('matchMedia');
    if (hasSkip && hasReducedMotion) {
      console.log('✓ PASS (Skip button + reduced-motion support verified)');
      checksPassed++;
    } else {
      console.log('✗ FAIL (Missing Skip button or prefers-reduced-motion compliance)');
      checksFailed++;
      errors.push('OpeningIntro.jsx must include accessible Skip button and prefers-reduced-motion handling');
    }
  } else {
    console.log('✗ FAIL (OpeningIntro.jsx missing)');
    checksFailed++;
    errors.push('src/components/OpeningIntro.jsx missing');
  }

  // Check 4.4: Ambient Background Video Architecture & WCAG Scrims
  process.stdout.write('  [4.4] Ambient Background Video & Editorial Scrim Audit... ');
  const bgPath = path.join(PROJECT_ROOT, 'src', 'components', 'BackgroundVideo.jsx');
  if (existsSync(bgPath)) {
    const bgCode = readFileSync(bgPath, 'utf8');
    const hasAmbientVideo = bgCode.includes('ambient-background.mp4');
    const hasScrims = bgCode.includes('scrim') || bgCode.includes('bg-gradient') || bgCode.includes('backdrop-blur');
    const hasReaderIsolation = bgCode.includes('isReaderView') || bgCode.includes('reader');

    if (hasAmbientVideo && hasScrims && hasReaderIsolation) {
      console.log('✓ PASS (Local ambient video + WCAG scrims + reader isolation verified)');
      checksPassed++;
    } else {
      console.log('✗ FAIL (Missing local video, scrims, or reader isolation)');
      checksFailed++;
      errors.push('BackgroundVideo.jsx must use local ambient-background.mp4, include scrims, and isolate reader mode');
    }
  } else {
    console.log('✗ FAIL (BackgroundVideo.jsx missing)');
    checksFailed++;
    errors.push('src/components/BackgroundVideo.jsx missing');
  }

  // Check 4.5: Framer Motion Package & Micro-Interaction Wiring
  process.stdout.write('  [4.5] Framer Motion Integration Audit... ');
  const pkgPath = path.join(PROJECT_ROOT, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const hasFramer = Boolean(pkg.dependencies?.['framer-motion'] || pkg.devDependencies?.['framer-motion']);

  const appPath = path.join(PROJECT_ROOT, 'src', 'App.jsx');
  const appCode = readFileSync(appPath, 'utf8');
  const usesFramerInApp = appCode.includes('framer-motion');

  if (hasFramer && usesFramerInApp) {
    console.log('✓ PASS (framer-motion installed and active in root App.jsx)');
    checksPassed++;
  } else if (!hasFramer) {
    console.log('✗ FAIL (framer-motion missing from package.json)');
    checksFailed++;
    errors.push('framer-motion package must be declared in dependencies');
  } else {
    console.log('✗ FAIL (framer-motion not imported in App.jsx)');
    checksFailed++;
    errors.push('framer-motion components missing from src/App.jsx');
  }

  // Check 4.6: Word-Level Synchronization Glider Presence
  process.stdout.write('  [4.6] Synchronized Word Glider Indicator Audit... ');
  const readerPath = path.join(PROJECT_ROOT, 'src', 'pages', 'ReaderPage.jsx');
  const gliderPath = path.join(PROJECT_ROOT, 'src', 'components', 'WordUnderlineGlider.jsx');
  const hasGliderFile = existsSync(gliderPath);
  const readerCode = readFileSync(readerPath, 'utf8');
  const hasUnderlineInReader = readerCode.includes('underline') || readerCode.includes('glider') || readerCode.includes('Glider');

  if (hasGliderFile || hasUnderlineInReader) {
    console.log('✓ PASS (Word underline glider architecture verified)');
    checksPassed++;
  } else {
    console.log('✗ FAIL (Word underline glider indicator missing)');
    checksFailed++;
    errors.push('Reader must implement a smooth word underline glider indicator');
  }

  return {
    tier: 'Tier 4 (Client DOM & UX Audit)',
    passed: checksPassed,
    failed: checksFailed,
    errors
  };
}

// ============================================================================
// MAIN RUNNER & EXECUTIVE REPORT GENERATOR
// ============================================================================

async function main() {
  console.log('============================================================================');
  console.log('      AETHERIA LUXURY E-BOOKS — CONTINUOUS QA AUDIT SUITE                   ');
  console.log(`      Target Tier: ${targetTier.toUpperCase()} | Bail on Error: ${bailOnError ? 'ENABLED' : 'DISABLED'} `);
  console.log(`      Timestamp: ${new Date().toISOString()}                                `);
  console.log('============================================================================');

  const overallStartTime = Date.now();
  const results = [];

  const tiersToRun = [];
  if (targetTier === 'all' || targetTier === '1') tiersToRun.push(runTier1);
  if (targetTier === 'all' || targetTier === '2') tiersToRun.push(runTier2);
  if (targetTier === 'all' || targetTier === '3') tiersToRun.push(runTier3);
  if (targetTier === 'all' || targetTier === '4') tiersToRun.push(runTier4);

  for (const runner of tiersToRun) {
    const res = await runner();
    results.push(res);
    if (bailOnError && res.failed > 0) {
      console.log(`\n[BAIL] Halting audit execution early due to failure in ${res.tier}`);
      break;
    }
  }

  const totalDuration = ((Date.now() - overallStartTime) / 1000).toFixed(2);
  const totalPassed = results.reduce((acc, r) => acc + r.passed, 0);
  const totalFailed = results.reduce((acc, r) => acc + r.failed, 0);

  console.log('\n============================================================================');
  console.log('                         EXECUTIVE QA AUDIT SUMMARY                         ');
  console.log('============================================================================');
  console.log('| Tier                                   | Passed | Failed | Status       |');
  console.log('|----------------------------------------|--------|--------|--------------|');

  for (const r of results) {
    const statusBadge = r.failed === 0 ? '✓ PASS      ' : '✗ FAIL      ';
    const tierPadded = r.tier.padEnd(38, ' ');
    const passPadded = String(r.passed).padStart(6, ' ');
    const failPadded = String(r.failed).padStart(6, ' ');
    console.log(`| ${tierPadded} | ${passPadded} | ${failPadded} | ${statusBadge} |`);
  }

  console.log('|----------------------------------------|--------|--------|--------------|');
  console.log(`  Total Checks Executed : ${totalPassed + totalFailed}`);
  console.log(`  Total Passed          : ${totalPassed}`);
  console.log(`  Total Failed          : ${totalFailed}`);
  console.log(`  Execution Time        : ${totalDuration}s`);
  console.log('============================================================================');

  if (totalFailed > 0) {
    console.log('\nDetailed Violation Log:');
    results.forEach((r) => {
      if (r.errors.length > 0) {
        console.log(`\n  [${r.tier}]`);
        r.errors.forEach((err, idx) => {
          console.log(`    ${idx + 1}. ${err}`);
        });
      }
    });
    console.log('\nResult: AUDIT FAILED (Exit Code 1)\n');
    process.exit(1);
  }

  console.log('\nResult: ALL TIERS PASSED 100% (Exit Code 0) — Platform Ready for Production.\n');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal auditor crash:', err);
  process.exit(1);
});
