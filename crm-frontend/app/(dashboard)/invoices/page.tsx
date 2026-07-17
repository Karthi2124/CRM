"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, CreditCard } from "lucide-react";
import { invoicesApi } from "@/lib/api";
import { Invoice } from "@/types";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input, Select } from "@/components/ui/Input";
import { statusBadge } from "@/components/ui/Badge";
import { useToast } from "@/lib/providers";
import { format } from "date-fns";

export default function InvoicesPage() {
  const qc = useQueryClient();
  const { success, error: toastError } = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payForm, setPayForm] = useState({ amount: "", method: "bank_transfer", reference: "", notes: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["invoices", page, search],
    queryFn: () => invoicesApi.list({ page, limit: 15, search }),
  });

  const rows = (data?.data?.data ?? []) as Invoice[];
  const pagination = data?.data?.pagination;

  const paymentMutation = useMutation({
    mutationFn: () => invoicesApi.addPayment(selectedInvoice!.id, payForm),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invoices"] }); success("Payment recorded"); setPaymentModal(false); setPayForm({ amount: "", method: "bank_transfer", reference: "", notes: "" }); },
    onError: () => toastError("Failed to record payment"),
  });

  const columns = [
    { key: "invoice_number", label: "Invoice #", render: (r: Invoice) => <code style={{ fontSize: "0.8125rem", color: "var(--accent-primary-hover)" }}>{r.invoice_number}</code> },
    { key: "customer", label: "Customer", render: (r: Invoice) => r.customer ? `${r.customer.first_name} ${r.customer.last_name}` : <span className="text-muted">—</span> },
    { key: "total", label: "Total", render: (r: Invoice) => `₹${Number(r.total).toLocaleString("en-IN")}` },
    { key: "amount_paid", label: "Paid", render: (r: Invoice) => <span style={{ color: "var(--accent-emerald)" }}>₹{Number(r.amount_paid).toLocaleString("en-IN")}</span> },
    { key: "balance_due", label: "Balance", render: (r: Invoice) => <strong style={{ color: Number(r.balance_due) > 0 ? "var(--accent-red)" : "var(--accent-emerald)" }}>₹{Number(r.balance_due).toLocaleString("en-IN")}</strong> },
    { key: "status", label: "Status", render: (r: Invoice) => statusBadge(r.status) },
    { key: "due_date", label: "Due Date", render: (r: Invoice) => r.due_date ? format(new Date(r.due_date), "dd MMM yyyy") : <span className="text-muted">—</span> },
    { key: "actions", label: "", width: "60px", render: (r: Invoice) => (
      Number(r.balance_due) > 0 ? (
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => { setSelectedInvoice(r); setPaymentModal(true); }} title="Record Payment"><CreditCard size={14} /></button>
      ) : null
    )},
  ];

  return (
    <div>
      <PageHeader title="Invoices" subtitle="Track invoices, payments and balances" />
      <div className="filter-bar">
        <div className="search-input-wrap"><Search size={15} className="search-icon" /><input className="form-input" placeholder="Search invoices…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} /></div>
      </div>
      <DataTable columns={columns} data={rows as unknown as Record<string, unknown>[]} loading={isLoading} pagination={pagination ? { ...pagination, onPageChange: setPage } : undefined} />
      <Modal open={paymentModal} onClose={() => setPaymentModal(false)} title="Record Payment" footer={<><Button variant="secondary" onClick={() => setPaymentModal(false)}>Cancel</Button><Button loading={paymentMutation.isPending} onClick={() => paymentMutation.mutate()}>Record Payment</Button></>}>
        {selectedInvoice && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", padding: "0.75rem", fontSize: "0.875rem" }}>
              Balance due: <strong style={{ color: "var(--accent-red)" }}>₹{Number(selectedInvoice.balance_due).toLocaleString("en-IN")}</strong>
            </div>
            <Input label="Amount (₹)" type="number" value={payForm.amount} onChange={(e) => setPayForm(f => ({ ...f, amount: e.target.value }))} required />
            <Select label="Payment Method" value={payForm.method} onChange={(e) => setPayForm(f => ({ ...f, method: e.target.value }))} options={[{ value: "bank_transfer", label: "Bank Transfer" }, { value: "cash", label: "Cash" }, { value: "cheque", label: "Cheque" }, { value: "upi", label: "UPI" }, { value: "card", label: "Card" }]} />
            <Input label="Reference / Transaction ID" value={payForm.reference} onChange={(e) => setPayForm(f => ({ ...f, reference: e.target.value }))} />
          </div>
        )}
      </Modal>
    </div>
  );
}
