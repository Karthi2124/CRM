import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Role, Permission } from '../models';
import { sendUnauthorized, sendForbidden } from '../utils/response.helper';

interface JwtPayload {
  userId: number;
  userUuid: string;
  email: string;
  role: string;
  permissions?: string[];
}

export interface AuthRequest extends Request {
  user?: User;
  userPermissions?: string[];
}

// ─── Authenticate Middleware ──────────────────────────────────────────────────
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      sendUnauthorized(res, 'Authorization header is missing');
      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      sendUnauthorized(res, 'Invalid authorization format. Use: Bearer <token>');
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      sendUnauthorized(res, 'Token is missing');
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await User.findByPk(decoded.userId, {
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
      attributes: { exclude: ['password_hash', 'password_reset_token', 'password_reset_expires_at'] },
    });

    if (!user) {
      sendUnauthorized(res, 'User account not found');
      return;
    }

    if (user.status !== 'active') {
      sendUnauthorized(res, `Account is ${user.status}. Please contact your administrator.`);
      return;
    }

    // Attach user and their permission strings to the request
    req.user = user;
    req.userPermissions = (((user as any).role?.permissions) || []).map(
      (p: Permission) => `${p.module}.${p.action}`
    );

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      sendUnauthorized(res, 'Access token has expired. Please refresh your token.');
    } else if (error.name === 'JsonWebTokenError') {
      sendUnauthorized(res, 'Invalid access token.');
    } else {
      sendUnauthorized(res, 'Authentication failed.');
    }
  }
};

// ─── Permission Middleware (RBAC) ─────────────────────────────────────────────
/**
 * Usage: router.get('/users', authenticate, hasPermission('users', 'view'), controller.list)
 */
export const hasPermission = (module: string, action: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user as any;
    const permissions = req.userPermissions || [];

    // Super Admin bypasses all permission checks
    if (user?.role?.name === 'Super Admin') {
      next();
      return;
    }

    const required = `${module}.${action}`;
    if (!permissions.includes(required)) {
      sendForbidden(res, `You do not have permission to perform "${required}".`);
      return;
    }

    next();
  };
};

// ─── Role Guard ───────────────────────────────────────────────────────────────
/**
 * Usage: router.get('/admin', authenticate, hasRole(['Super Admin', 'Admin']), controller.handler)
 */
export const hasRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user as any;
    const userRole = user?.role?.name;

    if (!userRole || !allowedRoles.includes(userRole)) {
      sendForbidden(res, 'You do not have the required role to access this resource.');
      return;
    }

    next();
  };
};