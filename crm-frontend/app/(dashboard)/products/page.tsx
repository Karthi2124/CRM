"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { productsApi } from "@/lib/api";
import { Product } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { statusBadge } from "@/components/ui/Badge";
import { useToast } from "@/lib/providers";

const defaultForm = { name: "", sku: "", description: "", unit_price: "", cost_price: "", stock_quantity: "", status: "active" };

export default function ProductsPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(defaultForm);

  const { data, isLoading } = useQuery({
    queryKey: ["products", page, search],
    queryFn: () => productsApi.list({ page, limit: 15, search }),
  });

  const rows = (data?.data?.data ?? []) as Product[];
  const pagination = data?.data?.pagination;

  const saveMutation = useMutation({
    mutationFn: () => editing ? productsApi.update(editing.id, form) : productsApi.create(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); success(editing ? "Product updated" : "Product created"); setModalOpen(false); setForm(defaultForm); },
    onError: () => toastError("Failed to save product"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); success("Product deleted"); },
  });

  const openEdit = (p: Product) => { setEditing(p); setForm({ name: p.name, sku: p.sku ?? "", description: p.description ?? "", unit_price: String(p.unit_price), cost_price: String(p.cost_price ?? ""), stock_quantity: String(p.stock_quantity ?? ""), status: p.status }); setModalOpen(true); };

  const columns = [
    { key: "name", label: "Product", render: (r: Product) => <span className="cell-primary">{r.name}</span> },
    { key: "sku", label: "SKU", render: (r: Product) => r.sku ? <code style={{ fontSize: "0.8125rem", color: "var(--accent-cyan)" }}>{r.sku}</code> : <span className="text-muted">—</span> },
    { key: "unit_price", label: "Price", render: (r: Product) => `₹${Number(r.unit_price).toLocaleString("en-IN")}` },
    { key: "stock_quantity", label: "Stock", render: (r: Product) => r.stock_quantity != null ? r.stock_quantity : <span className="text-muted">—</span> },
    { key: "status", label: "Status", render: (r: Product) => statusBadge(r.status) },
    { key: "actions", label: "", width: "80px", render: (r: Product) => (
      <div className="flex-gap-2">
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(r)}><Pencil size={14} /></button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteMutation.mutate(r.id)}><Trash2 size={14} /></button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader title="Products" subtitle="Manage your product catalog" action={<Button onClick={() => { setEditing(null); setForm(defaultForm); setModalOpen(true); }}><Plus size={15} /> Add Product</Button>} />
      <div className="filter-bar">
        <div className="search-input-wrap"><Search size={15} className="search-icon" /><input className="form-input" placeholder="Search products…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
      </div>
      <DataTable columns={columns} data={rows as unknown as Record<string, unknown>[]} loading={isLoading} pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined} />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "New Product"} footer={<><Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button><Button loading={saveMutation.isPending} onClick={() => saveMutation.mutate()}>{editing ? "Save Changes" : "Create Product"}</Button></>}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Input label="Product Name" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
          <Input label="SKU" value={form.sku} onChange={(e) => setForm(f => ({ ...f, sku: e.target.value }))} />
          <TextArea label="Description" value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="grid-2">
            <Input label="Unit Price (₹)" type="number" value={form.unit_price} onChange={(e) => setForm(f => ({ ...f, unit_price: e.target.value }))} required />
            <Input label="Cost Price (₹)" type="number" value={form.cost_price} onChange={(e) => setForm(f => ({ ...f, cost_price: e.target.value }))} />
          </div>
          <div className="grid-2">
            <Input label="Stock Quantity" type="number" value={form.stock_quantity} onChange={(e) => setForm(f => ({ ...f, stock_quantity: e.target.value }))} />
            <Select label="Status" value={form.status} onChange={(e) => setForm(f => ({ ...f, status: e.target.value }))} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
