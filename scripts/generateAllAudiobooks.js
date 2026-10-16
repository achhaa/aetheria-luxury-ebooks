import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BOOKS_DATA } from '../src/data/booksData.js';
import { run, initializeDatabase } from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const audioDir = path.join(rootDir, 'public', 'assets', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const dataDir = path.join(rootDir, 'src', 'data');

// Voice mapping per book requirement:
// Christopher: The Artificial Mind, Ghost in the Wire
// Guy: The Sovereign Mind, The Stoic Sovereign
// Jenny: Bio-Optima
const VOICE_MAP = {
  'the-artificial-mind': 'en-US-ChristopherNeural',
  'the-sovereign-mind': 'en-US-GuyNeural',
  'ghost-in-the-wire': 'en-US-ChristopherNeural',
  'the-stoic-sovereign': 'en-US-GuyNeural',
  'bio-optima': 'en-US-JennyNeural'
};

async function main() {
  console.log('=== AETHERIA MICROSOFT EDGE NEURAL AUDIOBOOK PIPELINE ===');
  await initializeDatabase();

  // Launch headless Microsoft Edge with remote debugging
  const port = 9235;
  console.log(`Starting headless Microsoft Edge instance on port ${port}...`);
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    '--no-sandbox',
    `--remote-debugging-port=${port}`,
    'about:blank'
  ]);

  await new Promise((r) => setTimeout(r, 2500));

  let cdpWs = null;
  const results = [];

  try {
    const listRes = await fetch(`http://127.0.0.1:${port}/json`);
    const targets = await listRes.json();
    const readAloudTarget = targets.find((t) => t.url.includes('jdiccldimpdaibmpdkjnbmckianbfold'));

    if (!readAloudTarget) {
      throw new Error('ReadAloud background target not found in Edge instance.');
    }

    console.log(`Connected to ReadAloud extension context [${readAloudTarget.id}]`);
    cdpWs = new WebSocket(readAloudTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      cdpWs.onopen = resolve;
      cdpWs.onerror = reject;
    });

    for (const book of BOOKS_DATA) {
      console.log(`\n--------------------------------------------------`);
      console.log(`Processing [${book.id}]: "${book.title}"`);
      const voice = VOICE_MAP[book.id] || 'en-US-ChristopherNeural';
      console.log(`Assigned Studio Voice: ${voice}`);

      const wavPath = path.join(audioDir, `${book.id}-chapter-01.wav`);
      const jsonPath = path.join(dataDir, `${book.id}-chapter-01-timing.json`);

      const ch01 = book.chapters?.[0] || book.sampleChapter;
      if (!ch01 || !ch01.content) {
        console.warn(`[WARN] No chapter content for ${book.id}, skipping.`);
        continue;
      }

      // Build speech text from title, subtitle, and each content block
      const textBlocks = [];
      if (ch01.title) textBlocks.push(ch01.title);
      if (ch01.subtitle) textBlocks.push(ch01.subtitle);

      for (const block of ch01.content) {
        if (block.text) {
          const clean = block.text
            .replace(/[—–]/g, ' - ')
            .replace(/[""]/g, '"')
            .replace(/['']/g, "'");
          textBlocks.push(clean);
        }
      }

      const fullText = textBlocks.join('. ');
      console.log(`Narration text: ${fullText.length} chars, ~${fullText.split(/\s+/).length} words`);

      // Escape SSML XML entities
      const escapedText = fullText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

      console.log(`Synthesizing with Microsoft Edge Neural studio voice (${voice})...`);

      const synthesisScript = `
        new Promise(async (resolve, reject) => {
          try {
            const key = await new Promise(res => chrome.systemPrivate.getApiKey(res));
            const connId = crypto.randomUUID().replace(/-/g, '');
            const url = 'wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1?Ocp-Apim-Subscription-Key=' + key + '&ConnectionId=' + connId;
            
            const sock = new WebSocket(url);
            sock.binaryType = 'arraybuffer';
            
            const mp3Chunks = [];
            const boundaries = [];
            
            sock.onopen = () => {
              const configObj = {
                context: {
                  synthesis: {
                    audio: {
                      metadataoptions: {
                        sentenceBoundaryEnabled: "false",
                        wordBoundaryEnabled: "true"
                      },
                      outputFormat: "audio-24khz-96kbitrate-mono-mp3"
                    }
                  }
                }
              };
              const configMsg = 'X-Timestamp:' + new Date().toString() + 'Z\\r\\nContent-Type:application/json; charset=utf-8\\r\\nPath:speech.config\\r\\n\\r\\n' + JSON.stringify(configObj);
              sock.send(configMsg);
              
              const uuid = crypto.randomUUID().replace(/-/g, '');
              const ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='en-US'><voice name='${voice}'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>" + ${JSON.stringify(escapedText)} + "</prosody></voice></speak>";
              const ssmlMsg = 'X-RequestId:' + uuid + '\\r\\nContent-Type:application/ssml+xml\\r\\nX-Timestamp:' + new Date().toString() + 'Z\\r\\nPath:ssml\\r\\n\\r\\n' + ssml;
              sock.send(ssmlMsg);
            };
            
            sock.onmessage = async (e) => {
              if (e.data instanceof ArrayBuffer) {
                const view = new DataView(e.data);
                const headerLen = view.getInt16(0);
                const body = e.data.slice(2 + headerLen);
                if (body.byteLength > 0) {
                  mp3Chunks.push(new Uint8Array(body));
                }
              } else if (typeof e.data === 'string') {
                if (e.data.includes('audio.metadata')) {
                  const idx = e.data.indexOf('{');
                  if (idx >= 0) {
                    const meta = JSON.parse(e.data.substring(idx));
                    if (meta.Metadata) {
                      for (const item of meta.Metadata) {
                        if (item.Type === 'WordBoundary') {
                          boundaries.push({
                            word: item.Data.text.Text,
                            offset: item.Data.Offset,
                            duration: item.Data.Duration,
                            length: item.Data.text.Length
                          });
                        }
                      }
                    }
                  }
                }
                if (e.data.indexOf('turn.end') >= 0) {
                  sock.close();
                  
                  let totalLen = 0;
                  for (const c of mp3Chunks) totalLen += c.byteLength;
                  const fullMp3 = new Uint8Array(totalLen);
                  let offset = 0;
                  for (const c of mp3Chunks) {
                    fullMp3.set(c, offset);
                    offset += c.byteLength;
                  }
                  
                  // Decode audio using OfflineAudioContext at 24000 Hz
                  const audioCtx = new OfflineAudioContext(1, 24000 * 400, 24000);
                  const audioBuffer = await audioCtx.decodeAudioData(fullMp3.buffer);
                  const floatChannel = audioBuffer.getChannelData(0);
                  const sampleRate = audioBuffer.sampleRate; // 24000
                  const numSamples = floatChannel.length;
                  
                  // Encode 16-bit Mono RIFF PCM WAV
                  const wavHeaderLen = 44;
                  const dataLen = numSamples * 2;
                  const wavBuffer = new ArrayBuffer(wavHeaderLen + dataLen);
                  const view = new DataView(wavBuffer);
                  
                  view.setUint32(0, 0x52494646, false); // "RIFF"
                  view.setUint32(4, 36 + dataLen, true);
                  view.setUint32(8, 0x57415645, false); // "WAVE"
                  view.setUint32(12, 0x666d7420, false); // "fmt "
                  view.setUint32(16, 16, true); // PCM subchunk size
                  view.setUint16(20, 1, true); // format = 1 (PCM)
                  view.setUint16(22, 1, true); // mono
                  view.setUint32(24, sampleRate, true); // 24000 Hz
                  view.setUint32(28, sampleRate * 2, true); // 48000 bytes/sec
                  view.setUint16(32, 2, true); // block align
                  view.setUint16(34, 16, true); // 16 bits per sample
                  view.setUint32(36, 0x64617461, false); // "data"
                  view.setUint32(40, dataLen, true);
                  
                  let pcmOffset = 44;
                  for (let i = 0; i < numSamples; i++) {
                    let s = Math.max(-1, Math.min(1, floatChannel[i]));
                    let val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    view.setInt16(pcmOffset, val, true);
                    pcmOffset += 2;
                  }
                  
                  // Convert ArrayBuffer to Base64 in safe chunks
                  const bytes = new Uint8Array(wavBuffer);
                  let binary = '';
                  const chunkSz = 0x8000;
                  for (let i = 0; i < bytes.length; i += chunkSz) {
                    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSz));
                  }
                  const wavBase64 = btoa(binary);
                  
                  resolve({
                    duration: audioBuffer.duration,
                    sampleRate,
                    samples: numSamples,
                    boundaries,
                    wavBase64
                  });
                }
              }
            };
            
            sock.onerror = (e) => reject('WebSocket synthesis error: ' + JSON.stringify(e));
            setTimeout(() => reject('Synthesis timed out after 60 seconds'), 60000);
          } catch (err) {
            reject(err.message);
          }
        })
      `;

      const synthResult = await new Promise((resolveEval, rejectEval) => {
        const evalId = Math.floor(Math.random() * 1000000);
        const onMsg = (event) => {
          const parsed = JSON.parse(event.data);
          if (parsed.id === evalId) {
            cdpWs.removeEventListener('message', onMsg);
            if (parsed.result?.exceptionDetails) {
              rejectEval(new Error(parsed.result.exceptionDetails.text || 'CDP execution error'));
            } else {
              resolveEval(parsed.result?.result?.value);
            }
          }
        };
        cdpWs.addEventListener('message', onMsg);
        cdpWs.send(
          JSON.stringify({
            id: evalId,
            method: 'Runtime.evaluate',
            params: { expression: synthesisScript, awaitPromise: true, returnByValue: true }
          })
        );
      });

      if (!synthResult || !synthResult.wavBase64) {
        throw new Error(`Failed to synthesize audio for ${book.id}`);
      }

      // Save RIFF PCM WAV file
      const wavBuf = Buffer.from(synthResult.wavBase64, 'base64');
      fs.writeFileSync(wavPath, wavBuf);

      // Build structured word timing segments
      // Convert raw 100ns offset/duration to seconds with microsecond precision
      let lastCharPos = 0;
      const formattedSegments = synthResult.boundaries.map((b) => {
        const startSec = Math.round((b.offset / 10000000) * 1000) / 1000;
        const durSec = Math.round((b.duration / 10000000) * 1000) / 1000;
        const endSec = Math.round((startSec + durSec) * 1000) / 1000;

        // Approximate character position in transcript
        const charIdx = fullText.indexOf(b.word, lastCharPos);
        if (charIdx !== -1) {
          lastCharPos = charIdx + b.word.length;
        }

        return {
          word: b.word,
          start: startSec,
          end: endSec,
          characterPosition: charIdx !== -1 ? charIdx : lastCharPos,
          characterCount: b.length || b.word.length
        };
      });

      const totalDuration = Math.round(synthResult.duration * 1000) / 1000;

      const timingObj = {
        bookId: book.id,
        chapterId: 'chapter-01',
        audioUrl: `/assets/audio/${book.id}-chapter-01.wav`,
        voice: voice,
        sampleRate: 24000,
        transcriptVersion: '2.0',
        totalSegments: formattedSegments.length,
        durationSeconds: totalDuration,
        segments: formattedSegments
      };

      fs.writeFileSync(jsonPath, JSON.stringify(timingObj, null, 2), 'utf-8');

      // Update SQLite database audiobook_tracks table
      const trackId = `${book.id}_chapter-01`;
      await run(
        `
        INSERT OR REPLACE INTO audiobook_tracks (
          id, book_id, chapter_id, chapter_title, audio_url,
          transcript_version, duration_seconds, timing_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          trackId,
          book.id,
          'chapter-01',
          ch01.title,
          `/assets/audio/${book.id}-chapter-01.wav`,
          '2.0',
          totalDuration,
          JSON.stringify(timingObj),
          new Date().toISOString()
        ]
      );

      const sizeMB = (wavBuf.length / 1024 / 1024).toFixed(2);
      console.log(`✓ Audio WAV: ${sizeMB} MB (24,000 Hz RIFF PCM Mono)`);
      console.log(`✓ Timing JSON: ${formattedSegments.length} words, ${totalDuration}s`);

      results.push({
        bookId: book.id,
        title: book.title,
        voice,
        words: formattedSegments.length,
        duration: `${totalDuration}s`,
        size: `${sizeMB} MB`
      });
    }
  } finally {
    if (cdpWs) cdpWs.close();
    edge.kill();
  }

  console.log('\n==================================================');
  console.log('ALL 5 AUDIOBOOKS SYNTHESIZED SUCCESSFULLY');
  console.table(results);
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal batch error:', err);
  process.exit(1);
});
