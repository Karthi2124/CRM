"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const email_helper_1 = require("../utils/email.helper");
const error_helper_1 = require("../utils/error.helper");
const logger_1 = __importDefault(require("../utils/logger"));
class AuthService {
    authRepository;
    jwtSecret;
    // Standard session: 15m access, 7d refresh
    accessTokenExpiry = '15m';
    accessTokenExpirySeconds = 15 * 60;
    refreshTokenExpiry = '7d';
    refreshTokenExpiryMs = 7 * 24 * 60 * 60 * 1000;
    // Remember Me session: 7d access, 30d refresh
    rememberMeAccessExpiry = '7d';
    rememberMeAccessExpirySeconds = 7 * 24 * 60 * 60;
    rememberMeRefreshExpiry = '30d';
    rememberMeRefreshExpiryMs = 30 * 24 * 60 * 60 * 1000;
    // Password reset token TTL: 15 minutes
    resetTokenExpiryMs = 15 * 60 * 1000;
    constructor(authRepository) {
        this.authRepository = authRepository;
        this.jwtSecret = process.env.JWT_SECRET;
        if (!this.jwtSecret) {
            throw new Error('JWT_SECRET environment variable is not set');
        }
    }
    // ─── Build JWT Payload Utility ────────────────────────────────────────────
    buildJwtPayload(user, roleName) {
        return {
            userId: user.id,
            userUuid: user.uuid,
            email: user.email,
            role: roleName,
        };
    }
    // ─── Sign Tokens ──────────────────────────────────────────────────────────
    signAccessToken(payload, rememberMe = false) {
        return jsonwebtoken_1.default.sign(payload, this.jwtSecret, {
            expiresIn: rememberMe ? this.rememberMeAccessExpiry : this.accessTokenExpiry,
        });
    }
    signRefreshToken(userId, userUuid, rememberMe = false) {
        return jsonwebtoken_1.default.sign({ userId, userUuid }, this.jwtSecret, { expiresIn: rememberMe ? this.rememberMeRefreshExpiry : this.refreshTokenExpiry });
    }
    // ─── LOGIN ────────────────────────────────────────────────────────────────
    async login(dto, ipAddress, userAgent) {
        const user = await this.authRepository.findUserByEmail(dto.email);
        if (!user)
            throw new error_helper_1.UnauthorizedError('Invalid email or password');
        if (user.status !== 'active') {
            throw new error_helper_1.AppError(`Your account status is "${user.status}". Please contact your administrator.`, error_helper_1.HttpStatusCode.UNAUTHORIZED);
        }
        const isPasswordValid = await bcrypt_1.default.compare(dto.password, user.password_hash);
        if (!isPasswordValid)
            throw new error_helper_1.UnauthorizedError('Invalid email or password');
        const roleName = user.role?.name || 'User';
        const permissions = ((user.role?.permissions) || []).map((p) => `${p.module}.${p.action}`);
        const rememberMe = dto.rememberMe ?? false;
        const jwtPayload = this.buildJwtPayload(user, roleName);
        const accessToken = this.signAccessToken(jwtPayload, rememberMe);
        const refreshToken = this.signRefreshToken(user.id, user.uuid, rememberMe);
        console.log("Permissions Count:", permissions.length);
        console.log("JWT Length:", accessToken.length);
        const expiresAt = new Date(Date.now() + (rememberMe ? this.rememberMeRefreshExpiryMs : this.refreshTokenExpiryMs));
        await this.authRepository.createSession({
            userId: user.id,
            jwtToken: accessToken,
            refreshToken,
            ipAddress,
            userAgent,
            expiresAt,
        });
        await this.authRepository.updateLastLogin(user.id);
        logger_1.default.info(`User logged in: ${user.email} [rememberMe: ${rememberMe}]`);
        return {
            accessToken,
            refreshToken,
            expiresIn: rememberMe ? this.rememberMeAccessExpirySeconds : this.accessTokenExpirySeconds,
            user: {
                uuid: user.uuid,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: roleName,
            },
        };
    }
    // ─── LOGOUT ───────────────────────────────────────────────────────────────
    async logout(refreshToken) {
        if (!refreshToken)
            throw new error_helper_1.BadRequestError('Refresh token is required');
        const deleted = await this.authRepository.deleteSessionByRefreshToken(refreshToken);
        if (deleted === 0) {
            throw new error_helper_1.NotFoundError('Session not found or already invalidated');
        }
        logger_1.default.info('User session invalidated');
    }
    // ─── REFRESH TOKEN ────────────────────────────────────────────────────────
    async refreshToken(token) {
        // 1. Verify the refresh token signature
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
        }
        catch {
            throw new error_helper_1.UnauthorizedError('Invalid or expired refresh token');
        }
        // 2. Find active session in DB
        const session = await this.authRepository.findSessionByRefreshToken(token);
        if (!session)
            throw new error_helper_1.UnauthorizedError('Session not found or expired. Please login again.');
        // 3. Load full user with permissions
        const user = await this.authRepository.findUserByEmail((await this.authRepository.findUserById(decoded.userId))?.email || '');
        if (!user || user.status !== 'active')
            throw new error_helper_1.UnauthorizedError('User not found or inactive');
        const roleName = user.role?.name || 'User';
        // 4. Issue new tokens (refresh token rotation)
        const jwtPayload = this.buildJwtPayload(user, roleName);
        const newAccessToken = this.signAccessToken(jwtPayload);
        const newRefreshToken = this.signRefreshToken(user.id, user.uuid);
        const expiresAt = new Date(Date.now() + this.refreshTokenExpiryMs);
        await this.authRepository.updateSessionToken(session.id, newAccessToken, newRefreshToken, expiresAt);
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: this.accessTokenExpirySeconds,
        };
    }
    // ─── FORGOT PASSWORD ──────────────────────────────────────────────────────
    async forgotPassword(dto) {
        // Always respond with success to prevent email enumeration
        const user = await this.authRepository.findUserByEmail(dto.email);
        if (!user) {
            logger_1.default.warn(`Forgot password requested for unknown email: ${dto.email}`);
            return; // Silent return
        }
        // Generate a secure random reset token
        const resetToken = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + this.resetTokenExpiryMs);
        await this.authRepository.setPasswordResetToken(user.id, resetToken, expiresAt);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
        await (0, email_helper_1.sendEmail)({
            to: user.email,
            subject: 'Password Reset Request — CRM',
            html: (0, email_helper_1.getForgotPasswordTemplate)({
                firstName: user.first_name,
                resetUrl,
                expiresInMinutes: 15,
            }),
        });
        logger_1.default.info(`Password reset email sent to: ${user.email}`);
    }
    // ─── RESET PASSWORD ───────────────────────────────────────────────────────
    async resetPassword(dto) {
        if (dto.password !== dto.confirmPassword) {
            throw new error_helper_1.BadRequestError('Passwords do not match');
        }
        const user = await this.authRepository.findUserByResetToken(dto.token);
        if (!user) {
            throw new error_helper_1.BadRequestError('Invalid or expired reset token. Please request a new one.');
        }
        const passwordHash = await bcrypt_1.default.hash(dto.password, 12);
        await this.authRepository.updatePassword(user.id, passwordHash);
        await this.authRepository.clearPasswordResetToken(user.id);
        // Invalidate all sessions for security
        await this.authRepository.invalidateAllUserSessions(user.id);
        await (0, email_helper_1.sendEmail)({
            to: user.email,
            subject: 'Your Password Has Been Changed — CRM',
            html: (0, email_helper_1.getPasswordChangedTemplate)({ firstName: user.first_name }),
        });
        logger_1.default.info(`Password successfully reset for user: ${user.email}`);
    }
    // ─── CHANGE PASSWORD ──────────────────────────────────────────────────────
    async changePassword(userId, dto) {
        if (dto.newPassword !== dto.confirmPassword) {
            throw new error_helper_1.BadRequestError('New passwords do not match');
        }
        const user = await this.authRepository.findUserById(userId);
        if (!user)
            throw new error_helper_1.NotFoundError('User');
        // Fetch with password hash (findUserById excludes it)
        const userWithHash = await this.authRepository.findUserByEmail(user.email);
        if (!userWithHash)
            throw new error_helper_1.NotFoundError('User');
        const isCurrentPasswordValid = await bcrypt_1.default.compare(dto.currentPassword, userWithHash.password_hash);
        if (!isCurrentPasswordValid) {
            throw new error_helper_1.BadRequestError('Current password is incorrect');
        }
        // Ensure new password is different from current
        const isSamePassword = await bcrypt_1.default.compare(dto.newPassword, userWithHash.password_hash);
        if (isSamePassword) {
            throw new error_helper_1.BadRequestError('New password must be different from your current password');
        }
        const passwordHash = await bcrypt_1.default.hash(dto.newPassword, 12);
        await this.authRepository.updatePassword(userId, passwordHash);
        // Invalidate all other sessions for security
        await this.authRepository.invalidateAllUserSessions(userId);
        await (0, email_helper_1.sendEmail)({
            to: user.email,
            subject: 'Your Password Has Been Changed — CRM',
            html: (0, email_helper_1.getPasswordChangedTemplate)({ firstName: userWithHash.first_name }),
        });
        logger_1.default.info(`Password changed by user ID: ${userId}`);
    }
}
exports.AuthService = AuthService;
