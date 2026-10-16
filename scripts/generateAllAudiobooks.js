import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BOOKS_DATA } from '../src/data/booksData.js';
import { db, run, initializeDatabase } from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const audioDir = path.join(rootDir, 'public', 'assets', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const dataDir = path.join(rootDir, 'src', 'data');

async function main() {
  console.log('=== AETHERIA AUDIOBOOK SYNTHESIS BATCH PIPELINE ===');
  await initializeDatabase();

  const results = [];

  for (const book of BOOKS_DATA) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Processing [${book.id}]: "${book.title}"`);

    // Target paths
    const wavPath = path.join(audioDir, `${book.id}-chapter-01.wav`);
    const jsonPath = path.join(dataDir, `${book.id}-chapter-01-timing.json`);

    // Extract Chapter 01 text
    const ch01 = book.chapters?.[0] || book.sampleChapter;
    if (!ch01 || !ch01.content) {
      console.warn(`[WARN] No chapter content found for ${book.id}, skipping.`);
      continue;
    }

    // Build speech text from title, subtitle, and content blocks
    // This provides an editorial narration flow:
    // Chapter Title. Subtitle. Then each content block text.
    const textBlocks = [];
    if (ch01.title) textBlocks.push(ch01.title);
    if (ch01.subtitle) textBlocks.push(ch01.subtitle);
    
    for (const block of ch01.content) {
      if (block.text) {
        // Clean any smart quotes/dashes for crystal-clear TTS pronunciation
        const clean = block.text
          .replace(/[—–]/g, ' - ')
          .replace(/[""]/g, '"')
          .replace(/['']/g, "'");
        textBlocks.push(clean);
      }
    }

    const fullText = textBlocks.join('. ');

    console.log(`Narration text length: ${fullText.length} chars, ~${fullText.split(/\s+/).length} words.`);

    // Temporary files for PowerShell input
    const tempTextInput = path.join(__dirname, `temp_${book.id}_text.txt`);
    const tempPsScript = path.join(__dirname, `temp_${book.id}_run.ps1`);
    const tempJsonOutput = path.join(__dirname, `temp_${book.id}_timing.json`);

    fs.writeFileSync(tempTextInput, fullText, 'utf-8');

    const psContent = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Speech

$inputFile = '${tempTextInput.replace(/\\/g, '\\\\')}'
$wavOut = '${wavPath.replace(/\\/g, '\\\\')}'
$jsonOut = '${tempJsonOutput.replace(/\\/g, '\\\\')}'

$text = [System.IO.File]::ReadAllText($inputFile, [System.Text.Encoding]::UTF8)

$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.Rate = 0
$synth.Volume = 100

$words = [System.Collections.Generic.List[PSObject]]::new()

$handler = {
    param($sender, $e)
    $obj = [PSCustomObject]@{
        word = $e.Text
        start = [Math]::Round($e.AudioPosition.TotalSeconds, 3)
        characterPosition = $e.CharacterPosition
        characterCount = $e.CharacterCount
    }
    $words.Add($obj)
}

$synth.add_SpeakProgress($handler)
$synth.SetOutputToWaveFile($wavOut)

$synth.Speak($text)
$synth.Dispose()

# Calculate 'end' timestamp for each segment
for ($i = 0; $i -lt $words.Count; $i++) {
    if ($i -lt $words.Count - 1) {
        $words[$i] | Add-Member -NotePropertyName 'end' -NotePropertyValue $words[$i+1].start
    } else {
        $words[$i] | Add-Member -NotePropertyName 'end' -NotePropertyValue ([Math]::Round($words[$i].start + 0.6, 3))
    }
}

$duration = if ($words.Count -gt 0) { $words[$words.Count - 1].end } else { 0 }

$outputObj = [PSCustomObject]@{
    bookId = '${bookIdSafe(book.id)}'
    chapterId = 'chapter-01'
    audioUrl = '/assets/audio/${bookIdSafe(book.id)}-chapter-01.wav'
    transcriptVersion = '1.0'
    totalSegments = $words.Count
    durationSeconds = $duration
    segments = $words
}

$outputObj | ConvertTo-Json -Depth 5 | Out-File -FilePath $jsonOut -Encoding utf8
Write-Host "SYNTH_COMPLETE: $($words.Count) words, Duration: $duration sec"
`;

    fs.writeFileSync(tempPsScript, psContent, 'utf-8');

    try {
      console.log(`Synthesizing studio audio narration and word timing map...`);
      const output = execSync(`powershell -ExecutionPolicy Bypass -File "${tempPsScript}"`, { encoding: 'utf-8' });
      console.log(output.trim());

      // Sanitize and copy JSON output (strip potential UTF-8 BOM)
      if (fs.existsSync(tempJsonOutput)) {
        const rawJson = fs.readFileSync(tempJsonOutput, 'utf-8').replace(/^\uFEFF/, '');
        const parsed = JSON.parse(rawJson);
        fs.writeFileSync(jsonPath, JSON.stringify(parsed, null, 2), 'utf-8');

        // Check WAV file size
        const wavStat = fs.statSync(wavPath);
        console.log(`✓ Audio WAV: ${(wavStat.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`✓ Timing JSON: ${parsed.totalSegments} segments, ${parsed.durationSeconds}s`);

        // Store into SQLite audiobook_tracks table
        const trackId = `${book.id}_chapter-01`;
        await run(`
          INSERT OR REPLACE INTO audiobook_tracks (
            id, book_id, chapter_id, chapter_title, audio_url,
            transcript_version, duration_seconds, timing_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          trackId,
          book.id,
          'chapter-01',
          ch01.title,
          `/assets/audio/${book.id}-chapter-01.wav`,
          '1.0',
          parsed.durationSeconds,
          JSON.stringify(parsed),
          new Date().toISOString()
        ]);

        results.push({
          bookId: book.id,
          title: book.title,
          words: parsed.totalSegments,
          duration: `${parsed.durationSeconds}s`,
          size: `${(wavStat.size / 1024 / 1024).toFixed(2)} MB`
        });
      }
    } catch (err) {
      console.error(`[ERROR] Synthesis failed for ${book.id}:`, err.message);
    } finally {
      // Clean up temporary files
      if (fs.existsSync(tempTextInput)) fs.unlinkSync(tempTextInput);
      if (fs.existsSync(tempPsScript)) fs.unlinkSync(tempPsScript);
      if (fs.existsSync(tempJsonOutput)) fs.unlinkSync(tempJsonOutput);
    }
  }

  console.log('\n==================================================');
  console.log('AUDIOBOOK SYNTHESIS BATCH COMPLETED');
  console.table(results);
  process.exit(0);
}

function bookIdSafe(id) {
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}

main().catch((err) => {
  console.error('Fatal batch error:', err);
  process.exit(1);
});
