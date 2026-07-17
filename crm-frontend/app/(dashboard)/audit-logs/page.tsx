"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { auditLogsApi } from "@/lib/api";
import { AuditLog } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Select } from "@/components/ui/Input";
import { format } from "date-fns";

const MODULES = ["", "auth", "customers", "leads", "opportunities", "products", "quotations", "invoices", "tasks", "calendar", "notifications", "files", "audit_logs", "settings", "users", "roles"];

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [module, setModule] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", page, module],
    queryFn: () => auditLogsApi.list({ page, limit: 20, module: module || undefined }),
  });

  const rows = (data?.data?.data ?? []) as AuditLog[];
  const pagination = data?.data?.pagination;

  const columns = [
    { key: "action", label: "Action", render: (r: AuditLog) => <span className="cell-primary" style={{ textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "0.04em" }}>{r.action}</span> },
    { key: "module", label: "Module", render: (r: AuditLog) => <span className="badge badge-info">{r.module}</span> },
    { key: "user", label: "User", render: (r: AuditLog) => r.user ? `${r.user.first_name} ${r.user.last_name}` : <span className="text-muted">System</span> },
    { key: "ip_address", label: "IP Address", render: (r: AuditLog) => r.ip_address ? <code style={{ fontSize: "0.8125rem" }}>{r.ip_address}</code> : <span className="text-muted">—</span> },
    { key: "created_at", label: "Timestamp", render: (r: AuditLog) => format(new Date(r.created_at), "dd MMM yyyy, HH:mm:ss") },
    { key: "details", label: "Details", width: "50px", render: (r: AuditLog) => (
      r.details ? (
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setExpanded(expanded === r.id ? null : r.id)} title="View details">
          {expanded === r.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      ) : null
    )},
  ];

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="Monitor system activity and compliance trail" />

      <div className="filter-bar">
        <div style={{ minWidth: "180px" }}>
          <Select
            value={module}
            onChange={(e) => { setModule(e.target.value); setPage(1); }}
            options={MODULES.filter(m => m).map(m => ({ value: m, label: m.charAt(0).toUpperCase() + m.slice(1) }))}
            placeholder="All Modules"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows as unknown as Record<string, unknown>[]}
        loading={isLoading}
        pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined}
        emptyMessage="No audit logs found"
      />

      {/* Detail Drawer */}
      {expanded && (
        <div className="glass-card" style={{ marginTop: "1rem", padding: "1.25rem" }}>
          <div className="font-semibold text-sm" style={{ marginBottom: "0.75rem", color: "var(--text-secondary)" }}>
            Event Details
          </div>
          <pre style={{ fontSize: "0.8125rem", color: "var(--accent-cyan)", overflow: "auto", lineHeight: 1.7 }}>
            {JSON.stringify(rows.find(r => r.id === expanded)?.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
