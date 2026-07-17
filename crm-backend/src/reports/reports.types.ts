// ─── Reports Types ──────────────────────────────────────────────────────────────

export interface ReportFilters {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  user_id?: number;
  format?: 'json' | 'csv';
}

export interface LeadReportItem {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  company: string | null;
  status: string;
  source: string | null;
  created_at: string;
}

export interface SalesReportItem {
  id: number;
  uuid: string;
  name: string;
  value: number;
  status: string; // won, lost, open
  stage_name: string;
  owner_name: string;
  closed_at: string | null;
}

export interface TaskReportItem {
  id: number;
  uuid: string;
  title: string;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_to_name: string | null;
  created_at: string;
}

export interface RevenueReportItem {
  invoice_number: string;
  subject: string;
  date: string;
  due_date: string;
  total: number;
  amount_paid: number;
  balance_due: number;
  status: string;
  customer_name: string;
}
