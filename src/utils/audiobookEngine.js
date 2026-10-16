/**
 * AETHERIA AUDIOBOOK SYNCHRONIZATION ENGINE
 * Orchestrates word-level karaoke synchronization for prerecorded narration
 * and provides speech synthesis boundary tracking as a fallback.
 */

export class AudiobookSynchronizer {
  constructor({ timingData, onWordChange, onPageAdvance, onEnd, onError }) {
    this.timingData = timingData || null;
    this.segments = timingData?.segments || [];
    this.onWordChange = onWordChange || (() => {});
    this.onPageAdvance = onPageAdvance || (() => {});
    this.onEnd = onEnd || (() => {});
    this.onError = onError || (() => {});

    this.audioElement = null;
    this.isPlaying = false;
    this.activeWordIndex = -1;
    this.currentSpeed = 1.0;
    this.currentVolume = 1.0;
    this.rafId = null;

    // Fallback Web Speech
    this.isSpeechSynthesisMode = false;
    this.synthUtterance = null;
  }

  setTimingData(timingData) {
    this.timingData = timingData;
    this.segments = timingData?.segments || [];
    this.activeWordIndex = -1;
  }

  /**
   * Initializes HTML5 audio with the audioUrl
   */
  loadAudio(audioUrl) {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.src = '';
    }

    if (!audioUrl) return;

    this.isSpeechSynthesisMode = false;
    this.audioElement = new Audio(audioUrl);
    this.audioElement.playbackRate = this.currentSpeed;
    this.audioElement.volume = this.currentVolume;

    this.audioElement.addEventListener('ended', () => {
      this.isPlaying = false;
      this.cancelLoop();
      this.activeWordIndex = -1;
      this.onWordChange(-1, null);
      this.onEnd();
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('[AudiobookEngine] HTML5 Audio load error:', e);
      this.onError(e);
    });
  }

  play() {
    if (this.isSpeechSynthesisMode) {
      return this.resumeSpeechSynthesis();
    }

    if (!this.audioElement) return;

    this.audioElement.play().then(() => {
      this.isPlaying = true;
      this.startLoop();
    }).catch((err) => {
      console.warn('[AudiobookEngine] Playback prevented:', err);
      this.onError(err);
    });
  }

  pause() {
    this.isPlaying = false;
    this.cancelLoop();

    if (this.isSpeechSynthesisMode) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
      return;
    }

    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  seek(timeInSeconds) {
    if (this.audioElement) {
      this.audioElement.currentTime = Math.max(0, Math.min(timeInSeconds, this.audioElement.duration || Infinity));
      this.updateActiveWord(this.audioElement.currentTime);
    }
  }

  seekRelative(deltaSeconds) {
    if (this.audioElement) {
      this.seek(this.audioElement.currentTime + deltaSeconds);
    }
  }

  setPlaybackRate(rate) {
    this.currentSpeed = rate;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
  }

  setVolume(vol) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.currentVolume;
    }
  }

  getCurrentTime() {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }

  getDuration() {
    if (this.audioElement && this.audioElement.duration && !isNaN(this.audioElement.duration)) {
      return this.audioElement.duration;
    }
    return this.timingData?.durationSeconds || 0;
  }

  // Animation frame loop for microsecond-precise active word tracking
  startLoop() {
    this.cancelLoop();
    const tick = () => {
      if (this.isPlaying && this.audioElement) {
        this.updateActiveWord(this.audioElement.currentTime);
        this.rafId = requestAnimationFrame(tick);
      }
    };
    this.rafId = requestAnimationFrame(tick);
  }

  cancelLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  updateActiveWord(currentTime) {
    if (!this.segments || this.segments.length === 0) return;

    // Fast index search: check contiguous or binary search
    let index = -1;
    // Check next words from last active index first
    const startCheck = Math.max(0, this.activeWordIndex);
    for (let i = startCheck; i < Math.min(this.segments.length, startCheck + 15); i++) {
      if (currentTime >= this.segments[i].start && currentTime < this.segments[i].end) {
        index = i;
        break;
      }
    }

    // Binary search if jumped via seek
    if (index === -1) {
      let low = 0;
      let high = this.segments.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const seg = this.segments[mid];
        if (currentTime < seg.start) {
          high = mid - 1;
        } else if (currentTime >= seg.end) {
          low = mid + 1;
        } else {
          index = mid;
          break;
        }
      }
    }

    if (index !== this.activeWordIndex) {
      this.activeWordIndex = index;
      const seg = index >= 0 ? this.segments[index] : null;
      this.onWordChange(index, seg);
    }
  }

  /**
   * Fallback Web Speech Synthesis with onboundary tracking
   */
  startSpeechSynthesisFallback(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.onError(new Error('SpeechSynthesis not supported'));
      return;
    }

    this.stop();
    this.isSpeechSynthesisMode = true;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.currentSpeed;
    utterance.pitch = 0.96;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google')))
      || voices.find(v => v.lang.startsWith('en'));
    if (voice) utterance.voice = voice;

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const charIndex = e.charIndex;
        // Locate matching segment or word
        if (this.segments.length > 0) {
          const matchIdx = this.segments.findIndex(s => s.characterPosition >= charIndex - 2 && s.characterPosition <= charIndex + 2);
          if (matchIdx >= 0) {
            this.activeWordIndex = matchIdx;
            this.onWordChange(matchIdx, this.segments[matchIdx]);
          }
        }
      }
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.activeWordIndex = -1;
      this.onWordChange(-1, null);
      this.onEnd();
    };

    utterance.onerror = (e) => {
      this.isPlaying = false;
      this.onError(e);
    };

    this.synthUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    this.isPlaying = true;
  }

  resumeSpeechSynthesis() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.resume();
      this.isPlaying = true;
    }
  }

  stop() {
    this.pause();
    this.activeWordIndex = -1;
    this.onWordChange(-1, null);

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    if (this.audioElement) {
      this.audioElement.currentTime = 0;
    }
  }

  destroy() {
    this.stop();
    if (this.audioElement) {
      this.audioElement.src = '';
      this.audioElement = null;
    }
  }
}
