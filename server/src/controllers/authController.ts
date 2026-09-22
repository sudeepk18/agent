import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/index.js';
import type { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_agentblazer_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const defaultEmail = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@agentblazer.sjec.ac.in').toLowerCase();
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'AgentBlazer@2026';

    let admin = null;
    try {
      admin = await Admin.findOne({ email: cleanEmail });
    } catch (dbErr) {
      // Database might not be connected yet
      console.warn('⚠️ [Auth] DB query failed, falling back to environment credentials');
    }

    let isPasswordValid = false;

    if (admin) {
      isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    } else if (cleanEmail === defaultEmail) {
      // Fallback to default admin if not yet seeded in DB
      isPasswordValid = password === defaultPassword;
    }

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign(
      { email: cleanEmail, role: 'administrator' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        email: cleanEmail,
        role: 'administrator',
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
}

export async function verifySession(req: AuthRequest, res: Response): Promise<void> {
  res.status(200).json({
    authenticated: true,
    user: req.user,
  });
}

export async function changePassword(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Both current and new password are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters long' });
      return;
    }

    const email = req.user?.email;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      res.status(404).json({ error: 'Admin account not found in database' });
      return;
    }

    const isCurrentValid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!isCurrentValid) {
      res.status(401).json({ error: 'Incorrect current password' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
}
