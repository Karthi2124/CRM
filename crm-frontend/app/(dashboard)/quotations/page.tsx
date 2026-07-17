"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, FileDown } from "lucide-react";
import { quotationsApi } from "@/lib/api";
import { Quotation } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { statusBadge } from "@/components/ui/Badge";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";
import { AxiosError } from "axios";

export default function QuotationsPage() {
  const { error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["quotations", page, search],
    queryFn: () => quotationsApi.list({ page, limit: 15, search }),
  });

  const rows = (data?.data?.data ?? []) as Quotation[];
  const pagination = data?.data?.pagination;

  const downloadPDF = async (id: string, num: string) => {
    try {
      const res = await quotationsApi.pdf(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotation-${num}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      const e = err as AxiosError;
      console.error(e);
      toastError("Failed to download PDF");
    }
  };

  const columns = [
    { key: "quotation_number", label: "QID", render: (r: Quotation) => <code style={{ fontSize: "0.8125rem", color: "var(--accent-primary-hover)" }}>{r.quotation_number}</code> },
    { key: "customer", label: "Customer", render: (r: Quotation) => r.customer ? `${r.customer.first_name} ${r.customer.last_name}` : <span className="text-muted">—</span> },
    { key: "subtotal", label: "Subtotal", render: (r: Quotation) => `₹${Number(r.subtotal).toLocaleString("en-IN")}` },
    { key: "total", label: "Total", render: (r: Quotation) => <strong style={{ color: "var(--text-primary)" }}>₹{Number(r.total).toLocaleString("en-IN")}</strong> },
    { key: "status", label: "Status", render: (r: Quotation) => statusBadge(r.status) },
    { key: "valid_until", label: "Valid Until", render: (r: Quotation) => r.valid_until ? format(new Date(r.valid_until), "dd MMM yyyy") : <span className="text-muted">—</span> },
    { key: "created_at", label: "Created", render: (r: Quotation) => format(new Date(r.created_at), "dd MMM yyyy") },
    { key: "actions", label: "", width: "60px", render: (r: Quotation) => (
      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => downloadPDF(r.id, r.quotation_number)} title="Download PDF"><FileDown size={14} /></button>
    )},
  ];

  return (
    <div>
      <PageHeader title="Quotations" subtitle="View and manage customer quotations" />
      <div className="filter-bar">
        <div className="search-input-wrap"><Search size={15} className="search-icon" /><input className="form-input" placeholder="Search quotations…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
      </div>
      <DataTable columns={columns} data={rows as unknown as Record<string, unknown>[]} loading={isLoading} pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined} />
    </div>
  );
}
