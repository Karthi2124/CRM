import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// ─── Item Schema ───────────────────────────────────────────────────────────────
export const createQuotationItemSchema = z.object({
  product_id: z.number().int().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
  discount_type: z.enum(['percentage', 'fixed']).optional().default('percentage'),
  discount_value: z.number().nonnegative().optional().default(0),
  tax_id: z.number().int().positive().optional().nullable(),
});

// ─── Create Quotation Schema ───────────────────────────────────────────────────
export const createQuotationSchema = z.object({
  customer_id: z.number().int().positive(),
  lead_id: z.number().int().positive().optional().nullable(),
  opportunity_id: z.number().int().positive().optional().nullable(),
  subject: z.string().min(1).max(255),
  date: z.string().regex(dateRegex, { message: 'Date must be in YYYY-MM-DD format' }),
  expiry_date: z.string().regex(dateRegex, { message: 'Expiry date must be in YYYY-MM-DD format' }),
  discount_type: z.enum(['percentage', 'fixed']).optional().default('percentage'),
  discount_value: z.number().nonnegative().optional().default(0),
  adjustment: z.number().optional().default(0),
  status: z.enum(['draft', 'sent', 'accepted', 'declined', 'expired']).optional().default('draft'),
  terms_conditions: z.string().optional().nullable(),
  customer_notes: z.string().optional().nullable(),
  items: z.array(createQuotationItemSchema).min(1, { message: 'Quotation must have at least one item' }),
});

// ─── Update Quotation Schema ───────────────────────────────────────────────────
export const updateQuotationSchema = createQuotationSchema.partial().extend({
  items: z.array(createQuotationItemSchema).min(1).optional(),
});

// ─── Quotation Filters ──────────────────────────────────────────────────────────
export const quotationFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  status: z.enum(['draft', 'sent', 'accepted', 'declined', 'expired']).optional(),
  customer_id: z.coerce.number().int().positive().optional(),
  lead_id: z.coerce.number().int().positive().optional(),
  opportunity_id: z.coerce.number().int().positive().optional(),
});
