"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_repository_1 = require("./auth.repository");
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// ─── Dependency Injection ─────────────────────────────────────────────────────
const authRepository = new auth_repository_1.AuthRepository();
const authService = new auth_service_1.AuthService(authRepository);
const authController = new auth_controller_1.AuthController(authService);
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
router.post('/login', auth_validation_1.loginValidator, authController.login);
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
router.post('/logout', auth_middleware_1.authenticate, auth_validation_1.logoutValidator, authController.logout);
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
router.post('/refresh-token', auth_validation_1.refreshTokenValidator, authController.refreshToken);
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
router.get('/profile', auth_middleware_1.authenticate, authController.profile);
/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email if user exists (silent for unknown emails)
 * @access  Public
 */
router.post('/forgot-password', auth_validation_1.forgotPasswordValidator, authController.forgotPassword);
/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using a valid reset token
 * @access  Public
 */
router.post('/reset-password', auth_validation_1.resetPasswordValidator, authController.resetPassword);
/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password for the currently authenticated user
 * @access  Private
 */
router.put('/change-password', auth_middleware_1.authenticate, auth_validation_1.changePasswordValidator, authController.changePassword);
exports.default = router;
