// ─── Dashboard Types ────────────────────────────────────────────────────────────

export interface KpiSummary {
  totalRevenue: number;
  openOpportunitiesValue: number;
  activeLeadsCount: number;
  pendingTasksCount: number;
}

export interface RevenueTrendItem {
  month: string; // YYYY-MM
  revenue: number;
  pending: number;
}

export interface LeadSourceDistribution {
  source: string;
  count: number;
}

export interface OpportunityStagePipeline {
  stage: string;
  value: number;
  count: number;
}

export interface TaskStatusBreakdown {
  status: string;
  count: number;
}

export interface ChartDataPayload {
  revenueTrend: RevenueTrendItem[];
  leadSources: LeadSourceDistribution[];
  opportunityPipeline: OpportunityStagePipeline[];
  taskBreakdown: TaskStatusBreakdown[];
}
