"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_repository_1 = require("./auth.repository");
const auth_service_1 = require("./auth.service");
const auth_validation_1 = require("./auth.validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Dependency Injection
const authRepository = new auth_repository_1.AuthRepository();
const authService = new auth_service_1.AuthService(authRepository);
const authController = new auth_controller_1.AuthController(authService);
/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT tokens
 * @access  Public
 */
router.post('/login', auth_validation_1.loginValidator, authController.login);
/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and invalidate refresh token
 * @access  Private
 */
router.post('/logout', auth_middleware_1.authenticate, auth_validation_1.logoutValidator, authController.logout);
/**
 * @route   GET /api/auth/profile
 * @desc    Get current authenticated user profile
 * @access  Private
 */
router.get('/profile', auth_middleware_1.authenticate, authController.profile);
exports.default = router;
