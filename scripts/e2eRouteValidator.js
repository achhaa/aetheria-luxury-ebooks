import { BOOKS_DATA } from '../src/data/booksData.js';
import { SERVER_CATALOG } from '../server/catalog.js';

const VITE_BASE = 'http://localhost:5173';
const API_BASE = 'http://localhost:3001';

async function runValidation() {
  console.log('===========================================================');
  console.log('   AETHERIA FULL PLATFORM END-TO-END VALIDATION AUDIT      ');
  console.log('===========================================================\n');

  let passed = 0;
  let failed = 0;

  async function check(desc, fn) {
    try {
      await fn();
      console.log(`  ✓ [PASS] ${desc}`);
      passed++;
    } catch (e) {
      console.error(`  ✗ [FAIL] ${desc} ->`, e.message);
      failed++;
    }
  }

  // 1. Frontend Route Accessibility
  console.log('--- 1. Client-Side SPA Routes (Vite Dev Server) ---');
  const routes = [
    '/',
    '/books',
    '/books/the-artificial-mind',
    '/books/the-sovereign-mind',
    '/books/ghost-in-the-wire',
    '/books/the-stoic-sovereign',
    '/books/bio-optima',
    '/read/the-artificial-mind',
    '/read/the-sovereign-mind',
    '/read/ghost-in-the-wire',
    '/read/the-stoic-sovereign',
    '/read/bio-optima',
    '/library',
    '/refund-policy',
    '/admin'
  ];

  for (const r of routes) {
    await check(`Route HTTP 200: ${r}`, async () => {
      const res = await fetch(`${VITE_BASE}${r}`);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
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

  // 3. Book Promotional Video Assets
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

  // 4. Studio Audiobook WAV Narration Tracks
  console.log('\n--- 4. Studio Master Audiobook Audio (WAV) ---');
  for (const book of BOOKS_DATA) {
    await check(`Audiobook WAV: ${book.title} (${book.audiobook.audioUrl})`, async () => {
      const res = await fetch(`${VITE_BASE}${book.audiobook.audioUrl}`);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const ct = res.headers.get('content-type');
      if (!ct || !ct.includes('audio')) throw new Error(`Expected audio content-type, got ${ct}`);
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 1000000) throw new Error(`Audio file unexpectedly small: ${buf.byteLength} bytes`);
    });
  }

  // 5. Synchronized Word-Level Timing Maps
  console.log('\n--- 5. Synchronized Microsecond Timing Maps (API) ---');
  for (const book of BOOKS_DATA) {
    await check(`Word Timing Map: ${book.title} (/api/audiobook/${book.id}/chapter-01)`, async () => {
      const res = await fetch(`${API_BASE}/api/audiobook/${book.id}/chapter-01`);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const data = await res.json();
      if (data.bookId !== book.id) throw new Error(`Mismatched bookId: expected ${book.id}, got ${data.bookId}`);
      if (!data.segments || data.segments.length < 150) {
        throw new Error(`Insufficient word segments: ${data.segments?.length}`);
      }
      if (!data.segments[0].word || data.segments[0].start === undefined || data.segments[0].end === undefined) {
        throw new Error('Malformed segment structure');
      }
      if (!data.durationSeconds || data.durationSeconds < 60) {
        throw new Error(`Abnormal duration: ${data.durationSeconds}s`);
      }
    });
  }

  // 6. Catalogue Integrity & Consistency
  console.log('\n--- 6. Catalogue Price & Integrity Audit ---');
  await check('Frontend and Backend Catalogue ID & Price Match', async () => {
    for (const b of BOOKS_DATA) {
      const serverItem = SERVER_CATALOG[b.id];
      if (!serverItem) throw new Error(`Book ${b.id} missing from SERVER_CATALOG`);
      if (b.priceINR !== serverItem.priceINR) {
        throw new Error(`Price mismatch for ${b.id}: frontend ₹${b.priceINR} vs server ₹${serverItem.priceINR}`);
      }
      if (b.priceINR >= 500) {
        throw new Error(`Price ₹${b.priceINR} violates requirement of being under ₹500`);
      }
    }
  });

  console.log('\n===========================================================');
  console.log(` AUDIT SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('===========================================================');

  if (failed > 0) process.exit(1);
}

runValidation().catch((err) => {
  console.error('Fatal validation error:', err);
  process.exit(1);
});
