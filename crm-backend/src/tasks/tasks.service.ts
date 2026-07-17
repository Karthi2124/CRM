import { User, Customer, Lead, Opportunity } from '../models';
import { AppError } from '../utils/error.helper';
import * as repo from './tasks.repository';
import {
  CreateTaskDto,
  UpdateTaskDto,
  CreateTaskCommentDto,
  CreateTaskAttachmentDto,
  TaskFilters,
} from './tasks.types';

// ─── Verification Helper ────────────────────────────────────────────────────────

async function validateTaskRelations(data: Partial<CreateTaskDto>) {
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

export async function createTask(data: CreateTaskDto, creatorId: number) {
  await validateTaskRelations(data);

  const payload = {
    ...data,
    created_by: creatorId,
  };

  const task = await repo.createTask(payload);
  return repo.findTaskById(task.id);
}

export async function listTasks(filters: TaskFilters) {
  return repo.listTasks(filters);
}

export async function getTaskByUuid(uuid: string) {
  const task = await repo.findTaskByUuid(uuid);
  if (!task) throw new AppError('Task not found', 404);
  return task;
}

export async function updateTask(uuid: string, data: UpdateTaskDto) {
  const task = await repo.findTaskByUuid(uuid);
  if (!task) throw new AppError('Task not found', 404);

  await validateTaskRelations(data);

  await repo.updateTask(task, data);
  return repo.findTaskById(task.id);
}

export async function deleteTask(uuid: string) {
  const task = await repo.findTaskByUuid(uuid);
  if (!task) throw new AppError('Task not found', 404);
  await repo.deleteTask(task);
}

// ─── Comment Service Operations ──────────────────────────────────────────────────

export async function addComment(taskUuid: string, data: CreateTaskCommentDto, userId: number) {
  const task = await repo.findTaskByUuid(taskUuid);
  if (!task) throw new AppError('Task not found', 404);

  const commentPayload = {
    task_id: task.id,
    comment: data.comment,
    user_id: userId,
  };

  await repo.createComment(commentPayload);
  return repo.findTaskById(task.id);
}

export async function deleteComment(commentUuid: string, _userId: number) {
  const comment = await repo.findCommentByUuid(commentUuid);
  if (!comment) throw new AppError('Comment not found', 404);

  // Optional: check ownership (if comment.user_id !== userId)
  await repo.deleteComment(comment);
}

// ─── Attachment Service Operations ───────────────────────────────────────────────

export async function addAttachment(taskUuid: string, data: CreateTaskAttachmentDto, userId: number) {
  const task = await repo.findTaskByUuid(taskUuid);
  if (!task) throw new AppError('Task not found', 404);

  const attachmentPayload = {
    task_id: task.id,
    file_name: data.file_name,
    file_url: data.file_url,
    file_size: data.file_size || null,
    mime_type: data.mime_type || null,
    uploaded_by: userId,
  };

  await repo.createAttachment(attachmentPayload);
  return repo.findTaskById(task.id);
}

export async function deleteAttachment(attachmentUuid: string, _userId: number) {
  const attachment = await repo.findAttachmentByUuid(attachmentUuid);
  if (!attachment) throw new AppError('Attachment not found', 404);

  await repo.deleteAttachment(attachment);
}
