import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number; // Depth 0.2 - 1.0 (for parallax & speed variation)
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  isBeacon: boolean; // Special bright glowing star
}


export const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
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

    // Mouse influence
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetDriftX = 0;
    let targetDriftY = 0;
    let currentDriftX = 0;
    let currentDriftY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Gentle parallax shift based on cursor
      targetDriftX = ((mouseX / width) - 0.5) * 0.35;
      targetDriftY = ((mouseY / height) - 0.5) * 0.35;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Generate stars
    const starCount = Math.min(130, Math.floor((width * height) / 10000));
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const z = Math.random() * 0.8 + 0.2; // Depth
      const isBeacon = Math.random() < 0.08; // 8% are bright beacon stars
      const speedMagnitude = (Math.random() * 0.25 + 0.08) * z;
      // Drift predominantly upwards and slightly left/right (floating cosmic dust)
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.9;

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z,
        size: isBeacon ? Math.random() * 1.5 + 2.2 : Math.random() * 1.4 + 0.6,
        vx: Math.cos(angle) * speedMagnitude,
        vy: Math.sin(angle) * speedMagnitude,
        alpha: Math.random() * 0.7 + 0.3,
        baseAlpha: Math.random() * 0.5 + 0.4,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        isBeacon,
      });
    }

    // Comet interface & state
    interface CometParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      decay: number;
      color: string;
    }

    interface Comet {
      x: number;
      y: number;
      vx: number;
      vy: number;
      speed: number;
      angle: number;
      tailLength: number;
      radius: number;
      tailParticles: CometParticle[];
    }

    let activeComet: Comet | null = null;
    // Initial comet appears 1.5 seconds after loading, then repeats with 5s delay
    let nextCometSpawnTime = performance.now() + 1500;

    const spawnComet = () => {
      const margin = 100;
      // Pick random side to enter: 0 = top, 1 = right, 2 = bottom, 3 = left
      const side = Math.floor(Math.random() * 4);
      let startX = 0;
      let startY = 0;
      let targetX = 0;
      let targetY = 0;

      if (side === 0) {
        // Top edge -> travels towards bottom
        startX = Math.random() * width * 0.8 + width * 0.1;
        startY = -margin;
        targetX = Math.random() * width;
        targetY = height + margin;
      } else if (side === 1) {
        // Right edge -> travels towards left
        startX = width + margin;
        startY = Math.random() * height * 0.8 + height * 0.1;
        targetX = -margin;
        targetY = Math.random() * height;
      } else if (side === 2) {
        // Bottom edge -> travels towards top
        startX = Math.random() * width * 0.8 + width * 0.1;
        startY = height + margin;
        targetX = Math.random() * width;
        targetY = -margin;
      } else {
        // Left edge -> travels towards right
        startX = -margin;
        startY = Math.random() * height * 0.8 + height * 0.1;
        targetX = width + margin;
        targetY = Math.random() * height;
      }

      const dx = targetX - startX;
      const dy = targetY - startY;
      const dist = Math.hypot(dx, dy) || 1;
      const speed = Math.random() * 1.5 + 3.2; // Slowed down from 6.5-9 to 3.2-4.7 px/frame for cinematic glide
      const angle = Math.atan2(dy, dx);

      activeComet = {
        x: startX,
        y: startY,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
        speed,
        angle,
        tailLength: Math.random() * 100 + 320, // Increased to 320-420px majestic tail
        radius: 6.5, // Increased nucleus radius
        tailParticles: [],
      };
    };

    // Theme color cache
    let cachedTheme = '';
    let starColor = '#d8b4fe';
    let beaconColor = '#a855f7';
    let haloColor = 'rgba(168, 85, 247, 0.35)';

    const updateColors = () => {
      const currentThemeAttr = document.documentElement.getAttribute('data-theme') || 'violet';
      if (currentThemeAttr !== cachedTheme) {
        cachedTheme = currentThemeAttr;
        const styles = getComputedStyle(document.documentElement);
        starColor = styles.getPropertyValue('--star-color').trim() || '#d8b4fe';
        beaconColor = styles.getPropertyValue('--neon-primary').trim() || '#a855f7';
        haloColor = styles.getPropertyValue('--neon-glow').trim() ? beaconColor : 'rgba(168, 85, 247, 0.35)';
      }
    };

    let time = 0;
    const render = () => {
      time++;
      const now = performance.now();
      updateColors();

      // Smooth drift damping
      currentDriftX += (targetDriftX - currentDriftX) * 0.05;
      currentDriftY += (targetDriftY - currentDriftY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Check if it's time to spawn a new comet (5 seconds after previous one disappeared)
      if (!activeComet && now >= nextCometSpawnTime) {
        spawnComet();
      }

      // Render & update stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Move star
        s.x += s.vx + currentDriftX * s.z;
        s.y += s.vy + currentDriftY * s.z;

        // Wrap around boundaries
        if (s.x < -10) s.x = width + 10;
        else if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        else if (s.y > height + 10) s.y = -10;

        // Twinkle calculation
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = Math.max(0.15, Math.min(1, s.baseAlpha + Math.sin(s.twinklePhase) * 0.35));

        // Draw star
        if (s.isBeacon) {
          // Multi-layer glowing beacon star (like in user's screenshot)
          ctx.save();
          // Outer halo
          const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 5);
          gradient.addColorStop(0, beaconColor);
          gradient.addColorStop(0.3, beaconColor);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.globalAlpha = currentAlpha * 0.8;
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 5, 0, Math.PI * 2);
          ctx.fill();

          // Bright inner core
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Standard drifting twinkling star
          ctx.save();
          ctx.globalAlpha = currentAlpha * s.z;
          ctx.fillStyle = starColor;
          ctx.shadowBlur = s.size > 1.5 ? 6 : 2;
          ctx.shadowColor = beaconColor;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Render & update Comet
      if (activeComet) {
        const c = activeComet;

        // Advance comet head
        c.x += c.vx;
        c.y += c.vy;

        // Emit trail embers (larger and more abundant)
        if (Math.random() < 0.9) {
          const spread = (Math.random() - 0.5) * 12;
          c.tailParticles.push({
            x: c.x - Math.cos(c.angle) * 14 + Math.sin(c.angle) * spread,
            y: c.y - Math.sin(c.angle) * 14 - Math.cos(c.angle) * spread,
            vx: -Math.cos(c.angle) * (Math.random() * 1.8) + (Math.random() - 0.5) * 0.8,
            vy: -Math.sin(c.angle) * (Math.random() * 1.8) + (Math.random() - 0.5) * 0.8,
            size: Math.random() * 3 + 1.8,
            alpha: 0.85,
            decay: Math.random() * 0.025 + 0.015,
            color: Math.random() < 0.35 ? '#ffffff' : beaconColor,
          });
        }

        // Calculate tail end coordinates
        const tailEndX = c.x - Math.cos(c.angle) * c.tailLength;
        const tailEndY = c.y - Math.sin(c.angle) * c.tailLength;

        // 1. Draw glowing multi-tier tail line
        ctx.save();
        const tailGrad = ctx.createLinearGradient(c.x, c.y, tailEndX, tailEndY);
        tailGrad.addColorStop(0, '#ffffff');
        tailGrad.addColorStop(0.12, beaconColor);
        tailGrad.addColorStop(0.6, beaconColor);
        tailGrad.addColorStop(1, 'rgba(0,0,0,0)');

        // Tier A: Wide outer soft glow aura
        ctx.strokeStyle = tailGrad;
        ctx.lineWidth = 14;
        ctx.globalAlpha = 0.22;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailEndX, tailEndY);
        ctx.stroke();

        // Tier B: Mid-body vibrant beam
        ctx.lineWidth = 6;
        ctx.globalAlpha = 0.65;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailEndX, tailEndY);
        ctx.stroke();

        // Tier C: Intense inner core laser
        ctx.lineWidth = 2.8;
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(tailEndX, tailEndY);
        ctx.stroke();
        ctx.restore();

        // 2. Draw stardust ember particles
        for (let pIdx = c.tailParticles.length - 1; pIdx >= 0; pIdx--) {
          const tp = c.tailParticles[pIdx];
          tp.x += tp.vx;
          tp.y += tp.vy;
          tp.alpha -= tp.decay;

          if (tp.alpha <= 0) {
            c.tailParticles.splice(pIdx, 1);
            continue;
          }

          ctx.save();
          ctx.globalAlpha = tp.alpha;
          ctx.fillStyle = tp.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = beaconColor;
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, tp.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // 3. Draw comet head (expanded coma & brilliant white-hot nucleus)
        ctx.save();
        // Coma outer radiant corona (up to 38px radius)
        const outerCorona = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 38);
        outerCorona.addColorStop(0, '#ffffff');
        outerCorona.addColorStop(0.2, beaconColor);
        outerCorona.addColorStop(0.65, haloColor);
        outerCorona.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.globalAlpha = 0.85;
        ctx.fillStyle = outerCorona;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 38, 0, Math.PI * 2);
        ctx.fill();

        // Inner dense halo
        const innerHalo = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 16);
        innerHalo.addColorStop(0, '#ffffff');
        innerHalo.addColorStop(0.5, beaconColor);
        innerHalo.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.globalAlpha = 0.95;
        ctx.fillStyle = innerHalo;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 16, 0, Math.PI * 2);
        ctx.fill();

        // Nucleus core (large brilliant white light)
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4. Check if comet AND its tail have completely exited screen
        const margin = 460;
        const isHeadOffscreen =
          c.x < -margin || c.x > width + margin || c.y < -margin || c.y > height + margin;
        const isTailOffscreen =
          tailEndX < -margin || tailEndX > width + margin || tailEndY < -margin || tailEndY > height + margin;

        if (isHeadOffscreen && isTailOffscreen && c.tailParticles.length === 0) {
          // Completely disappeared! Set 5-second wait before next appearance
          activeComet = null;
          nextCometSpawnTime = performance.now() + 5000; // Exactly 5 seconds
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
