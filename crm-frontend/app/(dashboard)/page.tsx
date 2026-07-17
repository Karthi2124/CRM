"use client";

import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  TrendingUp, Users, Target, CheckSquare, DollarSign,
} from "lucide-react";
import { dashboardApi } from "@/lib/api";
import { DashboardKPIs, ChartData } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { CardSkeleton, Skeleton } from "@/components/ui/Skeleton";

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KPICard({
  label, value, icon, gradient, trend, trendLabel,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  trend?: number;
  trendLabel?: string;
}) {
  return (
    <div className="kpi-card">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div className={`kpi-icon ${gradient}`}>{icon}</div>
        {trend !== undefined && (
          <span className={`kpi-trend ${trend >= 0 ? "up" : "down"}`}>
            <TrendingUp size={12} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
        {trendLabel && <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>{trendLabel}</div>}
      </div>
    </div>
  );
}

// ─── Chart Colors ──────────────────────────────────────────────────────────────
const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: kpisRes, isLoading: kpisLoading } = useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: () => dashboardApi.kpis(),
  });

  const { data: chartsRes, isLoading: chartsLoading } = useQuery({
    queryKey: ["dashboard-charts"],
    queryFn: () => dashboardApi.charts(),
  });

  const kpis = kpisRes?.data?.data as DashboardKPIs | undefined;
  const charts = chartsRes?.data?.data as ChartData | undefined;

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your CRM performance metrics"
      />

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpisLoading ? (
          Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
        ) : (
          <>
            <KPICard
              label="Total Revenue"
              value={formatCurrency(kpis?.totalRevenue ?? 0)}
              icon={<DollarSign size={19} color="white" />}
              gradient="gradient-indigo"
              trend={kpis?.revenueGrowth}
              trendLabel="vs last month"
            />
            <KPICard
              label="Total Leads"
              value={kpis?.totalLeads ?? 0}
              icon={<Target size={19} color="white" />}
              gradient="gradient-emerald"
              trend={kpis?.leadsGrowth}
              trendLabel="vs last month"
            />
            <KPICard
              label="Open Opportunities"
              value={kpis?.openOpportunities ?? 0}
              icon={<TrendingUp size={19} color="white" />}
              gradient="gradient-amber"
            />
            <KPICard
              label="Tasks Due Today"
              value={kpis?.tasksDueToday ?? 0}
              icon={<CheckSquare size={19} color="white" />}
              gradient="gradient-cyan"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Revenue Line Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Monthly Revenue</div>
          </div>
          {chartsLoading ? (
            <Skeleton style={{ height: "220px" }} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={charts?.monthlyRevenue ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                  }}
                  formatter={(v) => [formatCurrency(Number(v)), "Revenue"]}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366f1", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Leads by Status Pie */}
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">Leads by Status</div>
          </div>
          {chartsLoading ? (
            <Skeleton style={{ height: "220px", borderRadius: "50%" }} />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={charts?.leadsByStatus ?? []}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={48}
                  paddingAngle={3}
                >
                  {(charts?.leadsByStatus ?? []).map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-default)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Tasks by Status Bar */}
      <div className="chart-card" style={{ marginTop: "1rem" }}>
        <div className="chart-header">
          <div className="chart-title">Opportunities by Stage</div>
        </div>
        {chartsLoading ? (
          <Skeleton style={{ height: "180px" }} />
        ) : (
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            {(charts?.opportunitiesByStage ?? []).map((item, idx) => (
              <div
                key={item.stage}
                style={{
                  flex: "1 1 120px",
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.875rem",
                  borderLeft: `3px solid ${CHART_COLORS[idx % CHART_COLORS.length]}`,
                }}
              >
                <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "var(--text-primary)" }}>
                  {item.count}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {item.stage}
                </div>
                {item.value > 0 && (
                  <div style={{ fontSize: "0.6875rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    {formatCurrency(item.value)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
