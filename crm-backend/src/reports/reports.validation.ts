import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

// ─── Query Filters Schema ──────────────────────────────────────────────────────
export const reportFiltersSchema = z.object({
  start_date: z.string().regex(dateRegex, { message: 'start_date must be in YYYY-MM-DD format' }).optional(),
  end_date: z.string().regex(dateRegex, { message: 'end_date must be in YYYY-MM-DD format' }).optional(),
  user_id: z.coerce.number().int().positive().optional(),
  format: z.enum(['json', 'csv']).optional().default('json'),
});
