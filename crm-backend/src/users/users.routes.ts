import { Router } from 'express';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import {
  listUsersValidator,
  createUserValidator,
  updateUserValidator,
  changeStatusValidator,
  adminResetPasswordValidator,
  bulkDeleteValidator,
} from './users.validation';

const router = Router();

// Dependency Injection
const usersRepository = new UsersRepository();
const usersService = new UsersService(usersRepository);
const usersController = new UsersController(usersService);

router.use(authenticate);

/**
 * @route   GET /api/users/export
 * @desc    Export all users as CSV
 * @access  Private [users.export]
 */
router.get('/export', hasPermission('users', 'export'), usersController.exportCsv);

/**
 * @route   GET /api/users
 * @desc    List users with pagination, search, filter, sort
 * @access  Private [users.view]
 */
router.get('/', hasPermission('users', 'view'), listUsersValidator, usersController.list);

/**
 * @route   GET /api/users/:uuid
 * @desc    Get a single user profile
 * @access  Private [users.view]
 */
router.get('/:uuid', hasPermission('users', 'view'), usersController.getOne);

/**
 * @route   POST /api/users
 * @desc    Create a new user
 * @access  Private [users.create]
 */
router.post('/', hasPermission('users', 'create'), createUserValidator, usersController.create);

/**
 * @route   POST /api/users/bulk-delete
 * @desc    Bulk delete users by UUIDs
 * @access  Private [users.delete]
 */
router.post('/bulk-delete', hasPermission('users', 'delete'), bulkDeleteValidator, usersController.bulkDelete);

/**
 * @route   PUT /api/users/:uuid
 * @desc    Update user profile
 * @access  Private [users.edit]
 */
router.put('/:uuid', hasPermission('users', 'edit'), updateUserValidator, usersController.update);

/**
 * @route   PATCH /api/users/:uuid/status
 * @desc    Change user status (active/inactive/suspended)
 * @access  Private [users.change_status]
 */
router.patch('/:uuid/status', hasPermission('users', 'change_status'), changeStatusValidator, usersController.changeStatus);

/**
 * @route   POST /api/users/:uuid/reset-password
 * @desc    Admin force-reset a user's password
 * @access  Private [users.reset_password]
 */
router.post('/:uuid/reset-password', hasPermission('users', 'reset_password'), adminResetPasswordValidator, usersController.adminResetPassword);

/**
 * @route   DELETE /api/users/:uuid
 * @desc    Soft-delete a user
 * @access  Private [users.delete]
 */
router.delete('/:uuid', hasPermission('users', 'delete'), usersController.remove);

export default router;
