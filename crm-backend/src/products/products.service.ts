import { AppError } from '../utils/error.helper';
import * as repo from './products.repository';
import {
  CreateProductCategoryDto, UpdateProductCategoryDto,
  CreateProductBrandDto, UpdateProductBrandDto,
  CreateProductUnitDto, UpdateProductUnitDto,
  CreateTaxDto, UpdateTaxDto,
  CreateProductDto, UpdateProductDto, ProductListFilters,
  CreatePriceListDto, UpdatePriceListDto,
} from './products.types';

// ─── Category Service ──────────────────────────────────────────────────────────

export async function createCategory(data: CreateProductCategoryDto) {
  if (data.parent_id) {
    const parent = await repo.findCategoryById(data.parent_id);
    if (!parent) throw new AppError('Parent category not found', 404);
  }
  return repo.createCategory(data);
}

export async function listCategories() {
  return repo.listCategories();
}

export async function getCategoryByUuid(uuid: string) {
  const cat = await repo.findCategoryByUuid(uuid);
  if (!cat) throw new AppError('Product category not found', 404);
  return cat;
}

export async function updateCategory(uuid: string, data: UpdateProductCategoryDto) {
  const cat = await repo.findCategoryByUuid(uuid);
  if (!cat) throw new AppError('Product category not found', 404);
  if (data.parent_id) {
    const parent = await repo.findCategoryById(data.parent_id);
    if (!parent) throw new AppError('Parent category not found', 404);
    if (data.parent_id === cat.id) throw new AppError('A category cannot be its own parent', 400);
  }
  return repo.updateCategory(cat, data);
}

export async function deleteCategory(uuid: string) {
  const cat = await repo.findCategoryByUuid(uuid);
  if (!cat) throw new AppError('Product category not found', 404);
  await repo.deleteCategory(cat);
}

// ─── Brand Service ─────────────────────────────────────────────────────────────

export async function createBrand(data: CreateProductBrandDto) {
  return repo.createBrand(data);
}

export async function listBrands() {
  return repo.listBrands();
}

export async function getBrandByUuid(uuid: string) {
  const brand = await repo.findBrandByUuid(uuid);
  if (!brand) throw new AppError('Product brand not found', 404);
  return brand;
}

export async function updateBrand(uuid: string, data: UpdateProductBrandDto) {
  const brand = await repo.findBrandByUuid(uuid);
  if (!brand) throw new AppError('Product brand not found', 404);
  return repo.updateBrand(brand, data);
}

export async function deleteBrand(uuid: string) {
  const brand = await repo.findBrandByUuid(uuid);
  if (!brand) throw new AppError('Product brand not found', 404);
  await repo.deleteBrand(brand);
}

// ─── Unit Service ──────────────────────────────────────────────────────────────

export async function createUnit(data: CreateProductUnitDto) {
  return repo.createUnit(data);
}

export async function listUnits() {
  return repo.listUnits();
}

export async function getUnitByUuid(uuid: string) {
  const unit = await repo.findUnitByUuid(uuid);
  if (!unit) throw new AppError('Product unit not found', 404);
  return unit;
}

export async function updateUnit(uuid: string, data: UpdateProductUnitDto) {
  const unit = await repo.findUnitByUuid(uuid);
  if (!unit) throw new AppError('Product unit not found', 404);
  return repo.updateUnit(unit, data);
}

export async function deleteUnit(uuid: string) {
  const unit = await repo.findUnitByUuid(uuid);
  if (!unit) throw new AppError('Product unit not found', 404);
  await repo.deleteUnit(unit);
}

// ─── Tax Service ───────────────────────────────────────────────────────────────

export async function createTax(data: CreateTaxDto) {
  return repo.createTax(data);
}

export async function listTaxes() {
  return repo.listTaxes();
}

export async function getTaxByUuid(uuid: string) {
  const tax = await repo.findTaxByUuid(uuid);
  if (!tax) throw new AppError('Tax not found', 404);
  return tax;
}

export async function updateTax(uuid: string, data: UpdateTaxDto) {
  const tax = await repo.findTaxByUuid(uuid);
  if (!tax) throw new AppError('Tax not found', 404);
  return repo.updateTax(tax, data);
}

