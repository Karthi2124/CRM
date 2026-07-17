import winston from 'winston';
import path from 'path';

const { combine, timestamp, colorize, printf, errors, json } = winston.format;

const isProduction = process.env.NODE_ENV === 'production';

// ─── Custom Console Format (Development) ────────────────────────────────────
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ timestamp, level, message, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${stack || message}${metaStr}`;
  })
);

// ─── JSON Format (Production) ───────────────────────────────────────────────
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

// ─── Transports ─────────────────────────────────────────────────────────────
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isProduction ? prodFormat : devFormat,
    silent: process.env.NODE_ENV === 'test',
  }),
];

// File transport only in production
if (isProduction) {
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: prodFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: prodFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
    })
  );
}

// ─── Logger Instance ─────────────────────────────────────────────────────────
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transports,
  exitOnError: false,
});

export default logger;
