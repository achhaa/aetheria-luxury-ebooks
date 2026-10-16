import React, { useEffect, useRef, useState } from 'react';
import { Film, Eye, EyeOff, Sliders } from 'lucide-react';

const VIDEO_PRESETS = [
  {
    id: 'abstract-luxury',
    name: 'Liquid Gold & Deep Light',
    // High-performance public CDN ambient loop video
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
  const [videoOpacity, setVideoOpacity] = useState(0.25);
  const [showControls, setShowControls] = useState(false);

  // Interactive Particle Constellation Canvas
  useEffect(() => {
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

    // Particle pool
    const particleCount = Math.min(65, Math.floor(width / 25));
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.8 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(212, 175, 55, ' : 'rgba(6, 182, 212, ',
        baseAlpha: Math.random() * 0.35 + 0.15,
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

      // Draw subtle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = 0.6;
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

        // Subtle mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 90) {
          p.x += (dx / dist) * 1.2;
          p.y += (dy / dist) * 1.2;
        }

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
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 filter brightness-75 contrast-125 saturate-150"
          style={{ opacity: videoOpacity }}
        >
          <source src={VIDEO_PRESETS[selectedVideo].url} type="video/mp4" />
        </video>
      )}

      {/* Luxury Obsidian Gradient Film Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950/80 via-obsidian-950/60 to-obsidian-950/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.08)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.06)_0%,transparent_50%)]" />

      {/* Interactive Starlight / Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Floating Atmosphere Controller Pill (Bottom Right) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto z-30">
        <div className="relative">
          {showControls && (
            <div className="absolute bottom-12 right-0 w-72 p-4 rounded-2xl glass-panel-gold border border-gold-500/30 shadow-2xl text-xs space-y-3 animate-fade-in backdrop-blur-2xl">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-mono uppercase text-gold-400 font-semibold flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5" /> Ambient Cinema
                </span>
                <button
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className="text-slate-400 hover:text-white"
                >
                  {videoEnabled ? <Eye className="w-3.5 h-3.5 text-gold-400" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono text-[10px]">VIDEO ATMOSPHERE</label>
                <div className="space-y-1">
                  {VIDEO_PRESETS.map((preset, index) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedVideo(index)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-all text-[11px] flex items-center justify-between ${
                        selectedVideo === index
                          ? 'bg-gold-500/20 text-gold-300 font-medium border border-gold-500/30'
                          : 'text-slate-300 hover:bg-white/5'
                      }`}
                    >
                      <span>{preset.name}</span>
                      {selectedVideo === index && <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>VIDEO LUMINANCE</span>
                  <span>{Math.round(videoOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.6"
                  step="0.05"
                  value={videoOpacity}
                  onChange={(e) => setVideoOpacity(parseFloat(e.target.value))}
                  className="w-full accent-gold-500 cursor-pointer h-1.5 bg-obsidian-800 rounded-lg"
                />
              </div>
            </div>
          )}

          <button
            onClick={() => setShowControls(!showControls)}
            className="px-3.5 py-2 rounded-full glass-panel border border-white/10 hover:border-gold-500/40 text-slate-300 hover:text-gold-300 text-xs font-mono flex items-center gap-2 shadow-lg transition-all active:scale-95 group"
            title="Configure Background Atmosphere"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Film className="w-3.5 h-3.5 text-gold-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Cinema Backdrop</span>
            <Sliders className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
