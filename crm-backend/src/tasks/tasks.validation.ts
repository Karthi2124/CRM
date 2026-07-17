import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// ─── Task Schema ───────────────────────────────────────────────────────────────
export const createTaskSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().optional().nullable(),
  status: z.enum(['todo', 'in_progress', 'completed', 'deferred']).optional().default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional().default('medium'),
  due_date: z.string().regex(dateRegex, { message: 'due_date must be in YYYY-MM-DD format' }).optional().nullable(),
  assigned_to: z.number().int().positive().optional().nullable(),
  customer_id: z.number().int().positive().optional().nullable(),
  lead_id: z.number().int().positive().optional().nullable(),
  opportunity_id: z.number().int().positive().optional().nullable(),
});

export const updateTaskSchema = createTaskSchema.partial();

// ─── Comment Schema ──────────────────────────────────────────────────────────────
export const createTaskCommentSchema = z.object({
  comment: z.string().min(1),
});

// ─── Attachment Schema ───────────────────────────────────────────────────────────
export const createTaskAttachmentSchema = z.object({
  file_name: z.string().min(1).max(255),
  file_url: z.string().url().max(500),
  file_size: z.number().int().positive().optional().nullable(),
  mime_type: z.string().max(100).optional().nullable(),
});

// ─── Task Filters ───────────────────────────────────────────────────────────────
export const taskFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  status: z.enum(['todo', 'in_progress', 'completed', 'deferred']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  assigned_to: z.coerce.number().int().positive().optional(),
  customer_id: z.coerce.number().int().positive().optional(),
  lead_id: z.coerce.number().int().positive().optional(),
  opportunity_id: z.coerce.number().int().positive().optional(),
});
