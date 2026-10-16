import React, { useEffect, useRef, useState } from 'react';
import { Film, Eye, EyeOff, Sliders } from 'lucide-react';

const VIDEO_PRESETS = [
  {
    id: 'abstract-luxury',
    name: 'Liquid Gold & Deep Light',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-flowing-glowing-lines-41584-large.mp4',
    poster: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cosmic-nebula',
    name: 'Astral Cosmos & Nebula',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4',
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'cyber-waves',
    name: 'Cyber Mesh Dynamics',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-tunnel-with-purple-and-blue-neon-lights-32982-large.mp4',
    poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'
  }
];

export default function BackgroundVideo() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [videoOpacity, setVideoOpacity] = useState(0.22);
  const [showControls, setShowControls] = useState(false);

  // Interactive Particle Constellation Canvas
  useEffect(() => {
    // Respect user's reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setVideoEnabled(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Subtle ambient particle pool
    const particleCount = Math.min(45, Math.floor(width / 35));
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.6,
        color: Math.random() > 0.5 ? 'rgba(197, 160, 89, ' : 'rgba(14, 165, 233, ',
        baseAlpha: Math.random() * 0.25 + 0.1,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle constellation filaments
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.05;
            ctx.strokeStyle = `rgba(197, 160, 89, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `${p.color}${p.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Video */}
      {videoEnabled && (
        <video
          ref={videoRef}
          key={VIDEO_PRESETS[selectedVideo].url}
          autoPlay
          loop
          muted
          playsInline
          poster={VIDEO_PRESETS[selectedVideo].poster}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 filter brightness-70 contrast-110"
          style={{ opacity: videoOpacity }}
        >
          <source src={VIDEO_PRESETS[selectedVideo].url} type="video/mp4" />
        </video>
      )}

      {/* Editorial Gradient Film Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#07080a]/85 via-[#07080a]/70 to-[#07080a]/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(197,160,89,0.06)_0%,transparent_50%)]" />

      {/* Interactive Starlight / Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50" />

      {/* Atmosphere Controller Pill (Bottom Right) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto z-30">
        <div className="relative">
          {showControls && (
            <div className="absolute bottom-12 right-0 w-72 p-4 rounded-2xl bg-[#0c0e14]/95 border border-[#c5a059]/30 shadow-2xl text-xs space-y-3 animate-fade-in backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-mono uppercase text-[#c5a059] font-semibold flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" /> Ambient Cinema
                </span>
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className="text-slate-400 hover:text-white"
                  aria-label="Toggle video"
                >
                  {videoEnabled ? <Eye className="w-3.5 h-3.5 text-[#c5a059]" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">PRESET</label>
                <div className="space-y-1">
                  {VIDEO_PRESETS.map((preset, index) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedVideo(index)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-all text-[11px] flex items-center justify-between ${
                        selectedVideo === index
                          ? 'bg-[#c5a059]/20 text-[#dfc079] font-medium border border-[#c5a059]/30'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{preset.name}</span>
                      {selectedVideo === index && <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>OPACITY</span>
                  <span>{Math.round(videoOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.5"
                  step="0.05"
                  value={videoOpacity}
                  onChange={(e) => setVideoOpacity(parseFloat(e.target.value))}
                  className="w-full accent-[#c5a059] cursor-pointer h-1.5 bg-[#1a1d26] rounded-lg"
                />
              </div>
            </div>
          )}

          <button
            onClick={() => setShowControls(!showControls)}
            className="px-3.5 py-2 rounded-full bg-[#0d0f14]/80 border border-white/10 hover:border-[#c5a059]/40 text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2 shadow-lg transition-all active:scale-95 group"
            title="Configure Background Atmosphere"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Film className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden sm:inline">Cinema Backdrop</span>
            <Sliders className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
