"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, BarChart2 } from "lucide-react";
import { reportsApi } from "@/lib/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Select, Input } from "@/components/ui/Input";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/Skeleton";

const REPORT_TYPES = [
  { value: "sales", label: "Sales Report" },
  { value: "leads", label: "Leads Report" },
  { value: "customers", label: "Customers Report" },
  { value: "tasks", label: "Tasks Report" },
  { value: "revenue", label: "Revenue Report" },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("sales");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const queryFn = {
    sales: reportsApi.sales,
    leads: reportsApi.leads,
    customers: reportsApi.customers,
    tasks: reportsApi.tasks,
    revenue: reportsApi.revenue,
  }[reportType] ?? reportsApi.sales;

  const params = { start_date: startDate || undefined, end_date: endDate || undefined };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["reports", reportType, startDate, endDate],
    queryFn: () => queryFn(params),
  });

  const reportData = (data?.data?.data ?? []) as Record<string, unknown>[];

  const downloadCSV = async () => {
    const res = await queryFn({ ...params, format: "csv" });
    const blob = new Blob([res.data as string], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${reportType}-report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Build chart data from first 2 numeric keys
  const numericKeys = reportData.length > 0
    ? Object.keys(reportData[0]).filter(k => typeof reportData[0][k] === "number")
    : [];
  const labelKey = reportData.length > 0
    ? Object.keys(reportData[0]).find(k => typeof reportData[0][k] === "string") ?? "label"
    : "label";

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Analyze performance across all modules"
        action={
          <Button variant="secondary" onClick={downloadCSV}>
            <Download size={15} /> Export CSV
          </Button>
        }
      />

      {/* Filters */}
      <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1rem" }}>
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ minWidth: "180px" }}>
            <Select
              label="Report Type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              options={REPORT_TYPES}
            />
          </div>
          <div style={{ minWidth: "160px" }}>
            <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div style={{ minWidth: "160px" }}>
            <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <Button onClick={() => refetch()}>Generate</Button>
        </div>
      </div>

      {/* Chart */}
      {isLoading ? (
        <Skeleton style={{ height: "300px" }} />
      ) : reportData.length === 0 ? (
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
          <BarChart2 size={40} style={{ color: "var(--text-muted)", margin: "0 auto 1rem" }} />
          <p style={{ color: "var(--text-muted)" }}>No data for this report. Try adjusting the date range.</p>
        </div>
      ) : (
        <div className="chart-card">
          <div className="chart-header">
            <div className="chart-title">{REPORT_TYPES.find(r => r.value === reportType)?.label}</div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey={labelKey} tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "var(--bg-elevated)", border: "1px solid var(--border-default)", borderRadius: "8px", fontSize: "12px" }}
              />
              <Legend formatter={(v) => <span style={{ color: "var(--text-secondary)", fontSize: "11px" }}>{v}</span>} />
              {numericKeys.slice(0, 3).map((k, i) => (
                <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
