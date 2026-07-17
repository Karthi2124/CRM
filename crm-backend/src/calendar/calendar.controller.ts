import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as service from './calendar.service';
import {
  createCalendarEventSchema,
  updateCalendarEventSchema,
  calendarFiltersSchema,
} from './calendar.validation';
import { AuthRequest } from '../middleware/auth.middleware';

export async function createEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createCalendarEventSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const event = await service.createEvent(data, userId);
    res.status(201).json({ success: true, data: event, message: 'Calendar event scheduled successfully' });
  } catch (err) {
    next(err);
  }
}

export async function listEvents(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = calendarFiltersSchema.parse(req.query);
    const result = await service.listEvents(filters);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getEventByUuid(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await service.getEventByUuid(req.params.uuid as string);
    res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
}

export async function updateEvent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateCalendarEventSchema.parse(req.body);
    const updated = await service.updateEvent(req.params.uuid as string, data);
    res.json({ success: true, data: updated, message: 'Calendar event updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteEvent(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteEvent(req.params.uuid as string);
    res.json({ success: true, message: 'Calendar event deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function syncExternalCalendar(req: Request, res: Response, next: NextFunction) {
  try {
    const bodySchema = z.object({
      provider: z.enum(['google', 'outlook']),
    });
    const { provider } = bodySchema.parse(req.body);
    const updated = await service.syncExternalCalendar(req.params.uuid as string, provider);
    res.json({ success: true, data: updated, message: `Synced successfully with ${provider === 'google' ? 'Google Calendar' : 'Outlook Calendar'}` });
  } catch (err) {
    next(err);
  }
}
