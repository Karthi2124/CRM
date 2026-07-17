import { body, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const handleValidation = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.type === 'field' ? e.path : e.type,
        message: e.msg,
      })),
    });
    return;
  }
  next();
};

// ─── Company Validation Rules ───────────────────────────────────────────────
export const listCompaniesValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isString().trim(),
  handleValidation,
];

export const createCompanyValidator = [
  body('name').notEmpty().withMessage('Company name is required').isLength({ max: 150 }).trim(),
  body('legal_name').optional().isString().isLength({ max: 255 }).trim(),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phone').optional().isString().isLength({ max: 20 }).trim(),
  body('website').optional().isURL().withMessage('Invalid website URL').trim(),
  body('tax_number').optional().isString().isLength({ max: 50 }).trim(),
  body('logo_url').optional().isURL().withMessage('Invalid logo URL').trim(),
  body('address').optional().isString().trim(),
  handleValidation,
];

export const updateCompanyValidator = [
  body('name').optional().notEmpty().withMessage('Company name cannot be empty').isLength({ max: 150 }).trim(),
  body('legal_name').optional().isString().isLength({ max: 255 }).trim(),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phone').optional().isString().isLength({ max: 20 }).trim(),
  body('website').optional().isURL().withMessage('Invalid website URL').trim(),
  body('tax_number').optional().isString().isLength({ max: 50 }).trim(),
  body('logo_url').optional().isURL().withMessage('Invalid logo URL').trim(),
  body('address').optional().isString().trim(),
  handleValidation,
];

// ─── Branch Validation Rules ────────────────────────────────────────────────
export const createBranchValidator = [
  body('name').notEmpty().withMessage('Branch name is required').isLength({ max: 150 }).trim(),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phone').optional().isString().isLength({ max: 20 }).trim(),
  body('address').optional().isString().trim(),
  handleValidation,
];

export const updateBranchValidator = [
  body('name').optional().notEmpty().withMessage('Branch name cannot be empty').isLength({ max: 150 }).trim(),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phone').optional().isString().isLength({ max: 20 }).trim(),
  body('address').optional().isString().trim(),
  handleValidation,
];

// ─── Department Validation Rules ────────────────────────────────────────────
export const createDepartmentValidator = [
  body('name').notEmpty().withMessage('Department name is required').isLength({ max: 150 }).trim(),
  body('description').optional().isString().isLength({ max: 255 }).trim(),
  handleValidation,
];

export const updateDepartmentValidator = [
  body('name').optional().notEmpty().withMessage('Department name cannot be empty').isLength({ max: 150 }).trim(),
  body('description').optional().isString().isLength({ max: 255 }).trim(),
  handleValidation,
];

// ─── Designation Validation Rules ───────────────────────────────────────────
export const createDesignationValidator = [
  body('name').notEmpty().withMessage('Designation name is required').isLength({ max: 150 }).trim(),
  body('description').optional().isString().isLength({ max: 255 }).trim(),
  handleValidation,
];

export const updateDesignationValidator = [
  body('name').optional().notEmpty().withMessage('Designation name cannot be empty').isLength({ max: 150 }).trim(),
  body('description').optional().isString().isLength({ max: 255 }).trim(),
  handleValidation,
];
