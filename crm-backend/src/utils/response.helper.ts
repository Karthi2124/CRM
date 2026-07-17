import { Response } from 'express';

// ─── Generic API Response Shape ───────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
  meta?: PaginationMeta;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─── Success Response ─────────────────────────────────────────────────────────
export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Request successful',
  statusCode = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

// ─── Created Response ─────────────────────────────────────────────────────────
export function sendCreated<T>(
  res: Response,
  data: T,
  message = 'Resource created successfully'
): void {
  sendSuccess(res, data, message, 201);
}

// ─── Paginated Response ───────────────────────────────────────────────────────
export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: PaginationMeta,
  message = 'Data retrieved successfully'
): void {
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    meta,
  };
  res.status(200).json(response);
}

// ─── Error Response ───────────────────────────────────────────────────────────
export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: ValidationError[]
): void {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && errors.length > 0 ? { errors } : {}),
  };
  res.status(statusCode).json(response);
}

// ─── Not Found Response ───────────────────────────────────────────────────────
export function sendNotFound(res: Response, resource = 'Resource'): void {
  sendError(res, `${resource} not found`, 404);
}

// ─── Unauthorized Response ────────────────────────────────────────────────────
export function sendUnauthorized(res: Response, message = 'Unauthorized access'): void {
  sendError(res, message, 401);
}

// ─── Forbidden Response ───────────────────────────────────────────────────────
export function sendForbidden(res: Response, message = 'You do not have permission to perform this action'): void {
  sendError(res, message, 403);
}

// ─── Validation Error Response ────────────────────────────────────────────────
export function sendValidationError(res: Response, errors: ValidationError[]): void {
  sendError(res, 'Validation failed', 422, errors);
}

// ─── Build Pagination Meta ────────────────────────────────────────────────────
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

// ─── Parse Pagination Query Params ────────────────────────────────────────────
export function parsePagination(query: Record<string, unknown>): { page: number; limit: number; offset: number } {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || '20'), 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
