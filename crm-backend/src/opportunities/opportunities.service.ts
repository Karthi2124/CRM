import { OpportunitiesRepository } from './opportunities.repository';
import { CreateOpportunityDto, UpdateOpportunityDto, OpportunityListQuery, CreateOpportunityCompetitorDto, UpdateOpportunityCompetitorDto, CreateOpportunityNoteDto, AssignOpportunityDto, OpportunityTimelineEvent } from './opportunities.types';
import { NotFoundError } from '../utils/error.helper';
import { parsePagination, buildPaginationMeta } from '../utils/response.helper';
import logger from '../utils/logger';

export class OpportunitiesService {
  constructor(private readonly opportunitiesRepository: OpportunitiesRepository) {}

  // ─── Opportunity Logic ────────────────────────────────────────────────────
  async listOpportunities(query: OpportunityListQuery) {
    const { page, limit, offset } = parsePagination(query);

    const stageId = query.stage_id ? Number(query.stage_id) : undefined;
    const assignedTo = query.assigned_to ? Number(query.assigned_to) : undefined;

    const { rows, count } = await this.opportunitiesRepository.findAll({
      limit,
      offset,
      search: query.search,
      stage_id: stageId,
      assigned_to: assignedTo,
    });

    const data = rows.map((o) => ({
      id: o.id,
      uuid: o.uuid,
      name: o.name,
      customer: o.customer,
      lead: o.lead,
      stage: o.stage,
      value: o.value,
      probability: o.probability,
      expected_revenue: o.expected_revenue,
      close_date: o.close_date,
      assignee: o.assigned_to ? (o as any).assignee : null,
      lost_reason: o.lost_reason,
      win_reason: o.win_reason,
      created_at: o.created_at,
    }));

    return { data, meta: buildPaginationMeta(count, page, limit) };
  }

  async getOpportunityByUuid(uuid: string) {
    const opp = await this.opportunitiesRepository.findByUuid(uuid);
    if (!opp) throw new NotFoundError('Opportunity');
    return opp;
  }

  async createOpportunity(dto: CreateOpportunityDto, creatorId: number) {
    // Validate stage exists
    const stage = await this.opportunitiesRepository.findStageById(dto.stage_id);
    if (!stage) throw new NotFoundError('Opportunity Stage');

    // Default probability from stage if not supplied
    if (dto.probability === undefined) {
      dto.probability = stage.probability;
    }

    const opp = await this.opportunitiesRepository.create(dto, creatorId);
    logger.info(`Opportunity created: "${opp.name}" (ID: ${opp.id}) by User ID: ${creatorId}`);
    return opp;
  }

  async updateOpportunity(uuid: string, dto: UpdateOpportunityDto) {
    const opp = await this.getOpportunityByUuid(uuid);

    if (dto.stage_id) {
      const stage = await this.opportunitiesRepository.findStageById(dto.stage_id);
      if (!stage) throw new NotFoundError('Opportunity Stage');
      if (dto.probability === undefined) {
        dto.probability = stage.probability;
      }
    }

    await this.opportunitiesRepository.update(opp.id, dto);
    logger.info(`Opportunity updated: "${opp.name}" (ID: ${opp.id})`);
    return this.getOpportunityByUuid(uuid);
  }

  async assignOpportunity(uuid: string, dto: AssignOpportunityDto) {
    const opp = await this.getOpportunityByUuid(uuid);
    await this.opportunitiesRepository.assign(opp.id, dto.assigned_to);
    logger.info(`Opportunity ID: ${opp.id} assigned to User ID: ${dto.assigned_to}`);
    return this.getOpportunityByUuid(uuid);
  }

  async deleteOpportunity(uuid: string) {
    const opp = await this.getOpportunityByUuid(uuid);
    await this.opportunitiesRepository.delete(opp.id);
    logger.info(`Opportunity deleted: "${opp.name}" (ID: ${opp.id})`);
  }

  // ─── Stage Logic ──────────────────────────────────────────────────────────
  async listStages() {
    return this.opportunitiesRepository.findAllStages();
  }

  // ─── Competitor Logic ─────────────────────────────────────────────────────
  async listCompetitors(oppUuid: string) {
    const opp = await this.getOpportunityByUuid(oppUuid);
    return this.opportunitiesRepository.findCompetitorsByOppId(opp.id);
  }

  async addCompetitor(oppUuid: string, dto: CreateOpportunityCompetitorDto) {
    const opp = await this.getOpportunityByUuid(oppUuid);
    const comp = await this.opportunitiesRepository.createCompetitor(opp.id, dto);
    logger.info(`Competitor "${dto.competitor_name}" added to Opportunity ID: ${opp.id}`);
    return comp;
  }

  async updateCompetitor(compUuid: string, dto: UpdateOpportunityCompetitorDto) {
    const comp = await this.opportunitiesRepository.findCompetitorByUuid(compUuid);
    if (!comp) throw new NotFoundError('Competitor');

    await this.opportunitiesRepository.updateCompetitor(comp.id, dto);
    logger.info(`Competitor updated (ID: ${comp.id})`);
    return this.opportunitiesRepository.findCompetitorByUuid(compUuid);
  }

  async deleteCompetitor(compUuid: string) {
    const comp = await this.opportunitiesRepository.findCompetitorByUuid(compUuid);
    if (!comp) throw new NotFoundError('Competitor');

    await this.opportunitiesRepository.deleteCompetitor(comp.id);
    logger.info(`Competitor deleted (ID: ${comp.id})`);
  }

  // ─── Note Logic ───────────────────────────────────────────────────────────
  async listNotes(oppUuid: string) {
    const opp = await this.getOpportunityByUuid(oppUuid);
    return this.opportunitiesRepository.findNotesByOppId(opp.id);
  }

  async addNote(oppUuid: string, userId: number, dto: CreateOpportunityNoteDto) {
    const opp = await this.getOpportunityByUuid(oppUuid);
    const note = await this.opportunitiesRepository.createNote(opp.id, userId, dto);
    logger.info(`Note added to Opportunity ID: ${opp.id} by User ID: ${userId}`);
    return note;
  }

  async deleteNote(noteUuid: string) {
    const note = await this.opportunitiesRepository.findNoteByUuid(noteUuid);
    if (!note) throw new NotFoundError('Note');

    await this.opportunitiesRepository.deleteNote(note.id);
    logger.info(`Note deleted (ID: ${note.id})`);
  }

  // ─── Timeline Logic ───────────────────────────────────────────────────────
  async getTimeline(oppUuid: string): Promise<OpportunityTimelineEvent[]> {
    const opp = await this.getOpportunityByUuid(oppUuid);

    const notes = await this.opportunitiesRepository.findNotesByOppId(opp.id);
    const auditLogs = await this.opportunitiesRepository.findAuditLogs(opp.id);

    const timeline: OpportunityTimelineEvent[] = [];

    // Map notes
    notes.forEach((n) => {
      timeline.push({
        id: n.id,
        type: 'note',
        event_name: 'Note Added',
        description: n.note,
        user: n.author ? {
          uuid: (n.author as any).uuid,
          first_name: (n.author as any).first_name,
          last_name: (n.author as any).last_name,
        } : null,
        date: n.created_at,
      });
    });

    // Map AuditLogs
    auditLogs.forEach((log) => {
      timeline.push({
        id: log.id,
        type: 'audit_log',
        event_name: `Opportunity ${log.action.toUpperCase()}`,
        description: `Opportunity details were ${log.action}d.`,
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
