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
        className="rounded-[20px] p-6 sm:p-7 md:p-8 relative overflow-hidden backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(10, 12, 22, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        }}
      >
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <span
            className="text-xs sm:text-[13px] font-bold tracking-[0.14em] uppercase"
            style={{ color: '#00f2fe' }}
          >
            CORE WORKING COMMITTEE
          </span>
          <span className="text-xs sm:text-[13px] text-[#94a3b8]">
            Departmental Representatives
          </span>
        </div>

        {/* Divider line */}
        <div className="w-full h-px bg-white/[0.08] mb-5" />

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {committeeList.map((member) => (
            <div
              key={member.name}
              className="rounded-[14px] p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{
                backgroundColor: 'rgba(11, 13, 24, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
              }}
            >
              {/* Initials box */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs sm:text-sm shrink-0"
                style={{
                  backgroundColor: 'rgba(23, 22, 46, 0.9)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  color: member.initialsColor,
                  boxShadow: '0 0 10px rgba(99, 102, 241, 0.12)',
                }}
              >
                {member.initials}
              </div>

              {/* Member details */}
              <div className="flex flex-col min-w-0">
                <div className="text-white font-bold text-[14.5px] leading-tight truncate sm:whitespace-normal">
                  {member.name}
                </div>
                <div className="text-xs text-[#94a3b8] mt-1 leading-normal">
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
