import { Router } from 'express';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RolesRepository } from './roles.repository';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import {
  listRolesValidator,
  createRoleValidator,
  updateRoleValidator,
  assignPermissionsValidator,
} from './roles.validation';

const router = Router();

// Dependency Injection
const rolesRepository = new RolesRepository();
const rolesService = new RolesService(rolesRepository);
const rolesController = new RolesController(rolesService);

// All routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/roles
 * @desc    List all roles with pagination and search
 * @access  Private [roles.view]
 */
router.get('/', hasPermission('roles', 'view'), listRolesValidator, rolesController.list);

/**
 * @route   GET /api/roles/:uuid
 * @desc    Get a single role with its permissions
 * @access  Private [roles.view]
 */
router.get('/:uuid', hasPermission('roles', 'view'), rolesController.getOne);

/**
 * @route   POST /api/roles
 * @desc    Create a new role
 * @access  Private [roles.create]
 */
router.post('/', hasPermission('roles', 'create'), createRoleValidator, rolesController.create);

/**
 * @route   PUT /api/roles/:uuid
 * @desc    Update a role's name and description
 * @access  Private [roles.edit]
 */
router.put('/:uuid', hasPermission('roles', 'edit'), updateRoleValidator, rolesController.update);

/**
 * @route   DELETE /api/roles/:uuid
 * @desc    Delete a role (not allowed if users are assigned)
 * @access  Private [roles.delete]
 */
router.delete('/:uuid', hasPermission('roles', 'delete'), rolesController.remove);

/**
 * @route   PUT /api/roles/:uuid/permissions
 * @desc    Assign (sync) permissions to a role
 * @access  Private [roles.assign_permissions]
 */
router.put('/:uuid/permissions', hasPermission('roles', 'assign_permissions'), assignPermissionsValidator, rolesController.assignPermissions);

export default router;
