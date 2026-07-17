import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as ctrl from './notifications.controller';

const router = Router();

// Apply authentication middleware to all notification routes
router.use(authenticate);

// ─── Notification Routes ────────────────────────────────────────────────────────
router.get('/',                 ctrl.getMyNotifications);
router.post('/read-all',        ctrl.markAllRead);
router.put('/:uuid/read',       ctrl.markRead);
router.get('/preferences',      ctrl.getPreferences);
router.put('/preferences',      ctrl.updatePreferences);

export default router;
