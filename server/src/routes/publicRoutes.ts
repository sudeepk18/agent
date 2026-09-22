import { Router } from 'express';
import { getPublicContent } from '../controllers/publicController.js';
import { registerForEvent } from '../controllers/eventController.js';
import { generalLimiter, registrationLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/content', generalLimiter, getPublicContent);
router.post('/events/register', registrationLimiter, registerForEvent);

export default router;
