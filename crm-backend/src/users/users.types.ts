export interface CreateUserDto {
  employee_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  password: string;
  role_id: number;
  status?: 'active' | 'inactive' | 'suspended';
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface UpdateUserDto {
  employee_id?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role_id?: number;
  status?: 'active' | 'inactive' | 'suspended';
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface AdminResetPasswordDto {
  newPassword: string;
}

export interface UserListQuery {
  [key: string]: unknown;
  page?: string;
  limit?: string;
  search?: string;
  status?: string;
  role_id?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface UserResponse {
  id: number;
  uuid: string;
  employee_id: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  date_of_birth: string | null;
  gender: string | null;
  status: string;
  role: { id: number; uuid: string; name: string } | null;
  last_login_at: Date | null;
  created_at: Date;
}

export interface BulkDeleteDto {
  uuids: string[];
}
