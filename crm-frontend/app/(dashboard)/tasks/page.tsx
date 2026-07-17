"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { tasksApi } from "@/lib/api";
import { Task } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { statusBadge, priorityBadge } from "@/components/ui/Badge";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";

const defaultForm = { title: "", description: "", status: "pending", priority: "medium", due_date: "" };

export default function TasksPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data, isLoading } = useQuery({
    queryKey: ["tasks", page, search],
    queryFn: () => tasksApi.list({ page, limit: 15, search }),
  });

  const rows = (data?.data?.data ?? []) as Task[];
  const pagination = data?.data?.pagination;

  const saveMutation = useMutation({
    mutationFn: () => editing ? tasksApi.update(editing.id, form) : tasksApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks"] }); success(editing ? "Task updated" : "Task created"); setModalOpen(false); setForm(defaultForm); },
    onError: () => toastError("Failed to save task"),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => tasksApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["tasks"] }); success("Task deleted"); },
  });

  const openEdit = (t: Task) => { setEditing(t); setForm({ title: t.title, description: t.description ?? "", status: t.status, priority: t.priority, due_date: t.due_date ?? "" }); setModalOpen(true); };

  const columns = [
    { key: "title", label: "Task", render: (r: Task) => <span className="cell-primary">{r.title}</span> },
    { key: "assignee", label: "Assignee", render: (r: Task) => r.assignee ? `${r.assignee.first_name} ${r.assignee.last_name}` : <span className="text-muted">—</span> },
    { key: "priority", label: "Priority", render: (r: Task) => priorityBadge(r.priority) },
    { key: "status", label: "Status", render: (r: Task) => statusBadge(r.status) },
    { key: "due_date", label: "Due Date", render: (r: Task) => r.due_date ? format(new Date(r.due_date), "dd MMM yyyy") : <span className="text-muted">—</span> },
    { key: "actions", label: "", width: "80px", render: (r: Task) => (
      <div className="flex-gap-2">
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteMutation.mutate(r.id)}><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Tasks" subtitle="Track your team tasks and to-dos" action={<Button onClick={() => { setEditing(null); setForm(defaultForm); setModalOpen(true); }}><Plus size={15} /> Add Task</Button>} />
      <div className="filter-bar">
        <div className="search-input-wrap"><Search size={15} className="search-icon" /><input className="form-input" placeholder="Search tasks…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
      </div>
      <DataTable columns={columns} data={rows as unknown as Record<string, unknown>[]} loading={isLoading} pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Task" : "New Task"} footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>{editing ? "Save Changes" : "Create Task"}</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input label="Task Title" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
          <TextArea label="Description" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid-2">
            <Select label="Priority" value={form.priority} onChange={(e) => setForm(f => ({ ...f, priority: e.target.value }))} options={[{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }, { value: "urgent", label: "Urgent" }]} />
            <Select label="Status" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} options={[{ value: "pending", label: "Pending" }, { value: "in_progress", label: "In Progress" }, { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" }]} />
          </div>
          <Input label="Due Date" type="date" value={form.due_date} onChange={(e) => setForm(f => ({ ...f, due_date: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
