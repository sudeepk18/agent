import { useState, useEffect, useRef } from 'react';
import logoImg from './assets/logo_transparent.png';
import { IntroScreen } from './components/IntroScreen';
import { CustomCursor } from './components/CustomCursor';
import { InaugurationSection } from './components/InaugurationSection';
import { CoreWorkingCommittee } from './components/CoreWorkingCommittee';
import { StudentCoreTeamSection, PortraitContent } from './components/StudentCoreTeamSection';
import { getMemberImage } from './components/memberImages';
import { EVENT_IMAGES, getEventImages } from './components/eventImages';
import { DataProvider, useData } from './context/DataContext';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminPanel } from './components/admin/AdminPanel';
import { usePageSEO } from './components/usePageSEO';
import { StarField } from './components/StarField';
import { GeoShapeLeft, GeoShapeRight } from './components/DynamicGeoShape';
import { apiUrl } from './config/api';

type Page = 'home' | 'about' | 'events' | 'join' | 'admin' | 'admin-login';
type Theme = 'violet' | 'inferno' | 'frost';

const THEMES: { id: Theme; label: string; icon: string }[] = [
  { id: 'violet', label: 'Violet', icon: '⚡' },
  { id: 'inferno', label: 'Inferno', icon: '🔥' },
  { id: 'frost', label: 'Frost', icon: '❄️' },
];

const NAV_LINKS: { id: Page; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'events', label: 'Events & Workshops' },
  { id: 'join', label: 'Join & Connect' },
];

const EVENTS = [
  {
    date: 'February 14, 2026',
    badge: 'FLAGSHIP MASTERCLASS',
    badgeClass: 'badge-violet',
    title: 'Master the Future: A Hands-on GSoC & LLMs Workshop',
    description: 'Practical masterclass on open-source Git PR workflows, Retrieval-Augmented Generation (RAG), Gemini AI, LangChain, LlamaIndex, CrewAI, and live Gradio prototyping.',
    meta: '80 Shortlisted Students',
    tracks: null,
  },
  {
    date: 'March 25, 2026',
    badge: 'LIVE CONTEST',
    badgeClass: 'badge-orange',
    title: 'PROMPT OPS-2K26 Challenge',
    description: 'Fast-paced prompt engineering hackathon featuring automated test suites, iterative refinement, teamwork, and live algorithmic problem solving.',
    meta: '10 Contest Photos',
    tracks: ['Track 1: 1st Year Engineers', 'Track 2: 2nd Year Engineers'],
  },
  {
    date: 'August 25, 2025',
    badge: 'SYMPOSIUM KEYNOTE',
    badgeClass: 'badge-cyan',
    title: 'Agentforce Technical Deep-Dive',
    description: 'Guiding undergraduate engineers from prompt prediction to autonomous agentic architectures, Salesforce Data Cloud integration, and real-time enterprise workflows.',
    meta: 'CSE Auditorium',
    tracks: null,
  },
  {
    date: 'March 18, 2026',
    badge: 'STUDENT LAB',
    badgeClass: 'badge-green',
    title: 'Demystifying Generative Models',
    description: 'Exploring Transformer mechanics, multi-agent consensus networks, and comparative latency benchmarks.',
    meta: null,
    tracks: null,
    leads: 'Session Leads: Prajwal Royston Cordiero & Chacko P Abraham',
  },
  {
    date: 'April 01, 2026',
    badge: 'SECURITY WORKSHOP',
    badgeClass: 'badge-red',
    title: 'Cyber Security & Career Pathways',
    description: 'Interactive demonstrations covering Shodan discovery, OSINT methods, CVE vulnerability analysis, SQL injection scenarios, and the Cyber Kill Chain.',
    meta: null,
    tracks: null,
  },
  {
    date: 'May 22, 2026',
    badge: 'DEVELOPER LAB',
    badgeClass: 'badge-blue',
    title: 'Hands-on Agentforce & AI Agents',
    description: 'Applied development lab creating Flex Prompts, dynamic contextual Sales Email templates, and agentic AI pipelines.',
    meta: null,
    tracks: null,
    platform: 'Platform: Salesforce Developer Sandbox',
  },
];

