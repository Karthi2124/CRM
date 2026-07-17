import { Op } from 'sequelize';
import { AuditLog, User } from '../models';
import { AuditLogFilters } from './audit-logs.types';

export async function findAndCountAll(filters: Required<AuditLogFilters>) {
  const where: any = {};

  if (filters.user_id) {
    where.user_id = filters.user_id;
  }
  if (filters.module) {
    where.module = filters.module;
  }
  if (filters.action) {
    where.action = filters.action;
  }

  // Date range filtering
  if (filters.start_date && filters.end_date) {
    where.created_at = {
      [Op.between]: [
        new Date(`${filters.start_date}T00:00:00.000Z`),
        new Date(`${filters.end_date}T23:59:59.999Z`),
      ],
    };
  } else if (filters.start_date) {
    where.created_at = {
      [Op.gte]: new Date(`${filters.start_date}T00:00:00.000Z`),
    };
  } else if (filters.end_date) {
    where.created_at = {
      [Op.lte]: new Date(`${filters.end_date}T23:59:59.999Z`),
    };
  }

  const limit = filters.limit;
  const offset = (filters.page - 1) * limit;

  const { count, rows } = await AuditLog.findAndCountAll({
    where,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'first_name', 'last_name', 'email'],
      },
    ],
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });

  return {
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: filters.page,
    limit,
    rows,
  };
}
