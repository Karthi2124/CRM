import { Op } from 'sequelize';
import {
  Lead, Opportunity, OpportunityStage, User, Task, Invoice, Customer,
} from '../models';
import {
  ReportFilters,
  LeadReportItem,
  SalesReportItem,
  TaskReportItem,
  RevenueReportItem,
} from './reports.types';

// Helper to compile date range clauses
function getDateRangeClause(start: string | undefined, end: string | undefined, columnName = 'created_at') {
  const clause: any = {};
  if (start && end) {
    clause[columnName] = {
      [Op.between]: [new Date(`${start}T00:00:00.000Z`), new Date(`${end}T23:59:59.999Z`)],
    };
  } else if (start) {
    clause[columnName] = {
      [Op.gte]: new Date(`${start}T00:00:00.000Z`),
    };
  } else if (end) {
    clause[columnName] = {
      [Op.lte]: new Date(`${end}T23:59:59.999Z`),
    };
  }
  return clause;
}

// ─── Lead Report Service ────────────────────────────────────────────────────────

export async function generateLeadReport(filters: ReportFilters): Promise<LeadReportItem[]> {
  const where: any = {};

  if (filters.user_id) {
    where.assigned_to = filters.user_id;
  }

  const dateClause = getDateRangeClause(filters.start_date, filters.end_date, 'created_at');
  Object.assign(where, dateClause);

  const leads = await Lead.findAll({
    where,
    order: [['created_at', 'DESC']],
  });

  return leads.map((lead) => ({
    id: lead.id,
    uuid: lead.uuid,
    first_name: lead.first_name,
    last_name: lead.last_name,
    company: lead.company_name,
    status: lead.status,
    source: lead.source,
    created_at: lead.created_at.toISOString(),
  }));
}

// ─── Sales Report Service ───────────────────────────────────────────────────────

export async function generateSalesReport(filters: ReportFilters): Promise<SalesReportItem[]> {
  const where: any = {};

  if (filters.user_id) {
    where.assigned_to = filters.user_id;
  }

  const dateClause = getDateRangeClause(filters.start_date, filters.end_date, 'created_at');
  Object.assign(where, dateClause);

  const opportunities = await Opportunity.findAll({
    where,
    include: [
      { model: OpportunityStage, as: 'stage', attributes: ['name'] },
      { model: User, as: 'assignee', attributes: ['first_name', 'last_name'] },
    ],
    order: [['created_at', 'DESC']],
  });

  return opportunities.map((opp) => {
    const ownerName = opp.assignee ? `${opp.assignee.first_name || ''} ${opp.assignee.last_name || ''}`.trim() : 'Unassigned';
    
    let status = 'open';
    if (opp.stage?.name === 'Closed Won') {
      status = 'won';
    } else if (opp.stage?.name === 'Closed Lost') {
      status = 'lost';
    }

    return {
      id: opp.id,
      uuid: opp.uuid,
      name: opp.name,
      value: Number(opp.value),
      status,
      stage_name: opp.stage?.name || 'Unknown',
      owner_name: ownerName,
      closed_at: opp.close_date ? opp.close_date.toISOString() : null,
    };
  });
}

// ─── Task Report Service ────────────────────────────────────────────────────────

export async function generateTaskReport(filters: ReportFilters): Promise<TaskReportItem[]> {
  const where: any = {};

  if (filters.user_id) {
    where.assigned_to = filters.user_id;
  }

  const dateClause = getDateRangeClause(filters.start_date, filters.end_date, 'created_at');
  Object.assign(where, dateClause);

  const tasks = await Task.findAll({
    where,
    include: [
      { model: User, as: 'assignee', attributes: ['first_name', 'last_name'] },
    ],
    order: [['created_at', 'DESC']],
  });

  return tasks.map((task) => {
    const assigneeName = task.assignee ? `${task.assignee.first_name || ''} ${task.assignee.last_name || ''}`.trim() : 'Unassigned';
    return {
      id: task.id,
      uuid: task.uuid,
      title: task.title,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      assigned_to_name: assigneeName,
      created_at: task.created_at.toISOString(),
    };
  });
}

// ─── Revenue Report Service ─────────────────────────────────────────────────────

export async function generateRevenueReport(filters: ReportFilters): Promise<RevenueReportItem[]> {
  const where: any = {};

  if (filters.user_id) {
    where.created_by = filters.user_id;
  }

  // Invoice uses DATEONLY date for creation
  const dateClause: any = {};
  if (filters.start_date && filters.end_date) {
    dateClause.date = {
      [Op.between]: [filters.start_date, filters.end_date],
    };
  } else if (filters.start_date) {
    dateClause.date = {
      [Op.gte]: filters.start_date,
    };
  } else if (filters.end_date) {
    dateClause.date = {
      [Op.lte]: filters.end_date,
    };
  }
  Object.assign(where, dateClause);

  const invoices = await Invoice.findAll({
    where,
    include: [
      { model: Customer, as: 'customer', attributes: ['first_name', 'last_name', 'company_name'] },
    ],
    order: [['date', 'DESC']],
  });

  return invoices.map((inv) => {
    let customerName = 'Unknown Customer';
    if (inv.customer) {
      const personalName = `${inv.customer.first_name || ''} ${inv.customer.last_name || ''}`.trim();
      customerName = inv.customer.company_name || personalName || 'Unknown Customer';
    }

    return {
      invoice_number: inv.invoice_number,
      subject: inv.subject,
      date: inv.date,
      due_date: inv.due_date,
      total: Number(inv.total),
      amount_paid: Number(inv.amount_paid),
      balance_due: Number(inv.balance_due),
      status: inv.status,
      customer_name: customerName,
    };
  });
}
