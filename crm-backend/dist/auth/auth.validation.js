"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidator = exports.resetPasswordValidator = exports.forgotPasswordValidator = exports.refreshTokenValidator = exports.logoutValidator = exports.loginValidator = exports.validateFields = void 0;
const express_validator_1 = require("express-validator");
// ─── Validation Error Formatter ───────────────────────────────────────────────
const validateFields = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((err) => ({
                field: err.type === 'field' ? err.path : err.type,
                message: err.msg,
            })),
        });
        return;
    }
    next();
};
exports.validateFields = validateFields;
// ─── Password strength rule (reused across validators) ────────────────────────
const passwordRules = (fieldName = 'password') => (0, express_validator_1.body)(fieldName)
    .isLength({ min: 8 })
    .withMessage(`${fieldName} must be at least 8 characters`)
    .matches(/[A-Z]/)
    .withMessage(`${fieldName} must contain at least one uppercase letter`)
    .matches(/[a-z]/)
    .withMessage(`${fieldName} must contain at least one lowercase letter`)
    .matches(/[0-9]/)
    .withMessage(`${fieldName} must contain at least one number`)
    .matches(/[@$!%*?&#^()_\-+=]/)
    .withMessage(`${fieldName} must contain at least one special character`);
// ─── Login Validator ──────────────────────────────────────────────────────────
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
    (0, express_validator_1.body)('rememberMe')
        .optional()
        .isBoolean()
        .withMessage('rememberMe must be a boolean'),
    exports.validateFields,
];
// ─── Logout Validator ─────────────────────────────────────────────────────────
exports.logoutValidator = [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isString()
        .withMessage('Refresh token must be a string'),
    exports.validateFields,
];
// ─── Refresh Token Validator ──────────────────────────────────────────────────
exports.refreshTokenValidator = [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isString()
        .withMessage('Refresh token must be a string'),
    exports.validateFields,
];
// ─── Forgot Password Validator ────────────────────────────────────────────────
exports.forgotPasswordValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),
    exports.validateFields,
];
// ─── Reset Password Validator ─────────────────────────────────────────────────
exports.resetPasswordValidator = [
    (0, express_validator_1.body)('token')
        .notEmpty()
        .withMessage('Reset token is required')
        .isString()
        .withMessage('Invalid reset token'),
    passwordRules('password'),
    (0, express_validator_1.body)('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    exports.validateFields,
];
// ─── Change Password Validator ────────────────────────────────────────────────
exports.changePasswordValidator = [
    (0, express_validator_1.body)('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    passwordRules('newPassword'),
    (0, express_validator_1.body)('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('New passwords do not match');
        }
        return true;
    }),
    exports.validateFields,
];
