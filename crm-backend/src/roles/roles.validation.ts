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

export const listRolesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().trim(),
  handleValidation,
];

export const createRoleValidator = [
  body('name').notEmpty().withMessage('Role name is required').isLength({ max: 100 }).withMessage('Name max 100 chars').trim(),
  body('description').optional().isString().isLength({ max: 255 }).trim(),
  handleValidation,
];

export const updateRoleValidator = [
  body('name').optional().isLength({ min: 1, max: 100 }).withMessage('Name must be between 1 and 100 chars').trim(),
  body('description').optional().isString().isLength({ max: 255 }).trim(),
  handleValidation,
];

export const assignPermissionsValidator = [
  body('permissionIds')
    .isArray({ min: 0 })
    .withMessage('permissionIds must be an array')
    .custom((arr: any[]) => arr.every((id) => Number.isInteger(id) && id > 0))
    .withMessage('All permission IDs must be positive integers'),
  handleValidation,
];
