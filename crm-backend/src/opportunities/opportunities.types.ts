export interface CreateOpportunityDto {
  name: string;
  customer_id: number;
  lead_id?: number;
  stage_id: number;
  value: number;
  probability?: number;
  close_date?: string;
  assigned_to?: number;
}

export interface UpdateOpportunityDto {
  name?: string;
  customer_id?: number;
  lead_id?: number;
  stage_id?: number;
  value?: number;
  probability?: number;
  close_date?: string;
  assigned_to?: number;
  lost_reason?: string;
  win_reason?: string;
}

export interface AssignOpportunityDto {
  assigned_to: number;
}

export interface OpportunityListQuery {
  [key: string]: unknown;
  page?: string;
  limit?: string;
  search?: string;
  stage_id?: string;
  assigned_to?: string;
}

// ─── Competitor DTOs ────────────────────────────────────────────────────────
export interface CreateOpportunityCompetitorDto {
  competitor_name: string;
  strength?: string;
  weakness?: string;
}

export interface UpdateOpportunityCompetitorDto {
  competitor_name?: string;
  strength?: string;
  weakness?: string;
}

// ─── Note DTOs ──────────────────────────────────────────────────────────────
export interface CreateOpportunityNoteDto {
  note: string;
}

// ─── Response Shapes ─────────────────────────────────────────────────────────
export interface OpportunityTimelineEvent {
  id: string | number;
  type: 'note' | 'audit_log';
  event_name: string;
  description: string;
  user: {
    uuid: string;
    first_name: string;
    last_name: string;
  } | null;
  date: Date;
}
