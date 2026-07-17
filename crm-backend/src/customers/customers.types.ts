export interface CreateCustomerDto {
  name: string;
  type: 'company' | 'individual';
  email?: string;
  phone?: string;
  website?: string;
  gst_number?: string;
  tax_id?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateCustomerDto {
  name?: string;
  type?: 'company' | 'individual';
  email?: string;
  phone?: string;
  website?: string;
  gst_number?: string;
  tax_id?: string;
  status?: 'active' | 'inactive';
}

export interface CustomerListQuery {
  [key: string]: unknown;
  page?: string;
  limit?: string;
  search?: string;
  type?: string;
  status?: string;
}

// ─── Customer Address DTOs ──────────────────────────────────────────────────
export interface CreateCustomerAddressDto {
  type: 'billing' | 'shipping';
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}

export interface UpdateCustomerAddressDto {
  type?: 'billing' | 'shipping';
  address_line_1?: string;
  address_line_2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
}

// ─── Customer Contact DTOs ──────────────────────────────────────────────────
export interface CreateCustomerContactDto {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  designation?: string;
}

export interface UpdateCustomerContactDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  designation?: string;
}

// ─── Customer Note DTOs ─────────────────────────────────────────────────────
export interface CreateCustomerNoteDto {
  note: string;
}

export interface UpdateCustomerNoteDto {
  note: string;
}
export interface TimelineEvent {
  id: string | number;
  type: 'note' | 'audit_log';
  event_name: string;
  description: string;
  user: {
    uuid: string;
    first_name: string;
    last_name: string;
  } | null;
  date: Date;
}
