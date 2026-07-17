import { Router } from 'express';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import * as ctrl from './tasks.controller';

const router = Router();

// Apply authentication middleware to all task routes
router.use(authenticate);

// ─── Task Routes ───────────────────────────────────────────────────────────────
router.get('/',                    hasPermission('tasks', 'view'),   ctrl.listTasks);
router.post('/',                   hasPermission('tasks', 'create'), ctrl.createTask);
router.get('/:uuid',               hasPermission('tasks', 'view'),   ctrl.getTaskByUuid);
router.put('/:uuid',               hasPermission('tasks', 'edit'),   ctrl.updateTask);
router.delete('/:uuid',            hasPermission('tasks', 'delete'), ctrl.deleteTask);
router.post('/:uuid/comments',     hasPermission('tasks', 'edit'),   ctrl.addComment);
router.delete('/comments/:commentUuid', hasPermission('tasks', 'edit'), ctrl.deleteComment);
router.post('/:uuid/attachments',  hasPermission('tasks', 'edit'),   ctrl.addAttachment);
router.delete('/attachments/:attachmentUuid', hasPermission('tasks', 'edit'), ctrl.deleteAttachment);

export default router;
