import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  decay: number;
  color: string;
}

export const CustomCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only enable on desktop with fine mouse pointer
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;

    if (isTouch) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse coordinates
    let mouseX = -100;
    let mouseY = -100;
    let orbX = -100;
    let orbY = -100;
    let isVisible = false;
    let isHovering = false;
    let isClicking = false;

    // Trail and spark particles
    const particles: Particle[] = [];

    // Helper to get current theme colors from CSS variables
    const getThemeColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const color = styles.getPropertyValue('--cursor-color').trim() || '#a855f7';
      const glow = styles.getPropertyValue('--cursor-glow').trim() || 'rgba(168, 85, 247, 0.85)';
      const spark = styles.getPropertyValue('--cursor-spark').trim() || '#c084fc';
      return { color, glow, spark };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        orbX = mouseX;
        orbY = mouseY;
      }

      // Check for interactive hover
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest(
            'a, button, input, textarea, select, [role="button"], .card, .theme-btn, .badge, .pill-badge'
          )
        );
        isHovering = interactive;
      }

      // Spawn short subtle trailing particles behind pointer
      const { spark, color } = getThemeColors();
      const dist = Math.hypot(mouseX - orbX, mouseY - orbY);
      if (dist > 3) {
        particles.push({
          x: orbX + (Math.random() - 0.5) * 4,
          y: orbY + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 2 + 1.2,
          alpha: 0.75,
          decay: Math.random() * 0.04 + 0.035, // short lifespan ~15-25 frames
          color: Math.random() > 0.5 ? spark : color,
        });
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isClicking = true;
      const { spark, color } = getThemeColors();

      // Spawn tiny click burst of 6 sparks
      for (let i = 0; i < 7; i++) {
        const angle = (Math.PI * 2 * i) / 7 + (Math.random() - 0.5) * 0.4;
        const speed = Math.random() * 2 + 1.2;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.2 + 1.5,
          alpha: 1,
          decay: 0.05,
          color: i % 2 === 0 ? spark : color,
        });
      }
    };

    const handleMouseUp = () => {
      isClicking = false;
    };

    const handleMouseLeave = () => {
      isVisible = false;
    };

    const handleMouseEnter = () => {
      isVisible = true;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (isVisible) {
        // Smooth organic lag for orb (follows slightly behind the normal mouse arrow)
        orbX += (mouseX - orbX) * 0.28;
        orbY += (mouseY - orbY) * 0.28;

        const { color, glow } = getThemeColors();

        // 1. Draw tiny trailing spark particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.restore();
        }

        // 2. Draw Main Small Glowing Particle Orb (positioned right near pointer tip)
        const baseRadius = isHovering ? 5.5 : isClicking ? 3.5 : 4.5;
        const glowRadius = isHovering ? 20 : isClicking ? 12 : 15;

        ctx.save();
        // Soft outer glow halo
        ctx.beginPath();
        ctx.arc(orbX, orbY, baseRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowColor = glow;
        ctx.shadowBlur = glowRadius;
        ctx.fill();

        // Bright small core center
        ctx.beginPath();
        ctx.arc(orbX, orbY, baseRadius * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Return nothing on touch / mobile
  if (
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0)
  ) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="custom-cursor-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  );
};
