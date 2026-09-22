import type { Request, Response } from 'express';

export function handleImageUpload(req: Request, res: Response): void {
  if (!req.file) {
    res.status(400).json({ error: 'No image file uploaded' });
    return;
  }

  // Cloudinary storage provides `path` as the full HTTPS URL
  // Local disk storage provides `filename`
  const file = req.file as any;
  const imageUrl = file.path?.startsWith('http')
    ? file.path
    : `/uploads/${file.filename}`;

  res.status(200).json({
    success: true,
    url: imageUrl,
    filename: file.filename || file.originalname,
  });
}
