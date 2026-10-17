import React, { useEffect, useState, useRef, useCallback } from 'react';

/**
 * WordUnderlineGlider
 * 
 * Hardware-accelerated fluid underline glider for synchronized audiobook narration.
 * Tracks active spoken word bounding client rect smoothly with:
 * - translate3d transforms
 * - spring physics (cubic-bezier(0.25, 1, 0.5, 1))
 * - intelligent line-wrap detection (prevents diagonal jump across lines)
 * - luxury theme glow:
 *     - Ivory: antique gold glow
 *     - Sepia: warm terracotta glow
 *     - Night: electric sapphire/luminous cyan glow
 */
export default function WordUnderlineGlider({
  containerRef,
  activeWordIndex,
  theme = 'ivory',
  isEnabled = true
}) {
  const [gliderState, setGliderState] = useState({
    x: 0,
    y: 0,
    width: 0,
    opacity: 0,
    isLineWrap: false
  });

  const lastPosRef = useRef(null);
  const wordGeometryCacheRef = useRef(new Map());

  // Invalidate word coordinates on window resize or theme/font change
  const invalidateCache = useCallback(() => {
    wordGeometryCacheRef.current.clear();
  }, []);

  useEffect(() => {
    window.addEventListener('resize', invalidateCache);
    return () => window.removeEventListener('resize', invalidateCache);
  }, [invalidateCache]);

  const updateGliderPosition = useCallback(() => {
    if (!isEnabled || activeWordIndex < 0 || !containerRef?.current) {
      setGliderState(prev => prev.opacity === 0 ? prev : { ...prev, opacity: 0 });
      return;
    }

    const container = containerRef.current;
    let target = wordGeometryCacheRef.current.get(activeWordIndex);

    if (!target) {
      const wordEl = container.querySelector(`[data-word-idx="${activeWordIndex}"]`);
      if (!wordEl) {
        setGliderState(prev => prev.opacity === 0 ? prev : { ...prev, opacity: 0 });
        return;
      }

      const wordRect = wordEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      target = {
        x: wordRect.left - containerRect.left + container.scrollLeft,
        y: wordRect.bottom - containerRect.top + container.scrollTop - 2,
        width: Math.max(wordRect.width, 8)
      };
      wordGeometryCacheRef.current.set(activeWordIndex, target);
    }

    const prevPos = lastPosRef.current;
    // Line wrap detected if vertical position changes significantly (> 10px)
    const isLineWrap = prevPos ? Math.abs(target.y - prevPos.y) > 10 : false;

    lastPosRef.current = target;

    setGliderState({
      x: target.x,
      y: target.y,
      width: target.width,
      opacity: 1,
      isLineWrap
    });
  }, [isEnabled, activeWordIndex, containerRef]);

  useEffect(() => {
    updateGliderPosition();
  }, [updateGliderPosition]);

  // Luxury theme styling
  const themeStyles = {
    ivory: {
      backgroundColor: '#c5a059',
      boxShadow: '0 0 10px rgba(197, 160, 89, 0.75), 0 1px 3px rgba(153, 115, 40, 0.45)'
    },
    sepia: {
      backgroundColor: '#b8682e',
      boxShadow: '0 0 10px rgba(184, 104, 46, 0.75), 0 1px 3px rgba(140, 76, 26, 0.45)'
    },
    sage: {
      backgroundColor: '#2e7d32',
      boxShadow: '0 0 10px rgba(46, 125, 50, 0.75), 0 1px 3px rgba(27, 94, 32, 0.45)'
    },
    night: {
      backgroundColor: '#38bdf8',
      boxShadow: '0 0 14px rgba(56, 189, 248, 0.85), 0 0 4px rgba(0, 229, 255, 0.95)'
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.ivory;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-10 rounded-full h-[3px]"
      style={{
        ...currentTheme,
        top: 0,
        left: 0,
        width: `${gliderState.width}px`,
        opacity: gliderState.opacity,
        transform: `translate3d(${gliderState.x}px, ${gliderState.y}px, 0)`,
        // If line-wrapping, snap instantly without diagonal jump; otherwise glide smoothly with spring physics
        transition: gliderState.isLineWrap
          ? 'opacity 120ms ease-out, width 120ms ease-out'
          : 'transform 200ms cubic-bezier(0.25, 1, 0.5, 1), width 180ms cubic-bezier(0.25, 1, 0.5, 1), opacity 150ms ease-out',
        willChange: 'transform, width, opacity'
      }}
    />
  );
}
