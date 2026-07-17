import { Op } from 'sequelize';
import { User, Role, UserSession, Permission } from '../models';
import { CreateSessionInput } from './auth.types';

export class AuthRepository {
  // ─── User Queries ─────────────────────────────────────────────────────────

  /**
   * Find a user by email, including their role and permissions.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    return User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'role',
          include: [
            {
              model: Permission,
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
  async findUserById(id: number): Promise<User | null> {
    return User.findByPk(id, {
      include: [{ model: Role, as: 'role' }],
      attributes: { exclude: ['password_hash'] },
    });
  }

  /**
   * Find a user by their password reset token (only if not yet expired).
   */
  async findUserByResetToken(token: string): Promise<User | null> {
    return User.findOne({
      where: {
        password_reset_token: token,
        password_reset_expires_at: { [Op.gt]: new Date() },
      },
    });
  }

  /**
   * Set password reset token and expiry on user record.
   */
  async setPasswordResetToken(
    userId: number,
    token: string,
    expiresAt: Date
  ): Promise<void> {
    await User.update(
      {
        password_reset_token: token,
        password_reset_expires_at: expiresAt,
      },
      { where: { id: userId } }
    );
  }

  /**
   * Clear the reset token after successful password reset.
   */
  async clearPasswordResetToken(userId: number): Promise<void> {
    await User.update(
      {
        password_reset_token: null,
        password_reset_expires_at: null,
      },
      { where: { id: userId } }
    );
  }

  /**
   * Update user's hashed password.
   */
  async updatePassword(userId: number, passwordHash: string): Promise<void> {
    await User.update(
      { password_hash: passwordHash },
      { where: { id: userId } }
    );
  }

  /**
   * Update the user's last login timestamp.
   */
  async updateLastLogin(userId: number): Promise<void> {
    await User.update(
      { last_login_at: new Date() },
      { where: { id: userId } }
    );
  }

  // ─── Session Queries ──────────────────────────────────────────────────────

  /**
   * Create and save a new user session record.
   */
  async createSession(input: CreateSessionInput): Promise<UserSession> {
    return UserSession.create({
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
  async findSessionByRefreshToken(refreshToken: string): Promise<UserSession | null> {
    return UserSession.findOne({
      where: {
        refresh_token: refreshToken,
        expires_at: { [Op.gt]: new Date() },
        logout_at: null,
      },
    });
  }

  /**
   * Update session with a new access token.
   */
  async updateSessionToken(
    sessionId: number,
    newJwtToken: string,
    newRefreshToken: string,
    expiresAt: Date
  ): Promise<void> {
    await UserSession.update(
      {
        jwt_token: newJwtToken,
        refresh_token: newRefreshToken,
        expires_at: expiresAt,
      },
      { where: { id: sessionId } }
    );
  }

  /**
   * Soft-delete a session by refresh token (logout).
   */
  async deleteSessionByRefreshToken(refreshToken: string): Promise<number> {
    return UserSession.destroy({
      where: { refresh_token: refreshToken },
    });
  }

  /**
   * Invalidate all sessions for a user (e.g., password change).
   */
  async invalidateAllUserSessions(userId: number): Promise<void> {
    await UserSession.destroy({
      where: { user_id: userId },
    });
  }
}
