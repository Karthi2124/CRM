import { Op } from 'sequelize';
import { Opportunity, OpportunityStage, OpportunityCompetitor, OpportunityNote, Customer, Lead, User, AuditLog } from '../models';
import { CreateOpportunityDto, UpdateOpportunityDto, CreateOpportunityCompetitorDto, UpdateOpportunityCompetitorDto, CreateOpportunityNoteDto } from './opportunities.types';

export class OpportunitiesRepository {
  private get opportunityIncludes() {
    return [
      { model: Customer, as: 'customer', attributes: ['id', 'uuid', 'name', 'email', 'phone'] },
      { model: Lead, as: 'lead', attributes: ['id', 'uuid', 'first_name', 'last_name'] },
      { model: OpportunityStage, as: 'stage', attributes: ['id', 'uuid', 'name', 'probability'] },
      { model: User, as: 'assignee', attributes: ['id', 'uuid', 'first_name', 'last_name'] },
      { model: User, as: 'creator', attributes: ['id', 'uuid', 'first_name', 'last_name'] },
    ];
  }

  // ─── Opportunity Operations ───────────────────────────────────────────────
  async findAll(options: { limit: number; offset: number; search?: string; stage_id?: number; assigned_to?: number }): Promise<{ rows: Opportunity[]; count: number }> {
    const where: Record<string, any> = {};

    if (options.search) {
      where[Op.or as any] = [
        { name: { [Op.like]: `%${options.search}%` } },
      ];
    }

    if (options.stage_id) where.stage_id = options.stage_id;
    if (options.assigned_to) where.assigned_to = options.assigned_to;

    return Opportunity.findAndCountAll({
      where,
      include: this.opportunityIncludes,
      limit: options.limit,
      offset: options.offset,
      order: [['created_at', 'DESC']],
      distinct: true,
    });
  }

  async findByUuid(uuid: string): Promise<Opportunity | null> {
    return Opportunity.findOne({
      where: { uuid },
      include: this.opportunityIncludes,
    });
  }

  async findById(id: number): Promise<Opportunity | null> {
    return Opportunity.findByPk(id);
  }

  async create(dto: CreateOpportunityDto, creatorId: number): Promise<Opportunity> {
    const expected_revenue = dto.value * ((dto.probability ?? 10) / 100);
    return Opportunity.create({
      ...dto,
      expected_revenue,
      created_by: creatorId,
    } as any);
  }

  async update(id: number, dto: UpdateOpportunityDto): Promise<void> {
    const data: any = { ...dto };
    if (dto.value !== undefined || dto.probability !== undefined) {
      const opp = await Opportunity.findByPk(id);
      if (opp) {
        const val = dto.value !== undefined ? dto.value : opp.value;
        const prob = dto.probability !== undefined ? dto.probability : opp.probability;
        data.expected_revenue = val * (prob / 100);
      }
    }
    await Opportunity.update(data, { where: { id } });
  }

  async assign(id: number, assigneeId: number): Promise<void> {
    await Opportunity.update({ assigned_to: assigneeId }, { where: { id } });
  }

  async delete(id: number): Promise<void> {
    await Opportunity.destroy({ where: { id } });
  }

  // ─── Stage Operations ─────────────────────────────────────────────────────
  async findStageById(id: number): Promise<OpportunityStage | null> {
    return OpportunityStage.findByPk(id);
  }

  async findAllStages(): Promise<OpportunityStage[]> {
    return OpportunityStage.findAll({ order: [['order', 'ASC']] });
  }

  // ─── Competitor Operations ────────────────────────────────────────────────
  async findCompetitorByUuid(uuid: string): Promise<OpportunityCompetitor | null> {
    return OpportunityCompetitor.findOne({ where: { uuid } });
  }

  async findCompetitorsByOppId(oppId: number): Promise<OpportunityCompetitor[]> {
    return OpportunityCompetitor.findAll({
      where: { opportunity_id: oppId },
      order: [['created_at', 'DESC']],
    });
  }

  async createCompetitor(oppId: number, dto: CreateOpportunityCompetitorDto): Promise<OpportunityCompetitor> {
    return OpportunityCompetitor.create({
      ...dto,
      opportunity_id: oppId,
    } as any);
  }

  async updateCompetitor(id: number, dto: UpdateOpportunityCompetitorDto): Promise<void> {
    await OpportunityCompetitor.update(dto, { where: { id } });
  }

  async deleteCompetitor(id: number): Promise<void> {
    await OpportunityCompetitor.destroy({ where: { id } });
  }

  // ─── Note Operations ──────────────────────────────────────────────────────
  async findNoteByUuid(uuid: string): Promise<OpportunityNote | null> {
    return OpportunityNote.findOne({ where: { uuid } });
  }

  async findNotesByOppId(oppId: number): Promise<OpportunityNote[]> {
    return OpportunityNote.findAll({
      where: { opportunity_id: oppId },
      include: [{ model: User, as: 'author', attributes: ['uuid', 'first_name', 'last_name'] }],
      order: [['created_at', 'DESC']],
    });
  }

  async createNote(oppId: number, userId: number, dto: CreateOpportunityNoteDto): Promise<OpportunityNote> {
    return OpportunityNote.create({
      ...dto,
      opportunity_id: oppId,
      user_id: userId,
    } as any);
  }

  async deleteNote(id: number): Promise<void> {
    await OpportunityNote.destroy({ where: { id } });
  }

  // ─── Timeline Logs ────────────────────────────────────────────────────────
  async findAuditLogs(entityId: number): Promise<AuditLog[]> {
    return AuditLog.findAll({
      where: {
        entity_type: 'Opportunity',
        entity_id: entityId,
      },
      include: [{ model: User, as: 'user', attributes: ['uuid', 'first_name', 'last_name'] }],
      order: [['created_at', 'DESC']],
    });
  }
}
