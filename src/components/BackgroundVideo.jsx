import React, { useEffect, useRef, useState } from 'react';
import { Film, Eye, EyeOff, Sliders } from 'lucide-react';

const LOCAL_PRESETS = [
  {
    id: 'ambient-luxury',
    name: 'Aetheria Ambient Master (Local)',
    url: '/assets/videos/ambient-background.mp4',
    poster: '/assets/covers/the-artificial-mind.jpg'
  },
  {
    id: 'monogram-intro',
    name: 'Atelier Monogram Motion (Local)',
    url: '/assets/videos/brand-intro.mp4',
    poster: '/assets/covers/the-sovereign-mind.jpg'
  },
  {
    id: 'synthetic-mind',
    name: 'Autonomous Cognition (Local)',
    url: '/assets/videos/the-artificial-mind.mp4',
    poster: '/assets/covers/the-artificial-mind.jpg'
  }
];

export default function BackgroundVideo({ 
  isReaderView = false, 
  src = '/assets/videos/ambient-background.mp4',
  defaultOpacity = 0.28,
  isDark = false
}) {
  const videoRef = useRef(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Initialize videoEnabled based on user reduced motion preference directly without setState in effect
  const [videoEnabled, setVideoEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return true;
    }
  });

  const [videoOpacity, setVideoOpacity] = useState(defaultOpacity);
  const [showControls, setShowControls] = useState(false);

  // Distraction-free reader isolation: completely pause and mute in reader mode
  useEffect(() => {
    if (isReaderView) {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      return;
    }

    // Optimize performance: pause video when tab/document is inactive
    const handleVisibilityChange = () => {
      if (!videoRef.current) return;
      if (document.hidden) {
        videoRef.current.pause();
      } else if (videoEnabled && !isReaderView) {
        videoRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isReaderView, videoEnabled]);

  // If on reader route, keep unmounted or invisible
  if (isReaderView) {
    return null;
  }

  const activeUrl = LOCAL_PRESETS[selectedPresetIndex]?.url || src;
  const activePoster = LOCAL_PRESETS[selectedPresetIndex]?.poster || '/assets/covers/the-artificial-mind.jpg';

  return (
    <div 
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none hardware-accelerated"
    >
      {/* 60fps Hardware-Accelerated Ambient Video Player */}
      {videoEnabled && (
        <video
          ref={videoRef}
          key={activeUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={activePoster}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 filter brightness-95 contrast-105 pointer-events-none"
          style={{ opacity: videoOpacity }}
        >
          <source src={activeUrl} type="video/mp4" />
        </video>
      )}

      {/* Editorial Gradient Scrim Overlays ensuring WCAG AAA 7:1 Text Contrast */}
      <div className={`absolute inset-0 pointer-events-none ${isDark ? 'scrim-editorial-dark' : 'scrim-editorial-light'} bg-gradient-to-b from-white/90 via-white/80 to-white/92`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Atmosphere Controller Pill (Bottom Right) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto z-30">
        <div className="relative">
          {showControls && (
            <div 
              role="region"
              aria-label="Cinema Atmosphere Settings"
              className="absolute bottom-12 right-0 w-72 p-4 rounded-2xl bg-white/95 border border-black/10 shadow-2xl text-xs space-y-3 animate-spring-pop backdrop-blur-2xl text-[#1d1d1f]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <span className="font-mono uppercase text-[#997328] font-semibold flex items-center gap-1.5 text-[11px]">
                  <Film className="w-3.5 h-3.5" /> Ambient Cinema
                </span>
                <button
                  type="button"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className="p-1 rounded text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                  aria-label="Toggle ambient video"
                >
                  {videoEnabled ? <Eye className="w-3.5 h-3.5 text-[#997328]" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div>
                <label className="text-[#6e6e73] block mb-1 font-mono text-[10px] tracking-wider uppercase">
                  Cinematic Preset
                </label>
                <div className="space-y-1">
                  {LOCAL_PRESETS.map((preset, index) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedPresetIndex(index)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-all text-[11px] flex items-center justify-between ${
                        selectedPresetIndex === index
                          ? 'bg-[#c5a059]/15 text-[#997328] font-semibold border border-[#c5a059]/30'
                          : 'text-[#515154] hover:bg-gray-100'
                      }`}
                    >
                      <span className="truncate">{preset.name}</span>
                      {selectedPresetIndex === index && <span className="w-1.5 h-1.5 rounded-full bg-[#997328] shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-[#6e6e73] mb-1 font-mono">
                  <span>SCRIM OPACITY</span>
                  <span>{Math.round(videoOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={videoOpacity}
                  onChange={(e) => setVideoOpacity(parseFloat(e.target.value))}
                  className="w-full accent-[#997328] cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                  aria-label="Adjust video opacity"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowControls(!showControls)}
            className="px-3 py-1.5 rounded-full bg-white/90 border border-black/10 hover:border-[#c5a059]/50 text-[#1d1d1f] hover:text-[#997328] text-xs font-mono flex items-center gap-2 shadow-sm transition-all active:scale-95 backdrop-blur-md cursor-pointer"
            title="Configure Ambient Atmosphere"
            aria-label="Configure Ambient Atmosphere"
          >
            <span className={`w-2 h-2 rounded-full ${videoEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
            <Film className="w-3.5 h-3.5 text-[#997328]" />
            <span className="hidden sm:inline font-medium">Ambient Film</span>
            <Sliders className="w-3 h-3 text-[#6e6e73]" />
          </button>
        </div>
      </div>
    </div>
  );
}
