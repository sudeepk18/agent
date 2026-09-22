import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface DynamicGeoShapeProps {
  type?: 'polyhedron' | 'icosahedron' | 'cube';
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  speedMultiplier?: number;
}

// 3D Polyhedron matching the AgentBlazer geometric motif
const createCubeVertices = (scale: number): Point3D[] => {
  const s = scale;
  return [
    { x: -s, y: -s, z: -s },
    { x: s, y: -s, z: -s },
    { x: s, y: s, z: -s },
    { x: -s, y: s, z: -s },
    { x: -s, y: -s, z: s },
    { x: s, y: -s, z: s },
    { x: s, y: s, z: s },
    { x: -s, y: s, z: s },
  ];
};

const cubeEdges: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
  // Cross diagonals for faceted futuristic look
  [0, 6], [1, 7], [2, 4], [3, 5],
];

// Inner diamond/core
const createOctahedronVertices = (scale: number): Point3D[] => {
  const s = scale * 0.55;
  return [
    { x: 0, y: -s, z: 0 },
    { x: s, y: 0, z: 0 },
    { x: 0, y: s, z: 0 },
    { x: -s, y: 0, z: 0 },
    { x: 0, y: 0, z: -s },
    { x: 0, y: 0, z: s },
  ];
};

const octahedronEdges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
  [2, 1], [2, 3], [2, 4], [2, 5],
  [1, 4], [4, 3], [3, 5], [5, 1],
];

export const DynamicGeoShape: React.FC<DynamicGeoShapeProps> = ({
  type = 'polyhedron',
  size = 130,
  className = '',
  style = {},
  speedMultiplier = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const baseScale = size * 0.35;

    // Vertices & edges
    const vertices = createCubeVertices(baseScale);
    const innerVertices = createOctahedronVertices(baseScale);

    let angleX = Math.random() * Math.PI;
    let angleY = Math.random() * Math.PI;
    let angleZ = Math.random() * Math.PI;

    const rotSpeedX = 0.005 * speedMultiplier;
    const rotSpeedY = 0.008 * speedMultiplier;
    const rotSpeedZ = 0.004 * speedMultiplier;

    let animId: number;
    let time = 0;

    // Interactive tilt
    let mouseInfluenceX = 0;
    let mouseInfluenceY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);
      mouseInfluenceX = dx * 0.02;
      mouseInfluenceY = dy * 0.02;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const project = (p: Point3D, rotX: number, rotY: number, rotZ: number, fov = 350) => {
      // Rotate Y
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.z * cosY + p.x * sinY;

      // Rotate X
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = z1 * cosX + p.y * sinX;

      // Rotate Z
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);
      const x3 = x1 * cosZ - y2 * sinZ;
      const y3 = y2 * cosZ + x1 * sinZ;

      const perspective = fov / (fov + z2);
      return {
        x: cx + x3 * perspective,
        y: cy + y3 * perspective,
        z: z2,
        scale: perspective,
      };
    };

    const render = () => {
      time++;
      angleX += rotSpeedX + mouseInfluenceY;
      angleY += rotSpeedY + mouseInfluenceX;
      angleZ += rotSpeedZ;

      ctx.clearRect(0, 0, size, size);

      // Get current theme color
      const styles = getComputedStyle(document.documentElement);
      const primaryNeon = styles.getPropertyValue('--neon-primary').trim() || '#a855f7';
      const accentNeon = styles.getPropertyValue('--neon-accent').trim() || '#6366f1';

      // Project outer cube
      const projectedOuter = vertices.map((v) => project(v, angleX, angleY, angleZ));

      // Draw outer edges
      ctx.lineWidth = 1.2;
      for (const [i, j] of cubeEdges) {
        const p1 = projectedOuter[i];
        const p2 = projectedOuter[j];

        // Depth cueing
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.18, Math.min(0.85, 0.5 + avgZ / 200));

        ctx.strokeStyle = primaryNeon;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Project & draw inner octahedron (counter-rotating)
      const projectedInner = innerVertices.map((v) => project(v, -angleX * 1.2, -angleY * 1.2, angleZ * 1.2));

      ctx.lineWidth = 0.8;
      for (const [i, j] of octahedronEdges) {
        const p1 = projectedInner[i];
        const p2 = projectedInner[j];
        ctx.strokeStyle = accentNeon;
        ctx.globalAlpha = 0.45;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // Draw glowing vertices (outer)
      for (const p of projectedOuter) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = primaryNeon;
        ctx.shadowBlur = 8;
        ctx.shadowColor = primaryNeon;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2 * p.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      // Draw glowing vertices (inner)
      for (const p of projectedInner) {
        ctx.globalAlpha = 0.75;
        ctx.fillStyle = accentNeon;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size, speedMultiplier]);

  return (
    <div
      className={`dynamic-geo-wrapper ${className}`}
      style={{
        width: size,
        height: size,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: size,
          height: size,
          display: 'block',
          filter: 'drop-shadow(0 0 12px var(--neon-primary))',
        }}
      />
    </div>
  );
};

export const GeoShapeLeft: React.FC = () => {
  return (
    <div
      className="geo-shape-left-container fixed pointer-events-none z-0"
      style={{
        position: 'fixed',
        left: '2vw',
        top: '22vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <DynamicGeoShape size={140} speedMultiplier={1} />
    </div>
  );
};

export const GeoShapeRight: React.FC = () => {
  return (
    <div
      className="geo-shape-right-container fixed pointer-events-none z-0"
      style={{
        position: 'fixed',
        right: '2.5vw',
        bottom: '12vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <DynamicGeoShape size={120} speedMultiplier={0.8} />
    </div>
  );
};
