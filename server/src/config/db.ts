import mongoose from 'mongoose';

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️ [MongoDB] MONGODB_URI is not defined in environment variables.');
    return false;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ [MongoDB] Connected successfully to database');
    return true;
  } catch (error) {
    console.error('❌ [MongoDB] Connection error:', error);
    return false;
  }
}
