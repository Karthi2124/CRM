// ─── Task Types ─────────────────────────────────────────────────────────────────

export interface CreateTaskDto {
  title: string;
  description?: string | null;
  status?: 'todo' | 'in_progress' | 'completed' | 'deferred';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string | null; // YYYY-MM-DD
  assigned_to?: number | null;
  customer_id?: number | null;
  lead_id?: number | null;
  opportunity_id?: number | null;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {}

export interface CreateTaskCommentDto {
  comment: string;
}

export interface CreateTaskAttachmentDto {
  file_name: string;
  file_url: string;
  file_size?: number | null;
  mime_type?: string | null;
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'todo' | 'in_progress' | 'completed' | 'deferred';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assigned_to?: number;
  customer_id?: number;
  lead_id?: number;
  opportunity_id?: number;
}
