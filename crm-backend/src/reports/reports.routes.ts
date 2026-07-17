import { Router } from 'express';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import * as ctrl from './reports.controller';

const router = Router();

// Apply authentication middleware to all report routes
router.use(authenticate);

// ─── Reports Routes ─────────────────────────────────────────────────────────────
router.get('/leads',   hasPermission('reports', 'view'), ctrl.getLeadReport);
router.get('/sales',   hasPermission('reports', 'view'), ctrl.getSalesReport);
router.get('/tasks',   hasPermission('reports', 'view'), ctrl.getTaskReport);
router.get('/revenue', hasPermission('reports', 'view'), ctrl.getRevenueReport);

export default router;
