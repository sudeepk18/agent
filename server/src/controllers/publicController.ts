import type { Request, Response } from 'express';
import { Inauguration, Guest, Faculty, Member, Event } from '../models/index.js';

export async function getPublicContent(_req: Request, res: Response): Promise<void> {
  try {
    const [inaugurationDoc, guests, faculty, allMembers, events] = await Promise.allSettled([
      Inauguration.findOne(),
      Guest.find(),
      Faculty.find(),
      Member.find(),
      Event.find(),
    ]);

    const inauguration = inaugurationDoc.status === 'fulfilled' && inaugurationDoc.value ? inaugurationDoc.value : null;
    const guestList = guests.status === 'fulfilled' ? guests.value : [];
    const facultyList = faculty.status === 'fulfilled' ? faculty.value : [];
    const memberList = allMembers.status === 'fulfilled' ? allMembers.value : [];
    const eventList = events.status === 'fulfilled' ? events.value : [];

    const studentTeam = memberList.filter((m) => m.category !== 'committee');
    const committee = memberList.filter((m) => m.category === 'committee');

    res.status(200).json({
      inauguration: inauguration || {
        title: 'AgentBlazer Club Launch & Agentforce Symposium',
        date: 'August 25, 2025',
        academicYear: '2025–2026',
        venue: 'SJEC Campus',
        badge: 'Official Launch & Keynote',
      },
      guests: guestList,
      faculty: facultyList,
      studentTeam,
      committee,
      events: eventList,
    });
  } catch (error) {
    console.error('Error fetching public content:', error);
    res.status(500).json({ error: 'Failed to retrieve public content' });
  }
}
