import { LeadsRepository } from './leads.repository';
import { CreateLeadDto, UpdateLeadDto, LeadListQuery, CreateLeadNoteDto, CreateLeadFollowUpDto, UpdateLeadFollowUpDto, CreateLeadActivityDto, AssignLeadDto, LeadTimelineEvent } from './leads.types';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/error.helper';
import { parsePagination, buildPaginationMeta } from '../utils/response.helper';
import logger from '../utils/logger';

export class LeadsService {
  constructor(private readonly leadsRepository: LeadsRepository) {}

  // ─── Lead Profiles ────────────────────────────────────────────────────────
  async listLeads(query: LeadListQuery) {
    const { page, limit, offset } = parsePagination(query);

    const assignedTo = query.assigned_to ? Number(query.assigned_to) : undefined;

    const { rows, count } = await this.leadsRepository.findAll({
      limit,
      offset,
      search: query.search,
      status: query.status,
      source: query.source,
      assigned_to: assignedTo,
    });

    const data = rows.map((l) => ({
      id: l.id,
      uuid: l.uuid,
      first_name: l.first_name,
      last_name: l.last_name,
      full_name: `${l.first_name} ${l.last_name}`,
      company_name: l.company_name,
      email: l.email,
      phone: l.phone,
      source: l.source,
      status: l.status,
      value: l.value,
      assignee: l.assigned_to ? (l as any).assignee : null,
      created_at: l.created_at,
    }));

    return { data, meta: buildPaginationMeta(count, page, limit) };
  }

  async getLeadByUuid(uuid: string) {
    const lead = await this.leadsRepository.findByUuid(uuid);
    if (!lead) throw new NotFoundError('Lead');
    return lead;
  }

  async createLead(dto: CreateLeadDto, creatorId: number) {
    if (dto.email) {
      const emailExists = await this.leadsRepository.existsByEmail(dto.email);
      if (emailExists) throw new ConflictError(`Lead email "${dto.email}" is already registered`);
    }

    const lead = await this.leadsRepository.create(dto, creatorId);
    logger.info(`Lead created: "${lead.first_name} ${lead.last_name}" (ID: ${lead.id}) by User ID: ${creatorId}`);
    return lead;
  }

  async updateLead(uuid: string, dto: UpdateLeadDto) {
    const lead = await this.getLeadByUuid(uuid);

    if (dto.email && dto.email !== lead.email) {
      const emailExists = await this.leadsRepository.existsByEmail(dto.email, lead.id);
      if (emailExists) throw new ConflictError(`Lead email "${dto.email}" is already registered`);
    }

    await this.leadsRepository.update(lead.id, dto);
    logger.info(`Lead updated: "${lead.first_name} ${lead.last_name}" (ID: ${lead.id})`);
    return this.getLeadByUuid(uuid);
  }

  async assignLead(uuid: string, dto: AssignLeadDto) {
    const lead = await this.getLeadByUuid(uuid);
    await this.leadsRepository.assign(lead.id, dto.assigned_to);
    logger.info(`Lead ID: ${lead.id} assigned to User ID: ${dto.assigned_to}`);
    return this.getLeadByUuid(uuid);
  }

  async deleteLead(uuid: string) {
    const lead = await this.getLeadByUuid(uuid);
    await this.leadsRepository.delete(lead.id);
    logger.info(`Lead deleted: "${lead.first_name} ${lead.last_name}" (ID: ${lead.id})`);
  }

  // ─── Lead Note Logic ──────────────────────────────────────────────────────
  async listNotes(leadUuid: string) {
    const lead = await this.getLeadByUuid(leadUuid);
    return this.leadsRepository.findNotesByLeadId(lead.id);
  }

  async addNote(leadUuid: string, userId: number, dto: CreateLeadNoteDto) {
    const lead = await this.getLeadByUuid(leadUuid);
    const note = await this.leadsRepository.createNote(lead.id, userId, dto);
    logger.info(`Note added to Lead ID: ${lead.id} (Note ID: ${note.id}) by User ID: ${userId}`);
    return note;
  }

  async deleteNote(noteUuid: string) {
    const note = await this.leadsRepository.findNoteByUuid(noteUuid);
    if (!note) throw new NotFoundError('Note');

    await this.leadsRepository.deleteNote(note.id);
    logger.info(`Note deleted (ID: ${note.id})`);
  }

  // ─── Lead Follow-up Logic ─────────────────────────────────────────────────
  async listFollowUps(leadUuid: string) {
    const lead = await this.getLeadByUuid(leadUuid);
    return this.leadsRepository.findFollowUpsByLeadId(lead.id);
  }

