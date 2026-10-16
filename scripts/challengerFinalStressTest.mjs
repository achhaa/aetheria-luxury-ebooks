import crypto from 'crypto';

const VITE_BASE = 'http://localhost:5173';
const API_BASE = 'http://localhost:3001';
const TOKEN_SECRET = process.env.DOWNLOAD_TOKEN_SECRET || 'aetheria_luxury_download_secret_key_9981';

console.log('========================================================================');
console.log('   CHALLENGER FINAL: ADVERSARIAL STRESS-TEST & INTEGRITY HARNESS        ');
console.log('========================================================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failureLog = [];

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name} -> ${err.message}`);
    failedTests++;
    failureLog.push({ name, error: err.message });
  }
}

// -----------------------------------------------------------------------------
// 1. ADVERSARIAL PRICING & ORDER ATTACK SURFACE
// -----------------------------------------------------------------------------
console.log('--- 1. Adversarial Pricing & Order Validation ---');

await test('Attacker attempts to set price to ₹1 in /api/create-order', async () => {
  const res = await fetch(`${API_BASE}/api/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookIds: ['the-artificial-mind'],
      amountINR: 1,
      amountPaise: 100,
      customerName: 'Hacker',
      customerEmail: 'hacker@adversary.com'
    })
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.amountINR !== 299 || data.amountPaise !== 29900) {
    throw new Error(`Price tampering succeeded! Server charged ₹${data.amountINR} instead of ₹299`);
  }
});

await test('Attacker supplies non-existent bookId in /api/create-order', async () => {
  const res = await fetch(`${API_BASE}/api/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookIds: ['totally-fake-book-id-999'],
      customerName: 'Hacker',
      customerEmail: 'hacker@adversary.com'
    })
  });
  if (res.status !== 400) {
    throw new Error(`Expected HTTP 400 Bad Request, got HTTP ${res.status}`);
  }
});

await test('Attacker supplies empty bookIds array in /api/create-order', async () => {
  const res = await fetch(`${API_BASE}/api/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookIds: [],
      customerName: 'Hacker',
      customerEmail: 'hacker@adversary.com'
    })
  });
  if (res.status !== 400) {
    throw new Error(`Expected HTTP 400 Bad Request, got HTTP ${res.status}`);
  }
});

// -----------------------------------------------------------------------------
// 2. CRYPTOGRAPHIC DOWNLOAD TOKEN TAMPERING
// -----------------------------------------------------------------------------
console.log('\n--- 2. Cryptographic Download Token Tampering ---');

await test('Download rejected for completely random malformed token', async () => {
  const res = await fetch(`${API_BASE}/api/download/totally-random-garbage-token`);
  if (res.status !== 403) {
    throw new Error(`Expected HTTP 403 Forbidden, got HTTP ${res.status}`);
  }
});

await test('Download rejected for token with tampered payload', async () => {
  // Generate a legitimate token first
  const payload = JSON.stringify({
    orderId: 'order_test_123',
    bookId: 'the-artificial-mind',
    email: 'reader@aetheria.com',
    expiresAt: Date.now() + 3600000
  });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(b64Payload).digest('base64url');

  // Tamper payload: change bookId to bio-optima without re-signing
  const tamperedPayload = JSON.stringify({
    orderId: 'order_test_123',
    bookId: 'bio-optima',
    email: 'reader@aetheria.com',
    expiresAt: Date.now() + 3600000
  });
  const tamperedB64 = Buffer.from(tamperedPayload).toString('base64url');
  const tamperedToken = `${tamperedB64}.${signature}`;

  const res = await fetch(`${API_BASE}/api/download/${tamperedToken}`);
  if (res.status !== 403) {
    throw new Error(`Expected HTTP 403 for tampered payload, got HTTP ${res.status}`);
  }
});

await test('Download rejected for legitimately signed but expired token', async () => {
  // Expired 1 hour ago
  const payload = JSON.stringify({
    orderId: 'order_test_123',
    bookId: 'the-artificial-mind',
    email: 'reader@aetheria.com',
    expiresAt: Date.now() - 3600000
  });
  const b64Payload = Buffer.from(payload).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(b64Payload).digest('base64url');
  const expiredToken = `${b64Payload}.${signature}`;

  const res = await fetch(`${API_BASE}/api/download/${expiredToken}`);
  if (res.status !== 403) {
    throw new Error(`Expected HTTP 403 for expired token, got HTTP ${res.status}`);
  }
});

await test('Path traversal attempt in token parameter is blocked', async () => {
  const res = await fetch(`${API_BASE}/api/download/..%2F..%2Fpackage.json`);
  if (res.status !== 403 && res.status !== 400 && res.status !== 404) {
    throw new Error(`Expected 403/400/404, got HTTP ${res.status}`);
  }
  const body = await res.text();
  if (body.includes('"name": "aetheria-luxury-ebooks"')) {
    throw new Error('Path traversal vulnerability leaked package.json!');
  }
});

// -----------------------------------------------------------------------------
// 3. SQL INJECTION RESILIENCE IN USER PROGRESS & BOOKMARKS
// -----------------------------------------------------------------------------
console.log('\n--- 3. SQL Injection Resilience (Progress & Bookmarks) ---');

