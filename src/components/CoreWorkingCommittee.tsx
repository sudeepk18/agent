import React from 'react';
import { useData } from '../context/DataContext';

interface CommitteeMember {
  initials: string;
  initialsColor: string;
  name: string;
  role: string;
}

const DEFAULT_MEMBERS: CommitteeMember[] = [
  {
    initials: 'PR',
    initialsColor: '#38bdf8', // Cyan
    name: 'Prajwal Royston Cordiero',
    role: 'AI & LLM Research Group',
  },
  {
    initials: 'CA',
    initialsColor: '#c084fc', // Lavender
    name: 'Chacko P Abraham',
    role: 'Model Evaluation Benchmarks',
  },
  {
    initials: 'AR',
    initialsColor: '#fbbf24', // Amber/gold
    name: 'Alma Roxane Pereira',
    role: 'Project Operations & Labs',
  },
];

export function CoreWorkingCommittee() {
  const { committee } = useData();
  const committeeList = committee && committee.length > 0 ? committee : DEFAULT_MEMBERS;

  return (
    <section className="w-full mt-16 select-none">
      <div
        className="rounded-[20px] p-6 sm:p-7 md:p-8 relative overflow-hidden backdrop-blur-md transition-all duration-500"
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4), var(--neon-glow)',
        }}
      >
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <span
            className="text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase transition-colors duration-300"
            style={{ color: 'var(--neon-primary)', textShadow: 'var(--neon-text-glow)' }}
          >
            CORE WORKING COMMITTEE
          </span>
          <span className="text-xs sm:text-[13px] transition-colors duration-300" style={{ color: 'var(--text-muted)' }}>
            Departmental Representatives
          </span>
        </div>

        {/* Divider line */}
        <div className="w-full h-px mb-5 transition-colors duration-300" style={{ backgroundColor: 'var(--border-subtle)' }} />

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {committeeList.map((member) => (
            <div
              key={member.name}
              className="interactive-name-card rounded-[14px] p-4 sm:p-5 flex items-center gap-4 transition-all duration-300"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border-medium)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25), 0 0 10px var(--border-subtle)',
              }}
            >
              {/* Initials box */}
              <div
                className="initials-avatar w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 transition-all duration-300"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-neon)',
                  color: member.initialsColor || 'var(--neon-accent)',
                  boxShadow: '0 0 10px var(--border-subtle)',
                }}
              >
                {member.initials}
              </div>

              {/* Member details */}
              <div className="flex flex-col min-w-0">
                <div
                  className="name-title font-bold text-[14.5px] leading-tight truncate sm:whitespace-normal transition-all duration-300"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {member.name}
                </div>
                <div
                  className="text-xs mt-1 leading-normal transition-colors duration-300"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {member.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CoreWorkingCommittee;
