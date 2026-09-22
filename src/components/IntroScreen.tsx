import React, { useState, useEffect, useRef } from 'react';

// Use public/intro.mp4 directly to avoid JS bundler unresolved import failures during CI/CD builds
const DEFAULT_INTRO_VIDEO = '/intro.mp4';

interface IntroScreenProps {
  onContinue: () => void;
  defaultVideoSrc?: string;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  onContinue,
  defaultVideoSrc = DEFAULT_INTRO_VIDEO,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>(defaultVideoSrc);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number; active: boolean } | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Attempt autoPlay whenever video source changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy might require mute, which is already muted
      });
    }
  }, [videoSrc]);

  // Ambient canvas animation as dynamic visual backdrop / fallback
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for agentic tech constellation
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#7c5ff5' : '#22d3ee',
    }));

    let t = 0;
    const render = () => {
      t += 0.02;
      ctx.fillStyle = '#07071a';
      ctx.fillRect(0, 0, width, height);

      // Deep glowing gradient orbs
      const grad1 = ctx.createRadialGradient(
        width * 0.5 + Math.sin(t * 0.5) * 100,
        height * 0.45 + Math.cos(t * 0.5) * 80,
        20,
        width * 0.5,
        height * 0.45,
        width * 0.5
      );
      grad1.addColorStop(0, 'rgba(124, 95, 245, 0.25)');
      grad1.addColorStop(0.5, 'rgba(34, 211, 238, 0.1)');
      grad1.addColorStop(1, 'rgba(7, 7, 26, 0.95)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect nearby nodes
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 110)})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle click anywhere
  const handleScreenClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Avoid re-triggering if already exiting
    if (isExiting) return;

    setClickRipple({
      x: e.clientX,
      y: e.clientY,
      active: true,
    });

    setIsExiting(true);

    // Smooth transition into home page
    setTimeout(() => {
      onContinue();
    }, 600);
  };

  // Keyboard navigation (Enter / Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!isExiting) {
          setIsExiting(true);
          setTimeout(() => {
            onContinue();
          }, 600);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExiting, onContinue]);

  // Local file picker for user to test their 3-second video immediately
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setVideoError(false);
      setVideoLoaded(false);
    }
  };

  return (
    <div
      onClick={handleScreenClick}
      className={`fixed inset-0 z-[9999] flex items-center justify-center select-none overflow-hidden cursor-pointer transition-all duration-700 ease-out ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        background: '#07071a',
      }}
      title="Click anywhere to continue"
    >
      {/* Background Canvas (Fallback or visual atmosphere behind video) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* 3-Second Video Layer */}
      <video
        ref={videoRef}
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        onCanPlay={() => setVideoLoaded(true)}
        onLoadedData={() => setVideoLoaded(true)}
        onLoadedMetadata={() => setVideoLoaded(true)}
        onError={() => {
          setVideoError(true);
          setVideoLoaded(false);
        }}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
          videoLoaded && !videoError ? 'opacity-90' : 'opacity-0'
        }`}
        style={{ filter: 'brightness(0.85) contrast(1.1)' }}
      />

      {/* Cinematic Vignette & Cyber Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, rgba(7, 7, 26, 0.35) 0%, rgba(7, 7, 26, 0.8) 75%, #07071a 100%)',
        }}
      />

      {/* Subtle Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 38, 0) 50%, rgba(0, 0, 0, 0.5) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Central Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-2xl pointer-events-none">
        {/* Futuristic Hexagon Crest / Logo */}
        <div className="relative mb-8 group">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center relative z-10 transition-transform duration-500 transform group-hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, rgba(124,95,245,0.35), rgba(34,211,238,0.2))',
              border: '1px solid rgba(168,85,247,0.5)',
              boxShadow: '0 0 35px rgba(124,95,245,0.4), inset 0 0 15px rgba(34,211,238,0.3)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <span
              className="text-4xl filter drop-shadow-[0_0_12px_#7c5ff5]"
              style={{ color: '#ffffff' }}
            >
              ⬡
            </span>
          </div>

          {/* Glowing pulse rings behind crest */}
          <div
            className="absolute inset-0 rounded-2xl animate-ping opacity-30"
            style={{
              border: '2px solid #7c5ff5',
              animationDuration: '2.5s',
            }}
          />
          <div
            className="absolute -inset-2 rounded-2xl animate-pulse opacity-40 blur-md"
            style={{
              background: 'radial-gradient(circle, #7c5ff5 0%, #22d3ee 100%)',
            }}
          />
        </div>

        {/* Brand Title / Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#22d3ee]" />
          <span
            className="text-xs uppercase font-bold tracking-[0.3em]"
            style={{ color: 'var(--accent-cyan)' }}
          >
            AGENTBLAZER ARCHITECTURE
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#22d3ee]" />
        </div>

        {/* Click to Continue Center Banner */}
        <div className="relative py-4 px-8 mt-2">
          {/* Glowing border box */}
          <div
            className="absolute inset-0 rounded-2xl opacity-60 transition-all duration-300"
            style={{
              border: '1px solid rgba(168, 85, 247, 0.4)',
              background: 'linear-gradient(135deg, rgba(124, 95, 245, 0.12), rgba(34, 211, 238, 0.08))',
              boxShadow: '0 0 30px rgba(124, 95, 245, 0.25)',
              backdropFilter: 'blur(12px)',
            }}
          />

          {/* MAIN "CLICK TO CONTINUE" TEXT */}
          <h1
            className="relative z-10 text-2xl md:text-4xl font-extrabold tracking-[0.22em] uppercase animate-pulse"
            style={{
              fontFamily: "'Inter', sans-serif",
              background: 'linear-gradient(135deg, #ffffff 0%, #d4d4f7 50%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 25px rgba(124, 95, 245, 0.6), 0 0 50px rgba(34, 211, 238, 0.3)',
            }}
          >
            Click to Continue
          </h1>
        </div>

        {/* Subtitle / Interaction prompt */}
        <p
          className="mt-6 text-sm tracking-wider font-medium flex items-center gap-2"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span className="inline-block w-2 h-2 rounded-full bg-[#22d3ee] animate-ping" />
          Click anywhere on the screen to enter
        </p>

        {/* Mouse / Tap Visual Indicator */}
        <div className="mt-8 flex flex-col items-center gap-2 opacity-70">
          <div
            className="w-5 h-8 rounded-full border-2 flex justify-center pt-1"
            style={{ borderColor: 'rgba(255, 255, 255, 0.35)' }}
          >
            <div className="w-1 h-2 rounded-full bg-[#22d3ee] animate-bounce" />
          </div>
          <span className="text-[10px] tracking-widest text-slate-400 uppercase">
            Tap anywhere
          </span>
        </div>
      </div>

      {/* Interactive Click Ripple */}
      {clickRipple && clickRipple.active && (
        <div
          className="absolute rounded-full pointer-events-none animate-ping"
          style={{
            left: clickRipple.x - 40,
            top: clickRipple.y - 40,
            width: 80,
            height: 80,
            background: 'radial-gradient(circle, rgba(34, 211, 238, 0.8) 0%, rgba(124, 95, 245, 0) 70%)',
            boxShadow: '0 0 40px rgba(34, 211, 238, 0.6)',
          }}
        />
      )}

      {/* Video Source Helper & Upload Button (Allows user to immediately provide or test their video) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-[#0d0d28]/80 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="text-[11px] opacity-75">
          {videoLoaded && !videoError ? '🎥 3s Video Active' : '📁 Intro Video: place at /public/intro.mp4'}
        </span>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-2.5 py-1 bg-[#7c5ff5]/30 hover:bg-[#7c5ff5]/50 border border-[#7c5ff5]/40 rounded-lg text-white font-medium text-[11px] cursor-pointer transition-all"
        >
          {videoLoaded ? 'Change Video' : 'Select Video File'}
        </button>
      </div>
    </div>
  );
};
