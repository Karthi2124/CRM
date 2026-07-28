"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { opportunitiesApi, customersApi } from "@/lib/api";
import { Opportunity, Customer } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { statusBadge } from "@/components/ui/Badge";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";

const defaultForm = {
  title: "",
  customer_id: "",
  stage_id: "",
  value: "",
  probability: "",
  expected_close_date: "",
  status: "open",
};

export default function OpportunitiesPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [form, setForm] = useState(defaultForm);

  // Fetch opportunities
  const { data, isLoading } = useQuery({
    queryKey: ["opportunities", page, search],
    queryFn: () => opportunitiesApi.list({ page, limit: 15, search }),
  });

  // Fetch stages
  const { data: stagesData } = useQuery({
    queryKey: ["stages-list"],
    queryFn: () => opportunitiesApi.stages(),
  });

  // Fetch customers
  const { data: customersData } = useQuery({
    queryKey: ["customers-list-all"],
    queryFn: () => customersApi.list({ limit: 100 }),
  });

  const rows = (data?.data?.data ?? []) as Opportunity[];
  const pagination = data?.data?.pagination;
  const stages = (stagesData?.data?.data ?? []) as any[];
  const customers = (customersData?.data?.data ?? []) as Customer[];

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.title,
        customer_id: Number(form.customer_id),
        stage_id: Number(form.stage_id),
        value: Number(form.value || 0),
        probability: form.probability ? Number(form.probability) : undefined,
        close_date: form.expected_close_date || undefined,
      };

      const uuid = (editing as any)?.uuid || editing?.id;
      return editing
        ? opportunitiesApi.update(uuid, payload)
        : opportunitiesApi.create(payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["opportunities"] });
      success(editing ? "Opportunity updated" : "Opportunity created");
      setModalOpen(false);
      setEditing(null);
      setForm(defaultForm);
    },
    onError: () => toastError("Failed to save opportunity"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => opportunitiesApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["opportunities"] });
      success("Opportunity deleted");
    },
    onError: () => toastError("Failed to delete opportunity"),
  });

  const openCreate = () => {
    setEditing(null);
    // Auto-select first stage and customer if available
    setForm({
      ...defaultForm,
      stage_id: stages.length > 0 ? String(stages[0].id) : "",
      customer_id: customers.length > 0 ? String(customers[0].id) : "",
    });
    setModalOpen(true);
  };

  const openEdit = (o: Opportunity) => {
    setEditing(o);
    setForm({
      title: o.title || (o as any).name || "",
      customer_id: String((o as any).customer_id || o.customer?.id || ""),
      stage_id: String((o as any).stage_id || (o.stage as any)?.id || ""),
      value: String(o.value ?? ""),
      probability: String(o.probability ?? ""),
      expected_close_date: o.expected_close_date || (o as any).close_date
        ? new Date(o.expected_close_date || (o as any).close_date).toISOString().split('T')[0]
        : "",
      status: o.status || "open",
    });
    setModalOpen(true);
  };

  const columns = [
    { key: "title", label: "Title", render: (r: Opportunity) => <span className="cell-primary">{r.title || (r as any).name}</span> },
    { key: "customer", label: "Customer", render: (r: Opportunity) => r.customer ? `${(r.customer as any).name || `${(r.customer as any).first_name} ${(r.customer as any).last_name}`}` : <span className="text-muted">—</span> },
    { key: "stage", label: "Stage", render: (r: Opportunity) => <span className="badge badge-primary">{typeof r.stage === 'object' ? (r.stage as any)?.name : r.stage}</span> },
    { key: "value", label: "Value", render: (r: Opportunity) => r.value ? `₹${Number(r.value).toLocaleString("en-IN")}` : <span className="text-muted">—</span> },
    { key: "probability", label: "Probability", render: (r: Opportunity) => r.probability != null ? `${r.probability}%` : <span className="text-muted">—</span> },
    {
      key: "status",
      label: "Status",
      render: (r: Opportunity) => {
        const stageName = typeof r.stage === 'object' ? (r.stage as any)?.name : r.stage;
        let inferredStatus = "open";
        if (stageName === "Closed Won") inferredStatus = "won";
        if (stageName === "Closed Lost") inferredStatus = "lost";
        return statusBadge(r.status || inferredStatus);
      }
    },
    {
      key: "expected_close_date",
      label: "Close Date",
      render: (r: Opportunity) => {
        const closeDate = r.expected_close_date || (r as any).close_date;
        return closeDate ? format(new Date(closeDate), "dd MMM yyyy") : <span className="text-muted">—</span>;
      }
    },
    {
      key: "actions",
      label: "",
      width: "80px",
      render: (r: Opportunity) => (
        <div className="flex-gap-2">
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
          <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteMutation.mutate((r as any).uuid || r.id)}><Trash2 size={14} /></button>
        </div>
      )
    },
  ];

  return (
    <div>
      <PageHeader
        title="Opportunities"
        subtitle="Track deals and pipeline stages"
        action={<Button onClick={openCreate}><Plus size={15} /> Add Opportunity</Button>}
      />
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={15} className="search-icon" />
          <input
            className="form-input"
            placeholder="Search opportunities…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={rows as unknown as Record<string, unknown>[]}
        loading={isLoading}
        pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined}
      />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Opportunity" : "New Opportunity"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
              {editing ? "Save Changes" : "Create"}
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
            required
          />
          <Select
            label="Customer"
            value={form.customer_id}
            onChange={(e) => setForm(f => ({ ...f, customer_id: e.target.value }))}
            options={customers.map(c => ({
              value: String(c.id),
              label: c.name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || `Customer #${c.id}`,
            }))}
            required
          />
          <div className="grid-2">
            <Select
              label="Stage"
              value={form.stage_id}
              onChange={(e) => setForm(f => ({ ...f, stage_id: e.target.value }))}
              options={stages.map(s => ({ value: String(s.id), label: s.name }))}
              required
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))}
              options={[
                { value: "open", label: "Open" },
                { value: "won", label: "Won" },
                { value: "lost", label: "Lost" },
              ]}
            />
          </div>
          <div className="grid-2">
            <Input
              label="Value (₹)"
              type="number"
              value={form.value}
              onChange={(e) => setForm(f => ({ ...f, value: e.target.value }))}
            />
            <Input
              label="Probability (%)"
              type="number"
              value={form.probability}
              placeholder="Leave blank to use stage default"
              onChange={(e) => setForm(f => ({ ...f, probability: e.target.value }))}
            />
          </div>
          <Input
            label="Expected Close Date"
            type="date"
            value={form.expected_close_date}
            onChange={(e) => setForm(f => ({ ...f, expected_close_date: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  );
}
