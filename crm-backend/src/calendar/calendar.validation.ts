import { z } from 'zod';

// ─── Base Event Fields Schema ──────────────────────────────────────────────────
export const eventFieldsSchema = z.object({
  title: z.string().min(1).max(150),
  description: z.string().optional().nullable(),
  start_date: z.string().datetime({ message: 'start_date must be a valid ISO 8601 date string' }),
  end_date: z.string().datetime({ message: 'end_date must be a valid ISO 8601 date string' }),
  location: z.string().max(255).optional().nullable(),
  is_all_day: z.boolean().optional().default(false),
  meeting_link: z.string().url().max(500).optional().nullable(),
  status: z.enum(['scheduled', 'cancelled', 'completed']).optional().default('scheduled'),
  customer_id: z.number().int().positive().optional().nullable(),
  lead_id: z.number().int().positive().optional().nullable(),
  opportunity_id: z.number().int().positive().optional().nullable(),
  assigned_to: z.number().int().positive().optional().nullable(),
});

// Helper for chronological check
const checkDateChronology = (start: string | undefined, end: string | undefined) => {
  if (!start || !end) return true;
  return new Date(start) < new Date(end);
};

// ─── Create Event Schema ───────────────────────────────────────────────────────
export const createCalendarEventSchema = eventFieldsSchema.refine(
  (data) => checkDateChronology(data.start_date, data.end_date),
  {
    message: 'end_date must be after start_date',
    path: ['end_date'],
  }
);

// ─── Update Event Schema ───────────────────────────────────────────────────────
export const updateCalendarEventSchema = eventFieldsSchema.partial().refine(
  (data) => checkDateChronology(data.start_date, data.end_date),
  {
    message: 'end_date must be after start_date',
    path: ['end_date'],
  }
);

// ─── Calendar Filters ──────────────────────────────────────────────────────────
export const calendarFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  status: z.enum(['scheduled', 'cancelled', 'completed']).optional(),
  start_after: z.string().datetime().optional(),
  end_before: z.string().datetime().optional(),
  assigned_to: z.coerce.number().int().positive().optional(),
  customer_id: z.coerce.number().int().positive().optional(),
  lead_id: z.coerce.number().int().positive().optional(),
  opportunity_id: z.coerce.number().int().positive().optional(),
});
