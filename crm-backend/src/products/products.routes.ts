import { Router } from 'express';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import * as ctrl from './products.controller';

const router = Router();

// Apply JWT authentication to all product routes
router.use(authenticate);

// ─── Product Categories ─────────────────────────────────────────────────────────
router.get('/categories',             hasPermission('products', 'view'),   ctrl.listCategories);
router.post('/categories',            hasPermission('products', 'create'), ctrl.createCategory);
router.get('/categories/:uuid',       hasPermission('products', 'view'),   ctrl.getCategoryByUuid);
router.put('/categories/:uuid',       hasPermission('products', 'edit'),   ctrl.updateCategory);
router.delete('/categories/:uuid',    hasPermission('products', 'delete'), ctrl.deleteCategory);

// ─── Product Brands ─────────────────────────────────────────────────────────────
router.get('/brands',                 hasPermission('products', 'view'),   ctrl.listBrands);
router.post('/brands',                hasPermission('products', 'create'), ctrl.createBrand);
router.get('/brands/:uuid',           hasPermission('products', 'view'),   ctrl.getBrandByUuid);
router.put('/brands/:uuid',           hasPermission('products', 'edit'),   ctrl.updateBrand);
router.delete('/brands/:uuid',        hasPermission('products', 'delete'), ctrl.deleteBrand);

// ─── Product Units ──────────────────────────────────────────────────────────────
router.get('/units',                  hasPermission('products', 'view'),   ctrl.listUnits);
router.post('/units',                 hasPermission('products', 'create'), ctrl.createUnit);
router.get('/units/:uuid',            hasPermission('products', 'view'),   ctrl.getUnitByUuid);
router.put('/units/:uuid',            hasPermission('products', 'edit'),   ctrl.updateUnit);
router.delete('/units/:uuid',         hasPermission('products', 'delete'), ctrl.deleteUnit);

// ─── Taxes ──────────────────────────────────────────────────────────────────────
router.get('/taxes',                  hasPermission('products', 'view'),   ctrl.listTaxes);
router.post('/taxes',                 hasPermission('products', 'create'), ctrl.createTax);
router.get('/taxes/:uuid',            hasPermission('products', 'view'),   ctrl.getTaxByUuid);
router.put('/taxes/:uuid',            hasPermission('products', 'edit'),   ctrl.updateTax);
router.delete('/taxes/:uuid',         hasPermission('products', 'delete'), ctrl.deleteTax);

// ─── Products ───────────────────────────────────────────────────────────────────
router.get('/',                       hasPermission('products', 'view'),   ctrl.listProducts);
router.post('/',                      hasPermission('products', 'create'), ctrl.createProduct);
router.get('/:uuid',                  hasPermission('products', 'view'),   ctrl.getProductByUuid);
router.put('/:uuid',                  hasPermission('products', 'edit'),   ctrl.updateProduct);
router.delete('/:uuid',               hasPermission('products', 'delete'), ctrl.deleteProduct);

// ─── Product Price Lists ────────────────────────────────────────────────────────
router.get('/:uuid/price-lists',              hasPermission('products', 'view'),   ctrl.listProductPriceLists);
router.post('/:uuid/price-lists',             hasPermission('products', 'edit'),   ctrl.addPriceList);
router.put('/:uuid/price-lists/:plUuid',      hasPermission('products', 'edit'),   ctrl.updatePriceList);
router.delete('/:uuid/price-lists/:plUuid',   hasPermission('products', 'edit'),   ctrl.deletePriceList);

export default router;
