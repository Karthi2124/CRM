import { Response, NextFunction } from 'express';
import * as service from './audit-logs.service';
import { auditLogFiltersSchema } from './audit-logs.validation';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getAuditLogs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const filters = auditLogFiltersSchema.parse(req.query);
    const logs = await service.getAuditLogs(filters);
    res.json({ success: true, ...logs });
  } catch (err) {
    next(err);
  }
}
