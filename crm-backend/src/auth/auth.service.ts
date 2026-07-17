import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthRepository } from './auth.repository';
import {
  LoginDto,
  LoginResponse,
  JwtPayload,
  RefreshTokenResponse,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './auth.types';
import { sendEmail, getForgotPasswordTemplate, getPasswordChangedTemplate } from '../utils/email.helper';
import {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
  AppError,
  HttpStatusCode,
} from '../utils/error.helper';
import logger from '../utils/logger';

export class AuthService {
  private authRepository: AuthRepository;
  private readonly jwtSecret: Secret;

  // Standard session: 15m access, 7d refresh
  private readonly accessTokenExpiry: SignOptions['expiresIn'] = '15m';
  private readonly accessTokenExpirySeconds = 15 * 60;
  private readonly refreshTokenExpiry: SignOptions['expiresIn'] = '7d';
  private readonly refreshTokenExpiryMs = 7 * 24 * 60 * 60 * 1000;

  // Remember Me session: 7d access, 30d refresh
  private readonly rememberMeAccessExpiry: SignOptions['expiresIn'] = '7d';
  private readonly rememberMeAccessExpirySeconds = 7 * 24 * 60 * 60;
  private readonly rememberMeRefreshExpiry: SignOptions['expiresIn'] = '30d';
  private readonly rememberMeRefreshExpiryMs = 30 * 24 * 60 * 60 * 1000;

  // Password reset token TTL: 15 minutes
  private readonly resetTokenExpiryMs = 15 * 60 * 1000;

  constructor(authRepository: AuthRepository) {
    this.authRepository = authRepository;
    this.jwtSecret = process.env.JWT_SECRET as string;
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
  }

  // ─── Build JWT Payload Utility ────────────────────────────────────────────
  private buildJwtPayload(user: any, roleName: string): JwtPayload {
    return {
      userId: user.id,
      userUuid: user.uuid,
      email: user.email,
      role: roleName,
    };
  }
  // ─── Sign Tokens ──────────────────────────────────────────────────────────
  private signAccessToken(payload: JwtPayload, rememberMe = false): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: rememberMe ? this.rememberMeAccessExpiry : this.accessTokenExpiry,
    });
  }

  private signRefreshToken(userId: number, userUuid: string, rememberMe = false): string {
    return jwt.sign(
      { userId, userUuid },
      this.jwtSecret,
      { expiresIn: rememberMe ? this.rememberMeRefreshExpiry : this.refreshTokenExpiry }
    );
  }

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  async login(dto: LoginDto, ipAddress: string | null, userAgent: string | null): Promise<LoginResponse> {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedError('Invalid email or password');

    if (user.status !== 'active') {
      throw new AppError(
        `Your account status is "${user.status}". Please contact your administrator.`,
        HttpStatusCode.UNAUTHORIZED
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid email or password');

    const roleName = (user as any).role?.name || 'User';
    const permissions: string[] = (((user as any).role?.permissions) || []).map(
      (p: any) => `${p.module}.${p.action}`
    );

    const rememberMe = dto.rememberMe ?? false;
    const jwtPayload = this.buildJwtPayload(user, roleName);
    const accessToken = this.signAccessToken(jwtPayload, rememberMe);
    const refreshToken = this.signRefreshToken(user.id, user.uuid, rememberMe);
    console.log("Permissions Count:", permissions.length);
    console.log("JWT Length:", accessToken.length);

    const expiresAt = new Date(
      Date.now() + (rememberMe ? this.rememberMeRefreshExpiryMs : this.refreshTokenExpiryMs)
    );

    await this.authRepository.createSession({
      userId: user.id,
      jwtToken: accessToken,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    await this.authRepository.updateLastLogin(user.id);

    logger.info(`User logged in: ${user.email} [rememberMe: ${rememberMe}]`);

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
  async logout(refreshToken: string): Promise<void> {
    if (!refreshToken) throw new BadRequestError('Refresh token is required');

    const deleted = await this.authRepository.deleteSessionByRefreshToken(refreshToken);
    if (deleted === 0) {
      throw new NotFoundError('Session not found or already invalidated');
    }

    logger.info('User session invalidated');
  }

  // ─── REFRESH TOKEN ────────────────────────────────────────────────────────
  async refreshToken(token: string): Promise<RefreshTokenResponse> {
    // 1. Verify the refresh token signature
    let decoded: { userId: number; userUuid: string };
    try {
      decoded = jwt.verify(token, this.jwtSecret) as { userId: number; userUuid: string };
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // 2. Find active session in DB
    const session = await this.authRepository.findSessionByRefreshToken(token);
    if (!session) throw new UnauthorizedError('Session not found or expired. Please login again.');

    // 3. Load full user with permissions
    const user = await this.authRepository.findUserByEmail(
      (await this.authRepository.findUserById(decoded.userId))?.email || ''
    );
    if (!user || user.status !== 'active') throw new UnauthorizedError('User not found or inactive');

    const roleName = (user as any).role?.name || 'User';

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
  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    // Always respond with success to prevent email enumeration
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      logger.warn(`Forgot password requested for unknown email: ${dto.email}`);
      return; // Silent return
    }

    // Generate a secure random reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + this.resetTokenExpiryMs);

    await this.authRepository.setPasswordResetToken(user.id, resetToken, expiresAt);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request — CRM',
      html: getForgotPasswordTemplate({
        firstName: user.first_name,
        resetUrl,
        expiresInMinutes: 15,
      }),
    });

    logger.info(`Password reset email sent to: ${user.email}`);
  }

  // ─── RESET PASSWORD ───────────────────────────────────────────────────────
  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestError('Passwords do not match');
    }

    const user = await this.authRepository.findUserByResetToken(dto.token);
    if (!user) {
      throw new BadRequestError('Invalid or expired reset token. Please request a new one.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    await this.authRepository.updatePassword(user.id, passwordHash);
    await this.authRepository.clearPasswordResetToken(user.id);

    // Invalidate all sessions for security
    await this.authRepository.invalidateAllUserSessions(user.id);

    await sendEmail({
      to: user.email,
      subject: 'Your Password Has Been Changed — CRM',
      html: getPasswordChangedTemplate({ firstName: user.first_name }),
    });

    logger.info(`Password successfully reset for user: ${user.email}`);
  }

  // ─── CHANGE PASSWORD ──────────────────────────────────────────────────────
  async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestError('New passwords do not match');
    }

    const user = await this.authRepository.findUserById(userId);
    if (!user) throw new NotFoundError('User');

    // Fetch with password hash (findUserById excludes it)
    const userWithHash = await this.authRepository.findUserByEmail(user.email);
    if (!userWithHash) throw new NotFoundError('User');

    const isCurrentPasswordValid = await bcrypt.compare(dto.currentPassword, userWithHash.password_hash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestError('Current password is incorrect');
    }

    // Ensure new password is different from current
    const isSamePassword = await bcrypt.compare(dto.newPassword, userWithHash.password_hash);
    if (isSamePassword) {
      throw new BadRequestError('New password must be different from your current password');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.authRepository.updatePassword(userId, passwordHash);

    // Invalidate all other sessions for security
    await this.authRepository.invalidateAllUserSessions(userId);

    await sendEmail({
      to: user.email,
      subject: 'Your Password Has Been Changed — CRM',
      html: getPasswordChangedTemplate({ firstName: (userWithHash as any).first_name }),
    });

    logger.info(`Password changed by user ID: ${userId}`);
  }
}
