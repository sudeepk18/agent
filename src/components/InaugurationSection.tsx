import React from 'react';
import { useData } from '../context/DataContext';

interface GuestCardProps {
  initials: string;
  name: string;
  role: string;
  bottomLeft: string;
  bottomRight: string;
  bottomRightColor: string;
}

const DEFAULT_GUESTS: GuestCardProps[] = [
  {
    initials: 'SR',
    name: 'Mr. Santosh Rebello',
    role: 'Salesforce',
    bottomLeft: 'Guest of Honor',
    bottomRight: 'Keynote Speaker',
    bottomRightColor: '#fbbf24', // Amber/gold
  },
  {
    initials: 'SP',
    name: 'Mr. Stephen Pinto',
    role: 'Salesforce & SJEC Alumnus',
    bottomLeft: 'Technical Mentor',
    bottomRight: 'Alumni Guide',
    bottomRightColor: '#38bdf8', // Cyan
  },
  {
    initials: 'RD',
    name: "Dr. Rio D'Souza",
    role: 'Principal, SJEC',
    bottomLeft: 'Presidential Address',
    bottomRight: 'Patron',
    bottomRightColor: '#c084fc', // Lavender
  },
  {
    initials: 'MD',
    name: "Dr. Melwyn D'Souza",
    role: 'HOD, Computer Science & Engg',
    bottomLeft: 'Program Chair',
    bottomRight: 'Department Head',
    bottomRightColor: '#c084fc', // Lavender
  },
];

