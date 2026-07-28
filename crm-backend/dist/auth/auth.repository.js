"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
class AuthRepository {
    // ─── User Queries ─────────────────────────────────────────────────────────
    /**
     * Find a user by email, including their role and permissions.
     */
    async findUserByEmail(email) {
        return models_1.User.findOne({
            where: { email },
            include: [
                {
                    model: models_1.Role,
                    as: 'role',
                    include: [
                        {
                            model: models_1.Permission,
                            as: 'permissions',
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        });
    }
    /**
     * Find a user by ID, including their role.
     */
    async findUserById(id) {
        return models_1.User.findByPk(id, {
            include: [{ model: models_1.Role, as: 'role' }],
            attributes: { exclude: ['password_hash'] },
        });
    }
    /**
     * Find a user by their password reset token (only if not yet expired).
     */
    async findUserByResetToken(token) {
        return models_1.User.findOne({
            where: {
                password_reset_token: token,
                password_reset_expires_at: { [sequelize_1.Op.gt]: new Date() },
            },
        });
    }
    /**
     * Set password reset token and expiry on user record.
     */
    async setPasswordResetToken(userId, token, expiresAt) {
        await models_1.User.update({
            password_reset_token: token,
            password_reset_expires_at: expiresAt,
        }, { where: { id: userId } });
    }
    /**
     * Clear the reset token after successful password reset.
     */
    async clearPasswordResetToken(userId) {
        await models_1.User.update({
            password_reset_token: null,
            password_reset_expires_at: null,
        }, { where: { id: userId } });
    }
    /**
     * Update user's hashed password.
     */
    async updatePassword(userId, passwordHash) {
        await models_1.User.update({ password_hash: passwordHash }, { where: { id: userId } });
    }
    /**
     * Update the user's last login timestamp.
     */
    async updateLastLogin(userId) {
        await models_1.User.update({ last_login_at: new Date() }, { where: { id: userId } });
    }
    // ─── Session Queries ──────────────────────────────────────────────────────
    /**
     * Create and save a new user session record.
     */
    async createSession(input) {
        return models_1.UserSession.create({
            user_id: input.userId,
            jwt_token: input.jwtToken,
            refresh_token: input.refreshToken,
            ip_address: input.ipAddress,
            user_agent: input.userAgent,
            expires_at: input.expiresAt,
            login_at: new Date(),
        });
    }
    /**
     * Find an active session by refresh token (not expired).
     */
    async findSessionByRefreshToken(refreshToken) {
        return models_1.UserSession.findOne({
            where: {
                refresh_token: refreshToken,
                expires_at: { [sequelize_1.Op.gt]: new Date() },
                logout_at: null,
            },
        });
    }
    /**
     * Update session with a new access token.
     */
    async updateSessionToken(sessionId, newJwtToken, newRefreshToken, expiresAt) {
        await models_1.UserSession.update({
            jwt_token: newJwtToken,
            refresh_token: newRefreshToken,
            expires_at: expiresAt,
        }, { where: { id: sessionId } });
    }
    /**
     * Soft-delete a session by refresh token (logout).
     */
    async deleteSessionByRefreshToken(refreshToken) {
        return models_1.UserSession.destroy({
            where: { refresh_token: refreshToken },
        });
    }
    /**
     * Invalidate all sessions for a user (e.g., password change).
     */
    async invalidateAllUserSessions(userId) {
        await models_1.UserSession.destroy({
            where: { user_id: userId },
        });
    }
}
exports.AuthRepository = AuthRepository;
