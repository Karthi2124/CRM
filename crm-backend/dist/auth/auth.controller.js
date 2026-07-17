"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const models_1 = require("../models");
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    /**
     * Handle HTTP request for logging in users.
     */
    login = async (req, res) => {
        try {
            const ipAddress = req.headers['x-forwarded-for'] || req.ip || null;
            const userAgent = req.headers['user-agent'] || null;
            const response = await this.authService.login(req.body, ipAddress, userAgent);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: response,
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error.message || 'Authentication failed',
            });
        }
    };
    /**
     * Handle HTTP request for logging out users.
     */
    logout = async (req, res) => {
        try {
            const { refreshToken } = req.body;
            await this.authService.logout(refreshToken);
            res.status(200).json({
                success: true,
                message: 'Logout successful',
            });
        }
        catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Logout failed',
            });
        }
    };
    /**
     * Retrieve current authenticated user profile details.
     */
    profile = async (req, res) => {
        try {
            const authUser = req.user;
            if (!authUser) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized access',
                });
                return;
            }
            // Fetch fresh, full details including Role from DB, excluding password hash
            const user = await models_1.User.findByPk(authUser.id, {
                include: [{ model: models_1.Role, as: 'role' }],
                attributes: { exclude: ['password_hash'] },
            });
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: 'User profile not found',
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: {
                    uuid: user.uuid,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    status: user.status,
                    role: user.role?.name || 'User',
                    last_login_at: user.last_login_at,
                    created_at: user.created_at,
                },
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error.message || 'Failed to retrieve profile details',
            });
        }
    };
}
exports.AuthController = AuthController;
