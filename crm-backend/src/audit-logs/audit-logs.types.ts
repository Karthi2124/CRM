// ─── Audit Logs Types ───────────────────────────────────────────────────────────

export interface AuditLogFilters {
  page?: number;
  limit?: number;
  user_id?: number;
  module?: string;
  action?: string;
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
}
