import { Router } from 'express';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { LeadsRepository } from './leads.repository';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import {
  listLeadsValidator,
  createLeadValidator,
  updateLeadValidator,
  assignLeadValidator,
  createLeadNoteValidator,
  createLeadFollowUpValidator,
  updateLeadFollowUpValidator,
  createLeadActivityValidator,
} from './leads.validation';

const router = Router();

// Dependency Injection
const leadsRepository = new LeadsRepository();
const leadsService = new LeadsService(leadsRepository);
const leadsController = new LeadsController(leadsService);

// Require authentication for all routes
router.use(authenticate);

// ─── Lead Profiles ──────────────────────────────────────────────────────────
router.get('/', hasPermission('leads', 'view'), listLeadsValidator, leadsController.listLeads);
router.get('/:uuid', hasPermission('leads', 'view'), leadsController.getLead);
router.post('/', hasPermission('leads', 'create'), createLeadValidator, leadsController.createLead);
router.put('/:uuid', hasPermission('leads', 'edit'), updateLeadValidator, leadsController.updateLead);
router.patch('/:uuid/assign', hasPermission('leads', 'assign'), assignLeadValidator, leadsController.assignLead);
router.delete('/:uuid', hasPermission('leads', 'delete'), leadsController.deleteLead);

// ─── Lead Timeline ──────────────────────────────────────────────────────────
router.get('/:uuid/timeline', hasPermission('leads', 'view_timeline'), leadsController.getTimeline);

// ─── Lead Notes ─────────────────────────────────────────────────────────────
router.get('/:leadUuid/notes', hasPermission('leads', 'view'), leadsController.listNotes);
router.post('/:leadUuid/notes', hasPermission('leads', 'add_note'), createLeadNoteValidator, leadsController.addNote);
router.delete('/notes/:uuid', hasPermission('leads', 'delete'), leadsController.deleteNote);

// ─── Lead Follow-ups ────────────────────────────────────────────────────────
router.get('/:leadUuid/followups', hasPermission('leads', 'view'), leadsController.listFollowUps);
router.post('/:leadUuid/followups', hasPermission('leads', 'add_followup'), createLeadFollowUpValidator, leadsController.addFollowUp);
router.put('/followups/:uuid', hasPermission('leads', 'edit'), updateLeadFollowUpValidator, leadsController.updateFollowUp);
router.delete('/followups/:uuid', hasPermission('leads', 'delete'), leadsController.deleteFollowUp);

// ─── Lead Activities ────────────────────────────────────────────────────────
router.get('/:leadUuid/activities', hasPermission('leads', 'view'), leadsController.listActivities);
router.post('/:leadUuid/activities', hasPermission('leads', 'create'), createLeadActivityValidator, leadsController.addActivity);
router.delete('/activities/:uuid', hasPermission('leads', 'delete'), leadsController.deleteActivity);

export default router;
