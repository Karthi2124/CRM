// ─── Invoice Types ──────────────────────────────────────────────────────────────

export interface CreateInvoiceItemDto {
  product_id?: number | null;
  description?: string | null;
  quantity: number;
  unit_price: number;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  tax_id?: number | null;
}

export interface CreateInvoiceDto {
  customer_id: number;
  quotation_id?: number | null;
  subject: string;
  date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  adjustment?: number;
  status?: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'unpaid' | 'voided';
  terms_conditions?: string | null;
  customer_notes?: string | null;
  items: CreateInvoiceItemDto[];
}

export interface UpdateInvoiceDto extends Partial<Omit<CreateInvoiceDto, 'items'>> {
  items?: CreateInvoiceItemDto[];
}

export interface CreatePaymentDto {
  amount: number;
  payment_date: string; // YYYY-MM-DD
  payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'cheque' | 'paypal' | 'other';
  transaction_reference?: string | null;
  notes?: string | null;
}

export interface CreateCreditNoteDto {
  amount: number;
  credit_note_date: string; // YYYY-MM-DD
  reason: string;
  status?: 'draft' | 'applied' | 'voided';
}

export interface InvoiceFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'sent' | 'partially_paid' | 'paid' | 'unpaid' | 'voided';
  customer_id?: number;
  quotation_id?: number;
}
