import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// ─── Validation Error Formatter ───────────────────────────────────────────────
export const validateFields = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
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

// ─── Password strength rule (reused across validators) ────────────────────────
const passwordRules = (fieldName = 'password') =>
  body(fieldName)
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
export const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('rememberMe must be a boolean'),
  validateFields,
];

// ─── Logout Validator ─────────────────────────────────────────────────────────
export const logoutValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isString()
    .withMessage('Refresh token must be a string'),
  validateFields,
];

// ─── Refresh Token Validator ──────────────────────────────────────────────────
export const refreshTokenValidator = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required')
    .isString()
    .withMessage('Refresh token must be a string'),
  validateFields,
];

// ─── Forgot Password Validator ────────────────────────────────────────────────
export const forgotPasswordValidator = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  validateFields,
];

// ─── Reset Password Validator ─────────────────────────────────────────────────
export const resetPasswordValidator = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required')
    .isString()
    .withMessage('Invalid reset token'),
  passwordRules('password'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  validateFields,
];

// ─── Change Password Validator ────────────────────────────────────────────────
export const changePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  passwordRules('newPassword'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New passwords do not match');
      }
      return true;
    }),
  validateFields,
];
