import { Request, Response, NextFunction } from 'express';
import * as service from './reports.service';
import { reportFiltersSchema } from './reports.validation';
import { convertToCsv } from '../utils/csv.helper';

export async function getLeadReport(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = reportFiltersSchema.parse(req.query);
    const result = await service.generateLeadReport(filters);

    if (filters.format === 'csv') {
      const csvStr = convertToCsv(result);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="leads-report.csv"');
      res.status(200).send(csvStr);
      return;
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getSalesReport(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = reportFiltersSchema.parse(req.query);
    const result = await service.generateSalesReport(filters);

    if (filters.format === 'csv') {
      const csvStr = convertToCsv(result);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sales-report.csv"');
      res.status(200).send(csvStr);
      return;
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getTaskReport(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = reportFiltersSchema.parse(req.query);
    const result = await service.generateTaskReport(filters);

    if (filters.format === 'csv') {
      const csvStr = convertToCsv(result);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="tasks-report.csv"');
      res.status(200).send(csvStr);
      return;
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function getRevenueReport(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = reportFiltersSchema.parse(req.query);
    const result = await service.generateRevenueReport(filters);

    if (filters.format === 'csv') {
      const csvStr = convertToCsv(result);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="revenue-report.csv"');
      res.status(200).send(csvStr);
      return;
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
