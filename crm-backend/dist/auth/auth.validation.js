"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutValidator = exports.loginValidator = exports.validateFields = void 0;
const express_validator_1 = require("express-validator");
/**
 * Helper middleware that formats and returns express-validator validation errors.
 */
const validateFields = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
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
/**
 * Validation rule sets for logging in.
 */
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Must be a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
    exports.validateFields,
];
/**
 * Validation rule sets for logging out.
 */
exports.logoutValidator = [
    (0, express_validator_1.body)('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isString()
        .withMessage('Refresh token must be a string'),
    exports.validateFields,
];
