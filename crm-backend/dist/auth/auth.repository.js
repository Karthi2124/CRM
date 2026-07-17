"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const models_1 = require("../models");
class AuthRepository {
    /**
     * Find a user by their email address, including their role mapping.
     */
    async findUserByEmail(email) {
        return models_1.User.findOne({
            where: { email },
            include: [
                {
                    model: models_1.Role,
                    as: 'role',
                },
            ],
        });
    }
    /**
     * Create and save a new user session record in the database.
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
     * Update the user's last login timestamp.
     */
    async updateLastLogin(userId) {
        await models_1.User.update({ last_login_at: new Date() }, { where: { id: userId } });
    }
    /**
     * Delete a session by its refresh token (soft-delete since table is paranoid).
     */
    async deleteSessionByRefreshToken(refreshToken) {
        return models_1.UserSession.destroy({
            where: { refresh_token: refreshToken },
        });
    }
}
exports.AuthRepository = AuthRepository;
