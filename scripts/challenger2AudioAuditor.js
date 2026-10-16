import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('================================================================');
console.log('  CHALLENGER 2: EMPIRICAL AUDIO NARRATION & READER ENGINE AUDIT');
console.log('================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  [PASS] ${message}`);
    if (details) console.log(`         ${details}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL] ${message}`);
    if (details) console.error(`         ${details}`);
  }
}

// 1. WAV Audio Files Inspection
console.log('----------------------------------------------------------------');
console.log('STAGE 1: Parsing RIFF/WAVE Headers of Audio Tracks');
console.log('----------------------------------------------------------------');

const audioDir = path.join(projectRoot, 'public', 'assets', 'audio');
const expectedTitles = [
  'the-artificial-mind',
  'the-sovereign-mind',
  'ghost-in-the-wire',
  'the-stoic-sovereign',
  'bio-optima'
];

const audioFiles = expectedTitles.map(id => `${id}-chapter-01.wav`);

for (const filename of audioFiles) {
  const filePath = path.join(audioDir, filename);
  console.log(`\nAuditing WAV: ${filename}`);

  const exists = fs.existsSync(filePath);
  assert(exists, `File exists: ${filename}`);
  if (!exists) continue;

  const stats = fs.statSync(filePath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  assert(stats.size > 1024 * 1024, `File size > 1 MB: ${sizeMB} MB (${stats.size} bytes)`);
  assert(stats.size >= 4 * 1024 * 1024 && stats.size <= 25 * 1024 * 1024, `File size in expected range (4-25MB): ${sizeMB} MB`);

  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(100);
  fs.readSync(fd, buffer, 0, 100, 0);
  fs.closeSync(fd);

  // RIFF header
  const riff = buffer.toString('ascii', 0, 4);
  assert(riff === 'RIFF', `RIFF header signature: "${riff}"`);

  const chunkSize = buffer.readUInt32LE(4);
  const expectedChunkSize = stats.size - 8;
  assert(chunkSize === expectedChunkSize, `ChunkSize matches file size - 8: ${chunkSize} == ${expectedChunkSize}`);

  const format = buffer.toString('ascii', 8, 12);
  assert(format === 'WAVE', `WAVE format signature: "${format}"`);

  // Subchunk 1: "fmt "
  let offset = 12;
  let fmtFound = false;
  let audioFormat = 0;
  let numChannels = 0;
  let sampleRate = 0;
  let byteRate = 0;
  let blockAlign = 0;
  let bitsPerSample = 0;

  while (offset < buffer.length - 8) {
    const subchunkId = buffer.toString('ascii', offset, offset + 4);
    const subchunkSize = buffer.readUInt32LE(offset + 4);
    if (subchunkId === 'fmt ') {
      fmtFound = true;
      audioFormat = buffer.readUInt16LE(offset + 8);
      numChannels = buffer.readUInt16LE(offset + 10);
      sampleRate = buffer.readUInt32LE(offset + 12);
      byteRate = buffer.readUInt32LE(offset + 16);
      blockAlign = buffer.readUInt16LE(offset + 20);
      bitsPerSample = buffer.readUInt16LE(offset + 22);
      break;
    }
    offset += 8 + subchunkSize;
  }

  assert(fmtFound, `'fmt ' subchunk present`);
  assert(audioFormat === 1, `AudioFormat is 1 (PCM uncompressed): ${audioFormat}`);
  assert(numChannels === 1 || numChannels === 2, `Valid channel count (1 or 2): ${numChannels} channel(s)`);
  assert(sampleRate >= 22050, `Sample rate >= 22,050 Hz: ${sampleRate} Hz`);
  assert(bitsPerSample === 16, `16-bit PCM audio: ${bitsPerSample}-bit`);
  assert(byteRate === sampleRate * numChannels * (bitsPerSample / 8), `ByteRate formula verified: ${byteRate} B/s`);
  assert(blockAlign === numChannels * (bitsPerSample / 8), `BlockAlign formula verified: ${blockAlign}`);
}

// 2. Timing JSON Maps Inspection
console.log('\n----------------------------------------------------------------');
console.log('STAGE 2: Timing JSON Maps & Title/Subtitle Synchronization');
console.log('----------------------------------------------------------------');

// Import BOOKS_DATA dynamically to check title/subtitle alignment
const booksDataPath = path.join(projectRoot, 'src', 'data', 'booksData.js');
let booksDataModule;

async function auditTiming() {
  try {
    booksDataModule = await import(`file://${booksDataPath.replace(/\\/g, '/')}`);
  } catch (err) {
    console.error('Failed to load booksData.js:', err);
  }

  const booksData = booksDataModule?.BOOKS_DATA || [];

  for (const bookId of expectedTitles) {
    const timingFile = `${bookId}-chapter-01-timing.json`;
    const timingPath = path.join(projectRoot, 'src', 'data', timingFile);
    console.log(`\nAuditing Timing JSON: ${timingFile}`);

    const exists = fs.existsSync(timingPath);
    assert(exists, `Timing JSON exists: ${timingFile}`);
    if (!exists) continue;

    let json;
    try {
      json = JSON.parse(fs.readFileSync(timingPath, 'utf8'));
      assert(true, `JSON syntax valid for ${timingFile}`);
    } catch (e) {
      assert(false, `JSON syntax valid for ${timingFile}`, e.message);
      continue;
    }

    assert(json.bookId === bookId, `bookId matches expected: "${json.bookId}" == "${bookId}"`);
    assert(json.chapterId === 'chapter-01', `chapterId is "chapter-01": "${json.chapterId}"`);
    assert(typeof json.durationSeconds === 'number' && json.durationSeconds >= 60, `Duration >= 60s: ${json.durationSeconds}s`);
    assert(Array.isArray(json.segments), `segments is an Array`);
    assert(json.segments.length >= 150, `Word segment count >= 150 words: ${json.segments.length} segments`);
    assert(json.totalSegments === json.segments.length, `totalSegments field matches segments.length: ${json.totalSegments} == ${json.segments.length}`);

    // Verify segments integrity: monotonic, char pos, non-empty word
    let monotonicIntervals = true;
    let monotonicTimeline = true;
    let validCharPos = true;
    let validWords = true;
    let maxEnd = 0;

    for (let i = 0; i < json.segments.length; i++) {
      const seg = json.segments[i];
      if (typeof seg.start !== 'number' || typeof seg.end !== 'number' || seg.start > seg.end) {
        monotonicIntervals = false;
      }
      if (i > 0 && seg.start < json.segments[i - 1].start) {
        monotonicTimeline = false;
      }
      if (typeof seg.characterPosition !== 'number' || seg.characterPosition < 0) {
        validCharPos = false;
      }
      if (typeof seg.word !== 'string' || seg.word.trim().length === 0) {
        validWords = false;
      }
      if (seg.end > maxEnd) maxEnd = seg.end;
    }

    assert(monotonicIntervals, `All segments have start <= end`);
    assert(monotonicTimeline, `Timeline is monotonic (start[i] >= start[i-1])`);
    assert(validCharPos, `All segments have valid non-negative characterPosition`);
    assert(validWords, `All segments have valid non-empty word strings`);
    assert(maxEnd <= json.durationSeconds + 1.0, `Last segment end within audio duration: ${maxEnd}s <= ${json.durationSeconds}s`);

    // Title / Subtitle synchronization check
    const book = booksData.find(b => b.id === bookId);
    if (book && book.chapters && book.chapters[0]) {
      const chapter01 = book.chapters[0];
      const titleWords = (chapter01.title || '').trim().split(/\s+/).filter(Boolean);
      const subtitleWords = (chapter01.subtitle || '').trim().split(/\s+/).filter(Boolean);

      console.log(`         Book Title: "${book.title}"`);
      console.log(`         Chapter 01 Title: "${chapter01.title}"`);
      console.log(`         Chapter 01 Subtitle: "${chapter01.subtitle}"`);

      // Verify word index 0 matches the first spoken word of the chapter title
      const firstSpokenWord = json.segments[0]?.word;
      const expectedFirstWord = titleWords[0];
      
      const cleanSpoken = firstSpokenWord?.replace(/[^\w]/g, '').toLowerCase();
      const cleanExpected = expectedFirstWord?.replace(/[^\w]/g, '').toLowerCase();

      assert(cleanSpoken === cleanExpected, `Word index 0 matches first word of Chapter Title: "${firstSpokenWord}" vs "${expectedFirstWord}"`);

      // Verify initial segments match title words
      let titleWordsMatch = true;
      for (let t = 0; t < titleWords.length; t++) {
        const segWord = json.segments[t]?.word?.replace(/[^\w]/g, '').toLowerCase();
        const expWord = titleWords[t]?.replace(/[^\w]/g, '').toLowerCase();
        if (segWord !== expWord) {
          titleWordsMatch = false;
          console.error(`         Mismatch at word ${t}: spoken "${segWord}" vs expected "${expWord}"`);
          break;
        }
      }
      assert(titleWordsMatch, `All ${titleWords.length} words of Chapter Title match opening segments`);

      // Verify subtitle follows title
      if (subtitleWords.length > 0) {
        let subtitleStartIdx = titleWords.length;
        const firstSubtitleSpoken = json.segments[subtitleStartIdx]?.word?.replace(/[^\w]/g, '').toLowerCase();
        const expectedFirstSubtitle = subtitleWords[0]?.replace(/[^\w]/g, '').toLowerCase();
        assert(firstSubtitleSpoken === expectedFirstSubtitle, `Subtitle begins immediately after title at word index ${subtitleStartIdx}: "${firstSubtitleSpoken}" vs "${expectedFirstSubtitle}"`);
      }
    } else {
      assert(false, `Could not find book or chapter 01 in booksData for ${bookId}`);
    }
  }

  // 3. Reader Engine & WordUnderlineGlider Architecture Audit
  console.log('\n----------------------------------------------------------------');
  console.log('STAGE 3: Reader Engine & WordUnderlineGlider Implementation Audit');
  console.log('----------------------------------------------------------------');

  const gliderPath = path.join(projectRoot, 'src', 'components', 'WordUnderlineGlider.jsx');
  const readerPath = path.join(projectRoot, 'src', 'pages', 'ReaderPage.jsx');
  const audioSynthPath = path.join(projectRoot, 'src', 'utils', 'audioSynthesis.js');

  const gliderSrc = fs.readFileSync(gliderPath, 'utf8');
  const readerSrc = fs.readFileSync(readerPath, 'utf8');
  const synthSrc = fs.readFileSync(audioSynthPath, 'utf8');

  // Glider checks
  assert(gliderSrc.includes('getBoundingClientRect()'), 'Glider queries word bounding rect');
  assert(gliderSrc.includes('container.scrollLeft') && gliderSrc.includes('container.scrollTop'), 'Glider accounts for container scroll offsets');
  assert(gliderSrc.includes('targetY - prevPos.y') || gliderSrc.includes('isLineWrap'), 'Glider includes line-wrap detection logic');
  assert(gliderSrc.includes('translate3d'), 'Glider uses hardware-accelerated translate3d transform');

  // Theme color glow checks
  assert(gliderSrc.includes('ivory:') && gliderSrc.includes('#c5a059'), 'Ivory theme antique gold (#c5a059) configured');
  assert(gliderSrc.includes('sepia:') && gliderSrc.includes('#b8682e'), 'Sepia theme warm terracotta (#b8682e) configured');
  assert(gliderSrc.includes('night:') && gliderSrc.includes('#38bdf8'), 'Night theme electric sapphire/cyan (#38bdf8) configured');
  assert(gliderSrc.includes('boxShadow:'), 'Glider applies glowing box-shadow for luxury aesthetic');

  // Reader auto-advance and page-flip checks
  assert(readerSrc.includes('findAndAdvancePageForWord'), 'ReaderPage implements findAndAdvancePageForWord auto-advance');
  assert(readerSrc.includes('playPageFlipSound()'), 'ReaderPage triggers playPageFlipSound on page turn');
  assert(readerSrc.includes('WordUnderlineGlider'), 'ReaderPage imports and renders WordUnderlineGlider');
  assert(synthSrc.includes('export function playPageFlipSound'), 'audioSynthesis exports playPageFlipSound Web Audio synthesizer');
  assert(synthSrc.includes('biquadFilter') || synthSrc.includes('bandpass'), 'playPageFlipSound uses filtered tactile paper rustle noise synthesis');

  // Summary
  console.log('\n================================================================');
  console.log(`CHALLENGER 2 AUDIT COMPLETE: ${passedChecks}/${totalChecks} PASSED (${failedChecks} FAILED)`);
  console.log('================================================================');

  if (failedChecks > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

auditTiming();
