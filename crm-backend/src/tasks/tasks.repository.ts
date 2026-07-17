import { Op } from 'sequelize';
import {
  Task, TaskComment, TaskAttachment, User, Customer, Lead, Opportunity,
} from '../models';
import { TaskFilters } from './tasks.types';

const defaultIncludes = [
  { model: User, as: 'assignee', attributes: ['id', 'uuid', 'first_name', 'last_name', 'email'] },
  { model: User, as: 'creator', attributes: ['id', 'uuid', 'first_name', 'last_name', 'email'] },
  { model: Customer, as: 'customer', attributes: ['id', 'uuid', 'first_name', 'last_name', 'company_name'] },
  { model: Lead, as: 'lead', attributes: ['id', 'uuid', 'first_name', 'last_name', 'company'] },
  { model: Opportunity, as: 'opportunity', attributes: ['id', 'uuid', 'name', 'value'] },
  {
    model: TaskComment,
    as: 'comments',
    include: [{ model: User, as: 'author', attributes: ['id', 'uuid', 'first_name', 'last_name'] }],
  },
  {
    model: TaskAttachment,
    as: 'attachments',
    include: [{ model: User, as: 'uploader', attributes: ['id', 'uuid', 'first_name', 'last_name'] }],
  },
];

export async function createTask(data: any) {
  return Task.create(data);
}

export async function findTaskByUuid(uuid: string) {
  return Task.findOne({
    where: { uuid },
    include: defaultIncludes,
  });
}

export async function findTaskById(id: number) {
  return Task.findByPk(id, {
    include: defaultIncludes,
  });
}

export async function listTasks(filters: TaskFilters) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const offset = (page - 1) * limit;

  const where: any = {};

  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.priority) {
    where.priority = filters.priority;
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

  if (filters.search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${filters.search}%` } },
      { description: { [Op.like]: `%${filters.search}%` } },
    ];
  }

  const { count, rows } = await Task.findAndCountAll({
    where,
    include: [
      { model: User, as: 'assignee', attributes: ['id', 'uuid', 'first_name', 'last_name'] },
      { model: User, as: 'creator', attributes: ['id', 'uuid', 'first_name', 'last_name'] },
      { model: Customer, as: 'customer', attributes: ['id', 'uuid', 'first_name', 'last_name', 'company_name'] },
    ],
    limit,
    offset,
    order: [['created_at', 'DESC']],
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

export async function updateTask(task: Task, data: any) {
  return task.update(data);
}

export async function deleteTask(task: Task) {
  return task.destroy();
}

// ─── Comment Operations ──────────────────────────────────────────────────────────

export async function createComment(data: any) {
  return TaskComment.create(data);
}

export async function findCommentByUuid(uuid: string) {
  return TaskComment.findOne({ where: { uuid } });
}

export async function deleteComment(comment: TaskComment) {
  return comment.destroy();
}

// ─── Attachment Operations ───────────────────────────────────────────────────────

export async function createAttachment(data: any) {
  return TaskAttachment.create(data);
}

export async function findAttachmentByUuid(uuid: string) {
  return TaskAttachment.findOne({ where: { uuid } });
}

export async function deleteAttachment(attachment: TaskAttachment) {
  return attachment.destroy();
}
