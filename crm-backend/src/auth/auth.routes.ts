import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import {
  loginValidator,
  logoutValidator,
  refreshTokenValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
} from './auth.validation';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// ─── Dependency Injection ─────────────────────────────────────────────────────
const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT tokens
 * @access  Public
 */
router.post('/login', loginValidator, authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and invalidate refresh token session
 * @access  Private
 */
router.post('/logout', authenticate, logoutValidator, authController.logout);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Issue a new access token using a valid refresh token (token rotation)
 * @access  Public
 */
router.post('/refresh-token', refreshTokenValidator, authController.refreshToken);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current authenticated user profile
 * @access  Private
 */
router.get('/profile', authenticate, authController.profile);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email if user exists (silent for unknown emails)
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordValidator, authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using a valid reset token
 * @access  Public
 */
router.post('/reset-password', resetPasswordValidator, authController.resetPassword);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password for the currently authenticated user
 * @access  Private
 */
router.put('/change-password', authenticate, changePasswordValidator, authController.changePassword);

export default router;