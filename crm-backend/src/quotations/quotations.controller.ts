import { Request, Response, NextFunction } from 'express';
import * as service from './quotations.service';
import {
  createQuotationSchema,
  updateQuotationSchema,
  quotationFiltersSchema,
} from './quotations.validation';
import { generateQuotationPdfBuffer } from '../utils/pdf.helper';
import { AuthRequest } from '../middleware/auth.middleware';

export async function createQuotation(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createQuotationSchema.parse(req.body);
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'User context is missing' });
      return;
    }
    const quotation = await service.createQuotation(data, userId);
    res.status(201).json({ success: true, data: quotation, message: 'Quotation created successfully' });
  } catch (err) {
    next(err);
  }
}

export async function listQuotations(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = quotationFiltersSchema.parse(req.query);
    const result = await service.listQuotations(filters);
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getQuotationByUuid(req: Request, res: Response, next: NextFunction) {
  try {
    const quotation = await service.getQuotationByUuid(req.params.uuid as string);
    res.json({ success: true, data: quotation });
  } catch (err) {
    next(err);
  }
}

export async function updateQuotation(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateQuotationSchema.parse(req.body);
    const updated = await service.updateQuotation(req.params.uuid as string, data);
    res.json({ success: true, data: updated, message: 'Quotation updated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function deleteQuotation(req: Request, res: Response, next: NextFunction) {
  try {
    await service.deleteQuotation(req.params.uuid as string);
    res.json({ success: true, message: 'Quotation deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function generateQuotationPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const quotation = await service.getQuotationByUuid(req.params.uuid as string);
    const pdfBuffer = await generateQuotationPdfBuffer(quotation);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="Quotation-${quotation.quotation_number}.pdf"`
    );
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (err) {
    next(err);
  }
}
