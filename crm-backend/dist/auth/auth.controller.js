"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const models_1 = require("../models");
const error_helper_1 = require("../utils/error.helper");
const response_helper_1 = require("../utils/response.helper");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    // ─── POST /api/auth/login ─────────────────────────────────────────────────
    login = (0, error_helper_1.asyncHandler)(async (req, res) => {
        const ipAddress = req.headers['x-forwarded-for'] || req.ip || null;
        const userAgent = req.headers['user-agent'] || null;
        const result = await this.authService.login(req.body, ipAddress, userAgent);
        (0, response_helper_1.sendSuccess)(res, result, 'Login successful');
    });
    // ─── POST /api/auth/logout ────────────────────────────────────────────────
    logout = (0, error_helper_1.asyncHandler)(async (req, res) => {
        const { refreshToken } = req.body;
        await this.authService.logout(refreshToken);
        (0, response_helper_1.sendSuccess)(res, null, 'Logout successful');
    });
    // ─── POST /api/auth/refresh-token ────────────────────────────────────────
    refreshToken = (0, error_helper_1.asyncHandler)(async (req, res) => {
        const { refreshToken } = req.body;
        const result = await this.authService.refreshToken(refreshToken);
        (0, response_helper_1.sendSuccess)(res, result, 'Token refreshed successfully');
    });
    // ─── GET /api/auth/profile ────────────────────────────────────────────────
    profile = (0, error_helper_1.asyncHandler)(async (req, res) => {
        const authUser = req.user;
        const user = await models_1.User.findByPk(authUser.id, {
            include: [
                {
                    model: models_1.Role,
                    as: 'role',
                },
            ],
            attributes: { exclude: ['password_hash', 'password_reset_token', 'password_reset_expires_at'] },
        });
        if (!user) {
            (0, response_helper_1.sendNotFound)(res, 'User profile');
            return;
        }
        (0, response_helper_1.sendSuccess)(res, {
            uuid: user.uuid,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
            status: user.status,
            role: user.role?.name || 'User',
            last_login_at: user.last_login_at,
            created_at: user.created_at,
        }, 'Profile retrieved successfully');
    });
    // ─── POST /api/auth/forgot-password ──────────────────────────────────────
    forgotPassword = (0, error_helper_1.asyncHandler)(async (req, res) => {
        await this.authService.forgotPassword(req.body);
        // Always 200 to prevent email enumeration
        (0, response_helper_1.sendSuccess)(res, null, 'If your email is registered, you will receive a password reset link shortly.');
    });
    // ─── POST /api/auth/reset-password ───────────────────────────────────────
    resetPassword = (0, error_helper_1.asyncHandler)(async (req, res) => {
        await this.authService.resetPassword(req.body);
        (0, response_helper_1.sendSuccess)(res, null, 'Password has been reset successfully. Please login with your new password.');
    });
    // ─── PUT /api/auth/change-password ───────────────────────────────────────
    changePassword = (0, error_helper_1.asyncHandler)(async (req, res) => {
        const authUser = req.user;
        await this.authService.changePassword(authUser.id, req.body);
        (0, response_helper_1.sendSuccess)(res, null, 'Password changed successfully. Please login again.');
    });
}
exports.AuthController = AuthController;
