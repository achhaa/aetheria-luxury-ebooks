async function runTests() {
  console.log('--- AETHERIA LUXURY E-BOOKS VERIFICATION SUITE ---');
  let passed = 0;
  let failed = 0;

  async function assert(desc, fn) {
    try {
      await fn();
      console.log(`✓ PASS: ${desc}`);
      passed++;
    } catch (e) {
      console.error(`✗ FAIL: ${desc} ->`, e.message);
      failed++;
    }
  }

  // 1. Config endpoint
  await assert('Public server configuration (/api/config)', async () => {
    const res = await fetch('http://localhost:3001/api/config');
    const data = await res.json();
    if (!data.currency || data.currency !== 'INR') throw new Error('Invalid currency');
    if (!data.razorpayKeyId) throw new Error('Missing keyId');
  });

  // 2. Authoritative Order Creation
  let testOrder;
  await assert('Authoritative Order Creation with server pricing (/api/create-order)', async () => {
    const res = await fetch('http://localhost:3001/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookIds: ['the-artificial-mind'],
        customerName: 'Eleanor Vance',
        customerEmail: 'eleanor@aetheria.luxury'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    testOrder = await res.json();
    if (testOrder.amountINR !== 299) throw new Error(`Expected ₹299, got ₹${testOrder.amountINR}`);
    if (!testOrder.orderId.startsWith('order_')) throw new Error('Invalid orderId format');
  });

  // 3. Signature Verification & Download Token Generation
  let verifiedData;
  await assert('Cryptographic Payment Verification (/api/verify-payment)', async () => {
    const res = await fetch('http://localhost:3001/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: testOrder.orderId,
        razorpay_payment_id: `pay_test_${Date.now()}`,
        razorpay_signature: 'test_signature_mock',
        customerName: 'Eleanor Vance',
        customerEmail: 'eleanor@aetheria.luxury'
      })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    verifiedData = await res.json();
    if (!verifiedData.success) throw new Error('Payment verification unsuccessful');
    if (!verifiedData.order.downloads || verifiedData.order.downloads.length === 0) throw new Error('No download tokens generated');
  });

  // 4. PDF Master Delivery
  await assert('Personalized PDF Master Delivery (/api/download/:token)', async () => {
    const dl = verifiedData.order.downloads[0];
    const res = await fetch(`http://localhost:3001${dl.downloadUrl}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type');
    if (!ct || !ct.includes('application/pdf')) throw new Error(`Expected application/pdf, got ${ct}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 1000) throw new Error(`PDF too small: ${buf.byteLength} bytes`);
  });

  // 5. EPUB Master Delivery
  await assert('Reflowable EPUB Master Delivery (/api/download-epub/:token)', async () => {
    const dl = verifiedData.order.downloads[0];
    const res = await fetch(`http://localhost:3001${dl.downloadEpubUrl}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get('content-type');
    if (!ct || !ct.includes('epub')) throw new Error(`Expected epub content type, got ${ct}`);
    const buf = await res.arrayBuffer();
    if (buf.byteLength < 1000) throw new Error(`EPUB too small: ${buf.byteLength} bytes`);
  });

  // 6. Audiobook Timing Maps for all 5 books
  await assert('Synchronized Audiobook Timing Maps for all 5 titles (/api/audiobook/:bookId/chapter-01)', async () => {
    const bookIds = [
      'the-artificial-mind',
      'the-sovereign-mind',
      'ghost-in-the-wire',
      'the-stoic-sovereign',
      'bio-optima'
    ];

    for (const bId of bookIds) {
      const res = await fetch(`http://localhost:3001/api/audiobook/${bId}/chapter-01`);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${bId}`);
      const data = await res.json();
      if (!data.totalSegments || data.totalSegments < 100) {
        throw new Error(`Insufficient word segments (${data.totalSegments}) for ${bId}`);
      }
      if (!data.segments[0].word || data.segments[0].start === undefined || data.segments[0].end === undefined) {
        throw new Error(`Malformed timing segment structure for ${bId}`);
      }
      if (!data.audioUrl || !data.durationSeconds || data.durationSeconds <= 0) {
        throw new Error(`Invalid audioUrl or durationSeconds for ${bId}`);
      }
    }
  });

  // 7. Reading Progress Persistence
  await assert('Reading Progress Sync (/api/progress)', async () => {
    const postRes = await fetch('http://localhost:3001/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'eleanor@aetheria.luxury',
        bookId: 'the-artificial-mind',
        chapterIndex: 0,
        pageIndex: 2,
        audioTime: 42.5
      })
    });
    if (!postRes.ok) throw new Error(`Post progress HTTP ${postRes.status}`);

    const getRes = await fetch('http://localhost:3001/api/progress/eleanor@aetheria.luxury/the-artificial-mind');
    const data = await getRes.json();
    if (data.progress.pageIndex !== 2) throw new Error(`Expected pageIndex 2, got ${data.progress.pageIndex}`);
    if (data.progress.audioTime !== 42.5) throw new Error(`Expected audioTime 42.5, got ${data.progress.audioTime}`);
  });

  // 8. Bookmarks Persistence
  await assert('Bookmark Management (/api/bookmarks)', async () => {
    const postRes = await fetch('http://localhost:3001/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'eleanor@aetheria.luxury',
        bookId: 'the-artificial-mind',
        chapterIndex: 0,
        pageIndex: 1,
        excerpt: 'The emergence of sovereign reasoning architectures...'
      })
    });
    if (!postRes.ok) throw new Error(`Post bookmark HTTP ${postRes.status}`);

    const getRes = await fetch('http://localhost:3001/api/bookmarks/eleanor@aetheria.luxury/the-artificial-mind');
    const data = await getRes.json();
    if (!data.bookmarks || data.bookmarks.length === 0) throw new Error('No bookmarks returned');
  });

  // 9. Customer Order Recovery
  await assert('Customer Library Retrieval (/api/customer/orders)', async () => {
    const res = await fetch('http://localhost:3001/api/customer/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'eleanor@aetheria.luxury' })
    });
    const data = await res.json();
    if (!data.orders || data.orders.length === 0) throw new Error('Expected orders for verified customer');
    if (!data.orders[0].downloads || data.orders[0].downloads.length === 0) throw new Error('Missing active download tokens');
  });

  // 10. Admin Protected Endpoint Security
  await assert('Admin Authorization Gate rejects unauthenticated requests (/api/admin/books)', async () => {
    const unauthRes = await fetch('http://localhost:3001/api/admin/books');
    if (unauthRes.status !== 401) throw new Error(`Expected 401 Unauthorized, got ${unauthRes.status}`);

    const authRes = await fetch('http://localhost:3001/api/admin/books', {
      headers: { 'x-admin-key': 'aetheria-admin-secret-2026' }
    });
    if (authRes.status !== 200) throw new Error(`Expected 200 with admin key, got ${authRes.status}`);
  });

  console.log(`\nTEST SUMMARY: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
