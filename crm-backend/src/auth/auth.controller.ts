import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { User, Role } from '../models';
import { asyncHandler } from '../utils/error.helper';
import {
  sendSuccess,
  sendNotFound,
} from '../utils/response.helper';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  // ─── POST /api/auth/login ─────────────────────────────────────────────────
  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const ipAddress = (req.headers['x-forwarded-for'] as string) || req.ip || null;
    const userAgent = req.headers['user-agent'] || null;

    const result = await this.authService.login(req.body, ipAddress, userAgent);

    sendSuccess(res, result, 'Login successful');
  });

  // ─── POST /api/auth/logout ────────────────────────────────────────────────
  logout = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    await this.authService.logout(refreshToken);
    sendSuccess(res, null, 'Logout successful');
  });

  // ─── POST /api/auth/refresh-token ────────────────────────────────────────
  refreshToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    const result = await this.authService.refreshToken(refreshToken);
    sendSuccess(res, result, 'Token refreshed successfully');
  });

  // ─── GET /api/auth/profile ────────────────────────────────────────────────
  profile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user as User;

    const user = await User.findByPk(authUser.id, {
      include: [
        {
          model: Role,
          as: 'role',
        },
      ],
      attributes: { exclude: ['password_hash', 'password_reset_token', 'password_reset_expires_at'] },
    });

    if (!user) {
      sendNotFound(res, 'User profile');
      return;
    }

    sendSuccess(res, {
      uuid: user.uuid,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      status: user.status,
      role: (user as any).role?.name || 'User',
      last_login_at: user.last_login_at,
      created_at: user.created_at,
    }, 'Profile retrieved successfully');
  });

  // ─── POST /api/auth/forgot-password ──────────────────────────────────────
  forgotPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.authService.forgotPassword(req.body);
    // Always 200 to prevent email enumeration
    sendSuccess(
      res,
      null,
      'If your email is registered, you will receive a password reset link shortly.'
    );
  });

  // ─── POST /api/auth/reset-password ───────────────────────────────────────
  resetPassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.authService.resetPassword(req.body);
    sendSuccess(res, null, 'Password has been reset successfully. Please login with your new password.');
  });

  // ─── PUT /api/auth/change-password ───────────────────────────────────────
  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user as User;
    await this.authService.changePassword(authUser.id, req.body);
    sendSuccess(res, null, 'Password changed successfully. Please login again.');
  });
}
