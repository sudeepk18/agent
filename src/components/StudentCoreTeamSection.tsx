import React, { useState } from 'react';
import { getMemberImage } from './memberImages';
import { useData } from '../context/DataContext';

export interface TeamMember {
  id?: string;
  role: string;
  name: string;
  title: string;
  titleClass: string;
  description: string;
  highlighted: boolean;
  imageUrl?: string;
}

interface StudentCoreTeamSectionProps {
  team: TeamMember[];
}

export function StudentCoreTeamSection({ team }: StudentCoreTeamSectionProps) {
  const { studentTeam } = useData();
  const teamList = studentTeam && studentTeam.length > 0 ? studentTeam : team;

  const [hoveredMemberName, setHoveredMemberName] = useState<string | null>(null);

  const handleMouseEnter = (memberName: string) => {
    setHoveredMemberName(memberName);
  };

  const handleMouseLeave = () => {
    setHoveredMemberName(null);
  };

  const handleCardClick = (memberName: string) => {
    if (hoveredMemberName === memberName) {
      setHoveredMemberName(null);
    } else {
      setHoveredMemberName(memberName);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
      {teamList.map((m) => {
        const isHovered = hoveredMemberName === m.name;
        const imageSrc = getMemberImage(m.name, m.imageUrl);

        return (
          <div
            key={m.name}
            onMouseEnter={() => handleMouseEnter(m.name)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleCardClick(m.name)}
            className={`p-6 rounded-xl flex flex-col gap-3 cursor-pointer relative select-none overflow-hidden ${
              m.highlighted && !isHovered ? 'member-card-highlighted' : 'card'
            }`}
            style={{
              transition:
                'background 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              ...(isHovered
                ? {
                    background: 'var(--card-hover-bg)',
                    borderColor: 'var(--card-hover-border)',
                    boxShadow: 'var(--card-hover-shadow)',
                    transform: 'translateY(-4px)',
                    zIndex: 20,
                  }
                : {}),
            }}
          >
            {/* Role Header */}
            <div
              style={{
                color: isHovered ? 'var(--card-hover-role-color)' : 'var(--text-muted)',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.04em',
                transition: 'color 0.3s ease',
              }}
            >
              {m.role}
            </div>

            {/* Member Name */}
            <h3
              className="text-xl font-bold transition-all duration-300"
              style={{
                ...(isHovered
                  ? {
                      background: 'var(--card-hover-text-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: 'var(--card-hover-text-glow)',
                    }
                  : {
                      color: m.highlighted ? 'var(--neon-accent)' : 'var(--text-primary)',
                      textShadow: m.highlighted ? '0 0 10px var(--neon-accent)' : 'none',
                    }),
              }}
            >
              {m.name}
            </h3>

            {/* Title Badge */}
            <span
              className={`badge ${m.titleClass} self-start`}
              style={{
                boxShadow: isHovered ? 'var(--neon-glow)' : undefined,
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {m.title}
            </span>

            {/* Smooth Inside-Card Member Portrait Image Container */}
            {imageSrc && (
              <div
                className="relative w-full rounded-xl overflow-hidden bg-[#090b16] transition-all duration-500 ease-out"
                style={{
                  maxHeight: isHovered ? '280px' : '0px',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'scale(1)' : 'scale(0.95)',
                  marginTop: isHovered ? '4px' : '0px',
                  marginBottom: isHovered ? '4px' : '0px',
                }}
              >
                <img
                  src={imageSrc}
                  alt={m.name}
                  className="w-full h-64 object-cover object-top transition-transform duration-500 ease-out"
                  style={{
                    transform: isHovered ? 'scale(1)' : 'scale(1.06)',
                  }}
                />

                {/* Ambient Dark Gradient Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b18] via-transparent to-transparent opacity-85 pointer-events-none" />

                {/* AgentBlazer Club Label Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/65 backdrop-blur-md border border-[#38bdf8]/40 text-[#38bdf8] flex items-center gap-1.5 shadow-lg">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: '#38bdf8',
                      boxShadow: '0 0 6px #38bdf8',
                    }}
                  />
                  AgentBlazer Club
                </div>
              </div>
            )}

            {/* Description */}
            <p
              style={{
                color: isHovered ? 'var(--card-hover-body-color)' : 'var(--text-secondary)',
                fontSize: 13,
                lineHeight: 1.6,
                transition: 'color 0.3s ease',
              }}
            >
              {m.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default StudentCoreTeamSection;

