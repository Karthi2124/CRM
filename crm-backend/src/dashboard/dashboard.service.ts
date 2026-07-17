import { Op, fn, col } from 'sequelize';
import {
  Invoice, Opportunity, Lead, Task, OpportunityStage,
} from '../models';
import { KpiSummary, ChartDataPayload } from './dashboard.types';

export async function getKpiSummary(): Promise<KpiSummary> {
  // 1. Total Revenue (sum of amount_paid from invoices)
  const revenueResult = await Invoice.findOne({
    attributes: [
      [fn('SUM', col('amount_paid')), 'totalRevenue'],
    ],
    raw: true,
  });
  const totalRevenue = Number((revenueResult as any)?.totalRevenue || 0);

  // 2. Open Opportunities Value (stages that are not Closed Won or Closed Lost)
  const activeStages = await OpportunityStage.findAll({
    where: {
      name: {
        [Op.notIn]: ['Closed Won', 'Closed Lost'],
      },
    },
    attributes: ['id'],
  });
  const activeStageIds = activeStages.map((s) => s.id);

  const pipelineResult = await Opportunity.findOne({
    where: {
      opportunity_stage_id: activeStageIds,
    },
    attributes: [
      [fn('SUM', col('value')), 'totalValue'],
    ],
    raw: true,
  });
  const openOpportunitiesValue = Number((pipelineResult as any)?.totalValue || 0);

  // 3. Active Leads Count (status is NOT 'disqualified' or 'converted')
  const activeLeadsCount = await Lead.count({
    where: {
      status: {
        [Op.notIn]: ['disqualified', 'converted'],
      },
    },
  });

  // 4. Pending Tasks Count (status is NOT 'completed')
  const pendingTasksCount = await Task.count({
    where: {
      status: {
        [Op.notIn]: ['completed'],
      },
    },
  });

  return {
    totalRevenue: Number(totalRevenue.toFixed(2)),
    openOpportunitiesValue: Number(openOpportunitiesValue.toFixed(2)),
    activeLeadsCount,
    pendingTasksCount,
  };
}

export async function getChartData(): Promise<ChartDataPayload> {
  // 1. Monthly Revenue Trend (Last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const invoices = await Invoice.findAll({
    where: {
      created_at: {
        [Op.gte]: sixMonthsAgo,
      },
    },
    attributes: [
      'created_at',
      'amount_paid',
      'balance_due',
    ],
    order: [['created_at', 'ASC']],
  });

  // Group by Month (YYYY-MM) in JS to be DB-agnostic (works on both MySQL & SQLite)
  const monthlyMap: Record<string, { revenue: number; pending: number }> = {};
  
  // Initialize last 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap[key] = { revenue: 0, pending: 0 };
  }

  invoices.forEach((inv) => {
    const d = new Date(inv.created_at || (inv as any).createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyMap[key]) {
      monthlyMap[key].revenue += Number(inv.amount_paid);
      monthlyMap[key].pending += Number(inv.balance_due);
    }
  });

  const revenueTrend = Object.entries(monthlyMap).map(([month, data]) => ({
    month,
    revenue: Number(data.revenue.toFixed(2)),
    pending: Number(data.pending.toFixed(2)),
  }));

  // 2. Lead Sources distribution
  const leadSourcesData = await Lead.findAll({
    attributes: [
      'source',
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['source'],
    raw: true,
  });

  const leadSources = leadSourcesData.map((ls: any) => ({
    source: ls.source || 'Unknown',
    count: Number(ls.count),
  }));

  // 3. Opportunity Pipeline by Stage
  const pipelineData = await Opportunity.findAll({
    attributes: [
      'opportunity_stage_id',
      [fn('SUM', col('value')), 'totalValue'],
      [fn('COUNT', col('id')), 'count'],
    ],
    include: [
      {
        model: OpportunityStage,
        as: 'stage',
        attributes: ['name'],
      },
    ],
    group: ['opportunity_stage_id', 'stage.id', 'stage.name'],
    raw: true,
  });

  const opportunityPipeline = pipelineData.map((p: any) => ({
    stage: p['stage.name'] || 'Unassigned',
    value: Number(Number(p.totalValue || 0).toFixed(2)),
    count: Number(p.count),
  }));

  // 4. Task Breakdown by status
  const taskData = await Task.findAll({
    attributes: [
      'status',
      [fn('COUNT', col('id')), 'count'],
    ],
    group: ['status'],
    raw: true,
  });

  const taskBreakdown = taskData.map((t: any) => ({
    status: t.status,
    count: Number(t.count),
  }));

  return {
    revenueTrend,
    leadSources,
    opportunityPipeline,
    taskBreakdown,
  };
}