export function InaugurationSection() {
  const { inauguration, guests } = useData();
  const guestList = guests && guests.length > 0 ? guests : DEFAULT_GUESTS;

  return (
    <section className="relative w-full mb-16 select-none">
      {/* Background Constellation & Geometric Wireframe Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Ambient glow patches */}
        <div
          className="absolute -top-16 left-1/4 w-[500px] h-[300px] rounded-full opacity-20 blur-[100px]"
          style={{ background: 'radial-gradient(circle, #38bdf8 0%, #6366f1 50%, transparent 80%)' }}
        />
        <div
          className="absolute bottom-0 right-10 w-[450px] h-[350px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, #8b5cf6 0%, #ec4899 40%, transparent 80%)' }}
        />

        {/* Constellation SVG Network */}
        <svg
          className="absolute inset-0 w-full h-full opacity-35"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.7" />
            </linearGradient>
          </defs>

          {/* Connected Network Nodes - Top & Middle */}
          <line x1="5%" y1="38%" x2="18%" y2="44%" stroke="url(#lineGrad1)" strokeWidth="1" />
          <line x1="18%" y1="44%" x2="32%" y2="9%" stroke="url(#lineGrad1)" strokeWidth="1" />
          <line x1="32%" y1="9%" x2="49%" y2="4%" stroke="url(#lineGrad1)" strokeWidth="1" />
          <line x1="32%" y1="9%" x2="39%" y2="60%" stroke="url(#lineGrad1)" strokeWidth="1" />
          <line x1="39%" y1="60%" x2="18%" y2="44%" stroke="url(#lineGrad1)" strokeWidth="1" />
          <line x1="39%" y1="60%" x2="52%" y2="68%" stroke="url(#lineGrad1)" strokeWidth="1" />
          <line x1="68%" y1="4%" x2="83%" y2="18%" stroke="url(#lineGrad1)" strokeWidth="1" />
          <line x1="83%" y1="18%" x2="96%" y2="30%" stroke="url(#lineGrad1)" strokeWidth="1" />

          {/* Network dots */}
          <circle cx="5%" cy="38%" r="2" fill="#38bdf8" opacity="0.6" />
          <circle cx="18%" cy="44%" r="3" fill="#818cf8" opacity="0.8" />
          <circle cx="32%" cy="9%" r="2.5" fill="#c084fc" opacity="0.7" />
          <circle cx="49%" cy="4%" r="2" fill="#38bdf8" opacity="0.6" />
          <circle cx="39%" cy="60%" r="3" fill="#38bdf8" opacity="0.7" />
          <circle cx="52%" cy="68%" r="2.5" fill="#818cf8" opacity="0.6" />
          <circle cx="68%" cy="4%" r="2" fill="#818cf8" opacity="0.6" />
          <circle cx="83%" cy="18%" r="2.5" fill="#c084fc" opacity="0.7" />
          <circle cx="96%" cy="30%" r="2" fill="#38bdf8" opacity="0.6" />

          {/* Wireframe Polyhedron in Bottom-Right Corner (matches screenshot) */}
          <g className="translate-x-[85%] translate-y-[62%] md:translate-x-[90%] md:translate-y-[60%]" opacity="0.45">
            <polygon points="50,10 90,40 75,90 25,90 10,40" fill="none" stroke="url(#wireGrad)" strokeWidth="1.2" />
            <polygon points="50,10 75,90 25,90" fill="none" stroke="url(#wireGrad)" strokeWidth="1.2" />
            <polygon points="90,40 10,40 50,60" fill="none" stroke="url(#wireGrad)" strokeWidth="1.2" />
            <line x1="50" y1="10" x2="50" y2="60" stroke="url(#wireGrad)" strokeWidth="1.2" />
            <line x1="25" y1="90" x2="50" y2="60" stroke="url(#wireGrad)" strokeWidth="1.2" />
            <line x1="75" y1="90" x2="50" y2="60" stroke="url(#wireGrad)" strokeWidth="1.2" />
            <line x1="10" y1="40" x2="50" y2="10" stroke="url(#wireGrad)" strokeWidth="1.2" />
            <line x1="90" y1="40" x2="50" y2="10" stroke="url(#wireGrad)" strokeWidth="1.2" />
            <circle cx="50" cy="10" r="2.5" fill="#38bdf8" />
            <circle cx="90" cy="40" r="2.5" fill="#818cf8" />
            <circle cx="75" cy="90" r="2.5" fill="#c084fc" />
            <circle cx="25" cy="90" r="2.5" fill="#c084fc" />
            <circle cx="10" cy="40" r="2.5" fill="#38bdf8" />
            <circle cx="50" cy="60" r="2.5" fill="#fbbf24" />
          </g>
        </svg>
      </div>

      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-[46px] font-black text-white tracking-tight leading-[1.15]">
            Inauguration &amp;{' '}
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontWeight: 400,
                background: 'linear-gradient(105deg, #38bdf8 0%, #c084fc 45%, #fbbf24 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Mentorship
            </span>
            <br />
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontWeight: 400,
                background: 'linear-gradient(105deg, #fbbf24 0%, #f472b6 50%, #c084fc 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Council
            </span>
          </h1>
        </div>

        <div className="max-w-md lg:text-left">
          <p className="text-[13.5px] leading-relaxed text-[#94a3b8]">
            Fostering technical curiosity, genuine mentorship, and bridging classroom theory with
            autonomous AI engineering practices.
          </p>
        </div>
      </div>

      {/* Horizontal Divider with Centered Sparkling Particle Cluster */}
      <div className="relative w-full py-4 mb-7">
        <div className="w-full h-px bg-white/[0.08]" />

        {/* Floating Spark Cluster positioned above the center of divider */}
        <div className="absolute left-[49.5%] -top-3.5 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          {/* Spark dots rising */}
          <div className="w-1 h-1 rounded-full bg-[#c084fc] opacity-70 mb-1" />
          <div className="flex gap-1.5 items-center mb-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#818cf8] opacity-80" />
            <div className="w-1 h-1 rounded-full bg-[#38bdf8] opacity-60" />
          </div>
          {/* Main glowing focal dot */}
          <div
            className="w-2.5 h-2.5 rounded-full bg-[#e0f2fe]"
            style={{
              boxShadow: '0 0 10px 2px #38bdf8, 0 0 20px 4px #818cf8, 0 0 30px 6px #c084fc',
            }}
          />
        </div>
      </div>

      {/* Large Rounded Launch/Event Information Card */}
      <div
        className="rounded-[24px] p-6 md:p-9 mb-12 relative overflow-hidden backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(10, 12, 22, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Event details */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Official Launch & Keynote Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                backgroundColor: 'rgba(23, 23, 48, 0.85)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                color: '#38bdf8',
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: '#3b82f6',
                  boxShadow: '0 0 6px #3b82f6',
                }}
              />
              Official Launch &amp; Keynote
            </div>

            {/* Event Title with Mixed Typography */}
            <h2 className="text-2xl sm:text-3xl lg:text-[31px] font-bold text-white tracking-tight leading-snug mb-3">
              <span className="lg:inline-block">
                AgentBlazer Club Launch &amp;{' '}
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontWeight: 400,
                    background: 'linear-gradient(100deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Agentforce
                </span>
              </span>
              <br />
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  fontWeight: 400,
                  background: 'linear-gradient(100deg, #fbbf24 0%, #f472b6 60%, #c084fc 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Symposium
              </span>
            </h2>

            {/* Event Description Paragraph */}
            <p className="text-[#94a3b8] text-[13.5px] leading-relaxed max-w-xl">
              The Department of Computer Science &amp; Engineering founded the AgentBlazer Club to
              build an authentic student collective centered on autonomous intelligence, open agent
              frameworks, and industry partnership.
            </p>
          </div>

          {/* Right Column: Inauguration Date Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div
              className="w-full max-w-[430px] rounded-[20px] p-6 md:p-8 flex flex-col items-center justify-center text-center"
              style={{
                backgroundColor: 'rgba(8, 12, 24, 0.9)',
                border: '1px solid rgba(14, 165, 233, 0.4)',
                boxShadow:
                  '0 0 30px rgba(14, 165, 233, 0.12), inset 0 0 20px rgba(14, 165, 233, 0.04)',
              }}
            >
              <div className="text-[#0ea5e9] tracking-[0.2em] text-[11px] font-bold uppercase mb-1">
                INAUGURATED ON
              </div>

              <div
                className="text-3xl sm:text-4xl my-2 font-normal"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: 'italic',
                  background:
                    'linear-gradient(105deg, #38bdf8 0%, #818cf8 35%, #c084fc 70%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                August 25, 2025
              </div>

              <div className="flex flex-nowrap items-center justify-center gap-2.5 mt-3">
                <span
                  className="px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                  style={{
                    backgroundColor: 'rgba(251, 191, 36, 0.08)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    color: '#fbbf24',
                  }}
                >
                  Academic Year 2025–2026
                </span>
                <span
                  className="px-3.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.08)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                  }}
                >
                  SJEC Campus
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Honored Guests & College Leadership Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-1 h-6 rounded-full"
          style={{
            background: 'linear-gradient(180deg, #38bdf8 0%, #a855f7 100%)',
            boxShadow: '0 0 10px rgba(56, 189, 248, 0.8)',
          }}
        />
        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Honored Guests{' '}
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontWeight: 400,
              background: 'linear-gradient(105deg, #38bdf8 0%, #818cf8 40%, #c084fc 75%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            &amp; College Leadership
          </span>
        </h3>
      </div>

      {/* Guest Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {guestList.map((guest) => (
          <div
            key={guest.name}
            className="interactive-name-card rounded-[16px] p-5 flex flex-col justify-between"
            style={{
              backgroundColor: 'rgba(11, 13, 24, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            {/* Top Row: Initials Avatar + Name & Role */}
            <div className="flex items-start gap-3.5 mb-5">
              <div
                className="initials-avatar w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(23, 22, 46, 0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  color: '#38bdf8',
                  boxShadow: '0 0 12px rgba(99, 102, 241, 0.15)',
                }}
              >
                {guest.initials}
              </div>

              <div className="flex flex-col">
                <div className="name-title text-white font-bold text-[15px] leading-tight transition-all duration-300">
                  {guest.name}
                </div>
                <div className="text-[12px] text-[#94a3b8] mt-1 leading-normal">
                  {guest.role}
                </div>
              </div>
            </div>

            {/* Bottom Row: Left Label & Right Tag */}
            <div className="flex items-center justify-between text-[11px] pt-3.5 border-t border-white/[0.06]">
              <span className="text-[#94a3b8]">{guest.bottomLeft}</span>
              <span className="font-medium" style={{ color: guest.bottomRightColor }}>
                {guest.bottomRight}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default InaugurationSection;
