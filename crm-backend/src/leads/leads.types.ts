export interface CreateLeadDto {
  first_name: string;
  last_name: string;
  company_name?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  value?: number;
  assigned_to?: number;
}

export interface UpdateLeadDto {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  email?: string;
  phone?: string;
  source?: string;
  status?: string;
  value?: number;
  assigned_to?: number;
}

export interface AssignLeadDto {
  assigned_to: number;
}

export interface LeadListQuery {
  [key: string]: unknown;
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  source?: string;
  assigned_to?: string;
}

// ─── Lead Note DTOs ─────────────────────────────────────────────────────────
export interface CreateLeadNoteDto {
  note: string;
}

// ─── Lead Follow-up DTOs ────────────────────────────────────────────────────
export interface CreateLeadFollowUpDto {
  followup_date: string; // ISO String / Date
  remarks?: string;
  status?: 'pending' | 'completed' | 'cancelled';
}

export interface UpdateLeadFollowUpDto {
  followup_date?: string;
  remarks?: string;
  status?: 'pending' | 'completed' | 'cancelled';
}

// ─── Lead Activity DTOs ────────────────────────────────────────────────────
export interface CreateLeadActivityDto {
  type: 'call' | 'email' | 'meeting' | 'task';
  details: string;
  activity_date: string;
}

// ─── Response Shapes ─────────────────────────────────────────────────────────
export interface LeadTimelineEvent {
  id: string | number;
  type: 'note' | 'followup' | 'activity' | 'audit_log';
  event_name: string;
  description: string;
  user: {
    uuid: string;
    first_name: string;
    last_name: string;
  } | null;
  date: Date;
}
