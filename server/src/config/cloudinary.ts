import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

function createUploadMiddleware() {
  if (isCloudinaryConfigured) {
    const storage = new CloudinaryStorage({
      cloudinary,
      params: {
        folder: 'agentblazer',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'svg'],
        transformation: [{ width: 1200, crop: 'limit', quality: 'auto' }],
      } as any,
    });
    return multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
  } else {
    // Fallback local storage
    const localUploadsDir = path.resolve(process.cwd(), 'uploads');
    if (!fs.existsSync(localUploadsDir)) {
      fs.mkdirSync(localUploadsDir, { recursive: true });
    }

    const storage = multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, localUploadsDir),
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    });

    return multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
  }
}

export const upload = createUploadMiddleware();
export { cloudinary, isCloudinaryConfigured };
