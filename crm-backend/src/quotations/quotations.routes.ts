import { Router } from 'express';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import * as ctrl from './quotations.controller';

const router = Router();

// Apply authentication middleware to all quotation routes
router.use(authenticate);

// ─── Quotation Routes ──────────────────────────────────────────────────────────
router.get('/',             hasPermission('quotations', 'view'),   ctrl.listQuotations);
router.post('/',            hasPermission('quotations', 'create'), ctrl.createQuotation);
router.get('/:uuid',        hasPermission('quotations', 'view'),   ctrl.getQuotationByUuid);
router.put('/:uuid',        hasPermission('quotations', 'edit'),   ctrl.updateQuotation);
router.delete('/:uuid',     hasPermission('quotations', 'delete'), ctrl.deleteQuotation);
router.get('/:uuid/pdf',    hasPermission('quotations', 'view'),   ctrl.generateQuotationPdf);

export default router;
