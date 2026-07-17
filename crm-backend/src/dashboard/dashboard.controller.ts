import { Request, Response, NextFunction } from 'express';
import * as service from './dashboard.service';

export async function getKpiSummary(_req: Request, res: Response, next: NextFunction) {
  try {
    const kpis = await service.getKpiSummary();
    res.json({ success: true, data: kpis });
  } catch (err) {
    next(err);
  }
}

export async function getChartData(_req: Request, res: Response, next: NextFunction) {
  try {
    const charts = await service.getChartData();
    res.json({ success: true, data: charts });
  } catch (err) {
    next(err);
  }
}
