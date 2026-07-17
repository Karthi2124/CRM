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
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate user and return JWT tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               rememberMe:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginValidator, authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user and invalidate refresh token session
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', authenticate, logoutValidator, authController.logout);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Issue a new access token using a valid refresh token (token rotation)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tokens rotated successfully
 */
router.post('/refresh-token', refreshTokenValidator, authController.refreshToken);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data retrieved
 *       401:
 *         description: Unauthorized
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