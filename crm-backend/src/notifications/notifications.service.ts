import { User } from '../models';
import { AppError } from '../utils/error.helper';
import logger from '../utils/logger';
import * as repo from './notifications.repository';
import { UpdatePreferenceItem, NotificationFilters } from './notifications.types';

// List of default templates to seed
const DEFAULT_TEMPLATES = [
  {
    name: 'lead_assigned',
    subject: 'New Lead Assigned: {leadName}',
    body: 'Hello {userName}, a new lead "{leadName}" from {companyName} has been assigned to you. Please review and initiate contact.',
    channels: ['in_app', 'email'],
  },
  {
    name: 'quotation_approved',
    subject: 'Quotation Approved: {quotationNumber}',
    body: 'Hello {userName}, the quotation {quotationNumber} with subject "{quotationSubject}" has been approved by the customer.',
    channels: ['in_app', 'email'],
  },
  {
    name: 'payment_received',
    subject: 'Payment Received for Invoice {invoiceNumber}',
    body: 'Hello {userName}, a payment of ${amount} has been successfully recorded for invoice {invoiceNumber}. The new balance due is ${balanceDue}.',
    channels: ['in_app', 'email'],
  },
];

export async function seedDefaultTemplates() {
  for (const t of DEFAULT_TEMPLATES) {
    await repo.createTemplateIfNotExist(t.name, t.subject, t.body, t.channels);
  }
}

// ─── Formatting Helper ─────────────────────────────────────────────────────────

function formatTemplateText(template: string, variables: Record<string, any>): string {
  let formatted = template;
  for (const [key, value] of Object.entries(variables)) {
    const valStr = value !== undefined && value !== null ? String(value) : '';
    formatted = formatted.replace(new RegExp(`{${key}}`, 'g'), valStr);
  }
  return formatted;
}

// ─── Dispatch Engine ───────────────────────────────────────────────────────────

export async function sendNotification(
  recipientId: number,
  templateName: string,
  variables: Record<string, any>,
  relatedEntity?: { type: string; id: string }
) {
  const recipient = await User.findByPk(recipientId);
  if (!recipient) {
    logger.warn(`Notification dispatch aborted: Recipient with ID ${recipientId} not found`);
    return;
  }

  // Inject user name
  const userName = `${recipient.first_name || ''} ${recipient.last_name || ''}`.trim() || 'Team Member';
  const fullVariables = { ...variables, userName };

  const template = await repo.findTemplateByName(templateName);
  if (!template) {
    logger.error(`Notification dispatch failed: Template "${templateName}" is missing`);
    return;
  }

  // Fetch or fallback preferences
  const preference = await repo.findPreference(recipientId, templateName);
  const sendEmail = preference ? preference.email : template.channels.includes('email');
  const sendInApp = preference ? preference.in_app : template.channels.includes('in_app');
  const sendSms = preference ? preference.sms : template.channels.includes('sms');

  const subject = formatTemplateText(template.subject_template, fullVariables);
  const body = formatTemplateText(template.body_template, fullVariables);

  // 1. In-App Notification
  if (sendInApp) {
    await repo.createNotification({
      recipient_id: recipientId,
      title: subject,
      message: body,
      type: 'info',
      is_read: false,
      related_entity_type: relatedEntity?.type || null,
      related_entity_id: relatedEntity?.id || null,
    });
  }

  // 2. Email Stub
  if (sendEmail) {
    logger.info(`[EMAIL DISPATCH STUB] To: ${recipient.email} | Subject: "${subject}" | Body: "${body}"`);
  }

  // 3. SMS Stub
  if (sendSms) {
    logger.info(`[SMS DISPATCH STUB] To: ${recipient.phone || 'N/A'} | Body: "${body}"`);
  }
}

// ─── Service Operations ──────────────────────────────────────────────────────────

export async function listNotifications(userId: number, filters: NotificationFilters) {
  return repo.listNotificationsForUser(userId, filters);
}

export async function markNotificationRead(uuid: string, userId: number) {
  const notification = await repo.findNotificationByUuid(uuid);
  if (!notification) throw new AppError('Notification not found', 404);
  if (notification.recipient_id !== userId) throw new AppError('Unauthorized', 403);

  await notification.update({
    is_read: true,
    read_at: new Date(),
  });

  return notification;
}

export async function markAllRead(userId: number) {
  await repo.markAllNotificationsAsRead(userId);
}

// ─── Preference Services ─────────────────────────────────────────────────────────

export async function getPreferences(userId: number) {
  const saved = await repo.listPreferencesForUser(userId);
  const savedTypes = saved.map((p) => p.notification_type);

  // Return loaded templates merged with missing templates
  const results = saved.map((p) => ({
    notification_type: p.notification_type,
    email: p.email,
    in_app: p.in_app,
    sms: p.sms,
  }));

  for (const t of DEFAULT_TEMPLATES) {
    if (!savedTypes.includes(t.name)) {
      results.push({
        notification_type: t.name,
        email: t.channels.includes('email'),
        in_app: t.channels.includes('in_app'),
        sms: t.channels.includes('sms'),
      });
    }
  }

  return results;
}

export async function updatePreferences(userId: number, preferences: UpdatePreferenceItem[]) {
  const results = [];
  for (const item of preferences) {
    const updated = await repo.upsertPreference(
      userId,
      item.notification_type,
      item.email,
      item.in_app,
      item.sms
    );
    results.push({
      notification_type: updated.notification_type,
      email: updated.email,
      in_app: updated.in_app,
      sms: updated.sms,
    });
  }
  return results;
}
