import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { BOOKS_DATA } from '../src/data/booksData.js';
import { SERVER_CATALOG } from '../server/catalog.js';

const VITE_BASE = 'http://localhost:5173';
const API_BASE = 'http://localhost:3001';

/**
 * Robust binary parser for RIFF WAVE audio container headers.
 * Extracts format, channel count, sample rate, and bit depth.
 */
function parseWavHeader(buffer) {
  if (buffer.length < 44) {
    throw new Error(`WAV file truncated: only ${buffer.length} bytes`);
  }

  const riffMarker = buffer.toString('ascii', 0, 4);
  if (riffMarker !== 'RIFF') {
    throw new Error(`Invalid RIFF header marker: expected "RIFF", found "${riffMarker}"`);
  }

  const waveMarker = buffer.toString('ascii', 8, 12);
  if (waveMarker !== 'WAVE') {
    throw new Error(`Invalid WAVE header marker: expected "WAVE", found "${waveMarker}"`);
  }

  // Scan for the 'fmt ' subchunk
  let fmtOffset = -1;
  const searchLimit = Math.min(buffer.length - 8, 2048);
  for (let i = 12; i < searchLimit; i++) {
    if (buffer.toString('ascii', i, i + 4) === 'fmt ') {
      fmtOffset = i;
      break;
    }
  }

  if (fmtOffset === -1) {
    throw new Error('Malformed WAV file: "fmt " subchunk not found within initial 2KB');
  }

  const audioFormat = buffer.readUInt16LE(fmtOffset + 8);
  const numChannels = buffer.readUInt16LE(fmtOffset + 10);
  const sampleRate = buffer.readUInt32LE(fmtOffset + 12);
  const byteRate = buffer.readUInt32LE(fmtOffset + 16);
  const blockAlign = buffer.readUInt16LE(fmtOffset + 20);
  const bitsPerSample = buffer.readUInt16LE(fmtOffset + 22);

  return {
    audioFormat,
    numChannels,
    sampleRate,
    byteRate,
    blockAlign,
    bitsPerSample
  };
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
 * Execute headless browser to dump rendered client DOM.
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

export async function runValidation() {
  console.log('===========================================================');
  console.log('   AETHERIA FULL PLATFORM END-TO-END VALIDATION AUDIT      ');
  console.log('===========================================================\n');

  let passed = 0;
  let failed = 0;
  const failureDetails = [];

  async function check(desc, fn) {
    try {
      await fn();
      console.log(`  ✓ [PASS] ${desc}`);
      passed++;
    } catch (e) {
      console.error(`  ✗ [FAIL] ${desc} ->`, e.message);
      failed++;
      failureDetails.push({ test: desc, error: e.message });
    }
  }

  // 1. Frontend Route Accessibility (All 15 SPA Routes + Aliases)
  console.log('--- 1. Client-Side SPA Routes (Vite Dev Server) ---');
  const routes = [
    // Core Storefront & Catalog
    '/',
    '/books',
    // 5 Book Dossier Pages
    '/books/the-artificial-mind',
    '/books/the-sovereign-mind',
    '/books/ghost-in-the-wire',
    '/books/the-stoic-sovereign',
    '/books/bio-optima',
    // 5 Distraction-Free Reader Pages
    '/read/the-artificial-mind',
    '/read/the-sovereign-mind',
    '/read/ghost-in-the-wire',
    '/read/the-stoic-sovereign',
    '/read/bio-optima',
    // Customer Library, Policies, Administration
    '/library',
    '/refund-policy',
    '/admin',
    // Supporting Policy Aliases
    '/terms',
    '/privacy',
    '/help'
  ];

  for (const r of routes) {
    await check(`Route HTTP 200: ${r}`, async () => {
      const res = await fetch(`${VITE_BASE}${r}`);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('text/html')) throw new Error(`Expected text/html content-type, got ${ct}`);
      const html = await res.text();
      if (!html.includes('<div id="root"></div>')) throw new Error('Missing #root container in HTML');
    });
  }

  // 2. Verified Local Artwork Assets (Covers)
  console.log('\n--- 2. Book Cover Artwork Verification ---');
  for (const book of BOOKS_DATA) {
    await check(`Cover Artwork: ${book.title} (${book.coverImage})`, async () => {
      const res = await fetch(`${VITE_BASE}${book.coverImage}`);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const ct = res.headers.get('content-type');
      if (!ct || !ct.includes('image')) throw new Error(`Expected image content-type, got ${ct}`);
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 5000) throw new Error(`Cover image unexpectedly small: ${buf.byteLength} bytes`);
    });
  }

  // 3. Book Promotional Video Assets (5 Trailers)
  console.log('\n--- 3. Inline Promotional Video Previews ---');
  for (const book of BOOKS_DATA) {
    await check(`Video Preview: ${book.title} (${book.videoPreview})`, async () => {
      const res = await fetch(`${VITE_BASE}${book.videoPreview}`);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const ct = res.headers.get('content-type');
      if (!ct || !ct.includes('video')) throw new Error(`Expected video content-type, got ${ct}`);
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 100000) throw new Error(`Video file too small: ${buf.byteLength} bytes`);
    });
  }

  // 4. Ambient & Brand Launch Video Assets
  console.log('\n--- 4. Brand Launch & Ambient Background Videos ---');
  await check('Ambient Background Video: /assets/videos/ambient-background.mp4', async () => {
    const res = await fetch(`${VITE_BASE}/assets/videos/ambient-background.mp4`);
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const ct = res.headers.get('content-type');
    if (!ct || !ct.includes('video')) throw new Error(`Expected video content-type, got ${ct}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 100000) throw new Error(`Ambient video too small: ${buf.byteLength} bytes`);
  });

  await check('Brand Intro Opening Video: /assets/videos/brand-intro.mp4', async () => {
    const res = await fetch(`${VITE_BASE}/assets/videos/brand-intro.mp4`);
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const ct = res.headers.get('content-type');
    if (!ct || !ct.includes('video')) throw new Error(`Expected video content-type, got ${ct}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 100000) throw new Error(`Brand intro video too small: ${buf.byteLength} bytes`);
  });

  // 5. Studio Audiobook WAV Narration Tracks & Header Structure
  console.log('\n--- 5. Studio Master Audiobook Audio (WAV & Sample Rate) ---');
  for (const book of BOOKS_DATA) {
    await check(`Audiobook WAV Header & Fidelity: ${book.title} (${book.audiobook.audioUrl})`, async () => {
      const res = await fetch(`${VITE_BASE}${book.audiobook.audioUrl}`);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const ct = res.headers.get('content-type');
      if (!ct || !ct.includes('audio')) throw new Error(`Expected audio content-type, got ${ct}`);

      const rawBuffer = Buffer.from(await res.arrayBuffer());
      if (rawBuffer.byteLength < 1000000) {
        throw new Error(`Audio file unexpectedly small: ${rawBuffer.byteLength} bytes (expected > 1MB)`);
      }

      // Parse RIFF WAVE container
      const header = parseWavHeader(rawBuffer);
      if (header.sampleRate < 22050) {
        throw new Error(
          `Sample rate ${header.sampleRate} Hz is below mandatory 22,050 Hz threshold`
        );
      }
      if (header.numChannels < 1) {
        throw new Error(`Invalid channel count: ${header.numChannels}`);
      }
    });
  }

  // 6. Synchronized Word-Level Timing Maps
  console.log('\n--- 6. Synchronized Microsecond Timing Maps (API) ---');
  for (const book of BOOKS_DATA) {
    await check(`Word Timing Map: ${book.title} (/api/audiobook/${book.id}/chapter-01)`, async () => {
      const res = await fetch(`${API_BASE}/api/audiobook/${book.id}/chapter-01`);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const data = await res.json();
      if (data.bookId !== book.id) {
        throw new Error(`Mismatched bookId: expected ${book.id}, got ${data.bookId}`);
      }
      if (!data.segments || data.segments.length < 150) {
        throw new Error(`Insufficient word segments: ${data.segments?.length} (expected >= 150)`);
      }

      const firstSeg = data.segments[0];
      if (!firstSeg.word || firstSeg.start === undefined || firstSeg.end === undefined) {
        throw new Error('Malformed segment structure: missing word, start, or end timestamp');
      }
      if (firstSeg.end < firstSeg.start) {
        throw new Error('Segment timestamps non-monotonic: end < start');
      }

      const duration = data.durationSeconds || data.duration;
      if (!duration || duration < 60) {
        throw new Error(`Abnormal audio duration: ${duration}s (expected >= 60s)`);
      }
    });
  }

  // 7. Catalogue Integrity & Consistency
  console.log('\n--- 7. Catalogue Price & Integrity Audit ---');
  await check('Frontend and Backend Catalogue ID & Price Match', async () => {
    for (const b of BOOKS_DATA) {
      const serverItem = SERVER_CATALOG[b.id];
      if (!serverItem) throw new Error(`Book ${b.id} missing from SERVER_CATALOG`);
      if (b.priceINR !== serverItem.priceINR) {
        throw new Error(`Price mismatch for ${b.id}: frontend ₹${b.priceINR} vs server ₹${serverItem.priceINR}`);
      }
      if (b.priceINR >= 500) {
        throw new Error(`Price ₹${b.priceINR} violates requirement of being strictly under ₹500`);
      }
    }
  });

  // 8. Client DOM, Console Error & Interaction Interception
  console.log('\n--- 8. Client DOM, Console Error & Interaction Interceptor ---');
  const browserPath = findSystemBrowser();
  if (browserPath) {
    await check('Headless DOM Rendering & Root Population (Storefront)', async () => {
      const { html } = await dumpClientDOM(browserPath, `${VITE_BASE}/`);
      if (!html || html.length < 5000) {
        throw new Error(`DOM output unexpectedly small: ${html?.length} characters`);
      }
      if (!html.includes('AETHERIA') && !html.includes('Curated')) {
        throw new Error('Storefront branding text missing from rendered client DOM');
      }
    });

    await check('Headless DOM Rendering (Reader View & Word Elements)', async () => {
      const { html } = await dumpClientDOM(browserPath, `${VITE_BASE}/read/the-artificial-mind`);
      if (!html || html.length < 5000) {
        throw new Error(`Reader DOM output unexpectedly small: ${html?.length} characters`);
      }
      // Assert presence of reader word indexing or reading canvas container
      const hasWordIndexes = html.includes('data-word-idx') || html.includes('word-idx') || html.includes('chapter');
      if (!hasWordIndexes) {
        throw new Error('Reader DOM does not render indexed chapter reading content');
      }
    });
  } else {
    console.log('  ⚠ [SKIP] System Chromium/Edge not found for headless DOM dump. Running static DOM assertion fallback.');
    await check('Static DOM Fallback: Index HTML Container Check', async () => {
      const res = await fetch(`${VITE_BASE}/`);
      const text = await res.text();
      if (!text.includes('id="root"')) throw new Error('Missing root container in index.html');
    });
  }

  console.log('\n===========================================================');
  console.log(` AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===========================================================');

  if (failed > 0) {
    console.error('\nFailure Details:');
    failureDetails.forEach((f, idx) => {
      console.error(`  ${idx + 1}. ${f.test}: ${f.error}`);
    });
    return false;
  }
  return true;
}

import { fileURLToPath } from 'url';
import path from 'path';

// Allow direct execution via CLI
if (process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === path.resolve(process.argv[1]).toLowerCase()) {
  runValidation().then((success) => {
    if (!success) process.exit(1);
  }).catch((err) => {
    console.error('Fatal validation error:', err);
    process.exit(1);
  });
}
