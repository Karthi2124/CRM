import { Request, Response, NextFunction } from 'express';
import * as service from './products.service';
import {
  createCategorySchema, updateCategorySchema,
  createBrandSchema, updateBrandSchema,
  createUnitSchema, updateUnitSchema,
  createTaxSchema, updateTaxSchema,
  createProductSchema, updateProductSchema, productFiltersSchema,
  createPriceListSchema, updatePriceListSchema,
} from './products.validation';

// ─── Category Controllers ───────────────────────────────────────────────────────

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createCategorySchema.parse(req.body);
    const cat = await service.createCategory(data);
    res.status(201).json({ success: true, data: cat, message: 'Product category created' });
  } catch (err) { next(err); }
}

export async function listCategories(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.listCategories();
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getCategoryByUuid(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getCategoryByUuid(req.params.uuid as string);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateCategorySchema.parse(req.body);
    const updated = await service.updateCategory(req.params.uuid as string, data);
    res.json({ success: true, data: updated, message: 'Product category updated' });
  } catch (err) { next(err); }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteCategory(req.params.uuid as string);
    res.json({ success: true, message: 'Product category deleted' });
  } catch (err) { next(err); }
}

// ─── Brand Controllers ──────────────────────────────────────────────────────────

export async function createBrand(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createBrandSchema.parse(req.body);
    const brand = await service.createBrand(data);
    res.status(201).json({ success: true, data: brand, message: 'Product brand created' });
  } catch (err) { next(err); }
}

export async function listBrands(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.listBrands();
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getBrandByUuid(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getBrandByUuid(req.params.uuid as string);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateBrand(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateBrandSchema.parse(req.body);
    const updated = await service.updateBrand(req.params.uuid as string, data);
    res.json({ success: true, data: updated, message: 'Product brand updated' });
  } catch (err) { next(err); }
}

export async function deleteBrand(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteBrand(req.params.uuid as string);
    res.json({ success: true, message: 'Product brand deleted' });
  } catch (err) { next(err); }
}

// ─── Unit Controllers ───────────────────────────────────────────────────────────

export async function createUnit(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createUnitSchema.parse(req.body);
    const unit = await service.createUnit(data);
    res.status(201).json({ success: true, data: unit, message: 'Product unit created' });
  } catch (err) { next(err); }
}

export async function listUnits(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.listUnits();
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getUnitByUuid(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getUnitByUuid(req.params.uuid as string);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateUnit(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateUnitSchema.parse(req.body);
    const updated = await service.updateUnit(req.params.uuid as string, data);
    res.json({ success: true, data: updated, message: 'Product unit updated' });
  } catch (err) { next(err); }
}

export async function deleteUnit(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteUnit(req.params.uuid as string);
    res.json({ success: true, message: 'Product unit deleted' });
  } catch (err) { next(err); }
}

// ─── Tax Controllers ────────────────────────────────────────────────────────────

export async function createTax(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createTaxSchema.parse(req.body);
    const tax = await service.createTax(data);
    res.status(201).json({ success: true, data: tax, message: 'Tax created' });
  } catch (err) { next(err); }
}

export async function listTaxes(_req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.listTaxes();
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getTaxByUuid(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getTaxByUuid(req.params.uuid as string);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateTax(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateTaxSchema.parse(req.body);
    const updated = await service.updateTax(req.params.uuid as string, data);
    res.json({ success: true, data: updated, message: 'Tax updated' });
  } catch (err) { next(err); }
}

export async function deleteTax(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteTax(req.params.uuid as string);
    res.json({ success: true, message: 'Tax deleted' });
  } catch (err) { next(err); }
}

// ─── Product Controllers ────────────────────────────────────────────────────────

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createProductSchema.parse(req.body);
    const product = await service.createProduct(data);
    res.status(201).json({ success: true, data: product, message: 'Product created' });
  } catch (err) { next(err); }
}

export async function listProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = productFiltersSchema.parse(req.query);
    const result = await service.listProducts(filters);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
}

export async function getProductByUuid(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getProductByUuid(req.params.uuid as string);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateProductSchema.parse(req.body);
    const updated = await service.updateProduct(req.params.uuid as string, data);
    res.json({ success: true, data: updated, message: 'Product updated' });
  } catch (err) { next(err); }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteProduct(req.params.uuid as string);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) { next(err); }
}

// ─── PriceList Controllers ──────────────────────────────────────────────────────

export async function addPriceList(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createPriceListSchema.parse(req.body);
    const pl = await service.addPriceList(req.params.uuid as string, data);
    res.status(201).json({ success: true, data: pl, message: 'Price list entry added' });
  } catch (err) { next(err); }
}

export async function listProductPriceLists(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.listProductPriceLists(req.params.uuid as string);
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function updatePriceList(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updatePriceListSchema.parse(req.body);
    const updated = await service.updatePriceList(req.params.plUuid as string, data);
    res.json({ success: true, data: updated, message: 'Price list entry updated' });
  } catch (err) { next(err); }
}

export async function deletePriceList(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deletePriceList(req.params.plUuid as string);
    res.json({ success: true, message: 'Price list entry deleted' });
  } catch (err) { next(err); }
}
