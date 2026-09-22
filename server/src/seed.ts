import 'dotenv/config';
import bcrypt from 'bcryptjs';
import fs from 'node:fs';
import path from 'node:path';
import { connectDB } from './config/db.js';
import { Admin, Inauguration, Guest, Faculty, Member, Event } from './models/index.js';

async function seed() {
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Cannot seed database: MongoDB connection failed. Please check MONGODB_URI.');
    process.exit(1);
  }

  console.log('🌱 Starting database seed...');

  // 1. Seed Default Admin
  const adminEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@agentblazer.sjec.ac.in').toLowerCase();
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AgentBlazer@2026';
  const existingAdmin = await Admin.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    await Admin.create({
      email: adminEmail,
      passwordHash,
      role: 'administrator',
    });
    console.log(`✅ Default admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin already exists: ${adminEmail}`);
  }

  // 2. Read existing store.json if available
  const storePath = path.resolve(process.cwd(), '../data/store.json');
  let store: any = {};
  if (fs.existsSync(storePath)) {
    try {
      store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
    } catch (e) {
      console.warn('Could not parse data/store.json');
    }
  }

  // 3. Seed Inauguration
  const existingInauguration = await Inauguration.findOne();
  if (!existingInauguration) {
    const inauData = store.inauguration || {};
    await Inauguration.create({
      title: inauData.eventTitle || 'AgentBlazer Club Launch & Agentforce Symposium',
      date: inauData.inauguratedDate || 'August 25, 2025',
      academicYear: '2025–2026',
      venue: 'SJEC Campus',
      description: inauData.eventDescription || 'The Department of Computer Science & Engineering founded the AgentBlazer Club...',
      badge: inauData.eventBadge || 'Official Launch & Keynote',
    });
    console.log('✅ Inauguration details seeded');
  }

  // 4. Seed Guests
  if (Array.isArray(store.guests) && store.guests.length > 0) {
    for (const g of store.guests) {
      await Guest.findOneAndUpdate(
        { id: g.id },
        {
          id: g.id,
          name: g.name,
          role: g.role,
          title: g.bottomLeft || g.role,
          institution: g.bottomRight || 'SJEC',
          image: g.imageUrl || '',
        },
        { upsert: true }
      );
    }
    console.log(`✅ ${store.guests.length} Guests seeded`);
  }

  // 5. Seed Faculty
  if (Array.isArray(store.faculty) && store.faculty.length > 0) {
    for (const f of store.faculty) {
      await Faculty.findOneAndUpdate(
        { id: f.id },
        {
          id: f.id,
          name: f.name,
          role: f.role,
          department: 'Computer Science & Engineering',
          image: f.imageUrl || '',
        },
        { upsert: true }
      );
    }
    console.log(`✅ ${store.faculty.length} Faculty members seeded`);
  }

  // 6. Seed Student Team & Committee
  const teamItems = store.studentTeam || [];
  const committeeItems = store.committee || [];

  for (const m of teamItems) {
    await Member.findOneAndUpdate(
      { id: m.id },
      {
        id: m.id,
        name: m.name,
        role: m.title || m.role,
        category: 'core',
        image: m.imageUrl || '',
      },
      { upsert: true }
    );
  }

  for (const c of committeeItems) {
    await Member.findOneAndUpdate(
      { id: c.id },
      {
        id: c.id,
        name: c.name,
        role: c.role || 'Member',
        category: 'committee',
        year: c.year || '',
        image: c.imageUrl || '',
      },
      { upsert: true }
    );
  }
  console.log(`✅ ${teamItems.length + committeeItems.length} Team & Committee members seeded`);

  // 7. Seed Sample Events if empty
  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    await Event.create({
      id: 'event-agentforce-2025',
      title: 'Agentforce Symposium & Hands-on Workshop',
      date: 'August 25, 2025',
      time: '09:30 AM - 04:30 PM',
      venue: 'SJEC CSE Seminar Hall',
      description: 'An interactive symposium exploring agentic intelligence, autonomous LLM workflows, and Salesforce Agentforce enterprise integrations.',
      category: 'Symposium',
      registrationOpen: true,
      maxSeats: 120,
      tags: ['Autonomous AI', 'Agentforce', 'Hands-on', 'Salesforce'],
    });
    console.log('✅ Inauguration symposium event seeded');
  }

  console.log('🎉 Database seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
