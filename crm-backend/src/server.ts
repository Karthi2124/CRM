import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import os from 'os';
import { testDbConnection } from './config/database';
import { globalErrorHandler } from './utils/error.helper';
import logger from './utils/logger';
import authRoutes from './auth/auth.routes';
import rolesRoutes from './roles/roles.routes';
import permissionsRoutes from './permissions/permissions.routes';
import usersRoutes from './users/users.routes';
import companiesRoutes from './companies/companies.routes';
import customersRoutes from './customers/customers.routes';
import leadsRoutes from './leads/leads.routes';
import opportunitiesRoutes from './opportunities/opportunities.routes';
import productsRoutes from './products/products.routes';
import quotationsRoutes from './quotations/quotations.routes';
import invoicesRoutes from './invoices/invoices.routes';
import tasksRoutes from './tasks/tasks.routes';
import calendarRoutes from './calendar/calendar.routes';
import notificationsRoutes from './notifications/notifications.routes';
import dashboardRoutes from './dashboard/dashboard.routes';
import reportsRoutes from './reports/reports.routes';
import filesRoutes from './files/files.routes';
import auditLogsRoutes from './audit-logs/audit-logs.routes';
import settingsRoutes from './settings/settings.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
import { seedDefaultTemplates } from './notifications/notifications.service';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middlewares ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ─── Request Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Compression & Logging ────────────────────────────────────────────────────
app.use(compression());
app.use(morgan('dev', {
  stream: {
    write: (message: string) => logger.http(message.trim()),
  },
}));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'CRM API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/quotations', quotationsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found`,
  });
});

// ─── Global Error Handler (MUST be last) ─────────────────────────────────────
app.use(globalErrorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
async function startServer() {
  const isConnected = await testDbConnection();
  if (!isConnected) {
    logger.error('Shutting down — Database connection failed.');
    process.exit(1);
  }

  // Seed notification templates
  try {
    await seedDefaultTemplates();
    logger.info('✅ Notification templates seeded successfully');
  } catch (err: any) {
    logger.error(`❌ Failed to seed notification templates: ${err.message}`);
  }

  const HOST = '0.0.0.0';
  app.listen(Number(PORT), HOST, () => {
    const interfaces = os.networkInterfaces();
    let networkIp = 'localhost';
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        if (net.family === 'IPv4' && !net.internal) {
          networkIp = net.address;
          break;
        }
      }
    }
    logger.info(`🚀 CRM Backend running in ${process.env.NODE_ENV || 'development'} mode`);
    logger.info(`Local:   http://localhost:${PORT}`);
    logger.info(`Network: http://${networkIp}:${PORT}`);
    logger.info(`Health:  http://localhost:${PORT}/health`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
