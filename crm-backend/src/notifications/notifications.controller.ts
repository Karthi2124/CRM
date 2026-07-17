import { Response, NextFunction } from 'express';
import * as service from './notifications.service';
import {
  updatePreferencesSchema,
  notificationFiltersSchema,
} from './notifications.validation';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getMyNotifications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const filters = notificationFiltersSchema.parse(req.query);
    const result = await service.listNotifications(userId, filters);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const updated = await service.markNotificationRead(req.params.uuid as string, userId);
    res.json({ success: true, data: updated, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
}

export async function markAllRead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    await service.markAllRead(userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
}

export async function getPreferences(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const preferences = await service.getPreferences(userId);
    res.json({ success: true, data: preferences });
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const { preferences } = updatePreferencesSchema.parse(req.body);
    const updated = await service.updatePreferences(userId, preferences);
    res.json({ success: true, data: updated, message: 'Preferences updated successfully' });
  } catch (err) {
    next(err);
  }
}
