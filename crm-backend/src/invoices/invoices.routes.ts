import { Router } from 'express';
import { authenticate, hasPermission } from '../middleware/auth.middleware';
import * as ctrl from './invoices.controller';

const router = Router();

// Apply authentication middleware to all invoice routes
router.use(authenticate);

// ─── Invoice Routes ─────────────────────────────────────────────────────────────
router.get('/',                 hasPermission('invoices', 'view'),   ctrl.listInvoices);
router.post('/',                hasPermission('invoices', 'create'), ctrl.createInvoice);
router.get('/:uuid',            hasPermission('invoices', 'view'),   ctrl.getInvoiceByUuid);
router.put('/:uuid',            hasPermission('invoices', 'edit'),   ctrl.updateInvoice);
router.delete('/:uuid',         hasPermission('invoices', 'delete'), ctrl.deleteInvoice);
router.post('/:uuid/payments',  hasPermission('invoices', 'edit'),   ctrl.recordPayment);
router.post('/:uuid/credit-notes', hasPermission('invoices', 'edit'), ctrl.issueCreditNote);
router.get('/:uuid/pdf',        hasPermission('invoices', 'view'),   ctrl.generateInvoicePdf);

export default router;
