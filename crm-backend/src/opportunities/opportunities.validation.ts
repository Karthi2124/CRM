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

// ─── Opportunity Validations ───────────────────────────────────────────────
export const listOpportunitiesValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('stage_id').optional().isInt({ min: 1 }),
  query('assigned_to').optional().isInt({ min: 1 }),
  handleValidation,
];

export const createOpportunityValidator = [
  body('name').notEmpty().withMessage('Opportunity name is required').isLength({ max: 150 }).trim(),
  body('customer_id').isInt({ min: 1 }).withMessage('Customer ID must be a positive integer'),
  body('lead_id').optional().isInt({ min: 1 }),
  body('stage_id').isInt({ min: 1 }).withMessage('Stage ID must be a positive integer'),
  body('value').isFloat({ min: 0 }).withMessage('Value must be a positive decimal number'),
  body('probability').optional().isInt({ min: 0, max: 100 }).withMessage('Probability must be between 0 and 100'),
  body('close_date').optional().isISO8601().withMessage('Close date must be a valid ISO8601 date'),
  body('assigned_to').optional().isInt({ min: 1 }).withMessage('Assigned to user ID must be a positive integer'),
  handleValidation,
];

export const updateOpportunityValidator = [
  body('name').optional().notEmpty().isLength({ max: 150 }).trim(),
  body('customer_id').optional().isInt({ min: 1 }),
  body('lead_id').optional().isInt({ min: 1 }),
  body('stage_id').optional().isInt({ min: 1 }),
  body('value').optional().isFloat({ min: 0 }),
  body('probability').optional().isInt({ min: 0, max: 100 }),
  body('close_date').optional().isISO8601(),
  body('assigned_to').optional().isInt({ min: 1 }),
  body('lost_reason').optional().isString().isLength({ max: 255 }).trim(),
  body('win_reason').optional().isString().isLength({ max: 255 }).trim(),
  handleValidation,
];

export const assignOpportunityValidator = [
  body('assigned_to').isInt({ min: 1 }).withMessage('Assigned to user ID must be a positive integer'),
  handleValidation,
];

// ─── Competitor Validations ─────────────────────────────────────────────────
export const createCompetitorValidator = [
  body('competitor_name').notEmpty().withMessage('Competitor name is required').isLength({ max: 150 }).trim(),
  body('strength').optional().isString().trim(),
  body('weakness').optional().isString().trim(),
  handleValidation,
];

export const updateCompetitorValidator = [
  body('competitor_name').optional().notEmpty().isLength({ max: 150 }).trim(),
  body('strength').optional().isString().trim(),
  body('weakness').optional().isString().trim(),
  handleValidation,
];

// ─── Note Validations ───────────────────────────────────────────────────────
export const createNoteValidator = [
  body('note').notEmpty().withMessage('Note text is required').trim(),
  handleValidation,
];
