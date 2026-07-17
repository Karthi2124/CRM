"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { leadsApi } from "@/lib/api";
import { Lead } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { statusBadge, priorityBadge } from "@/components/ui/Badge";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";

const defaultForm = { title: "", first_name: "", last_name: "", email: "", phone: "", company: "", source: "", status: "new", priority: "medium", estimated_value: "" };

export default function LeadsPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data, isLoading } = useQuery({
    queryKey: ["leads", page, search],
    queryFn: () => leadsApi.list({ page, limit: 15, search }),
  });

  const rows = (data?.data?.data ?? []) as Lead[];
  const pagination = data?.data?.pagination;

  const saveMutation = useMutation({
    mutationFn: () => editing ? leadsApi.update(editing.id, form) : leadsApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); success(editing ? "Lead updated" : "Lead created"); setModalOpen(false); setEditing(null); setForm(defaultForm); },
    onError: () => toastError("Failed to save lead"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); success("Lead deleted"); },
    onError: () => toastError("Failed to delete lead"),
  });

  const openCreate = () => { setEditing(null); setForm(defaultForm); setModalOpen(true); };
  const openEdit = (l: Lead) => {
    setEditing(l);
    setForm({ title: l.title, first_name: l.first_name, last_name: l.last_name, email: l.email ?? "", phone: l.phone ?? "", company: l.company ?? "", source: l.source ?? "", status: l.status, priority: l.priority, estimated_value: String(l.estimated_value ?? "") });
    setModalOpen(true);
  };

  const columns = [
    { key: "title", label: "Lead Title", render: (r: Lead) => <span className="cell-primary">{r.title}</span> },
    { key: "name", label: "Contact", render: (r: Lead) => `${r.first_name} ${r.last_name}` },
    { key: "company", label: "Company", render: (r: Lead) => r.company ?? <span className="text-muted">—</span> },
    { key: "source", label: "Source", render: (r: Lead) => r.source ? <span className="badge badge-neutral">{r.source}</span> : <span className="text-muted">—</span> },
    { key: "priority", label: "Priority", render: (r: Lead) => priorityBadge(r.priority) },
    { key: "status", label: "Status", render: (r: Lead) => statusBadge(r.status) },
    { key: "created_at", label: "Created", render: (r: Lead) => format(new Date(r.created_at), "dd MMM yyyy") },
    { key: "actions", label: "", width: "80px", render: (r: Lead) => (
      <div className="flex-gap-2">
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteMutation.mutate(r.id)}><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Leads" subtitle="Track and manage your sales leads" action={<Button onClick={openCreate}><Plus size={15} /> Add Lead</Button>} />
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={15} className="search-icon" />
          <input className="form-input" placeholder="Search leads…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>
      <DataTable columns={columns} data={rows as unknown as Record<string, unknown>[]} loading={isLoading} pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Lead" : "New Lead"} footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>{editing ? "Save Changes" : "Create Lead"}</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input label="Lead Title" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
          <div className="grid-2">
            <Input label="First Name" value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} required />
            <Input label="Last Name" value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} required />
          </div>
          <div className="grid-2">
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="grid-2">
            <Input label="Company" value={form.company} onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))} />
            <Input label="Source" value={form.source} onChange={(e) => setForm(f => ({ ...f, source: e.target.value }))} />
          </div>
          <div className="grid-2">
            <Select label="Priority" value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))} options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }]} />
            <Select label="Status" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} options={[{ value: "new", label: "New" }, { value: "contacted", label: "Contacted" }, { value: "qualified", label: "Qualified" }, { value: "lost", label: "Lost" }]} />
          </div>
          <Input label="Estimated Value (₹)" type="number" value={form.estimated_value} onChange={(e) => setForm(f => ({ ...f, estimated_value: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
