// Web Audio API & Speech Synthesis for Luxury Tactile Feedback

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 1. Realistic Page Flip Sound
export function playPageFlipSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.12; // 120ms
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Filtered pink-like noise for paper rustle
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99 * b0 + white * 0.05;
      b1 = 0.96 * b1 + white * 0.11;
      b2 = 0.86 * b2 + white * 0.25;
      const pink = b0 + b1 + b2 + white * 0.1;
      const envelope = Math.sin((i / bufferSize) * Math.PI);
      data[i] = pink * envelope * 0.18;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(ctx.destination);
    noiseSource.start();
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

// 2. Deep Book Open Sound (Thump + Velvet Hiss)
export function playBookOpenSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.36);

    playPageFlipSound();
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

// 3. Book Close Sound (Satisfying Snap & Leather Seal)
export function playBookCloseSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.22);
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

// 4. Celebratory Purchase Chime
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.95);
    });
  } catch (e) {
    console.debug('Audio error:', e);
  }
}

// 5. Continuous Luxury Ambient Drone (Focus Atmosphere)
let ambientNodes = null;

export function toggleAmbientSound(enable) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (!enable) {
      if (ambientNodes) {
        ambientNodes.gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.4);
        setTimeout(() => {
          if (ambientNodes) {
            ambientNodes.oscillators.forEach(o => o.stop());
            ambientNodes = null;
          }
        }, 500);
      }
      return false;
    }

    if (ambientNodes) return true; // Already playing

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5); // Soft unobtrusive volume

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, ctx.currentTime);

    const freqs = [110, 164.81, 220, 329.63]; // Warm A Major 9th harmonics
    const oscillators = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(f + (Math.random() * 0.4 - 0.2), ctx.currentTime);
      osc.connect(filter);
      osc.start();
      return osc;
    });

    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    ambientNodes = { oscillators, gain: masterGain };
    return true;
  } catch (e) {
    console.debug('Ambient audio error:', e);
    return false;
  }
}

// 6. Web Speech API Narration for Sample Chapters
let currentUtterance = null;

export function speakNarratorText(text, onStart, onEnd, onError) {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    if (onError) onError('Speech synthesis not supported in this browser.');
    return;
  }

  stopNarratorText();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Slightly slower, measured cadence
  utterance.pitch = 0.95; // Deeper tone

  const voices = window.speechSynthesis.getVoices();
  // Prefer premium natural sounding English voice
  const preferredVoice = voices.find(v => 
    (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha')) && v.lang.startsWith('en')
  ) || voices.find(v => v.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    currentUtterance = null;
    if (onError) onError(e);
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopNarratorText() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}
