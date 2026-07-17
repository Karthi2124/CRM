import { Request, Response, NextFunction } from 'express';
import * as service from './tasks.service';
import {
  createTaskSchema,
  updateTaskSchema,
  createTaskCommentSchema,
  createTaskAttachmentSchema,
  taskFiltersSchema,
} from './tasks.validation';
import { AuthRequest } from '../middleware/auth.middleware';

export async function createTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createTaskSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const task = await service.createTask(data, userId);
    res.status(201).json({ success: true, data: task, message: 'Task created successfully' });
  } catch (err) {
    next(err);
  }
}

export async function listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = taskFiltersSchema.parse(req.query);
    const result = await service.listTasks(filters);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getTaskByUuid(req: Request, res: Response, next: NextFunction) {
  try {
    const task = await service.getTaskByUuid(req.params.uuid as string);
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateTaskSchema.parse(req.body);
    const updated = await service.updateTask(req.params.uuid as string, data);
    res.json({ success: true, data: updated, message: 'Task updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteTask(req.params.uuid as string);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function addComment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createTaskCommentSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const updatedTask = await service.addComment(req.params.uuid as string, data, userId);
    res.status(201).json({ success: true, data: updatedTask, message: 'Comment added successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    await service.deleteComment(req.params.commentUuid as string, userId);
    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function addAttachment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createTaskAttachmentSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const updatedTask = await service.addAttachment(req.params.uuid as string, data, userId);
    res.status(201).json({ success: true, data: updatedTask, message: 'Attachment added successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteAttachment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    await service.deleteAttachment(req.params.attachmentUuid as string, userId);
    res.json({ success: true, message: 'Attachment deleted successfully' });
  } catch (err) {
    next(err);
  }
}