await test('SQL injection in progress email is safely escaped', async () => {
  const sqlInjectionEmail = "test' OR '1'='1; DROP TABLE reading_progress; --";
  const postRes = await fetch(`${API_BASE}/api/progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: sqlInjectionEmail,
      bookId: 'the-artificial-mind',
      chapterIndex: 0,
      pageIndex: 1,
      audioTime: 10
    })
  });
  if (!postRes.ok) throw new Error(`Post progress failed: HTTP ${postRes.status}`);

  // Ensure table was not dropped
  const checkRes = await fetch(`${API_BASE}/api/progress/${encodeURIComponent(sqlInjectionEmail)}/the-artificial-mind`);
  if (!checkRes.ok) throw new Error(`Table corrupted or dropped: HTTP ${checkRes.status}`);
  const data = await checkRes.json();
  if (!data.progress || data.progress.pageIndex !== 1) {
    throw new Error('Parameterized record not retrieved accurately');
  }
});

// -----------------------------------------------------------------------------
// 4. ADMIN ACCESS CONTROL HARDENING
// -----------------------------------------------------------------------------
console.log('\n--- 4. Admin Access Control Hardening ---');

await test('Admin access denied without credentials', async () => {
  const res = await fetch(`${API_BASE}/api/admin/books`);
  if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
});

await test('Admin access denied with invalid credential', async () => {
  const res = await fetch(`${API_BASE}/api/admin/books`, {
    headers: { 'x-admin-key': 'attacker-attempt-wrong-password' }
  });
  if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
});

await test('Admin access granted with valid secret', async () => {
  const res = await fetch(`${API_BASE}/api/admin/books`, {
    headers: { 'x-admin-key': 'aetheria-admin-secret-2026' }
  });
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data.books) || data.books.length < 5) {
    throw new Error(`Expected at least 5 books in admin catalogue, got ${data.books?.length}`);
  }
});

// -----------------------------------------------------------------------------
// 5. HIGH-CONCURRENCY STRESS LOAD
// -----------------------------------------------------------------------------
console.log('\n--- 5. High-Concurrency Stress Load (25 parallel requests) ---');

await test('25 concurrent order creations complete without failure', async () => {
  const requests = Array.from({ length: 25 }, (_, i) =>
    fetch(`${API_BASE}/api/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookIds: ['bio-optima'],
        customerName: `Concur Patron ${i}`,
        customerEmail: `concur${i}@aetheria.luxury`
      })
    })
  );

  const responses = await Promise.all(requests);
  const statusCodes = responses.map((r) => r.status);
  const failed = statusCodes.filter((s) => s !== 200);
  if (failed.length > 0) {
    throw new Error(`${failed.length} / 25 concurrent order requests failed`);
  }
});

await test('25 concurrent reading progress updates complete without SQLite lock contention', async () => {
  const requests = Array.from({ length: 25 }, (_, i) =>
    fetch(`${API_BASE}/api/progress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `stress${i}@aetheria.luxury`,
        bookId: 'ghost-in-the-wire',
        chapterIndex: 0,
        pageIndex: i,
        audioTime: i * 2.5
      })
    })
  );

  const responses = await Promise.all(requests);
  const failed = responses.filter((r) => !r.ok);
  if (failed.length > 0) {
    throw new Error(`${failed.length} / 25 concurrent progress writes failed`);
  }
});

// -----------------------------------------------------------------------------
// 6. AUDIO & TIMING MAP INTEGRITY VERIFICATION FOR ALL 5 BOOKS
// -----------------------------------------------------------------------------
console.log('\n--- 6. Audio Narration & Timing Map Integrity Audit ---');

const bookIds = [
  'the-artificial-mind',
  'the-sovereign-mind',
  'ghost-in-the-wire',
  'the-stoic-sovereign',
  'bio-optima'
];

for (const bId of bookIds) {
  await test(`Timing API for ${bId} returns monotonic non-empty segments`, async () => {
    const res = await fetch(`${API_BASE}/api/audiobook/${bId}/chapter-01`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!Array.isArray(data.segments) || data.segments.length < 150) {
      throw new Error(`Insufficient segments: ${data.segments?.length}`);
    }

    for (let i = 0; i < data.segments.length; i++) {
      const seg = data.segments[i];
      if (!seg.word || typeof seg.word !== 'string') {
        throw new Error(`Segment ${i} missing valid word`);
      }
      if (typeof seg.start !== 'number' || typeof seg.end !== 'number') {
        throw new Error(`Segment ${i} invalid timestamp types`);
      }
      if (seg.end < seg.start) {
        throw new Error(`Segment ${i} non-monotonic: end (${seg.end}) < start (${seg.start})`);
      }
      if (i > 0 && seg.start < data.segments[i - 1].start) {
        throw new Error(`Segment ${i} start time precedes previous segment start`);
      }
    }
  });

  await test(`Audio WAV file for ${bId} serves valid binary over HTTP`, async () => {
    const res = await fetch(`${VITE_BASE}/assets/audio/${bId}-chapter-01.wav`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('audio')) throw new Error(`Unexpected Content-Type: ${ct}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1000000) throw new Error(`Audio file too small: ${buf.length} bytes`);
    if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WAVE') {
      throw new Error('Invalid RIFF WAVE container format');
    }
  });
}

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(` CHALLENGER FINAL SUMMARY: ${passedTests} Passed, ${failedTests} Failed (Total: ${totalTests})`);
console.log('========================================================================');

if (failedTests > 0) {
  console.error('\nAdversarial Failures:');
  failureLog.forEach((f, i) => console.error(`  ${i + 1}. ${f.name}: ${f.error}`));
  process.exit(1);
} else {
  console.log('\nAll adversarial stress tests PASSED 100%. Zero security or resilience flaws.\n');
  process.exit(0);
}
