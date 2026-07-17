import * as repository from './audit-logs.repository';
import { AuditLogFilters } from './audit-logs.types';
import { AuditLog } from '../models';

export async function getAuditLogs(filters: AuditLogFilters) {
  // Enforce defaults for page/limit
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  
  return repository.findAndCountAll({
    ...filters,
    page,
    limit,
  } as Required<AuditLogFilters>);
}

export interface LogEventPayload {
  userId: number | null;
  module: string;
  action: string;
  entityType: string;
  entityId: number | null;
  oldValues?: Record<string, any> | null;
  newValues?: Record<string, any> | null;
  ipAddress?: string | null;
}

export async function logEvent(payload: LogEventPayload) {
  return AuditLog.create({
    user_id: payload.userId,
    module: payload.module,
    action: payload.action,
    entity_type: payload.entityType,
    entity_id: payload.entityId,
    old_values: payload.oldValues || null,
    new_values: payload.newValues || null,
    ip_address: payload.ipAddress || null,
  });
}
