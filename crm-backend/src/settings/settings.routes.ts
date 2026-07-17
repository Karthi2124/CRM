import { Router } from 'express';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import * as ctrl from './settings.controller';

const router = Router();

// Apply authentication middleware to all settings routes
router.use(authenticate);

// Dynamic permission guard mapping route parameters (e.g. /company -> settings.edit_company)
const checkGroupPermission = (req: any, res: any, next: any) => {
  const group = req.params.group;
  const action = `edit_${group}`;
  
  // Call hasPermission middleware dynamically
  return hasPermission('settings', action)(req, res, next);
};

// ─── Settings Routes ────────────────────────────────────────────────────────────
router.get('/', hasPermission('settings', 'view'), ctrl.getSettings);
router.put('/:group', checkGroupPermission, ctrl.updateSettingsGroup);

export default router;
