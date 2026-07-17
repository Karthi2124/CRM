import { Op } from 'sequelize';
import {
  Product, ProductCategory, ProductBrand, ProductUnit, Tax, PriceList,
} from '../models';
import {
  CreateProductCategoryDto, UpdateProductCategoryDto,
  CreateProductBrandDto, UpdateProductBrandDto,
  CreateProductUnitDto, UpdateProductUnitDto,
  CreateTaxDto, UpdateTaxDto,
  CreateProductDto, UpdateProductDto, ProductListFilters,
  CreatePriceListDto, UpdatePriceListDto,
} from './products.types';

// ─── Product Category Repository ────────────────────────────────────────────────

export async function createCategory(data: CreateProductCategoryDto) {
  return ProductCategory.create(data as any);
}

export async function listCategories() {
  return ProductCategory.findAll({
    where: { parent_id: null },
    include: [{ model: ProductCategory, as: 'children' }],
    order: [['name', 'ASC']],
  });
}

export async function findCategoryByUuid(uuid: string) {
  return ProductCategory.findOne({
    where: { uuid },
    include: [
      { model: ProductCategory, as: 'parent' },
      { model: ProductCategory, as: 'children' },
    ],
  });
}

export async function findCategoryById(id: number) {
  return ProductCategory.findByPk(id);
}

export async function updateCategory(category: ProductCategory, data: UpdateProductCategoryDto) {
  return category.update(data);
}

export async function deleteCategory(category: ProductCategory) {
  return category.destroy();
}

// ─── Product Brand Repository ────────────────────────────────────────────────────

export async function createBrand(data: CreateProductBrandDto) {
  return ProductBrand.create(data as any);
}

export async function listBrands() {
  return ProductBrand.findAll({ order: [['name', 'ASC']] });
}

export async function findBrandByUuid(uuid: string) {
  return ProductBrand.findOne({ where: { uuid } });
}

export async function findBrandById(id: number) {
  return ProductBrand.findByPk(id);
}

export async function updateBrand(brand: ProductBrand, data: UpdateProductBrandDto) {
  return brand.update(data);
}

export async function deleteBrand(brand: ProductBrand) {
  return brand.destroy();
}

// ─── Product Unit Repository ─────────────────────────────────────────────────────

export async function createUnit(data: CreateProductUnitDto) {
  return ProductUnit.create(data as any);
}

export async function listUnits() {
  return ProductUnit.findAll({ order: [['name', 'ASC']] });
}

export async function findUnitByUuid(uuid: string) {
  return ProductUnit.findOne({ where: { uuid } });
}

export async function findUnitById(id: number) {
  return ProductUnit.findByPk(id);
}

export async function updateUnit(unit: ProductUnit, data: UpdateProductUnitDto) {
  return unit.update(data);
}

export async function deleteUnit(unit: ProductUnit) {
  return unit.destroy();
}

// ─── Tax Repository ───────────────────────────────────────────────────────────────

export async function createTax(data: CreateTaxDto) {
  return Tax.create(data as any);
}

export async function listTaxes() {
  return Tax.findAll({ order: [['rate', 'ASC']] });
}

export async function findTaxByUuid(uuid: string) {
  return Tax.findOne({ where: { uuid } });
}

export async function findTaxById(id: number) {
  return Tax.findByPk(id);
}

export async function updateTax(tax: Tax, data: UpdateTaxDto) {
  return tax.update(data);
}

export async function deleteTax(tax: Tax) {
  return tax.destroy();
}

// ─── Product Repository ───────────────────────────────────────────────────────────

const productIncludes = [
  { model: ProductCategory, as: 'category', attributes: ['id', 'uuid', 'name'] },
  { model: ProductBrand, as: 'brand', attributes: ['id', 'uuid', 'name', 'logo_url'] },
  { model: ProductUnit, as: 'unit', attributes: ['id', 'uuid', 'name', 'symbol'] },
  { model: Tax, as: 'tax', attributes: ['id', 'uuid', 'name', 'rate', 'type'] },
  { model: PriceList, as: 'priceLists', attributes: ['id', 'uuid', 'name', 'price', 'min_quantity', 'valid_from', 'valid_to'] },
];

export async function createProduct(data: CreateProductDto) {
  return Product.create(data as any);
}

export async function listProducts(filters: ProductListFilters) {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const offset = (page - 1) * limit;

  const where: any = {};

  if (filters.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${filters.search}%` } },
      { sku: { [Op.like]: `%${filters.search}%` } },
    ];
  }
  if (filters.status) where.status = filters.status;
  if (filters.category_id) where.category_id = filters.category_id;
  if (filters.brand_id) where.brand_id = filters.brand_id;
  if (filters.unit_id) where.unit_id = filters.unit_id;
  if (filters.tax_id) where.tax_id = filters.tax_id;

  const { count, rows } = await Product.findAndCountAll({
    where, include: productIncludes, limit, offset,
    order: [['created_at', 'DESC']],
    distinct: true,
  });

  return {
    data: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

export async function findProductByUuid(uuid: string) {
  return Product.findOne({ where: { uuid }, include: productIncludes });
}

export async function findProductById(id: number) {
  return Product.findByPk(id);
}

export async function updateProduct(product: Product, data: UpdateProductDto) {
  return product.update(data);
}

export async function deleteProduct(product: Product) {
  return product.destroy();
}

// ─── PriceList Repository ─────────────────────────────────────────────────────────

export async function createPriceList(productId: number, data: CreatePriceListDto) {
  return PriceList.create({ ...data, product_id: productId } as any);
}

export async function findPriceListByUuid(uuid: string) {
  return PriceList.findOne({ where: { uuid }, include: [{ model: Product, as: 'product', attributes: ['id', 'uuid', 'name'] }] });
}

export async function findPriceListById(id: number) {
  return PriceList.findByPk(id);
}

export async function updatePriceList(pl: PriceList, data: UpdatePriceListDto) {
  return pl.update(data);
}

export async function deletePriceList(pl: PriceList) {
  return pl.destroy();
}

export async function listPriceListsForProduct(productId: number) {
  return PriceList.findAll({
    where: { product_id: productId },
    order: [['min_quantity', 'ASC']],
  });
}