export async function deleteTax(uuid: string) {
  const tax = await repo.findTaxByUuid(uuid);
  if (!tax) throw new AppError('Tax not found', 404);
  await repo.deleteTax(tax);
}

// ─── Product Service ───────────────────────────────────────────────────────────

export async function createProduct(data: CreateProductDto) {
  if (data.category_id) {
    const cat = await repo.findCategoryById(data.category_id);
    if (!cat) throw new AppError('Product category not found', 404);
  }
  if (data.brand_id) {
    const brand = await repo.findBrandById(data.brand_id);
    if (!brand) throw new AppError('Product brand not found', 404);
  }
  if (data.unit_id) {
    const unit = await repo.findUnitById(data.unit_id);
    if (!unit) throw new AppError('Product unit not found', 404);
  }
  if (data.tax_id) {
    const tax = await repo.findTaxById(data.tax_id);
    if (!tax) throw new AppError('Tax not found', 404);
  }
  if (data.selling_price < 0 || data.base_price < 0) {
    throw new AppError('Prices cannot be negative', 400);
  }
  return repo.createProduct(data);
}

export async function listProducts(filters: ProductListFilters) {
  return repo.listProducts(filters);
}

export async function getProductByUuid(uuid: string) {
  const product = await repo.findProductByUuid(uuid);
  if (!product) throw new AppError('Product not found', 404);
  return product;
}

export async function updateProduct(uuid: string, data: UpdateProductDto) {
  const product = await repo.findProductByUuid(uuid);
  if (!product) throw new AppError('Product not found', 404);

  if (data.category_id) {
    const cat = await repo.findCategoryById(data.category_id);
    if (!cat) throw new AppError('Product category not found', 404);
  }
  if (data.brand_id) {
    const brand = await repo.findBrandById(data.brand_id);
    if (!brand) throw new AppError('Product brand not found', 404);
  }
  if (data.unit_id) {
    const unit = await repo.findUnitById(data.unit_id);
    if (!unit) throw new AppError('Product unit not found', 404);
  }
  if (data.tax_id) {
    const tax = await repo.findTaxById(data.tax_id);
    if (!tax) throw new AppError('Tax not found', 404);
  }
  if ((data.selling_price !== undefined && data.selling_price < 0) ||
      (data.base_price !== undefined && data.base_price < 0)) {
    throw new AppError('Prices cannot be negative', 400);
  }
  return repo.updateProduct(product, data);
}

export async function deleteProduct(uuid: string) {
  const product = await repo.findProductByUuid(uuid);
  if (!product) throw new AppError('Product not found', 404);
  await repo.deleteProduct(product);
}

// ─── PriceList Service ──────────────────────────────────────────────────────────

export async function addPriceList(productUuid: string, data: CreatePriceListDto) {
  const product = await repo.findProductByUuid(productUuid);
  if (!product) throw new AppError('Product not found', 404);
  if (data.price < 0) throw new AppError('Price cannot be negative', 400);
  if (data.valid_from && data.valid_to && new Date(data.valid_from) > new Date(data.valid_to)) {
    throw new AppError('valid_from must be before valid_to', 400);
  }
  return repo.createPriceList(product.id, data);
}

export async function listProductPriceLists(productUuid: string) {
  const product = await repo.findProductByUuid(productUuid);
  if (!product) throw new AppError('Product not found', 404);
  return repo.listPriceListsForProduct(product.id);
}

export async function updatePriceList(uuid: string, data: UpdatePriceListDto) {
  const pl = await repo.findPriceListByUuid(uuid);
  if (!pl) throw new AppError('Price list entry not found', 404);
  if (data.price !== undefined && data.price < 0) throw new AppError('Price cannot be negative', 400);
  return repo.updatePriceList(pl, data);
}

export async function deletePriceList(uuid: string) {
  const pl = await repo.findPriceListByUuid(uuid);
  if (!pl) throw new AppError('Price list entry not found', 404);
  await repo.deletePriceList(pl);
}
