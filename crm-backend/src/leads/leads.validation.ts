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

// ─── Lead Validation ────────────────────────────────────────────────────────
export const listLeadsValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('status').optional().isString().trim(),
  query('source').optional().isString().trim(),
  query('assigned_to').optional().isInt({ min: 1 }),
  handleValidation,
];

export const createLeadValidator = [
  body('first_name').notEmpty().withMessage('First name is required').isLength({ max: 100 }).trim(),
  body('last_name').notEmpty().withMessage('Last name is required').isLength({ max: 100 }).trim(),
  body('company_name').optional().isString().isLength({ max: 150 }).trim(),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phone').optional().isString().isLength({ max: 20 }).trim(),
  body('source').optional().isString().isLength({ max: 100 }).trim(),
  body('status').optional().isString().isLength({ max: 100 }).trim(),
  body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('assigned_to').optional().isInt({ min: 1 }).withMessage('Assigned sales person ID must be a positive integer'),
  handleValidation,
];

export const updateLeadValidator = [
  body('first_name').optional().notEmpty().isLength({ max: 100 }).trim(),
  body('last_name').optional().notEmpty().isLength({ max: 100 }).trim(),
  body('company_name').optional().isString().isLength({ max: 150 }).trim(),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phone').optional().isString().isLength({ max: 20 }).trim(),
  body('source').optional().isString().isLength({ max: 100 }).trim(),
  body('status').optional().isString().isLength({ max: 100 }).trim(),
  body('value').optional().isFloat({ min: 0 }).withMessage('Value must be a positive number'),
  body('assigned_to').optional().isInt({ min: 1 }).withMessage('Assigned sales person ID must be a positive integer'),
  handleValidation,
];

export const assignLeadValidator = [
  body('assigned_to').isInt({ min: 1 }).withMessage('Assigned user ID must be a positive integer'),
  handleValidation,
];

// ─── Lead Note Validation ───────────────────────────────────────────────────
export const createLeadNoteValidator = [
  body('note').notEmpty().withMessage('Note content is required').trim(),
  handleValidation,
];

// ─── Lead Follow-up Validation ──────────────────────────────────────────────
export const createLeadFollowUpValidator = [
  body('followup_date').isISO8601().withMessage('Follow-up date must be a valid ISO8601 date'),
  body('remarks').optional().isString().trim(),
  body('status').optional().isIn(['pending', 'completed', 'cancelled']).withMessage('Status must be pending, completed, or cancelled'),
  handleValidation,
];

export const updateLeadFollowUpValidator = [
  body('followup_date').optional().isISO8601().withMessage('Follow-up date must be a valid ISO8601 date'),
  body('remarks').optional().isString().trim(),
  body('status').optional().isIn(['pending', 'completed', 'cancelled']).withMessage('Status must be pending, completed, or cancelled'),
  handleValidation,
];

// ─── Lead Activity Validation ───────────────────────────────────────────────
export const createLeadActivityValidator = [
  body('type').isIn(['call', 'email', 'meeting', 'task']).withMessage('Activity type must be call, email, meeting, or task'),
  body('details').notEmpty().withMessage('Activity details are required').trim(),
  body('activity_date').isISO8601().withMessage('Activity date must be a valid ISO8601 date'),
  handleValidation,
];
