import { Router } from 'express';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import * as ctrl from './audit-logs.controller';

const router = Router();

// Apply authentication middleware to all audit log routes
router.use(authenticate);

// ─── Audit Log Routes ───────────────────────────────────────────────────────────
router.get('/', hasPermission('audit_logs', 'view'), ctrl.getAuditLogs);

export default router;
