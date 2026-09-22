import { Router } from 'express';
import { login, verifySession, changePassword } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, login);
router.get('/me', requireAuth, verifySession);
router.post('/change-password', requireAuth, changePassword);

export default router;
