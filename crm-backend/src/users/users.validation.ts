import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const handleValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.type === 'field' ? e.path : e.type, message: e.msg })),
    });
    return;
  }
  next();
};

const passwordRules = (field = 'password') =>
  body(field)
    .isLength({ min: 8 })
    .withMessage(`${field} must be at least 8 characters`)
    .matches(/[A-Z]/).withMessage(`${field} must have an uppercase letter`)
    .matches(/[a-z]/).withMessage(`${field} must have a lowercase letter`)
    .matches(/[0-9]/).withMessage(`${field} must have a number`)
    .matches(/[@$!%*?&#^()_\-+=]/).withMessage(`${field} must have a special character`);

export const listUsersValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['active', 'inactive', 'suspended']),
  query('sort').optional().isIn(['first_name', 'last_name', 'email', 'created_at', 'last_login_at', 'status']),
  query('order').optional().isIn(['ASC', 'DESC']),
  handleValidation,
];

export const createUserValidator = [
  body('first_name').notEmpty().withMessage('First name is required').trim(),
  body('last_name').notEmpty().withMessage('Last name is required').trim(),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('role_id').isInt({ min: 1 }).withMessage('Role ID must be a positive integer'),
  passwordRules('password'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
  body('status').optional().isIn(['active', 'inactive', 'suspended']),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('date_of_birth').optional().isDate().withMessage('date_of_birth must be YYYY-MM-DD'),
  body('employee_id').optional().isString().trim(),
  handleValidation,
];

export const updateUserValidator = [
  body('first_name').optional().notEmpty().trim(),
  body('last_name').optional().notEmpty().trim(),
  body('role_id').optional().isInt({ min: 1 }),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
  body('status').optional().isIn(['active', 'inactive', 'suspended']),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('date_of_birth').optional().isDate(),
  body('employee_id').optional().isString().trim(),
  handleValidation,
];

export const changeStatusValidator = [
  body('status').isIn(['active', 'inactive', 'suspended']).withMessage('Status must be active, inactive, or suspended'),
  handleValidation,
];

export const adminResetPasswordValidator = [
  passwordRules('newPassword'),
  handleValidation,
];

export const bulkDeleteValidator = [
  body('uuids').isArray({ min: 1 }).withMessage('uuids must be a non-empty array'),
  body('uuids.*').isUUID().withMessage('Each UUID must be a valid UUID v4'),
  handleValidation,
];
