import { Request, Response, NextFunction } from 'express';
import * as service from './invoices.service';
import {
  createInvoiceSchema,
  updateInvoiceSchema,
  createPaymentSchema,
  createCreditNoteSchema,
  invoiceFiltersSchema,
} from './invoices.validation';
import { generateInvoicePdfBuffer } from '../utils/invoice.pdf.helper';
import { AuthRequest } from '../middleware/auth.middleware';

export async function createInvoice(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createInvoiceSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const invoice = await service.createInvoice(data, userId);
    res.status(201).json({ success: true, data: invoice, message: 'Invoice created successfully' });
  } catch (err) {
    next(err);
  }
}

export async function listInvoices(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = invoiceFiltersSchema.parse(req.query);
    const result = await service.listInvoices(filters);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getInvoiceByUuid(req: Request, res: Response, next: NextFunction) {
  try {
    const invoice = await service.getInvoiceByUuid(req.params.uuid as string);
    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
}

export async function updateInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateInvoiceSchema.parse(req.body);
    const updated = await service.updateInvoice(req.params.uuid as string, data);
    res.json({ success: true, data: updated, message: 'Invoice updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteInvoice(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteInvoice(req.params.uuid as string);
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function recordPayment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createPaymentSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const invoice = await service.recordPayment(req.params.uuid as string, data, userId);
    res.json({ success: true, data: invoice, message: 'Payment recorded successfully' });
  } catch (err) {
    next(err);
  }
}

export async function issueCreditNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createCreditNoteSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const invoice = await service.issueCreditNote(req.params.uuid as string, data, userId);
    res.json({ success: true, data: invoice, message: 'Credit note processed successfully' });
  } catch (err) {
    next(err);
  }
}

export async function generateInvoicePdf(req: Request, res: Response, next: NextFunction) {
  try {
    const invoice = await service.getInvoiceByUuid(req.params.uuid as string);
    const pdfBuffer = await generateInvoicePdfBuffer(invoice);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="Invoice-${invoice.invoice_number}.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (err) {
    next(err);
  }
}
