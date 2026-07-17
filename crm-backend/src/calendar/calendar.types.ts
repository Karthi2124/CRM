// ─── Calendar Types ─────────────────────────────────────────────────────────────

export interface CreateCalendarEventDto {
  title: string;
  description?: string | null;
  start_date: string; // ISO datetime e.g. 2026-07-17T15:30:00Z
  end_date: string; // ISO datetime e.g. 2026-07-17T16:30:00Z
  location?: string | null;
  is_all_day?: boolean;
  meeting_link?: string | null;
  status?: 'scheduled' | 'cancelled' | 'completed';
  customer_id?: number | null;
  lead_id?: number | null;
  opportunity_id?: number | null;
  assigned_to?: number | null;
}

export interface UpdateCalendarEventDto extends Partial<CreateCalendarEventDto> {}

export interface CalendarFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'scheduled' | 'cancelled' | 'completed';
  start_after?: string; // ISO Datetime
  end_before?: string; // ISO Datetime
  assigned_to?: number;
  customer_id?: number;
  lead_id?: number;
  opportunity_id?: number;
}
