import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { Inauguration, Guest, Faculty, Member, Event } from '../models/index.js';

// ==========================================
// Admin Full Content Feed
// ==========================================
export async function getAdminContent(_req: Request, res: Response): Promise<void> {
  try {
    const [inaugurationDoc, guests, faculty, allMembers, events] = await Promise.allSettled([
      Inauguration.findOne(),
      Guest.find(),
      Faculty.find(),
      Member.find(),
      Event.find(),
    ]);

    const inauguration = inaugurationDoc.status === 'fulfilled' && inaugurationDoc.value ? inaugurationDoc.value : {};
    const guestList = guests.status === 'fulfilled' ? guests.value : [];
    const facultyList = faculty.status === 'fulfilled' ? faculty.value : [];
    const memberList = allMembers.status === 'fulfilled' ? allMembers.value : [];
    const eventList = events.status === 'fulfilled' ? events.value : [];

    const studentTeam = memberList.filter((m) => m.category !== 'committee');
    const committee = memberList.filter((m) => m.category === 'committee');

    res.status(200).json({
      inauguration,
      guests: guestList,
      faculty: facultyList,
      studentTeam,
      committee,
      events: eventList,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve admin content' });
  }
}

// ==========================================
// Admin Media Files
// ==========================================
export async function getAdminMedia(_req: Request, res: Response): Promise<void> {
  try {
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    const filesList: { fileName: string; url: string; sizeBytes: number }[] = [];

    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        const stats = fs.statSync(path.join(uploadsDir, file));
        filesList.push({
          fileName: file,
          url: `/uploads/${file}`,
          sizeBytes: stats.size,
        });
      }
    }

    res.status(200).json({ success: true, files: filesList });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media files' });
  }
}

// ==========================================
// Inauguration
// ==========================================
export async function updateInauguration(req: Request, res: Response): Promise<void> {
  try {
    const data = req.body;
    let doc = await Inauguration.findOne();
    if (doc) {
      Object.assign(doc, data);
      await doc.save();
    } else {
      doc = await Inauguration.create(data);
    }
    res.status(200).json({ success: true, inauguration: doc });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inauguration details' });
  }
}

// ==========================================
// Guests CRUD
// ==========================================
export async function createGuest(req: Request, res: Response): Promise<void> {
  try {
    const item = await Guest.create(req.body);
    res.status(201).json({ success: true, guest: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create guest' });
  }
}

export async function updateGuest(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const item = await Guest.findOneAndUpdate({ id }, req.body, { new: true, upsert: true });
    res.status(200).json({ success: true, guest: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update guest' });
  }
}

export async function deleteGuest(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await Guest.findOneAndDelete({ id });
    res.status(200).json({ success: true, message: 'Guest removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete guest' });
  }
}

// ==========================================
// Faculty CRUD
// ==========================================
export async function createFaculty(req: Request, res: Response): Promise<void> {
  try {
    const item = await Faculty.create(req.body);
    res.status(201).json({ success: true, faculty: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create faculty member' });
  }
}

export async function updateFaculty(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const item = await Faculty.findOneAndUpdate({ id }, req.body, { new: true, upsert: true });
    res.status(200).json({ success: true, faculty: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update faculty' });
  }
}

export async function deleteFaculty(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await Faculty.findOneAndDelete({ id });
    res.status(200).json({ success: true, message: 'Faculty removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete faculty' });
  }
}

// ==========================================
// Members CRUD (Student Team & Committee)
// ==========================================
export async function createMember(req: Request, res: Response): Promise<void> {
  try {
    const item = await Member.create(req.body);
    res.status(201).json({ success: true, member: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create member' });
  }
}

export async function updateMember(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const item = await Member.findOneAndUpdate({ id }, req.body, { new: true, upsert: true });
    res.status(200).json({ success: true, member: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update member' });
  }
}

export async function deleteMember(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await Member.findOneAndDelete({ id });
    res.status(200).json({ success: true, message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete member' });
  }
}

// ==========================================
// Events CRUD
// ==========================================
export async function createEvent(req: Request, res: Response): Promise<void> {
  try {
    const item = await Event.create(req.body);
    res.status(201).json({ success: true, event: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event' });
  }
}

export async function updateEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const item = await Event.findOneAndUpdate({ id }, req.body, { new: true, upsert: true });
    res.status(200).json({ success: true, event: item });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
}

export async function deleteEvent(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    await Event.findOneAndDelete({ id });
    res.status(200).json({ success: true, message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
}
