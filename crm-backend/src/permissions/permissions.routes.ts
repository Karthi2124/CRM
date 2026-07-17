import { Router } from 'express';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { PermissionsRepository } from './permissions.repository';
import { authenticate, hasPermission } from '../middleware/auth.middleware';

const router = Router();

// Dependency Injection
const permissionsRepository = new PermissionsRepository();
const permissionsService = new PermissionsService(permissionsRepository);
const permissionsController = new PermissionsController(permissionsService);

router.use(authenticate);

/**
 * @route   GET /api/permissions
 * @desc    Get all permissions as flat list
 * @access  Private [permissions.view]
 */
router.get('/', hasPermission('permissions', 'view'), permissionsController.list);

/**
 * @route   GET /api/permissions/grouped
 * @desc    Get permissions grouped by module (for role permission matrix)
 * @access  Private [permissions.view]
 */
router.get('/grouped', hasPermission('permissions', 'view'), permissionsController.listGrouped);

export default router;
