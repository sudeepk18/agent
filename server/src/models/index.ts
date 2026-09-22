import mongoose, { Schema, Document } from 'mongoose';

// ==========================================
// Admin Model
// ==========================================
export interface IAdmin extends Document {
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'administrator' },
  },
  { timestamps: true }
);

export const Admin = mongoose.model<IAdmin>('Admin', AdminSchema);

// ==========================================
// Guest Model
// ==========================================
export interface IGuest extends Document {
  id: string;
  name: string;
  role: string;
  title: string;
  institution: string;
  image: string;
  bio?: string;
  keynoteTopic?: string;
  linkedinUrl?: string;
}

const GuestSchema = new Schema<IGuest>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  title: { type: String, required: true },
  institution: { type: String, required: true },
  image: { type: String, default: '' },
  bio: { type: String, default: '' },
  keynoteTopic: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
});

export const Guest = mongoose.model<IGuest>('Guest', GuestSchema);

// ==========================================
// Faculty Model
// ==========================================
export interface IFaculty extends Document {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  linkedinUrl?: string;
}

const FacultySchema = new Schema<IFaculty>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  department: { type: String, default: 'Computer Science & Engineering' },
  image: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
});

export const Faculty = mongoose.model<IFaculty>('Faculty', FacultySchema);

// ==========================================
// Student Team & Committee Member Model
// ==========================================
export interface IMember extends Document {
  id: string;
  name: string;
  role: string;
  category: 'core' | 'committee' | 'leads' | 'technical' | 'design';
  year?: string;
  image: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

const MemberSchema = new Schema<IMember>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  category: { type: String, default: 'core' },
  year: { type: String, default: '' },
  image: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
});

export const Member = mongoose.model<IMember>('Member', MemberSchema);

// ==========================================
// Event Model
// ==========================================
export interface IEvent extends Document {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  description: string;
  category: string;
  posterUrl?: string;
  registrationOpen: boolean;
  maxSeats?: number;
  tags: string[];
}

const EventSchema = new Schema<IEvent>({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, default: '10:00 AM' },
  venue: { type: String, default: 'SJEC Campus' },
  description: { type: String, default: '' },
  category: { type: String, default: 'Symposium' },
  posterUrl: { type: String, default: '' },
  registrationOpen: { type: Boolean, default: true },
  maxSeats: { type: Number, default: 100 },
  tags: [{ type: String }],
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);

// ==========================================
// Event Registration Model
// ==========================================
export interface IRegistration extends Document {
  eventId: string;
  eventName: string;
  name: string;
  email: string;
  usn: string;
  college: string;
  semester: string;
  branch: string;
  phone: string;
  status: 'confirmed' | 'waitlist' | 'cancelled';
  registeredAt: Date;
}

const RegistrationSchema = new Schema<IRegistration>({
  eventId: { type: String, required: true, index: true },
  eventName: { type: String, default: '' },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  usn: { type: String, required: true, uppercase: true, trim: true },
  college: { type: String, default: 'SJEC' },
  semester: { type: String, default: '' },
  branch: { type: String, default: 'CSE' },
  phone: { type: String, default: '' },
  status: { type: String, default: 'confirmed' },
  registeredAt: { type: Date, default: Date.now },
});

export const Registration = mongoose.model<IRegistration>('Registration', RegistrationSchema);

// ==========================================
// Inauguration Content Model
// ==========================================
export interface IInauguration extends Document {
  title: string;
  date: string;
  academicYear: string;
  venue: string;
  description: string;
  badge: string;
}

const InaugurationSchema = new Schema<IInauguration>({
  title: { type: String, default: 'AgentBlazer Club Launch & Agentforce Symposium' },
  date: { type: String, default: 'August 25, 2025' },
  academicYear: { type: String, default: '2025–2026' },
  venue: { type: String, default: 'SJEC Campus' },
  description: { type: String, default: '' },
  badge: { type: String, default: 'Official Launch & Keynote' },
});

export const Inauguration = mongoose.model<IInauguration>('Inauguration', InaugurationSchema);
