import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// ─── Query Filters Schema ──────────────────────────────────────────────────────
export const auditLogFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  user_id: z.coerce.number().int().positive().optional(),
  module: z.string().optional(),
  action: z.string().optional(),
  start_date: z.string().regex(dateRegex, { message: 'start_date must be in YYYY-MM-DD format' }).optional(),
  end_date: z.string().regex(dateRegex, { message: 'end_date must be in YYYY-MM-DD format' }).optional(),
});
