import { Op } from 'sequelize';
import { Lead, LeadNote, LeadFollowUp, LeadActivity, User, AuditLog } from '../models';
import { CreateLeadDto, UpdateLeadDto, CreateLeadNoteDto, CreateLeadFollowUpDto, UpdateLeadFollowUpDto, CreateLeadActivityDto } from './leads.types';

export class LeadsRepository {
  private get leadIncludes() {
    return [
      { model: User, as: 'assignee', attributes: ['id', 'uuid', 'first_name', 'last_name'] },
      { model: User, as: 'creator', attributes: ['id', 'uuid', 'first_name', 'last_name'] },
    ];
  }

  // ─── Lead Operations ──────────────────────────────────────────────────────
  async findAll(options: { limit: number; offset: number; search?: string; status?: string; source?: string; assigned_to?: number }): Promise<{ rows: Lead[]; count: number }> {
    const where: Record<string, any> = {};

    if (options.search) {
      where[Op.or as any] = [
        { first_name: { [Op.like]: `%${options.search}%` } },
        { last_name: { [Op.like]: `%${options.search}%` } },
        { email: { [Op.like]: `%${options.search}%` } },
        { company_name: { [Op.like]: `%${options.search}%` } },
      ];
    }

    if (options.status) where.status = options.status;
    if (options.source) where.source = options.source;
    if (options.assigned_to) where.assigned_to = options.assigned_to;

    return Lead.findAndCountAll({
      where,
      include: this.leadIncludes,
      limit: options.limit,
      offset: options.offset,
      order: [['created_at', 'DESC']],
      distinct: true,
    });
  }

  async findByUuid(uuid: string): Promise<Lead | null> {
    return Lead.findOne({
      where: { uuid },
      include: this.leadIncludes,
    });
  }

  async findById(id: number): Promise<Lead | null> {
    return Lead.findByPk(id);
  }

  async existsByEmail(email: string, excludeId?: number): Promise<boolean> {
    if (!email) return false;
    const where: Record<string, any> = { email };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    return (await Lead.count({ where })) > 0;
  }

  async create(dto: CreateLeadDto, creatorId: number): Promise<Lead> {
    return Lead.create({
      ...dto,
      created_by: creatorId,
    } as any);
  }

  async update(id: number, dto: UpdateLeadDto): Promise<void> {
    await Lead.update(dto, { where: { id } });
  }

  async assign(id: number, assigneeId: number): Promise<void> {
    await Lead.update({ assigned_to: assigneeId }, { where: { id } });
  }

  async delete(id: number): Promise<void> {
    await Lead.destroy({ where: { id } });
  }

  // ─── Lead Note Operations ─────────────────────────────────────────────────
  async findNoteByUuid(uuid: string): Promise<LeadNote | null> {
    return LeadNote.findOne({ where: { uuid } });
  }

  async findNotesByLeadId(leadId: number): Promise<LeadNote[]> {
    return LeadNote.findAll({
      where: { lead_id: leadId },
      include: [{ model: User, as: 'author', attributes: ['uuid', 'first_name', 'last_name'] }],
      order: [['created_at', 'DESC']],
    });
  }

  async createNote(leadId: number, userId: number, dto: CreateLeadNoteDto): Promise<LeadNote> {
    return LeadNote.create({
      ...dto,
      lead_id: leadId,
      user_id: userId,
    } as any);
  }

  async deleteNote(id: number): Promise<void> {
    await LeadNote.destroy({ where: { id } });
  }

  // ─── Lead Follow-up Operations ────────────────────────────────────────────
  async findFollowUpByUuid(uuid: string): Promise<LeadFollowUp | null> {
    return LeadFollowUp.findOne({ where: { uuid } });
  }

  async findFollowUpsByLeadId(leadId: number): Promise<LeadFollowUp[]> {
    return LeadFollowUp.findAll({
      where: { lead_id: leadId },
      include: [{ model: User, as: 'author', attributes: ['uuid', 'first_name', 'last_name'] }],
      order: [['followup_date', 'ASC']],
    });
  }

  async createFollowUp(leadId: number, userId: number, dto: CreateLeadFollowUpDto): Promise<LeadFollowUp> {
    return LeadFollowUp.create({
      ...dto,
      lead_id: leadId,
      user_id: userId,
    } as any);
  }

  async updateFollowUp(id: number, dto: UpdateLeadFollowUpDto): Promise<void> {
    await LeadFollowUp.update(dto, { where: { id } });
  }

  async deleteFollowUp(id: number): Promise<void> {
    await LeadFollowUp.destroy({ where: { id } });
  }

  // ─── Lead Activity Operations ─────────────────────────────────────────────
  async findActivityByUuid(uuid: string): Promise<LeadActivity | null> {
    return LeadActivity.findOne({ where: { uuid } });
  }

  async findActivitiesByLeadId(leadId: number): Promise<LeadActivity[]> {
    return LeadActivity.findAll({
      where: { lead_id: leadId },
      include: [{ model: User, as: 'author', attributes: ['uuid', 'first_name', 'last_name'] }],
      order: [['activity_date', 'DESC']],
    });
  }

  async createActivity(leadId: number, userId: number, dto: CreateLeadActivityDto): Promise<LeadActivity> {
    return LeadActivity.create({
      ...dto,
      lead_id: leadId,
      user_id: userId,
    } as any);
  }

  async deleteActivity(id: number): Promise<void> {
    await LeadActivity.destroy({ where: { id } });
  }

  // ─── Lead Timeline / Audit Logs ───────────────────────────────────────────
  async findAuditLogs(entityId: number): Promise<AuditLog[]> {
    return AuditLog.findAll({
      where: {
        entity_type: 'Lead',
        entity_id: entityId,
      },
      include: [{ model: User, as: 'user', attributes: ['uuid', 'first_name', 'last_name'] }],
      order: [['created_at', 'DESC']],
    });
  }
}
