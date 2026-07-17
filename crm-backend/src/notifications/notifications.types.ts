// ─── Notification Types ─────────────────────────────────────────────────────────

export interface UpdatePreferenceItem {
  notification_type: string;
  email: boolean;
  in_app: boolean;
  sms: boolean;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  is_read?: boolean;
}
