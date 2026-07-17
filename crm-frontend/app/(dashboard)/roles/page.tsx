"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import { rolesApi } from "@/lib/api";
import { Role } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";

const defaultForm = { name: "", description: "" };

export default function RolesPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Role | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rolesApi.list(),
  });

  const rows = (data?.data?.data ?? []) as Role[];

  const saveMutation = useMutation({
    mutationFn: () => editing ? rolesApi.update(editing.id, form) : rolesApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["roles"] }); success(editing ? "Role updated" : "Role created"); setModalOpen(false); setForm(defaultForm); },
    onError: () => toastError("Failed to save role"),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["roles"] }); success("Role deleted"); },
    onError: () => toastError("Cannot delete role that is assigned to users"),
  });

  const openEdit = (r: Role) => { setEditing(r); setForm({ name: r.name, description: r.description ?? "" }); setModalOpen(true); };

  const columns = [
    { key: "name", label: "Role Name", render: (r: Role) => (
      <div className="flex-gap-2">
        <Shield size={15} color="var(--accent-primary)" />
        <span className="cell-primary">{r.name}</span>
      </div>
    )},
    { key: "description", label: "Description", render: (r: Role) => r.description ?? <span className="text-muted">—</span> },
    { key: "permissions", label: "Permissions", render: (r: Role) => (
      <span className="badge badge-info">{r.permissions?.length ?? 0} permissions</span>
    )},
    { key: "created_at", label: "Created", render: (r: Role) => format(new Date(r.created_at), "dd MMM yyyy") },
    { key: "actions", label: "", width: "80px", render: (r: Role) => (
      <div className="flex-gap-2">
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteMutation.mutate(r.id)}><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Roles" subtitle="Manage user roles and permissions" action={<Button onClick={() => { setEditing(null); setForm(defaultForm); setModalOpen(true); }}><Plus size={15} /> Add Role</Button>} />
      <DataTable columns={columns} data={rows as unknown as Record<string, unknown>[]} loading={isLoading} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Role" : "New Role"} footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>{editing ? "Save Changes" : "Create Role"}</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input label="Role Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="Description" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>
      </Modal>
    </div>
  );
}
