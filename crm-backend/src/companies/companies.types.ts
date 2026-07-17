// ─── Company DTOs ───────────────────────────────────────────────────────────
export interface CreateCompanyDto {
  name: string;
  legal_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  tax_number?: string;
  logo_url?: string;
  address?: string;
}

export interface UpdateCompanyDto {
  name?: string;
  legal_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  tax_number?: string;
  logo_url?: string;
  address?: string;
}

export interface CompanyListQuery {
  [key: string]: unknown;
  page?: string;
  limit?: string;
  search?: string;
}

// ─── Branch DTOs ─────────────────────────────────────────────────────────────
export interface CreateBranchDto {
  company_id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateBranchDto {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// ─── Department DTOs ─────────────────────────────────────────────────────────
export interface CreateDepartmentDto {
  branch_id: number;
  name: string;
  description?: string;
}

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
}

// ─── Designation DTOs ────────────────────────────────────────────────────────
export interface CreateDesignationDto {
  department_id: number;
  name: string;
  description?: string;
}

export interface UpdateDesignationDto {
  name?: string;
  description?: string;
}

// ─── Response Shapes ─────────────────────────────────────────────────────────
export interface CompanyResponse {
  id: number;
  uuid: string;
  name: string;
  legal_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  tax_number: string | null;
  logo_url: string | null;
  address: string | null;
  branches_count?: number;
  created_at: Date;
}

export interface BranchResponse {
  id: number;
  uuid: string;
  company_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  departments_count?: number;
  created_at: Date;
}

export interface DepartmentResponse {
  id: number;
  uuid: string;
  branch_id: number;
  name: string;
  description: string | null;
  designations_count?: number;
  created_at: Date;
}

export interface DesignationResponse {
  id: number;
  uuid: string;
  department_id: number;
  name: string;
  description: string | null;
  created_at: Date;
}
