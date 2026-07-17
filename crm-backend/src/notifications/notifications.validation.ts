import { z } from 'zod';

// ─── Preference Item Schema ──────────────────────────────────────────────────
export const preferenceItemSchema = z.object({
  notification_type: z.string().min(1).max(100),
  email: z.boolean(),
  in_app: z.boolean(),
  sms: z.boolean(),
});

// ─── Update Preferences Schema ───────────────────────────────────────────────
export const updatePreferencesSchema = z.object({
  preferences: z.array(preferenceItemSchema).min(1, { message: 'Must update at least one preference item' }),
});

// ─── Filters Schema ──────────────────────────────────────────────────────────
export const notificationFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  is_read: z.preprocess((val) => {
    if (val === 'true') return true;
    if (val === 'false') return false;
    return undefined;
  }, z.boolean().optional()),
});
