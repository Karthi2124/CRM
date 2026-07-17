import { Router } from 'express';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import * as ctrl from './calendar.controller';

const router = Router();

// Apply authentication middleware to all calendar routes
router.use(authenticate);

// ─── Calendar Routes ───────────────────────────────────────────────────────────
router.get('/',                 hasPermission('calendar', 'view'),   ctrl.listEvents);
router.post('/',                hasPermission('calendar', 'create'), ctrl.createEvent);
router.get('/:uuid',            hasPermission('calendar', 'view'),   ctrl.getEventByUuid);
router.put('/:uuid',            hasPermission('calendar', 'edit'),   ctrl.updateEvent);
router.delete('/:uuid',         hasPermission('calendar', 'delete'), ctrl.deleteEvent);
router.post('/:uuid/sync',      hasPermission('calendar', 'edit'),   ctrl.syncExternalCalendar);

export default router;
