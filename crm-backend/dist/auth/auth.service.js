"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    authRepository;
    jwtSecret;
    accessTokenExpiry = '15m';
    refreshTokenExpiry = '7d';
    refreshTokenExpiryMs = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    constructor(authRepository) {
        this.authRepository = authRepository;
        this.jwtSecret = process.env.JWT_SECRET || 'your_super_secret_key';
    }
    /**
     * Validate credentials, record session, update last login, and issue tokens.
     */
    async login(dto, ipAddress, userAgent) {
        // 1. Fetch user including role
        const user = await this.authRepository.findUserByEmail(dto.email);
        if (!user) {
            throw new Error('Invalid email or password');
        }
        // 2. Check user status
        if (user.status !== 'active') {
            throw new Error(`Your account status is ${user.status}. Access denied.`);
        }
        // 3. Verify password
        const isPasswordValid = await bcrypt_1.default.compare(dto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Resolve Role Name
        const roleName = user.role?.name || 'User';
        // 4. Generate JWT Access Token
        const jwtPayload = {
            userId: user.id,
            userUuid: user.uuid,
            email: user.email,
            role: roleName,
        };
        const accessToken = jsonwebtoken_1.default.sign(jwtPayload, this.jwtSecret, {
            expiresIn: this.accessTokenExpiry,
        });
        // 5. Generate Refresh Token
        const refreshToken = jsonwebtoken_1.default.sign({ userId: user.id, userUuid: user.uuid }, this.jwtSecret, { expiresIn: this.refreshTokenExpiry });
        const expiresAt = new Date(Date.now() + this.refreshTokenExpiryMs);
        // 6. Persist Session
        await this.authRepository.createSession({
            userId: user.id,
            jwtToken: accessToken,
            refreshToken,
            ipAddress,
            userAgent,
            expiresAt,
        });
        // 7. Update Last Login Timestamp
        await this.authRepository.updateLastLogin(user.id);
        return {
            accessToken,
            refreshToken,
            user: {
                uuid: user.uuid,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: roleName,
            },
        };
    }
    /**
     * Log out a user by invalidating their refresh token session.
     */
    async logout(refreshToken) {
        if (!refreshToken) {
            throw new Error('Refresh token is required');
        }
        const deletedCount = await this.authRepository.deleteSessionByRefreshToken(refreshToken);
        if (deletedCount === 0) {
            throw new Error('Session not found or already invalidated');
        }
    }
}
exports.AuthService = AuthService;
