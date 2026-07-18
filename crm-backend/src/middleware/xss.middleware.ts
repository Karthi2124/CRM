import { Request, Response, NextFunction } from 'express';

/**
 * Recursively cleans and sanitizes strings to prevent XSS script injections.
 */
function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    return data
      .replace(/<script[^>]*>([\S\s]*?)<\/script>/gi, '') // Remove <script> tags
      .replace(/<[^>]*>/g, '') // Remove all HTML tags
      .trim();
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  
  if (data !== null && typeof data === 'object') {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = sanitizeInput(data[key]);
      }
    }
  }
  
  return data;
}

export function xssSanitizer(req: Request, _res: Response, next: NextFunction): void {
  if (req.body) {
    req.body = sanitizeInput(req.body);
  }
  if (req.query) {
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        req.query[key] = sanitizeInput(req.query[key]) as any;
      }
    }
  }
  if (req.params) {
    for (const key in req.params) {
      if (Object.prototype.hasOwnProperty.call(req.params, key)) {
        req.params[key] = sanitizeInput(req.params[key]);
      }
    }
  }
  next();
}
