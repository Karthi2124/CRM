// ─── Quotation Types ────────────────────────────────────────────────────────────

export interface CreateQuotationItemDto {
  product_id?: number | null;
  description?: string | null;
  quantity: number;
  unit_price: number;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  tax_id?: number | null;
}

export interface CreateQuotationDto {
  customer_id: number;
  lead_id?: number | null;
  opportunity_id?: number | null;
  subject: string;
  date: string; // YYYY-MM-DD
  expiry_date: string; // YYYY-MM-DD
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  adjustment?: number;
  status?: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  terms_conditions?: string | null;
  customer_notes?: string | null;
  items: CreateQuotationItemDto[];
}

export interface UpdateQuotationDto extends Partial<Omit<CreateQuotationDto, 'items'>> {
  items?: CreateQuotationItemDto[];
}

export interface QuotationFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
  customer_id?: number;
  lead_id?: number;
  opportunity_id?: number;
}
