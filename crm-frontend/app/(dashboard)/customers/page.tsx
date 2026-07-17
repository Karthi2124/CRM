"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { customersApi } from "@/lib/api";
import { Customer } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { statusBadge } from "@/components/ui/Badge";
import { useToast } from "@/lib/providers";

export default function CustomersPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "", company_name: "", type: "individual", status: "prospect" });

  const { data, isLoading } = useQuery({
    queryKey: ["customers", page, search],
    queryFn: () => customersApi.list({ page, limit: 15, search }),
  });

  const rows = (data?.data?.data ?? []) as Customer[];
  const pagination = data?.data?.pagination;

  const saveMutation = useMutation({
    mutationFn: () =>
      editing ? customersApi.update(editing.id, form) : customersApi.create(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      success(editing ? "Customer updated" : "Customer created");
      setModalOpen(false);
      setEditing(null);
      setForm({ first_name: "", last_name: "", email: "", phone: "", company_name: "", type: "individual", status: "prospect" });
    },
    onError: () => toastError("Failed to save customer"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => customersApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["customers"] }); success("Customer deleted"); },
    onError: () => toastError("Failed to delete customer"),
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ first_name: "", last_name: "", email: "", phone: "", company_name: "", type: "individual", status: "prospect" });
    setModalOpen(true);
  };
  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({ first_name: c.first_name, last_name: c.last_name, email: c.email ?? "", phone: c.phone ?? "", company_name: c.company_name ?? "", type: c.type, status: c.status });
    setModalOpen(true);
  };

  const columns = [
    { key: "name", label: "Name", render: (r: Customer) => <span className="cell-primary">{r.first_name} {r.last_name}</span> },
    { key: "company_name", label: "Company", render: (r: Customer) => r.company_name ?? <span className="text-muted">—</span> },
    { key: "email", label: "Email", render: (r: Customer) => r.email ?? <span className="text-muted">—</span> },
    { key: "type", label: "Type", render: (r: Customer) => <span className="badge badge-info">{r.type}</span> },
    { key: "status", label: "Status", render: (r: Customer) => statusBadge(r.status) },
    {
      key: "actions", label: "", width: "80px",
      render: (r: Customer) => (
        <div className="flex-gap-2">
          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(r)} title="Edit"><Pencil size={14} /></button>
          <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteMutation.mutate(r.id)} title="Delete"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage your customer relationships"
        action={<Button onClick={openCreate}><Plus size={15} /> Add Customer</Button>}
      />

      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={15} className="search-icon" />
          <input className="form-input" placeholder="Search customers…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
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
        title={editing ? "Edit Customer" : "New Customer"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>
              {editing ? "Save Changes" : "Create Customer"}
            </Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="grid-2">
            <Input label="First Name" value={form.first_name} onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))} required />
            <Input label="Last Name" value={form.last_name} onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))} required />
          </div>
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))} />
          <Input label="Company Name" value={form.company_name} onChange={(e) => setForm(f => ({ ...f, company_name: e.target.value }))} />
          <div className="grid-2">
            <Select label="Type" value={form.type} onChange={(e) => setForm(f => ({ ...f, type: e.target.value }))} options={[{ value: "individual", label: "Individual" }, { value: "business", label: "Business" }]} />
            <Select label="Status" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} options={[{ value: "prospect", label: "Prospect" }, { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
