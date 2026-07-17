import { Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import * as service from './files.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../utils/error.helper';
import { UPLOADS_DIR } from '../middleware/upload.middleware';

export async function uploadFile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const file = (req as any).file;
    const userId = req.user?.id;
    
    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }

    const filePayload = {
      original_name: file.originalname,
      storage_name: file.filename,
      file_path: `/uploads/${file.filename}`,
      file_size: file.size,
      mime_type: file.mimetype,
    };

    const uploaded = await service.registerFile(filePayload, userId);
    
    // Build secure download URL
    const downloadUrl = `/api/files/download/${uploaded.uuid}`;

    res.status(201).json({
      success: true,
      data: {
        uuid: uploaded.uuid,
        original_name: uploaded.original_name,
        file_size: uploaded.file_size,
        mime_type: uploaded.mime_type,
        download_url: downloadUrl,
      },
      message: 'File uploaded and registered successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function downloadFile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const uuid = req.params.uuid as string;
    const fileRecord = await service.getFileByUuid(uuid);

    const fullPath = path.join(UPLOADS_DIR, fileRecord.storage_name);
    
    if (!fs.existsSync(fullPath)) {
      throw new AppError('File not found on storage disk', 404);
    }

    res.setHeader('Content-Type', fileRecord.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.original_name}"`);
    res.sendFile(fullPath);
  } catch (err) {
    next(err);
  }
}

export async function deleteFile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const uuid = req.params.uuid as string;
    await service.deleteFile(uuid);
    res.json({ success: true, message: 'File deleted successfully' });
  } catch (err) {
    next(err);
  }
}