const FACULTY = [
  { initials: 'NR', name: 'Ms. Nisha Roche', role: 'Assistant Professor, CSE • Faculty Coordinator' },
  { initials: 'KF', name: 'Mr. Keith Fernandes', role: 'Assistant Professor, CSE • Faculty Coordinator' },
];

const TEAM = [
  {
    role: 'Executive President',
    name: 'Ruben Saldanha',
    title: 'President',
    titleClass: 'badge-green',
    description: 'Guiding club vision, university collaborations, and strategic workshop series.',
    highlighted: false,
  },
  {
    role: 'Executive Vice President',
    name: 'Ajay Preenal Dsouza',
    title: 'Vice President',
    titleClass: 'badge-gold',
    description: 'Coordinating student mentorship, event operations, and community growth.',
    highlighted: true,
  },
  {
    role: 'Technical Direction',
    name: 'Stevin Dsouza',
    title: 'Tech Lead',
    titleClass: 'badge-cyan',
    description: 'Technical architectures, hands-on lab environments, and repository supervision.',
    highlighted: false,
  },
  {
    role: 'Operations & Logistics',
    name: 'Frenny Chrystal Saldanha',
    title: 'Resource Head',
    titleClass: 'badge-gold',
    description: 'Managing cloud compute budgets, venue infrastructure, and participant toolkits.',
    highlighted: false,
  },
  {
    role: 'Administration',
    name: 'Joyline Galbao',
    title: 'Secretary',
    titleClass: 'badge-gold',
    description: 'Documentation, accreditation reporting, meeting minutes, and member onboarding.',
    highlighted: false,
  },
  {
    role: 'Creative Outreach',
    name: 'Chinthan N V',
    title: 'Media Head',
    titleClass: 'badge-violet',
    description: 'Brand storytelling, photo documentation, visual design, and social publications.',
    highlighted: false,
  },
];


