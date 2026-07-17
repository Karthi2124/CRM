import fs from 'fs';
import path from 'path';
import { UploadedFile } from '../models';
import { AppError } from '../utils/error.helper';
import { UPLOADS_DIR } from '../middleware/upload.middleware';

export interface FileRegistryPayload {
  original_name: string;
  storage_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
}

export async function registerFile(data: FileRegistryPayload, userId: number) {
  return UploadedFile.create({
    original_name: data.original_name,
    storage_name: data.storage_name,
    file_path: data.file_path,
    file_size: data.file_size,
    mime_type: data.mime_type,
    uploaded_by: userId,
  });
}

export async function getFileByUuid(uuid: string) {
  const fileRecord = await UploadedFile.findOne({ where: { uuid } });
  if (!fileRecord) {
    throw new AppError('File record not found', 404);
  }
  return fileRecord;
}

export async function deleteFile(uuid: string) {
  const fileRecord = await UploadedFile.findOne({ where: { uuid } });
  if (!fileRecord) {
    throw new AppError('File record not found', 404);
  }

  // Remove from filesystem
  const fullPath = path.join(UPLOADS_DIR, fileRecord.storage_name);
  try {
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (err: any) {
    // Log filesystem errors but continue DB deletion
  }

  // Remove from DB
  await fileRecord.destroy();
}
