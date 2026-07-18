import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// ─── HTTP Status Codes ────────────────────────────────────────────────────────
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}

// ─── Custom Application Error ─────────────────────────────────────────────────
export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR,
    isOperational = true,
    code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;

    // Restore prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Specific Error Subclasses ────────────────────────────────────────────────
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, HttpStatusCode.NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, HttpStatusCode.FORBIDDEN);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, HttpStatusCode.UNPROCESSABLE_ENTITY);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, HttpStatusCode.CONFLICT);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(message, HttpStatusCode.BAD_REQUEST);
  }
}

// ─── Global Error Handler Middleware ─────────────────────────────────────────
export function globalErrorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isAppError = err instanceof AppError;

  const statusCode = isAppError ? err.statusCode : HttpStatusCode.INTERNAL_SERVER_ERROR;
  const isOperational = isAppError ? err.isOperational : false;
  const message = isOperational ? err.message : 'An unexpected error occurred. Please try again later.';

  // Always log the error
  if (!isOperational) {
    const error: any = err;

    logger.error('UNHANDLED ERROR', {
      message: error.message,
      name: error.name,
      stack: error.stack,

      // Sequelize / MySQL details
      sqlMessage: error.parent?.sqlMessage || error.original?.sqlMessage,
      sql: error.parent?.sql || error.original?.sql,
      code: error.parent?.code || error.original?.code,
      errno: error.parent?.errno || error.original?.errno,
      sqlState: error.parent?.sqlState || error.original?.sqlState,

      url: req.url,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.warn('Operational error', {
      message: err.message,
      statusCode,
      url: req.url,
      method: req.method,
    });
  }

  const error: any = err;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
      ? {
          stack: error.stack,
          sqlMessage: error.parent?.sqlMessage || error.original?.sqlMessage,
          sql: error.parent?.sql || error.original?.sql,
          code: error.parent?.code || error.original?.code,
        }
      : {}),
  });
}

// ─── Async Route Wrapper (eliminates try/catch in controllers) ────────────────
export function asyncHandler<T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: T, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
