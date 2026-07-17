import {
  Notification, NotificationTemplate, NotificationPreference,
} from '../models';
import { NotificationFilters } from './notifications.types';

export async function createNotification(data: any) {
  return Notification.create(data);
}

export async function findNotificationByUuid(uuid: string) {
  return Notification.findOne({
    where: { uuid },
  });
}

export async function listNotificationsForUser(userId: number, filters: NotificationFilters) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const offset = (page - 1) * limit;

  const where: any = {
    recipient_id: userId,
  };

  if (filters.is_read !== undefined) {
    where.is_read = filters.is_read;
  }

  const { count, rows } = await Notification.findAndCountAll({
    where,
    limit,
    offset,
    order: [['created_at', 'DESC']],
  });

  return {
    data: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

export async function markAllNotificationsAsRead(userId: number) {
  return Notification.update(
    { is_read: true, read_at: new Date() },
    { where: { recipient_id: userId, is_read: false } }
  );
}

// ─── Preferences Operations ──────────────────────────────────────────────────────

export async function findPreference(userId: number, notificationType: string) {
  return NotificationPreference.findOne({
    where: { user_id: userId, notification_type: notificationType },
  });
}

export async function listPreferencesForUser(userId: number) {
  return NotificationPreference.findAll({
    where: { user_id: userId },
  });
}

export async function upsertPreference(
  userId: number,
  type: string,
  email: boolean,
  inApp: boolean,
  sms: boolean
) {
  const existing = await findPreference(userId, type);
  if (existing) {
    return existing.update({ email, in_app: inApp, sms });
  } else {
    return NotificationPreference.create({
      user_id: userId,
      notification_type: type,
      email,
      in_app: inApp,
      sms,
    });
  }
}

// ─── Templates Operations ────────────────────────────────────────────────────────

export async function findTemplateByName(name: string) {
  return NotificationTemplate.findOne({
    where: { name },
  });
}

export async function createTemplateIfNotExist(
  name: string,
  subject: string,
  body: string,
  channels: string[]
) {
  const existing = await findTemplateByName(name);
  if (!existing) {
    await NotificationTemplate.create({
      name,
      subject_template: subject,
      body_template: body,
      channels,
    });
  }
}
