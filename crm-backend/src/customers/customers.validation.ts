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

// ─── Customer Validation ────────────────────────────────────────────────────
export const listCustomersValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString().trim(),
  query('type').optional().isIn(['company', 'individual']),
  query('status').optional().isIn(['active', 'inactive']),
  handleValidation,
];

export const createCustomerValidator = [
  body('name').notEmpty().withMessage('Customer name is required').isLength({ max: 150 }).trim(),
  body('type').isIn(['company', 'individual']).withMessage('Customer type must be company or individual'),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phone').optional().isString().isLength({ max: 20 }).trim(),
  body('website').optional().isURL().withMessage('Invalid website URL').trim(),
  body('gst_number').optional().isString().isLength({ max: 50 }).trim(),
  body('tax_id').optional().isString().isLength({ max: 50 }).trim(),
  body('status').optional().isIn(['active', 'inactive']),
  handleValidation,
];

export const updateCustomerValidator = [
  body('name').optional().notEmpty().withMessage('Customer name cannot be empty').isLength({ max: 150 }).trim(),
  body('type').optional().isIn(['company', 'individual']),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phone').optional().isString().isLength({ max: 20 }).trim(),
  body('website').optional().isURL().withMessage('Invalid website URL').trim(),
  body('gst_number').optional().isString().isLength({ max: 50 }).trim(),
  body('tax_id').optional().isString().isLength({ max: 50 }).trim(),
  body('status').optional().isIn(['active', 'inactive']),
  handleValidation,
];

// ─── Address Validation ─────────────────────────────────────────────────────
export const createAddressValidator = [
  body('type').isIn(['billing', 'shipping']).withMessage('Address type must be billing or shipping'),
  body('address_line_1').notEmpty().withMessage('Address line 1 is required').isLength({ max: 255 }).trim(),
  body('address_line_2').optional().isString().isLength({ max: 255 }).trim(),
  body('city').notEmpty().withMessage('City is required').isLength({ max: 100 }).trim(),
  body('state').notEmpty().withMessage('State is required').isLength({ max: 100 }).trim(),
  body('country').notEmpty().withMessage('Country is required').isLength({ max: 100 }).trim(),
  body('zip_code').notEmpty().withMessage('Zip code is required').isLength({ max: 20 }).trim(),
  handleValidation,
];

export const updateAddressValidator = [
  body('type').optional().isIn(['billing', 'shipping']),
  body('address_line_1').optional().notEmpty().isLength({ max: 255 }).trim(),
  body('address_line_2').optional().isString().isLength({ max: 255 }).trim(),
  body('city').optional().notEmpty().isLength({ max: 100 }).trim(),
  body('state').optional().notEmpty().isLength({ max: 100 }).trim(),
  body('country').optional().notEmpty().isLength({ max: 100 }).trim(),
  body('zip_code').optional().notEmpty().isLength({ max: 20 }).trim(),
  handleValidation,
];

// ─── Contact Validation ─────────────────────────────────────────────────────
export const createContactValidator = [
  body('first_name').notEmpty().withMessage('First name is required').isLength({ max: 100 }).trim(),
  body('last_name').notEmpty().withMessage('Last name is required').isLength({ max: 100 }).trim(),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phone').optional().isString().isLength({ max: 20 }).trim(),
  body('designation').optional().isString().isLength({ max: 100 }).trim(),
  handleValidation,
];

export const updateContactValidator = [
  body('first_name').optional().notEmpty().isLength({ max: 100 }).trim(),
  body('last_name').optional().notEmpty().isLength({ max: 100 }).trim(),
  body('email').optional().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('phone').optional().isString().isLength({ max: 20 }).trim(),
  body('designation').optional().isString().isLength({ max: 100 }).trim(),
  handleValidation,
];

// ─── Note Validation ────────────────────────────────────────────────────────
export const createNoteValidator = [
  body('note').notEmpty().withMessage('Note text is required').trim(),
  handleValidation,
];

export const updateNoteValidator = [
  body('note').notEmpty().withMessage('Note text cannot be empty').trim(),
  handleValidation,
];
