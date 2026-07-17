import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as ctrl from './dashboard.controller';

const router = Router();

// Apply authentication middleware to all dashboard routes
router.use(authenticate);

// ─── Dashboard Routes ──────────────────────────────────────────────────────────
router.get('/kpis',   ctrl.getKpiSummary);
router.get('/charts', ctrl.getChartData);

export default router;
