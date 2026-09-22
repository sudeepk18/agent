import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import { handleImageUpload } from '../controllers/uploadController.js';
import {
  getAdminContent,
  getAdminMedia,
  updateInauguration,
  createGuest,
  updateGuest,
  deleteGuest,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  createMember,
  updateMember,
  deleteMember,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/adminController.js';
import { getEventRegistrations } from '../controllers/eventController.js';

const router = Router();

// Protect all admin endpoints with JWT authentication
router.use(requireAuth);

// Full Content GET
router.get('/content', getAdminContent);

// Media Gallery GET
router.get('/media', getAdminMedia);

// Inauguration
router.put('/inauguration', updateInauguration);

// Guests
router.post('/guests', createGuest);
router.put('/guests/:id', updateGuest);
router.delete('/guests/:id', deleteGuest);

// Faculty
router.post('/faculty', createFaculty);
router.put('/faculty/:id', updateFaculty);
router.delete('/faculty/:id', deleteFaculty);

// Members (Core Team & Committee)
router.post('/members', createMember);
router.put('/members/:id', updateMember);
router.delete('/members/:id', deleteMember);

// Events
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

// Media / Image Upload
router.post('/upload', upload.single('file'), handleImageUpload);

// Event Registrations (attendee management)
router.get('/registrations', getEventRegistrations);
router.get('/registrations/:eventId', getEventRegistrations);

export default router;