function Navbar({ page, setPage, theme, setTheme, onShowIntro }: {
  page: Page; setPage: (p: Page) => void;
  theme: Theme; setTheme: (t: Theme) => void;
  onShowIntro?: () => void;
}) {
  return (
    <nav style={{ background: 'var(--surface)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--border-subtle)' }}
      className="sticky top-0 z-50 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage('home')}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-neon)', boxShadow: 'var(--neon-glow)' }}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold text-white transition-all">⬡</div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-white text-sm">Agent</span>
            <span style={{ color: 'var(--neon-primary)', textShadow: 'var(--neon-text-glow)' }} className="font-bold text-sm transition-colors">Blazer</span>
            <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 10 }} className="font-light">collective</span>
          </div>
          <div style={{ color: 'var(--neon-accent)', fontSize: 9, fontWeight: 500 }} className="transition-colors">Department of Computer Science &amp; Engineering</div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {NAV_LINKS.map(link => (
          <button
            key={link.id}
            onClick={() => setPage(link.id)}
            className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${page === link.id ? 'nav-active text-white' : 'text-gray-400 hover:text-white'}`}
          >
            {page === link.id && <span style={{ color: 'var(--neon-accent)', textShadow: '0 0 8px var(--neon-accent)' }} className="mr-1.5">•</span>}
            {link.label}
          </button>
        ))}
        {page === 'join' && (
          <button className="btn-primary ml-2 px-4 py-2 text-sm rounded-lg">Join &amp; Connect</button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onShowIntro && (
          <button
            onClick={onShowIntro}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-white/10 hover:border-[var(--border-neon)] text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
            style={{ background: 'var(--bg-card)' }}
            title="Replay 3-second Intro Video"
          >
            <span>▶</span>
            <span>Intro</span>
          </button>
        )}
        <div className="flex items-center gap-1.5">
          {THEMES.map(t => (
            <button
              key={t.id}
              className={`theme-btn theme-btn-${t.id} ${theme === t.id ? 'active' : ''}`}
              onClick={() => setTheme(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function HomePage({ setPage, theme, setTheme }: { setPage: (p: Page) => void; theme: Theme; setTheme: (t: Theme) => void; }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <GeoShapeLeft />
      <GeoShapeRight />
      <div className="relative z-10 flex-1 flex items-center px-16 py-20" style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        <div className="flex-1 max-w-2xl">
          <div className="pill-badge mb-6 inline-flex">
            Collegiate AI Initiative • St Joseph Engineering College
          </div>

          {/* Interactive Neon Theme Selector Bar on HomePage */}
          <div className="mb-6 p-2.5 rounded-2xl flex flex-wrap items-center gap-3"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-neon)',
              boxShadow: 'var(--neon-glow)',
              backdropFilter: 'blur(12px)',
              maxWidth: 540,
            }}>
            <span className="text-[11px] font-bold uppercase tracking-widest pl-2" style={{ color: 'var(--text-secondary)' }}>
              Neon Palette:
            </span>
            <div className="flex items-center gap-2">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`theme-btn theme-btn-${t.id} ${theme === t.id ? 'active' : ''}`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          <h1 className="text-5xl font-black leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Pioneering Autonomous <span className="accent-italic">&amp; Agentic AI Systems</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: 14, marginBottom: 16 }}>
            Department of Computer Science &amp; Engineering · St Joseph Engineering College, Mangaluru
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 32, maxWidth: 520 }}>
            A dedicated student-led laboratory shaping tomorrow's software engineers through autonomous
            agent architectures, open-source AI tooling, collaborative workshops, and premier Salesforce
            Trailblazer community synergy.
          </p>
          <div className="flex items-center gap-4 mb-12">
            <button className="btn-primary px-6 py-3 rounded-xl text-sm flex items-center gap-2" onClick={() => setPage('events')}>
              Explore Workshops &amp; Events <span>→</span>
            </button>
            <button className="btn-outline px-6 py-3 rounded-xl text-sm flex items-center gap-2">
              Read Club Charter <span>📄</span>
            </button>
          </div>

          <div className="card flex divide-x" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="px-8 py-5 flex-1">
              <div className="text-3xl font-black" style={{ color: 'var(--neon-primary)', textShadow: 'var(--neon-text-glow)' }}>8+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Workshops &amp; Challenges</div>
            </div>
            <div className="px-8 py-5 flex-1" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="text-3xl font-black" style={{ color: 'var(--neon-primary)', textShadow: 'var(--neon-text-glow)' }}>500+</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>Engineering Students Reached</div>
            </div>
            <div className="px-8 py-5 flex-1" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Salesforce</div>
              <div className="mt-1">
                <span className="badge badge-theme" style={{ fontSize: 9 }}>Community Partner</span>
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 4 }}>Active Trailblazer Mentorship</div>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 ml-20 flex flex-col items-center">
          <div className="relative">
            <div style={{
              width: 280,
              height: 280,
              background: 'linear-gradient(135deg, var(--border-subtle), var(--border-medium))',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              border: '2px solid var(--border-neon)',
              boxShadow: 'var(--neon-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'all 0.4s ease',
            }}>
              <div style={{
                width: 240,
                height: 240,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                background: 'linear-gradient(135deg, var(--hexagon-bg1), var(--hexagon-bg2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                transition: 'background 0.4s ease',
              }}>
                <img src={logoImg} alt="AgentBlazer Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 0 15px var(--neon-primary))' }} />
              </div>
            </div>
            <div style={{
              position: 'absolute',
              inset: -4,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: 'linear-gradient(135deg, var(--neon-primary), transparent)',
              filter: 'blur(14px)',
              zIndex: -1,
              transition: 'background 0.4s ease',
            }} />
          </div>
          <div className="mt-4 text-center">
            <div className="font-black text-2xl" style={{
              background: 'linear-gradient(90deg, var(--neon-accent), var(--neon-primary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 12px var(--neon-primary))',
              transition: 'all 0.4s ease',
            }}>
              AgentBlazer
            </div>
            <div style={{ color: 'var(--neon-accent)', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textShadow: '0 0 8px var(--neon-accent)' }}>CLUB</div>
          </div>
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}

function EventsPage() {
  const { events } = useData();
  const eventList = events && events.length > 0 ? events : EVENTS;

  const [activeEventTitle, setActiveEventTitle] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const [slideFading, setSlideFading] = useState(false);
  const slideTimer = useRef<number | null>(null);

  const startSlideshow = (images: string[]) => {
    if (slideTimer.current) clearInterval(slideTimer.current);
    if (!images || images.length <= 1) return;
    slideTimer.current = window.setInterval(() => {
      setSlideFading(true);
      setTimeout(() => {
        setSlideIndex((prev) => (prev + 1) % images.length);
        setSlideFading(false);
      }, 300);
    }, 2500);
  };

  const stopSlideshow = () => {
    if (slideTimer.current) {
      clearInterval(slideTimer.current);
      slideTimer.current = null;
    }
  };

  const handleEventEnter = (title: string, images: string[]) => {
    if (slideTimer.current) clearInterval(slideTimer.current);
    setSlideIndex(0);
    setSlideFading(false);
    setActiveEventTitle(title);
    startSlideshow(images);
  };

  const handleEventLeave = () => {
    stopSlideshow();
    setActiveEventTitle(null);
    setSlideIndex(0);
  };

  const handleEventTap = (title: string, images: string[]) => {
    if (activeEventTitle === title) {
      stopSlideshow();
      setActiveEventTitle(null);
      setSlideIndex(0);
    } else {
      stopSlideshow();
      setSlideIndex(0);
      setSlideFading(false);
      setActiveEventTitle(title);
      startSlideshow(images);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSlideshow();
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <GeoShapeLeft />
      <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-16" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="text-center mb-12">
          <div className="pill-badge inline-flex mb-6" style={{ letterSpacing: '0.08em', fontSize: 10, color: 'var(--text-muted)' }}>
            WORKSHOPS &amp; LIVE SESSIONS • ACADEMIC YEAR 2025–2026
          </div>
          <h1 className="text-5xl font-black mb-4">
            Workshops, Contests <span className="accent-italic">&amp; Masterclasses</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto', lineHeight: 1.7 }}>
            Hands-on technical deep dives, algorithmic challenges, and real-world system deployments with seasoned engineers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {eventList.map((ev, i) => {
            const images = getEventImages(ev.title, (ev as any).galleryImages);
            const hasImages = !!images && images.length > 0;
            const isHovered = activeEventTitle === ev.title;
            const currentImage = hasImages ? (images[slideIndex] || images[0]) : '';

            return (
              <div
                key={i}
                className="card p-6 flex flex-col gap-3 cursor-pointer select-none relative overflow-hidden"
                onMouseEnter={hasImages ? () => handleEventEnter(ev.title, images) : undefined}
                onMouseLeave={hasImages ? handleEventLeave : undefined}
                onClick={hasImages ? () => handleEventTap(ev.title, images) : undefined}
                style={{
                  transition: 'background 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                  ...(isHovered ? {
                    background: 'var(--card-hover-bg)',
                    borderColor: 'var(--card-hover-border)',
                    boxShadow: 'var(--card-hover-shadow)',
                    transform: 'translateY(-4px)',
                    zIndex: 20,
                  } : {}),
                }}
              >
                {/* Header Date & Badge */}
                <div className="flex items-center justify-between">
                  <span style={{ color: isHovered ? 'var(--card-hover-role-color)' : 'var(--text-muted)', fontSize: 12, transition: 'color 0.3s ease' }}>{ev.date}</span>
                  <span className={`badge ${ev.badgeClass}`}>{ev.badge}</span>
                </div>

                {/* Title */}
                <h3
                  className="font-bold text-lg leading-snug transition-all duration-300"
                  style={isHovered ? {
                    background: 'var(--card-hover-text-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: 'var(--card-hover-text-glow)',
                  } : { color: 'var(--text-primary)' }}
                >{ev.title}</h3>

                {/* Smooth Inside-Card Image Slideshow Container */}
                {hasImages && (
                  <div
                    className="relative w-full rounded-xl overflow-hidden bg-[#090b16] transition-all duration-500 ease-out"
                    style={{
                      maxHeight: isHovered ? '220px' : '0px',
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'scale(1)' : 'scale(0.95)',
                      marginTop: isHovered ? '4px' : '0px',
                      marginBottom: isHovered ? '4px' : '0px',
                    }}
                  >
                    <img
                      src={currentImage}
                      alt={`${ev.title} photo`}
                      className="w-full h-52 object-cover object-center transition-all duration-300"
                      style={{
                        opacity: slideFading ? 0 : 1,
                        transform: slideFading ? 'scale(1.04)' : 'scale(1)',
                      }}
                    />
                    {/* Vignette Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b18] via-transparent to-transparent opacity-80 pointer-events-none" />

                    {/* AgentBlazer Tag */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-black/60 backdrop-blur-md border border-[#38bdf8]/40 text-[#38bdf8] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />
                      AgentBlazer Club
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/60 backdrop-blur-md text-white/80 border border-white/10">
                      {slideIndex + 1} / {images.length}
                    </div>
                  </div>
                )}

                {/* Tracks */}
                {ev.tracks && (
                  <div className="flex gap-2 flex-wrap">
                    {ev.tracks.map(t => (
                      <span key={t} className="badge badge-theme">{t}</span>
                    ))}
                  </div>
                )}
                {'leads' in ev && ev.leads && (
                  <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{ev.leads}</div>
                )}
                {'platform' in ev && ev.platform && (
                  <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{ev.platform}</div>
                )}
                <p style={{ color: isHovered ? 'var(--card-hover-body-color)' : 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6, flex: 1, transition: 'color 0.3s ease' }}>{ev.description}</p>
                <div className="flex items-center justify-between mt-2 pt-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: isHovered ? 'var(--neon-accent)' : 'var(--text-muted)', fontSize: 11, transition: 'color 0.2s' }}>
                    {hasImages ? (isHovered ? 'Viewing gallery →' : 'Hover to inspect gallery') : (ev.meta ? ev.meta : '')}
                  </span>
                  {ev.meta && hasImages && <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{ev.meta}</span>}
                  {ev.meta && !hasImages && null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EventSlideshowContent({ event, images, slideIndex, slideFading }: {
  event: { title: string; badge: string; badgeClass: string; date: string };
  images: string[];
  slideIndex: number;
  slideFading: boolean;
}) {
  const currentImage = images[slideIndex] || images[0];
  return (
    <>
      {/* Slideshow Image Container */}
      <div className="relative w-full h-[320px] rounded-xl overflow-hidden mb-3.5 bg-[#090b16]">
        <img
          src={currentImage}
          alt={`${event.title} - Photo ${slideIndex + 1}`}
          className="w-full h-full object-cover object-center transition-all duration-300"
          style={{
            opacity: slideFading ? 0 : 1,
            transform: slideFading ? 'scale(1.04)' : 'scale(1)',
          }}
        />
        {/* Dark gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b18] via-transparent to-transparent opacity-85 pointer-events-none" />
        {/* Event badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/65 backdrop-blur-md border border-[#38bdf8]/40 text-[#38bdf8] flex items-center gap-1.5 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#38bdf8', boxShadow: '0 0 6px #38bdf8' }} />
          AgentBlazer Club
        </div>
        {/* Image counter */}
        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-medium bg-black/55 backdrop-blur-md text-white/70 border border-white/10">
          {slideIndex + 1} / {images.length}
        </div>
      </div>
      {/* Event Title */}
      <div className="text-lg font-bold text-white tracking-tight leading-snug">{event.title}</div>
      {/* Date & Badge */}
      <div className="flex items-center justify-between mt-1 gap-2">
        <span className="text-xs text-[#94a3b8] font-medium">{event.date}</span>
        <span className={`badge ${event.badgeClass}`}>{event.badge}</span>
      </div>
    </>
  );
}


function AboutPage() {
  const { faculty } = useData();
  const facultyList = faculty && faculty.length > 0 ? faculty : FACULTY;

  const [hoveredFacultyName, setHoveredFacultyName] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-16" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <InaugurationSection />

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div style={{ width: 4, height: 24, background: 'var(--neon-primary)', borderRadius: 2, boxShadow: '0 0 10px var(--neon-primary)' }} />
            <h2 className="text-xl font-bold">Faculty Advisory Council</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {facultyList.map(f => {
              const isHovered = hoveredFacultyName === f.name;
              const imageSrc = getMemberImage(f.name, (f as any).imageUrl);
              return (
                <div
                  key={f.name}
                  className="card p-5 flex flex-col gap-3 cursor-pointer select-none overflow-hidden"
                  onMouseEnter={() => setHoveredFacultyName(f.name)}
                  onMouseLeave={() => setHoveredFacultyName(null)}
                  onClick={() => setHoveredFacultyName(prev => prev === f.name ? null : f.name)}
                  style={{
                    transition: 'background 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                    ...(isHovered ? {
                      background: 'var(--card-hover-bg)',
                      borderColor: 'var(--card-hover-border)',
                      boxShadow: 'var(--card-hover-shadow)',
                      transform: 'translateY(-4px)',
                      zIndex: 20,
                    } : {}),
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div style={{
                      width: 44, height: 44, borderRadius: 10,
                      background: 'linear-gradient(135deg, var(--btn-primary-start), var(--btn-primary-end))',
                      boxShadow: 'var(--neon-glow)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 14, flexShrink: 0
                    }}>{f.initials}</div>
                    <div className="flex-1">
                      <div
                        className="font-semibold transition-all duration-300"
                        style={isHovered ? {
                          background: 'var(--card-hover-text-gradient)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          textShadow: 'var(--card-hover-text-glow)',
                        } : {}}
                      >{f.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>{f.role}</div>
                    </div>
                  </div>

                  {/* Smooth Inside-Card Faculty Portrait Container */}
                  {imageSrc && (
                    <div
                      className="relative w-full rounded-xl overflow-hidden bg-[#090b16] transition-all duration-500 ease-out"
                      style={{
                        maxHeight: isHovered ? '240px' : '0px',
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'scale(1)' : 'scale(0.95)',
                        marginTop: isHovered ? '4px' : '0px',
                      }}
                    >
                      <img
                        src={imageSrc}
                        alt={f.name}
                        className="w-full h-56 object-cover object-top transition-transform duration-500 ease-out"
                        style={{
                          transform: isHovered ? 'scale(1)' : 'scale(1.05)',
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b18] via-transparent to-transparent opacity-85 pointer-events-none" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div style={{ width: 4, height: 24, background: 'var(--neon-primary)', borderRadius: 2, boxShadow: '0 0 10px var(--neon-primary)' }} />
              <h2 className="text-xl font-bold">
                Student Core Team <span className="accent-italic">&amp; Officers</span>
              </h2>
            </div>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Academic Year 2025–2026</span>
          </div>
          <StudentCoreTeamSection team={TEAM} />
        </section>

        <CoreWorkingCommittee />
      </div>
    </div>
  );
}

function TeamCard({ member }: { member: typeof TEAM[0] }) {
  return (
    <div className={`p-6 rounded-xl flex flex-col gap-3 ${member.highlighted ? 'member-card-highlighted' : 'card'}`}>
      <div style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>{member.role}</div>
      <h3 className="text-xl font-bold"
        style={{ color: member.highlighted ? 'var(--neon-accent)' : 'var(--text-primary)', textShadow: member.highlighted ? '0 0 10px var(--neon-accent)' : 'none' }}>
        {member.name}
      </h3>
      <span className={`badge ${member.titleClass} self-start`}>{member.title}</span>
      <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{member.description}</p>
    </div>
  );
}

function JoinPage({ setPage }: { setPage: (p: Page) => void }) {
  const [form, setForm] = useState({ name: '', email: '', year: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col">
      <GeoShapeLeft />
      <GeoShapeRight />
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div style={{ width: 56, height: 56, background: 'var(--bg-card)', border: '1px solid var(--border-neon)', boxShadow: 'var(--neon-glow)', borderRadius: 14 }}
          className="flex items-center justify-center text-2xl mb-6">⬡</div>

        <div className="pill-badge mb-6">
          Membership Intake • Academic Year 2025–2026
        </div>

        <h1 className="text-5xl font-black text-center mb-4" style={{ maxWidth: 700 }}>
          Ready to Build with <span className="accent-italic">Autonomous Intelligence?</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: 520, lineHeight: 1.7, marginBottom: 32 }}>
          Join the AgentBlazer Club at SJEC CSE. Collaborate with peers, gain hands-on access to
          Salesforce Trailhead developer orgs, and shape real AI agent projects.
        </p>

        <div className="flex items-center gap-4 mb-12">
          <button className="btn-primary px-6 py-3 rounded-xl text-sm font-semibold" onClick={() => {
            document.getElementById('join-form')?.scrollIntoView({ behavior: 'smooth' });
          }}>
            Become a Member
          </button>
          <button className="btn-outline px-6 py-3 rounded-xl text-sm font-semibold">
            Contact CSE Department
          </button>
        </div>

        <div className="card p-6 w-full max-w-xl mb-12">
          <div className="flex items-start gap-4">
            <div style={{ width: 40, height: 40, background: 'var(--bg-card)', border: '1px solid var(--border-neon)', boxShadow: '0 0 10px var(--border-subtle)', borderRadius: 10 }}
              className="flex items-center justify-center text-lg flex-shrink-0">🏫</div>
            <div>
              <div className="font-bold mb-1">Department of Computer Science &amp; Engineering</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>St Joseph Engineering College, Vamanjoor</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Mangaluru, Karnataka – 575028, India</div>
              <div style={{ marginTop: 8, fontSize: 13 }}>
                Direct Inquiries: <a href="mailto:agentblazer@sjec.ac.in" style={{ color: 'var(--neon-accent)', textShadow: '0 0 8px var(--neon-accent)' }}>agentblazer@sjec.ac.in</a>
              </div>
            </div>
          </div>
        </div>

        <div id="join-form" className="card p-8 w-full max-w-xl">
          <h3 className="font-bold text-lg mb-6">Membership Application</h3>
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✅</div>
              <div className="font-semibold text-lg mb-2">Application Submitted!</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>We'll reach out to you at your email shortly.</div>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Your full name', type: 'text' },
                { key: 'email', label: 'College Email', placeholder: 'you@sjec.ac.in', type: 'email' },
                { key: 'year', label: 'Year of Study', placeholder: '1st / 2nd / 3rd / 4th Year', type: 'text' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    required
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6 }}>Why do you want to join?</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your interest in AI and agentic systems..."
                  value={form.message}
                  onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-medium)',
                    color: 'var(--text-primary)', fontSize: 14, outline: 'none', resize: 'vertical',
                  }}
                />
              </div>
              <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm font-semibold mt-2">
                Submit Application
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer setPage={setPage} />
    </div>
  );
}

function Footer({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.45)' }} className="relative z-10 px-16 py-12">
      <div className="grid grid-cols-3 gap-12" style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 36, height: 36, background: 'var(--bg-card)', border: '1px solid var(--border-neon)', boxShadow: 'var(--neon-glow)', borderRadius: 8 }}
              className="flex items-center justify-center text-sm font-bold text-white">⬡</div>
            <span className="font-bold">AgentBlazer Club</span>
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>Department of Computer Science &amp; Engineering</div>
        </div>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>QUICK LINKS</div>
          {[
            { label: 'About & Charter', page: 'about' },
            { label: 'Workshops & Contests', page: 'events' },
            { label: 'Salesforce Trailhead Community', page: null },
          ].map(l => (
            <div key={l.label} style={{ marginBottom: 8 }}>
              <span
                style={{ color: l.page ? 'var(--neon-accent)' : 'var(--text-muted)', fontSize: 13, cursor: l.page ? 'pointer' : 'default', textShadow: l.page ? '0 0 6px var(--neon-accent)' : 'none' }}
                onClick={() => l.page && setPage(l.page as Page)}
              >{l.label}</span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 12 }}>AFFILIATIONS</div>
          <div className="flex gap-2 flex-wrap mb-3">
            {['SJEC CSE', 'Agentforce', 'Trailblazer'].map(a => (
              <span key={a} className="badge badge-theme">{a}</span>
            ))}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Empowered by faculty and student innovation.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [page, setPage] = useState<Page>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        return 'admin';
      }
    }
    return 'home';
  });
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('admin_token');
    }
    return null;
  });

  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agentblazer_theme');
      if (saved === 'violet' || saved === 'inferno' || saved === 'frost') {
        return saved as Theme;
      }
    }
    return 'violet';
  });

  // Dynamic SEO: update title, meta tags, OG, and canonical per page
  usePageSEO(page);

  // Listen for browser URL changes (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin')) {
        setPage('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Synchronize theme to document.body, document.documentElement, and localStorage
  useEffect(() => {
    localStorage.setItem('agentblazer_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.documentElement.className = `theme-${theme}`;
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const handleAdminLogout = async () => {
    if (adminToken) {
      await fetch(apiUrl('/api/auth/logout'), {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    }
    sessionStorage.removeItem('admin_token');
    setAdminToken(null);
  };

  const handleReturnToPublicSite = () => {
    window.history.pushState({}, '', '/');
    setPage('home');
  };

  const isAdminRoute = page === 'admin' || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));

  return (
    <DataProvider>
      {isAdminRoute ? (
        adminToken ? (
          <AdminPanel
            token={adminToken}
            onLogout={handleAdminLogout}
            onReturnToSite={handleReturnToPublicSite}
          />
        ) : (
          <AdminLogin
            onLoginSuccess={(token) => {
              setAdminToken(token);
              setPage('admin');
            }}
            onReturnToSite={handleReturnToPublicSite}
          />
        )
      ) : (
        <div
          className={`theme-${theme} app-theme-container`}
          data-theme={theme}
          style={{
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            backgroundImage: 'var(--bg-ambient)',
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            color: 'var(--text-primary)',
            transition: 'background-color 0.45s ease, background-image 0.45s ease, color 0.45s ease',
          }}
        >
          <CustomCursor />
          {!hasEntered && (
            <IntroScreen
              onContinue={() => {
                setHasEntered(true);
                setPage('home');
              }}
            />
          )}
          <StarField />
          <Navbar
            page={page}
            setPage={setPage}
            theme={theme}
            setTheme={setTheme}
            onShowIntro={() => setHasEntered(false)}
          />
          <main className="relative z-10">
            {page === 'home' && <HomePage setPage={setPage} theme={theme} setTheme={setTheme} />}
            {page === 'about' && <AboutPage />}
            {page === 'events' && <EventsPage />}
            {page === 'join' && <JoinPage setPage={setPage} />}
          </main>
        </div>
      )}
    </DataProvider>
  );
}
