// ─── Product Types ─────────────────────────────────────────────────────────────

export interface CreateProductCategoryDto {
  name: string;
  description?: string;
  parent_id?: number;
}

export interface UpdateProductCategoryDto extends Partial<CreateProductCategoryDto> {}

export interface CreateProductBrandDto {
  name: string;
  logo_url?: string;
}

export interface UpdateProductBrandDto extends Partial<CreateProductBrandDto> {}

export interface CreateProductUnitDto {
  name: string;
  symbol?: string;
}

export interface UpdateProductUnitDto extends Partial<CreateProductUnitDto> {}

export interface CreateTaxDto {
  name: string;
  rate: number;
  type?: 'percentage' | 'fixed';
}

export interface UpdateTaxDto extends Partial<CreateTaxDto> {}

export interface CreateProductDto {
  name: string;
  sku?: string;
  description?: string;
  category_id?: number;
  brand_id?: number;
  unit_id?: number;
  tax_id?: number;
  base_price: number;
  selling_price: number;
  image_url?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface CreatePriceListDto {
  name: string;
  price: number;
  min_quantity?: number;
  valid_from?: string;
  valid_to?: string;
}

export interface UpdatePriceListDto extends Partial<CreatePriceListDto> {}

export interface ProductListFilters {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  brand_id?: number;
  unit_id?: number;
  tax_id?: number;
  status?: 'active' | 'inactive';
}
