import type { Request, Response } from 'express';
import { z } from 'zod';
import { Event, Registration } from '../models/index.js';
import { sendRegistrationEmail } from '../config/email.js';

const RegistrationInputSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  usn: z.string().min(4, 'USN is required'),
  college: z.string().default('St Joseph Engineering College'),
  semester: z.string().optional(),
  branch: z.string().default('CSE'),
  phone: z.string().optional(),
});

export async function registerForEvent(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = RegistrationInputSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ error: 'Validation failed', details: parseResult.error.flatten() });
      return;
    }

    const { eventId, name, email, usn, college, semester, branch, phone } = parseResult.data;

    // Check if event exists
    const event = await Event.findOne({ id: eventId });
    if (event && !event.registrationOpen) {
      res.status(400).json({ error: 'Registrations for this event are currently closed.' });
      return;
    }

    // Check for duplicate registration
    const existing = await Registration.findOne({ eventId, email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ error: 'You are already registered for this event with this email.' });
      return;
    }

    const registration = await Registration.create({
      eventId,
      eventName: event?.title || 'AgentBlazer Event',
      name,
      email: email.toLowerCase(),
      usn: usn.toUpperCase(),
      college,
      semester: semester || '',
      branch,
      phone: phone || '',
      status: 'confirmed',
    });

    // Send confirmation email asynchronously
    sendRegistrationEmail({
      to: email,
      name,
      eventName: event?.title || 'AgentBlazer Event',
      eventDate: event?.date || 'Upcoming',
      eventVenue: event?.venue || 'SJEC Campus',
    }).catch((emailErr) => console.error('Email dispatch error:', emailErr));

    res.status(201).json({
      success: true,
      message: 'Registration confirmed! A confirmation email has been dispatched.',
      registration: {
        id: registration._id,
        eventId: registration.eventId,
        name: registration.name,
        email: registration.email,
        status: registration.status,
      },
    });
  } catch (error) {
    console.error('Error registering for event:', error);
    res.status(500).json({ error: 'Failed to process event registration' });
  }
}

export async function getEventRegistrations(req: Request, res: Response): Promise<void> {
  try {
    const { eventId } = req.params;
    const filter = eventId ? { eventId } : {};
    const registrations = await Registration.find(filter).sort({ registeredAt: -1 });
    res.status(200).json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
}
