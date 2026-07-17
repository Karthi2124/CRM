import { Request, Response } from 'express';
import { OpportunitiesService } from './opportunities.service';
import { asyncHandler } from '../utils/error.helper';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.helper';

export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  // ─── Opportunity Handlers ─────────────────────────────────────────────────
  listOpportunities = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { data, meta } = await this.opportunitiesService.listOpportunities(req.query as any);
    sendPaginated(res, data, meta, 'Opportunities retrieved successfully');
  });

  getOpportunity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const opp = await this.opportunitiesService.getOpportunityByUuid(req.params.uuid as string);
    sendSuccess(res, opp, 'Opportunity retrieved successfully');
  });

  createOpportunity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    const opp = await this.opportunitiesService.createOpportunity(req.body, authUser.id);
    sendCreated(res, opp, 'Opportunity created successfully');
  });

  updateOpportunity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const opp = await this.opportunitiesService.updateOpportunity(req.params.uuid as string, req.body);
    sendSuccess(res, opp, 'Opportunity updated successfully');
  });

  assignOpportunity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const opp = await this.opportunitiesService.assignOpportunity(req.params.uuid as string, req.body);
    sendSuccess(res, opp, 'Opportunity assigned successfully');
  });

  deleteOpportunity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.opportunitiesService.deleteOpportunity(req.params.uuid as string);
    sendSuccess(res, null, 'Opportunity deleted successfully');
  });

  // ─── Stage Handlers ───────────────────────────────────────────────────────
  listStages = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const stages = await this.opportunitiesService.listStages();
    sendSuccess(res, stages, 'Opportunity stages retrieved successfully');
  });

  // ─── Competitor Handlers ──────────────────────────────────────────────────
  listCompetitors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const competitors = await this.opportunitiesService.listCompetitors(req.params.oppUuid as string);
    sendSuccess(res, competitors, 'Competitors retrieved successfully');
  });

  addCompetitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const competitor = await this.opportunitiesService.addCompetitor(req.params.oppUuid as string, req.body);
    sendCreated(res, competitor, 'Competitor recorded successfully');
  });

  updateCompetitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const competitor = await this.opportunitiesService.updateCompetitor(req.params.uuid as string, req.body);
    sendSuccess(res, competitor, 'Competitor details updated successfully');
  });

  deleteCompetitor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.opportunitiesService.deleteCompetitor(req.params.uuid as string);
    sendSuccess(res, null, 'Competitor deleted successfully');
  });

  // ─── Note Handlers ────────────────────────────────────────────────────────
  listNotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const notes = await this.opportunitiesService.listNotes(req.params.oppUuid as string);
    sendSuccess(res, notes, 'Notes retrieved successfully');
  });

  addNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    const note = await this.opportunitiesService.addNote(req.params.oppUuid as string, authUser.id, req.body);
    sendCreated(res, note, 'Note added successfully');
  });

  deleteNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.opportunitiesService.deleteNote(req.params.uuid as string);
    sendSuccess(res, null, 'Note deleted successfully');
  });

  // ─── Timeline Handler ─────────────────────────────────────────────────────
  getTimeline = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const timeline = await this.opportunitiesService.getTimeline(req.params.uuid as string);
    sendSuccess(res, timeline, 'Opportunity timeline retrieved successfully');
  });
}
