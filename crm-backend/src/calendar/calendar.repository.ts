import { Op } from 'sequelize';
import {
  CalendarEvent, User, Customer, Lead, Opportunity,
} from '../models';
import { CalendarFilters } from './calendar.types';

const defaultIncludes = [
  { model: User, as: 'assignee', attributes: ['id', 'uuid', 'first_name', 'last_name', 'email'] },
  { model: User, as: 'creator', attributes: ['id', 'uuid', 'first_name', 'last_name', 'email'] },
  { model: Customer, as: 'customer', attributes: ['id', 'uuid', 'first_name', 'last_name', 'company_name'] },
  { model: Lead, as: 'lead', attributes: ['id', 'uuid', 'first_name', 'last_name', 'company'] },
  { model: Opportunity, as: 'opportunity', attributes: ['id', 'uuid', 'name', 'value'] },
];

export async function createEvent(data: any) {
  return CalendarEvent.create(data);
}

export async function findEventByUuid(uuid: string) {
  return CalendarEvent.findOne({
    where: { uuid },
    include: defaultIncludes,
  });
}

export async function findEventById(id: number) {
  return CalendarEvent.findByPk(id, {
    include: defaultIncludes,
  });
}

export async function listEvents(filters: CalendarFilters) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const offset = (page - 1) * limit;

  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.assigned_to) {
    where.assigned_to = filters.assigned_to;
  }
  if (filters.customer_id) {
    where.customer_id = filters.customer_id;
  }
  if (filters.lead_id) {
    where.lead_id = filters.lead_id;
  }
  if (filters.opportunity_id) {
    where.opportunity_id = filters.opportunity_id;
  }

  // Date range filters
  if (filters.start_after && filters.end_before) {
    where.start_date = {
      [Op.between]: [new Date(filters.start_after), new Date(filters.end_before)],
    };
  } else if (filters.start_after) {
    where.start_date = {
      [Op.gte]: new Date(filters.start_after),
    };
  } else if (filters.end_before) {
    where.end_date = {
      [Op.lte]: new Date(filters.end_before),
    };
  }

  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${filters.search}%` } },
      { description: { [Op.like]: `%${filters.search}%` } },
      { location: { [Op.like]: `%${filters.search}%` } },
    ];
  }

  const { count, rows } = await CalendarEvent.findAndCountAll({
    where,
    include: defaultIncludes,
    limit,
    offset,
    order: [['start_date', 'ASC']],
    distinct: true,
  });

  return {
    data: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

export async function updateEvent(event: CalendarEvent, data: any) {
  return event.update(data);
}

export async function deleteEvent(event: CalendarEvent) {
  return event.destroy();
}
