"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRole = exports.hasPermission = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const response_helper_1 = require("../utils/response.helper");
// ─── Authenticate Middleware ──────────────────────────────────────────────────
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            (0, response_helper_1.sendUnauthorized)(res, 'Authorization header is missing');
            return;
        }
        if (!authHeader.startsWith('Bearer ')) {
            (0, response_helper_1.sendUnauthorized)(res, 'Invalid authorization format. Use: Bearer <token>');
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            (0, response_helper_1.sendUnauthorized)(res, 'Token is missing');
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await models_1.User.findByPk(decoded.userId, {
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
            attributes: { exclude: ['password_hash', 'password_reset_token', 'password_reset_expires_at'] },
        });
        if (!user) {
            (0, response_helper_1.sendUnauthorized)(res, 'User account not found');
            return;
        }
        if (user.status !== 'active') {
            (0, response_helper_1.sendUnauthorized)(res, `Account is ${user.status}. Please contact your administrator.`);
            return;
        }
        // Attach user and their permission strings to the request
        req.user = user;
        req.userPermissions = ((user.role?.permissions) || []).map((p) => `${p.module}.${p.action}`);
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            (0, response_helper_1.sendUnauthorized)(res, 'Access token has expired. Please refresh your token.');
        }
        else if (error.name === 'JsonWebTokenError') {
            (0, response_helper_1.sendUnauthorized)(res, 'Invalid access token.');
        }
        else {
            (0, response_helper_1.sendUnauthorized)(res, 'Authentication failed.');
        }
    }
};
exports.authenticate = authenticate;
// ─── Permission Middleware (RBAC) ─────────────────────────────────────────────
/**
 * Usage: router.get('/users', authenticate, hasPermission('users', 'view'), controller.list)
 */
const hasPermission = (module, action) => {
    return (req, res, next) => {
        const user = req.user;
        const permissions = req.userPermissions || [];
        // Super Admin bypasses all permission checks
        if (user?.role?.name === 'Super Admin') {
            next();
            return;
        }
        const required = `${module}.${action}`;
        if (!permissions.includes(required)) {
            (0, response_helper_1.sendForbidden)(res, `You do not have permission to perform "${required}".`);
            return;
        }
        next();
    };
};
exports.hasPermission = hasPermission;
// ─── Role Guard ───────────────────────────────────────────────────────────────
/**
 * Usage: router.get('/admin', authenticate, hasRole(['Super Admin', 'Admin']), controller.handler)
 */
const hasRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        const userRole = user?.role?.name;
        if (!userRole || !allowedRoles.includes(userRole)) {
            (0, response_helper_1.sendForbidden)(res, 'You do not have the required role to access this resource.');
            return;
        }
        next();
    };
};
exports.hasRole = hasRole;
