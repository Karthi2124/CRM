"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { opportunitiesApi } from "@/lib/api";
import { Opportunity } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { statusBadge } from "@/components/ui/Badge";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";

const STAGES = ["Prospecting","Qualification","Proposal","Negotiation","Closed Won","Closed Lost"];
const defaultForm = { title: "", stage: "Prospecting", value: "", probability: "", expected_close_date: "", status: "open" };

export default function OpportunitiesPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data, isLoading } = useQuery({
    queryKey: ["opportunities", page, search],
    queryFn: () => opportunitiesApi.list({ page, limit: 15, search }),
  });

  const rows = (data?.data?.data ?? []) as Opportunity[];
  const pagination = data?.data?.pagination;

  const saveMutation = useMutation({
    mutationFn: () => editing ? opportunitiesApi.update(editing.id, form) : opportunitiesApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["opportunities"] }); success(editing ? "Opportunity updated" : "Opportunity created"); setModalOpen(false); setForm(defaultForm); },
    onError: () => toastError("Failed to save opportunity"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => opportunitiesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["opportunities"] }); success("Opportunity deleted"); },
  });

  const openEdit = (o: Opportunity) => { setEditing(o); setForm({ title: o.title, stage: o.stage, value: String(o.value ?? ""), probability: String(o.probability ?? ""), expected_close_date: o.expected_close_date ?? "", status: o.status }); setModalOpen(true); };

  const columns = [
    { key: "title", label: "Title", render: (r: Opportunity) => <span className="cell-primary">{r.title}</span> },
    { key: "stage", label: "Stage", render: (r: Opportunity) => <span className="badge badge-primary">{r.stage}</span> },
    { key: "value", label: "Value", render: (r: Opportunity) => r.value ? `₹${Number(r.value).toLocaleString("en-IN")}` : <span className="text-muted">—</span> },
    { key: "probability", label: "Probability", render: (r: Opportunity) => r.probability != null ? `${r.probability}%` : <span className="text-muted">—</span> },
    { key: "status", label: "Status", render: (r: Opportunity) => statusBadge(r.status) },
    { key: "expected_close_date", label: "Close Date", render: (r: Opportunity) => r.expected_close_date ? format(new Date(r.expected_close_date), "dd MMM yyyy") : <span className="text-muted">—</span> },
    { key: "actions", label: "", width: "80px", render: (r: Opportunity) => (
      <div className="flex-gap-2">
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteMutation.mutate(r.id)}><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Opportunities" subtitle="Track deals and pipeline stages" action={<Button onClick={() => { setEditing(null); setForm(defaultForm); setModalOpen(true); }}><Plus size={15} /> Add Opportunity</Button>} />
      <div className="filter-bar">
        <div className="search-input-wrap"><Search size={15} className="search-icon" /><input className="form-input" placeholder="Search opportunities…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
      </div>
      <DataTable columns={columns} data={rows as unknown as Record<string, unknown>[]} loading={isLoading} pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Opportunity" : "New Opportunity"} footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>{editing ? "Save Changes" : "Create"}</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input label="Title" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
          <div className="grid-2">
            <Select label="Stage" value={form.stage} onChange={(e) => setForm(f => ({ ...f, stage: e.target.value }))} options={STAGES.map(s => ({ value: s, label: s }))} />
            <Select label="Status" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} options={[{ value: "open", label: "Open" }, { value: "won", label: "Won" }, { value: "lost", label: "Lost" }]} />
          </div>
          <div className="grid-2">
            <Input label="Value (₹)" type="number" value={form.value} onChange={(e) => setForm(f => ({ ...f, value: e.target.value }))} />
            <Input label="Probability (%)" type="number" value={form.probability} onChange={(e) => setForm(f => ({ ...f, probability: e.target.value }))} />
          </div>
          <Input label="Expected Close Date" type="date" value={form.expected_close_date} onChange={(e) => setForm(f => ({ ...f, expected_close_date: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
