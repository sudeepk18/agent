import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../config/api';

export interface GuestItem {
  id: string;
  initials: string;
  name: string;
  role: string;
  bottomLeft: string;
  bottomRight: string;
  bottomRightColor: string;
}

export interface FacultyItem {
  id: string;
  initials: string;
  name: string;
  role: string;
  imageUrl?: string;
}

export interface TeamMemberItem {
  id: string;
  name: string;
  role: string;
  title: string;
  titleClass: string;
  description: string;
  highlighted: boolean;
  imageUrl?: string;
}

export interface CommitteeMemberItem {
  id: string;
  initials: string;
  initialsColor: string;
  name: string;
  role: string;
}

export interface EventItem {
  id: string;
  date: string;
  badge: string;
  badgeClass: string;
  title: string;
  description: string;
  meta?: string | null;
  tracks?: string[] | null;
  leads?: string | null;
  platform?: string | null;
  coverImage?: string;
  galleryImages?: string[];
}

export interface InaugurationData {
  headingTitle: string;
  description: string;
  eventTitle: string;
  eventBadge: string;
  eventDescription: string;
  inauguratedDate: string;
  inauguratedTags: string[];
}

interface DataContextType {
  inauguration: InaugurationData | null;
  guests: GuestItem[];
  faculty: FacultyItem[];
  studentTeam: TeamMemberItem[];
  committee: CommitteeMemberItem[];
  events: EventItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  inauguration: null,
  guests: [],
  faculty: [],
  studentTeam: [],
  committee: [],
  events: [],
  loading: true,
  refreshData: async () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [inauguration, setInauguration] = useState<InaugurationData | null>(null);
  const [guests, setGuests] = useState<GuestItem[]>([]);
  const [faculty, setFaculty] = useState<FacultyItem[]>([]);
  const [studentTeam, setStudentTeam] = useState<TeamMemberItem[]>([]);
  const [committee, setCommittee] = useState<CommitteeMemberItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshData = async () => {
    try {
      const res = await fetch(apiUrl('/api/public/content'));
      if (res.ok) {
        const data = await res.json();
        if (data.inauguration) setInauguration(data.inauguration);
        if (data.guests) setGuests(data.guests);
        if (data.faculty) setFaculty(data.faculty);
        if (data.studentTeam) setStudentTeam(data.studentTeam);
        if (data.committee) setCommittee(data.committee);
        if (data.events) setEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to fetch public content from API:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        inauguration,
        guests,
        faculty,
        studentTeam,
        committee,
        events,
        loading,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
