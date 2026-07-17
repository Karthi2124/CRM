"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { usersApi, rolesApi } from "@/lib/api";
import { User, Role } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { statusBadge } from "@/components/ui/Badge";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";

const defaultForm = { first_name: "", last_name: "", email: "", phone: "", password: "", role_id: "", status: "active" };

export default function UsersPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, search],
    queryFn: () => usersApi.list({ page, limit: 15, search }),
  });

  const { data: rolesData } = useQuery({
    queryKey: ["roles-list"],
    queryFn: () => rolesApi.list(),
  });

  const rows = (data?.data?.data ?? []) as User[];
  const pagination = data?.data?.pagination;
  const roles = (rolesData?.data?.data ?? []) as Role[];

  const saveMutation = useMutation({
    mutationFn: () => editing ? usersApi.update(editing.id, form) : usersApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); success(editing ? "User updated" : "User created"); setModalOpen(false); setForm(defaultForm); },
    onError: () => toastError("Failed to save user"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); success("User deleted"); },
  });

  const openEdit = (u: User) => { setEditing(u); setForm({ first_name: u.first_name, last_name: u.last_name, email: u.email, phone: u.phone ?? "", password: "", role_id: u.role_id ?? "", status: u.status }); setModalOpen(true); };

  const columns = [
    { key: "name", label: "Name", render: (r: User) => (
      <div className="flex-gap-2">
        <div className="avatar">{r.first_name[0]}{r.last_name[0]}</div>
        <div>
          <div className="cell-primary">{r.first_name} {r.last_name}</div>
          <div className="text-xs text-muted">{r.email}</div>
        </div>
      </div>
    )},
    { key: "role", label: "Role", render: (r: User) => r.role ? <span className="badge badge-primary">{r.role.name}</span> : <span className="text-muted">—</span> },
    { key: "status", label: "Status", render: (r: User) => statusBadge(r.status) },
    { key: "created_at", label: "Joined", render: (r: User) => format(new Date(r.created_at), "dd MMM yyyy") },
    { key: "actions", label: "", width: "80px", render: (r: User) => (
      <div className="flex-gap-2">
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteMutation.mutate(r.id)}><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage system users and access" action={<Button onClick={() => { setEditing(null); setForm(defaultForm); setModalOpen(true); }}><Plus size={15} /> Add User</Button>} />
      <div className="filter-bar">
        <div className="search-input-wrap"><Search size={15} className="search-icon" /><input className="form-input" placeholder="Search users…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
      </div>
      <DataTable columns={columns} data={rows as unknown as Record<string, unknown>[]} loading={isLoading} pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit User" : "New User"} footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>{editing ? "Save Changes" : "Create User"}</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="grid-2">
            <Input label="First Name" value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} required />
            <Input label="Last Name" value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} required />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
          {!editing && <Input label="Password" type="password" value={form.password} onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))} required />}
          <div className="grid-2">
            <Select label="Role" value={form.role_id} onChange={(e) => setForm(f => ({ ...f, role_id: e.target.value }))} options={roles.map(r => ({ value: r.id, label: r.name }))} placeholder="Select role" />
            <Select label="Status" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "suspended", label: "Suspended" }]} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
