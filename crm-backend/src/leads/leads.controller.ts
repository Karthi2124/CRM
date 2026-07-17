import { Request, Response } from 'express';
import { LeadsService } from './leads.service';
import { asyncHandler } from '../utils/error.helper';
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response.helper';

export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  // ─── Lead CRUD Handlers ───────────────────────────────────────────────────
  listLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { data, meta } = await this.leadsService.listLeads(req.query as any);
    sendPaginated(res, data, meta, 'Leads retrieved successfully');
  });

  getLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const lead = await this.leadsService.getLeadByUuid(req.params.uuid as string);
    sendSuccess(res, lead, 'Lead retrieved successfully');
  });

  createLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    const lead = await this.leadsService.createLead(req.body, authUser.id);
    sendCreated(res, lead, 'Lead created successfully');
  });

  updateLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const lead = await this.leadsService.updateLead(req.params.uuid as string, req.body);
    sendSuccess(res, lead, 'Lead updated successfully');
  });

  assignLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const lead = await this.leadsService.assignLead(req.params.uuid as string, req.body);
    sendSuccess(res, lead, 'Lead assigned successfully');
  });

  deleteLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.leadsService.deleteLead(req.params.uuid as string);
    sendSuccess(res, null, 'Lead deleted successfully');
  });

  // ─── Note Handlers ────────────────────────────────────────────────────────
  listNotes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const notes = await this.leadsService.listNotes(req.params.leadUuid as string);
    sendSuccess(res, notes, 'Notes retrieved successfully');
  });

  addNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    const note = await this.leadsService.addNote(req.params.leadUuid as string, authUser.id, req.body);
    sendCreated(res, note, 'Note added successfully');
  });

  deleteNote = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.leadsService.deleteNote(req.params.uuid as string);
    sendSuccess(res, null, 'Note deleted successfully');
  });

  // ─── Follow-up Handlers ───────────────────────────────────────────────────
  listFollowUps = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const followups = await this.leadsService.listFollowUps(req.params.leadUuid as string);
    sendSuccess(res, followups, 'Follow-ups retrieved successfully');
  });

  addFollowUp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    const followup = await this.leadsService.addFollowUp(req.params.leadUuid as string, authUser.id, req.body);
    sendCreated(res, followup, 'Follow-up created successfully');
  });

  updateFollowUp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const followup = await this.leadsService.updateFollowUp(req.params.uuid as string, req.body);
    sendSuccess(res, followup, 'Follow-up updated successfully');
  });

  deleteFollowUp = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.leadsService.deleteFollowUp(req.params.uuid as string);
    sendSuccess(res, null, 'Follow-up deleted successfully');
  });

  // ─── Activity Handlers ────────────────────────────────────────────────────
  listActivities = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const activities = await this.leadsService.listActivities(req.params.leadUuid as string);
    sendSuccess(res, activities, 'Activities retrieved successfully');
  });

  addActivity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const authUser = (req as any).user;
    const activity = await this.leadsService.addActivity(req.params.leadUuid as string, authUser.id, req.body);
    sendCreated(res, activity, 'Activity recorded successfully');
  });

  deleteActivity = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.leadsService.deleteActivity(req.params.uuid as string);
    sendSuccess(res, null, 'Activity deleted successfully');
  });

  // ─── Timeline Handler ─────────────────────────────────────────────────────
  getTimeline = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const timeline = await this.leadsService.getTimeline(req.params.uuid as string);
    sendSuccess(res, timeline, 'Lead timeline retrieved successfully');
  });
}
