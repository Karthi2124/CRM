import { Response, NextFunction } from 'express';
import * as service from './settings.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../utils/error.helper';
import { logEvent } from '../audit-logs/audit-logs.service';
import * as validation from './settings.validation';

export async function getSettings(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = await service.getAllSettings();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function updateSettingsGroup(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const group = req.params.group as string;
    const userId = req.user?.id || null;
    const ipAddress = req.ip || null;

    let validatedPayload: any;

    // Resolve corresponding group Zod validation schema
    switch (group) {
      case 'company':
        validatedPayload = validation.companySettingsSchema.parse(req.body);
        break;
      case 'email':
        validatedPayload = validation.emailSettingsSchema.parse(req.body);
        break;
      case 'sms':
        validatedPayload = validation.smsSettingsSchema.parse(req.body);
        break;
      case 'tax':
        validatedPayload = validation.taxSettingsSchema.parse(req.body);
        break;
      case 'currency':
        validatedPayload = validation.currencySettingsSchema.parse(req.body);
        break;
      case 'localization':
        validatedPayload = validation.localizationSettingsSchema.parse(req.body);
        break;
      default:
        throw new AppError(`Invalid settings group: '${group}'`, 400);
    }

    // Capture old values for audit logging
    const allSettings = await service.getAllSettings();
    const oldValues = allSettings[group] || null;

    // Apply updates
    const updated = await service.updateSettingsGroup(group, validatedPayload);

    // Write Audit Log
    try {
      await logEvent({
        userId,
        module: 'settings',
        action: `edit_${group}`,
        entityType: 'setting_group',
        entityId: null,
        oldValues,
        newValues: updated,
        ipAddress,
      });
    } catch (auditErr) {
      // Don't fail the request if logging fails
    }

    res.json({
      success: true,
      data: updated,
      message: `Settings group '${group}' updated successfully`,
    });
  } catch (err) {
    next(err);
  }
}