  async addFollowUp(leadUuid: string, userId: number, dto: CreateLeadFollowUpDto) {
    const lead = await this.getLeadByUuid(leadUuid);

    const fdate = new Date(dto.followup_date);
    if (fdate.getTime() < Date.now()) {
      throw new BadRequestError('Follow-up date must be in the future');
    }

    const followup = await this.leadsRepository.createFollowUp(lead.id, userId, dto);
    logger.info(`Follow-up created for Lead ID: ${lead.id} (ID: ${followup.id})`);
    return followup;
  }

  async updateFollowUp(uuid: string, dto: UpdateLeadFollowUpDto) {
    const followup = await this.leadsRepository.findFollowUpByUuid(uuid);
    if (!followup) throw new NotFoundError('Follow-up');

    if (dto.followup_date) {
      const fdate = new Date(dto.followup_date);
      if (fdate.getTime() < Date.now()) {
        throw new BadRequestError('Follow-up date must be in the future');
      }
    }

    await this.leadsRepository.updateFollowUp(followup.id, dto);
    logger.info(`Follow-up updated (ID: ${followup.id})`);
    return this.leadsRepository.findFollowUpByUuid(uuid);
  }

  async deleteFollowUp(uuid: string) {
    const followup = await this.leadsRepository.findFollowUpByUuid(uuid);
    if (!followup) throw new NotFoundError('Follow-up');

    await this.leadsRepository.deleteFollowUp(followup.id);
    logger.info(`Follow-up deleted (ID: ${followup.id})`);
  }

  // ─── Lead Activity Logic ──────────────────────────────────────────────────
  async listActivities(leadUuid: string) {
    const lead = await this.getLeadByUuid(leadUuid);
    return this.leadsRepository.findActivitiesByLeadId(lead.id);
  }

  async addActivity(leadUuid: string, userId: number, dto: CreateLeadActivityDto) {
    const lead = await this.getLeadByUuid(leadUuid);
    const activity = await this.leadsRepository.createActivity(lead.id, userId, dto);
    logger.info(`Activity (${dto.type}) added to Lead ID: ${lead.id} (ID: ${activity.id})`);
    return activity;
  }

  async deleteActivity(uuid: string) {
    const activity = await this.leadsRepository.findActivityByUuid(uuid);
    if (!activity) throw new NotFoundError('Activity');

    await this.leadsRepository.deleteActivity(activity.id);
    logger.info(`Activity deleted (ID: ${activity.id})`);
  }

  // ─── Lead Timeline Aggregation ───────────────────────────────────────────
  async getTimeline(leadUuid: string): Promise<LeadTimelineEvent[]> {
    const lead = await this.getLeadByUuid(leadUuid);

    const notes = await this.leadsRepository.findNotesByLeadId(lead.id);
    const followups = await this.leadsRepository.findFollowUpsByLeadId(lead.id);
    const activities = await this.leadsRepository.findActivitiesByLeadId(lead.id);
    const auditLogs = await this.leadsRepository.findAuditLogs(lead.id);

    const timeline: LeadTimelineEvent[] = [];

    // Map Notes
    notes.forEach((n) => {
      timeline.push({
        id: n.id,
        type: 'note',
        event_name: 'Lead Note Added',
        description: n.note,
        user: n.author ? {
          uuid: (n.author as any).uuid,
          first_name: (n.author as any).first_name,
          last_name: (n.author as any).last_name,
        } : null,
        date: n.created_at,
      });
    });

    // Map Followups
    followups.forEach((f) => {
      timeline.push({
        id: f.id,
        type: 'followup',
        event_name: `Follow-up ${f.status.toUpperCase()}`,
        description: `Scheduled for ${f.followup_date.toLocaleString()}.${f.remarks ? ' Remarks: ' + f.remarks : ''}`,
        user: f.author ? {
          uuid: (f.author as any).uuid,
          first_name: (f.author as any).first_name,
          last_name: (f.author as any).last_name,
        } : null,
        date: f.created_at,
      });
    });

    // Map Activities
    activities.forEach((a) => {
      timeline.push({
        id: a.id,
        type: 'activity',
        event_name: `Activity: ${a.type.toUpperCase()}`,
        description: a.details,
        user: a.author ? {
          uuid: (a.author as any).uuid,
          first_name: (a.author as any).first_name,
          last_name: (a.author as any).last_name,
        } : null,
        date: a.activity_date,
      });
    });

    // Map AuditLogs
    auditLogs.forEach((log) => {
      timeline.push({
        id: log.id,
        type: 'audit_log',
        event_name: `Lead ${log.action.toUpperCase()}`,
        description: `Lead profile was ${log.action}d.`,
        user: log.user ? {
          uuid: (log.user as any).uuid,
          first_name: (log.user as any).first_name,
          last_name: (log.user as any).last_name,
        } : null,
        date: log.created_at,
      });
    });

    // Sort descending by date
    return timeline.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
}
