import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// ─── Item Schema ───────────────────────────────────────────────────────────────
export const createInvoiceItemSchema = z.object({
  product_id: z.number().int().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().positive(),
  unit_price: z.number().nonnegative(),
  discount_type: z.enum(['percentage', 'fixed']).optional().default('percentage'),
  discount_value: z.number().nonnegative().optional().default(0),
  tax_id: z.number().int().positive().optional().nullable(),
});

// ─── Create Invoice Schema ─────────────────────────────────────────────────────
export const createInvoiceSchema = z.object({
  customer_id: z.number().int().positive(),
  quotation_id: z.number().int().positive().optional().nullable(),
  subject: z.string().min(1).max(255),
  date: z.string().regex(dateRegex, { message: 'Date must be in YYYY-MM-DD format' }),
  due_date: z.string().regex(dateRegex, { message: 'Due date must be in YYYY-MM-DD format' }),
  discount_type: z.enum(['percentage', 'fixed']).optional().default('percentage'),
  discount_value: z.number().nonnegative().optional().default(0),
  adjustment: z.number().optional().default(0),
  status: z.enum(['draft', 'sent', 'partially_paid', 'paid', 'unpaid', 'voided']).optional().default('draft'),
  terms_conditions: z.string().optional().nullable(),
  customer_notes: z.string().optional().nullable(),
  items: z.array(createInvoiceItemSchema).min(1, { message: 'Invoice must have at least one item' }),
});

// ─── Update Invoice Schema ─────────────────────────────────────────────────────
export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  items: z.array(createInvoiceItemSchema).min(1).optional(),
});

// ─── Record Payment Schema ─────────────────────────────────────────────────────
export const createPaymentSchema = z.object({
  amount: z.number().positive(),
  payment_date: z.string().regex(dateRegex, { message: 'Payment date must be in YYYY-MM-DD format' }),
  payment_method: z.enum(['cash', 'bank_transfer', 'credit_card', 'cheque', 'paypal', 'other']),
  transaction_reference: z.string().max(100).optional().nullable(),
  notes: z.string().optional().nullable(),
});

// ─── Issue Credit Note Schema ──────────────────────────────────────────────────
export const createCreditNoteSchema = z.object({
  amount: z.number().positive(),
  credit_note_date: z.string().regex(dateRegex, { message: 'Credit note date must be in YYYY-MM-DD format' }),
  reason: z.string().min(1).max(255),
  status: z.enum(['draft', 'applied', 'voided']).optional().default('draft'),
});

// ─── Invoice Filters ───────────────────────────────────────────────────────────
export const invoiceFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  status: z.enum(['draft', 'sent', 'partially_paid', 'paid', 'unpaid', 'voided']).optional(),
  customer_id: z.coerce.number().int().positive().optional(),
  quotation_id: z.coerce.number().int().positive().optional(),
});
