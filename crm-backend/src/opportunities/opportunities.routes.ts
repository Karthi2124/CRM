import { Router } from 'express';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesRepository } from './opportunities.repository';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import {
  listOpportunitiesValidator,
  createOpportunityValidator,
  updateOpportunityValidator,
  assignOpportunityValidator,
  createCompetitorValidator,
  updateCompetitorValidator,
  createNoteValidator,
} from './opportunities.validation';

const router = Router();

// Dependency Injection
const opportunitiesRepository = new OpportunitiesRepository();
const opportunitiesService = new OpportunitiesService(opportunitiesRepository);
const opportunitiesController = new OpportunitiesController(opportunitiesService);

// Require authentication for all routes
router.use(authenticate);

// ─── Stage Routes (Must sit above :uuid routes to prevent match conflict) ───
router.get('/stages', hasPermission('opportunities', 'view'), opportunitiesController.listStages);

// ─── Opportunity Profiles ───────────────────────────────────────────────────
router.get('/', hasPermission('opportunities', 'view'), listOpportunitiesValidator, opportunitiesController.listOpportunities);
router.get('/:uuid', hasPermission('opportunities', 'view'), opportunitiesController.getOpportunity);
router.post('/', hasPermission('opportunities', 'create'), createOpportunityValidator, opportunitiesController.createOpportunity);
router.put('/:uuid', hasPermission('opportunities', 'edit'), updateOpportunityValidator, opportunitiesController.updateOpportunity);
router.patch('/:uuid/assign', hasPermission('opportunities', 'assign'), assignOpportunityValidator, opportunitiesController.assignOpportunity);
router.delete('/:uuid', hasPermission('opportunities', 'delete'), opportunitiesController.deleteOpportunity);

// ─── Timeline Logs ──────────────────────────────────────────────────────────
router.get('/:uuid/timeline', hasPermission('opportunities', 'view_timeline'), opportunitiesController.getTimeline);

// ─── Competitor Logs ────────────────────────────────────────────────────────
router.get('/:oppUuid/competitors', hasPermission('opportunities', 'view'), opportunitiesController.listCompetitors);
router.post('/:oppUuid/competitors', hasPermission('opportunities', 'edit'), createCompetitorValidator, opportunitiesController.addCompetitor);
router.put('/competitors/:uuid', hasPermission('opportunities', 'edit'), updateCompetitorValidator, opportunitiesController.updateCompetitor);
router.delete('/competitors/:uuid', hasPermission('opportunities', 'edit'), opportunitiesController.deleteCompetitor);

// ─── Note Entries ───────────────────────────────────────────────────────────
router.get('/:oppUuid/notes', hasPermission('opportunities', 'view'), opportunitiesController.listNotes);
router.post('/:oppUuid/notes', hasPermission('opportunities', 'edit'), createNoteValidator, opportunitiesController.addNote);
router.delete('/notes/:uuid', hasPermission('opportunities', 'delete'), opportunitiesController.deleteNote);

export default router;
