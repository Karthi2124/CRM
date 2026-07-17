import { randomUUID } from 'crypto';
import { User, Customer, Lead, Opportunity } from '../models';
import { AppError } from '../utils/error.helper';
import * as repo from './calendar.repository';
import {
  CreateCalendarEventDto,
  UpdateCalendarEventDto,
  CalendarFilters,
} from './calendar.types';

// ─── Verification Helper ────────────────────────────────────────────────────────

async function validateEventRelations(data: Partial<CreateCalendarEventDto>) {
  if (data.assigned_to) {
    const user = await User.findByPk(data.assigned_to);
    if (!user) throw new AppError('Assigned user not found', 404);
  }
  if (data.customer_id) {
    const client = await Customer.findByPk(data.customer_id);
    if (!client) throw new AppError('Customer not found', 404);
  }
  if (data.lead_id) {
    const lead = await Lead.findByPk(data.lead_id);
    if (!lead) throw new AppError('Lead not found', 404);
  }
  if (data.opportunity_id) {
    const opp = await Opportunity.findByPk(data.opportunity_id);
    if (!opp) throw new AppError('Opportunity not found', 404);
  }
}

// ─── Service Operations ──────────────────────────────────────────────────────────

export async function createEvent(data: CreateCalendarEventDto, creatorId: number) {
  await validateEventRelations(data);

  const payload = {
    ...data,
    created_by: creatorId,
    start_date: new Date(data.start_date),
    end_date: new Date(data.end_date),
  };

  const event = await repo.createEvent(payload);
  return repo.findEventById(event.id);
}

export async function listEvents(filters: CalendarFilters) {
  return repo.listEvents(filters);
}

export async function getEventByUuid(uuid: string) {
  const event = await repo.findEventByUuid(uuid);
  if (!event) throw new AppError('Calendar event not found', 404);
  return event;
}

export async function updateEvent(uuid: string, data: UpdateCalendarEventDto) {
  const event = await repo.findEventByUuid(uuid);
  if (!event) throw new AppError('Calendar event not found', 404);

  await validateEventRelations(data);

  const payload: any = { ...data };
  if (data.start_date) payload.start_date = new Date(data.start_date);
  if (data.end_date) payload.end_date = new Date(data.end_date);

  await repo.updateEvent(event, payload);
  return repo.findEventById(event.id);
}

export async function deleteEvent(uuid: string) {
  const event = await repo.findEventByUuid(uuid);
  if (!event) throw new AppError('Calendar event not found', 404);
  await repo.deleteEvent(event);
}

// ─── External Sync Simulation ───────────────────────────────────────────────────

export async function syncExternalCalendar(uuid: string, provider: 'google' | 'outlook') {
  const event = await repo.findEventByUuid(uuid);
  if (!event) throw new AppError('Calendar event not found', 404);

  const mockSyncId = `${provider}_evt_${randomUUID()}`;

  const updatePayload: any = {
    sync_status: 'synced',
  };

  if (provider === 'google') {
    updatePayload.google_event_id = mockSyncId;
  } else {
    updatePayload.outlook_event_id = mockSyncId;
  }

  await repo.updateEvent(event, updatePayload);
  return repo.findEventById(event.id);
}
