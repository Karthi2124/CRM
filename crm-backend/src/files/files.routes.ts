import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import * as ctrl from './files.controller';

const router = Router();

// Apply authentication middleware to all file routes
router.use(authenticate);

// ─── File Routes ────────────────────────────────────────────────────────────────
router.post('/upload',         upload.single('file'), ctrl.uploadFile);
router.get('/download/:uuid',  ctrl.downloadFile);
router.delete('/:uuid',        ctrl.deleteFile);

export default router;
