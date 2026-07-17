// ─── Shared TypeScript types mirroring backend models ───────────────────────

export interface User {
  id: string;
  employee_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  status: "active" | "inactive" | "suspended";
  role_id?: string;
  role?: Role;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: Permission[];
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company_name?: string;
  type: "individual" | "business";
  status: "active" | "inactive" | "prospect";
  assigned_to?: string;
  assignee?: User;
  created_at: string;
}

export interface Lead {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  status: string;
  priority: "low" | "medium" | "high";
  estimated_value?: number;
  assigned_to?: string;
  assignee?: User;
  created_at: string;
}

export interface Opportunity {
  id: string;
  title: string;
  stage: string;
  value?: number;
  probability?: number;
  expected_close_date?: string;
  status: "open" | "won" | "lost";
  customer_id?: string;
  customer?: Customer;
  assigned_to?: string;
  assignee?: User;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  sku?: string;
  description?: string;
  unit_price: number;
  cost_price?: number;
  stock_quantity?: number;
  status: "active" | "inactive";
  category?: { id: string; name: string };
  brand?: { id: string; name: string };
  unit?: { id: string; name: string };
  created_at: string;
}

export interface QuotationItem {
  id?: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount?: number;
  tax_rate?: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  valid_until?: string;
  customer?: Customer;
  items?: QuotationItem[];
  created_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  status: "unpaid" | "partially_paid" | "paid" | "overdue" | "cancelled";
  subtotal: number;
  tax_amount: number;
  total: number;
  amount_paid: number;
  balance_due: number;
  due_date?: string;
  customer?: Customer;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due_date?: string;
  assignee?: User;
  customer?: Customer;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  start_date: string;
  end_date?: string;
  all_day: boolean;
  location?: string;
  description?: string;
  status: "scheduled" | "completed" | "cancelled";
  assignee?: User;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  entity_id?: string;
  user?: User;
  ip_address?: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface Setting {
  id: string;
  group: string;
  key: string;
  value?: string;
  label: string;
  type: "text" | "number" | "boolean" | "email" | "select";
}

export interface UploadedFile {
  id: string;
  uuid: string;
  original_name: string;
  mimetype: string;
  size: number;
  uploader?: User;
  created_at: string;
}

export interface DashboardKPIs {
  totalRevenue: number;
  totalLeads: number;
  openOpportunities: number;
  tasksDueToday: number;
  revenueGrowth?: number;
  leadsGrowth?: number;
}

export interface ChartData {
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  leadsByStatus: Array<{ status: string; count: number }>;
  opportunitiesByStage: Array<{ stage: string; count: number; value: number }>;
  tasksByStatus: Array<{ status: string; count: number }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
