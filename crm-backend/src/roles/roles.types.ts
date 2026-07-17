export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface AssignPermissionsDto {
  permissionIds: number[];
}

export interface RoleResponse {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  permissionCount?: number;
  userCount?: number;
  created_at: Date;
}

export interface RoleWithPermissions extends RoleResponse {
  permissions: PermissionSummary[];
}

export interface PermissionSummary {
  id: number;
  uuid: string;
  module: string;
  action: string;
  description: string | null;
}

export interface RoleListQuery {
  [key: string]: unknown;
  page?: string;
  limit?: string;
  search?: string;
}
