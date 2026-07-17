"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { calendarApi } from "@/lib/api";
import { CalendarEvent } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { statusBadge } from "@/components/ui/Badge";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";

const defaultForm = { title: "", type: "meeting", start_date: "", end_date: "", location: "", description: "", all_day: "false" };

export default function CalendarPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data, isLoading } = useQuery({
    queryKey: ["calendar", page],
    queryFn: () => calendarApi.list({ page, limit: 20 }),
  });

  const rows = (data?.data?.data ?? []) as CalendarEvent[];
  const pagination = data?.data?.pagination;

  const saveMutation = useMutation({
    mutationFn: () => editing ? calendarApi.update(editing.id, form) : calendarApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["calendar"] }); success(editing ? "Event updated" : "Event created"); setModalOpen(false); setForm(defaultForm); },
    onError: () => toastError("Failed to save event"),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => calendarApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["calendar"] }); success("Event deleted"); },
  });

  const openEdit = (e: CalendarEvent) => { setEditing(e); setForm({ title: e.title, type: e.type, start_date: e.start_date, end_date: e.end_date ?? "", location: e.location ?? "", description: e.description ?? "", all_day: String(e.all_day) }); setModalOpen(true); };

  const columns = [
    { key: "title", label: "Event", render: (r: CalendarEvent) => <span className="cell-primary">{r.title}</span> },
    { key: "type", label: "Type", render: (r: CalendarEvent) => <span className="badge badge-info">{r.type}</span> },
    { key: "start_date", label: "Start", render: (r: CalendarEvent) => format(new Date(r.start_date), "dd MMM yyyy, HH:mm") },
    { key: "end_date", label: "End", render: (r: CalendarEvent) => r.end_date ? format(new Date(r.end_date), "dd MMM yyyy, HH:mm") : <span className="text-muted">—</span> },
    { key: "location", label: "Location", render: (r: CalendarEvent) => r.location ?? <span className="text-muted">—</span> },
    { key: "status", label: "Status", render: (r: CalendarEvent) => statusBadge(r.status) },
    { key: "actions", label: "", width: "80px", render: (r: CalendarEvent) => (
      <div className="flex-gap-2">
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteMutation.mutate(r.id)}><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Calendar" subtitle="Schedule meetings and events" action={<Button onClick={() => { setEditing(null); setForm(defaultForm); setModalOpen(true); }}><Plus size={15} /> Add Event</Button>} />
      <DataTable columns={columns} data={rows as unknown as Record<string, unknown>[]} loading={isLoading} pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Event" : "New Event"} footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>{editing ? "Save Changes" : "Create Event"}</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input label="Event Title" value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
          <Select label="Type" value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} options={[{ value: "meeting", label: "Meeting" }, { value: "call", label: "Call" }, { value: "demo", label: "Demo" }, { value: "follow_up", label: "Follow Up" }, { value: "other", label: "Other" }]} />
          <div className="grid-2">
            <Input label="Start Date & Time" type="datetime-local" value={form.start_date} onChange={(e) => setForm(f => ({ ...f, start_date: e.target.value }))} required />
            <Input label="End Date & Time" type="datetime-local" value={form.end_date} onChange={(e) => setForm(f => ({ ...f, end_date: e.target.value }))} />
          </div>
          <Input label="Location" value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} />
          <TextArea label="Description" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
