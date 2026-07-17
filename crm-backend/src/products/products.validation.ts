import { z } from 'zod';

// ─── Category Validation ────────────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(255).optional(),
  parent_id: z.number().int().positive().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Brand Validation ──────────────────────────────────────────────────────────

export const createBrandSchema = z.object({
  name: z.string().min(1).max(100),
  logo_url: z.string().url().max(500).optional(),
});

export const updateBrandSchema = createBrandSchema.partial();

// ─── Unit Validation ──────────────────────────────────────────────────────────

export const createUnitSchema = z.object({
  name: z.string().min(1).max(50),
  symbol: z.string().max(10).optional(),
});

export const updateUnitSchema = createUnitSchema.partial();

// ─── Tax Validation ───────────────────────────────────────────────────────────

export const createTaxSchema = z.object({
  name: z.string().min(1).max(100),
  rate: z.number().min(0).max(100),
  type: z.enum(['percentage', 'fixed']).optional(),
});

export const updateTaxSchema = createTaxSchema.partial();

// ─── Product Validation ───────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  sku: z.string().max(100).optional(),
  description: z.string().optional(),
  category_id: z.number().int().positive().optional(),
  brand_id: z.number().int().positive().optional(),
  unit_id: z.number().int().positive().optional(),
  tax_id: z.number().int().positive().optional(),
  base_price: z.number().min(0),
  selling_price: z.number().min(0),
  image_url: z.string().url().max(500).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productFiltersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  category_id: z.coerce.number().int().positive().optional(),
  brand_id: z.coerce.number().int().positive().optional(),
  unit_id: z.coerce.number().int().positive().optional(),
  tax_id: z.coerce.number().int().positive().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// ─── PriceList Validation ──────────────────────────────────────────────────────

export const createPriceListSchema = z.object({
  name: z.string().min(1).max(150),
  price: z.number().min(0),
  min_quantity: z.number().int().positive().optional(),
  valid_from: z.string().datetime({ offset: true }).optional(),
  valid_to: z.string().datetime({ offset: true }).optional(),
});

export const updatePriceListSchema = createPriceListSchema.partial();
