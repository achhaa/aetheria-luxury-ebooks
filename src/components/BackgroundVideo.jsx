import React, { useEffect, useRef } from 'react';

/**
 * AETHERIA AMBIENT BACKGROUND VIDEO
 * Seamless, full-bleed, hardware-accelerated ambient video playing across the entire storefront.
 * Always auto-plays without user interaction, with calibrated visibility and contrast scrims.
 * Distraction-free reader isolation: completely unmounts on /read/* routes.
 */
export default function BackgroundVideo({ 
  isReaderView = false, 
  src = '/assets/videos/ambient-background.mp4',
  isDark = true,
  isCardVideoPlaying = false
}) {
  const videoRef = useRef(null);

  // Reliable Autoplay Enforcement & Tab Inactivity Optimization
  useEffect(() => {
    if (isReaderView) return;
    const video = videoRef.current;
    if (!video) return;

    // Browser autoplay policy compliance: must be explicitly muted and playsInline
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playVideo = () => {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.debug('[BackgroundVideo] Autoplay waiting for interaction:', err);
        });
      }
    };

    playVideo();

    // Universal unlock listeners on first user gesture if browser held back video
    const unlockAutoplay = () => {
      if (video && video.paused && !isCardVideoPlaying) {
        video.play().catch(() => {});
      }
    };

    window.addEventListener('pointerdown', unlockAutoplay, { passive: true, once: true });
    window.addEventListener('click', unlockAutoplay, { passive: true, once: true });
    window.addEventListener('scroll', unlockAutoplay, { passive: true, once: true });
    window.addEventListener('touchstart', unlockAutoplay, { passive: true, once: true });

    // Pause when tab is hidden, resume when tab is visible
    const handleVisibilityChange = () => {
      if (!video) return;
      if (document.hidden || isCardVideoPlaying) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pointerdown', unlockAutoplay);
      window.removeEventListener('click', unlockAutoplay);
      window.removeEventListener('scroll', unlockAutoplay);
      window.removeEventListener('touchstart', unlockAutoplay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isReaderView, isCardVideoPlaying]);

  // GPU Budgeting: Pause background ambient video when a card preview video is playing
  useEffect(() => {
    if (isReaderView) return;
    const video = videoRef.current;
    if (!video) return;

    if (isCardVideoPlaying) {
      video.pause();
    } else if (!document.hidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.play().catch(() => {});
    }
  }, [isCardVideoPlaying, isReaderView]);

  // Distraction-free reader isolation: completely unmount DOM on reading routes
  if (isReaderView) {
    return null;
  }

  // High-clarity video opacity: video is prominently and vividly visible
  const videoOpacity = isDark ? 0.90 : 0.80;

  return (
    <div 
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none hardware-accelerated"
    >
      {/* 60fps Hardware-Accelerated Ambient Video Player — Always Autoplaying */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/assets/covers/the-artificial-mind.jpg"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 filter brightness-105 contrast-105 saturate-110 pointer-events-none"
        style={{ opacity: videoOpacity }}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* Editorial Ultra-Light Gradient Scrims — Ultra-translucent to allow vivid video movement */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
          isDark 
            ? 'scrim-editorial-dark bg-gradient-to-b from-black/35 via-black/20 to-black/45' 
            : 'scrim-editorial-light bg-gradient-to-b from-white/35 via-white/18 to-white/45'
        }`} 
      />
      
      {/* Subtle Warm Luxury Amber Radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}
