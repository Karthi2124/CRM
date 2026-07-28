"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const os_1 = __importDefault(require("os"));
const database_1 = require("./config/database");
const error_helper_1 = require("./utils/error.helper");
const logger_1 = __importDefault(require("./utils/logger"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const roles_routes_1 = __importDefault(require("./roles/roles.routes"));
const permissions_routes_1 = __importDefault(require("./permissions/permissions.routes"));
const users_routes_1 = __importDefault(require("./users/users.routes"));
const companies_routes_1 = __importDefault(require("./companies/companies.routes"));
const customers_routes_1 = __importDefault(require("./customers/customers.routes"));
const leads_routes_1 = __importDefault(require("./leads/leads.routes"));
const opportunities_routes_1 = __importDefault(require("./opportunities/opportunities.routes"));
const products_routes_1 = __importDefault(require("./products/products.routes"));
const quotations_routes_1 = __importDefault(require("./quotations/quotations.routes"));
const invoices_routes_1 = __importDefault(require("./invoices/invoices.routes"));
const tasks_routes_1 = __importDefault(require("./tasks/tasks.routes"));
const calendar_routes_1 = __importDefault(require("./calendar/calendar.routes"));
const notifications_routes_1 = __importDefault(require("./notifications/notifications.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard/dashboard.routes"));
const reports_routes_1 = __importDefault(require("./reports/reports.routes"));
const files_routes_1 = __importDefault(require("./files/files.routes"));
const audit_logs_routes_1 = __importDefault(require("./audit-logs/audit-logs.routes"));
const settings_routes_1 = __importDefault(require("./settings/settings.routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = require("./config/swagger.config");
const notifications_service_1 = require("./notifications/notifications.service");
const rate_limit_middleware_1 = require("./middleware/rate-limit.middleware");
const xss_middleware_1 = require("./middleware/xss.middleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ─── Security Middlewares ─────────────────────────────────────────────────────
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
// ─── Rate Limiting ───────────────────────────────────────────────────────────
app.use('/api/auth', rate_limit_middleware_1.authLimiter);
app.use('/api', rate_limit_middleware_1.apiLimiter);
// ─── Request Parsing ──────────────────────────────────────────────────────────
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(xss_middleware_1.xssSanitizer);
// ─── Compression & Logging ────────────────────────────────────────────────────
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('dev', {
    stream: {
        write: (message) => logger_1.default.http(message.trim()),
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
app.use('/api/auth', auth_routes_1.default);
app.use('/api/roles', roles_routes_1.default);
app.use('/api/permissions', permissions_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/companies', companies_routes_1.default);
app.use('/api/customers', customers_routes_1.default);
app.use('/api/leads', leads_routes_1.default);
app.use('/api/opportunities', opportunities_routes_1.default);
app.use('/api/products', products_routes_1.default);
app.use('/api/quotations', quotations_routes_1.default);
app.use('/api/invoices', invoices_routes_1.default);
app.use('/api/tasks', tasks_routes_1.default);
app.use('/api/calendar', calendar_routes_1.default);
app.use('/api/notifications', notifications_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/reports', reports_routes_1.default);
app.use('/api/files', files_routes_1.default);
app.use('/api/audit-logs', audit_logs_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.swaggerSpec));
// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found`,
    });
});
// ─── Global Error Handler (MUST be last) ─────────────────────────────────────
app.use(error_helper_1.globalErrorHandler);
// ─── Start Server ─────────────────────────────────────────────────────────────
async function startServer() {
    const isConnected = await (0, database_1.testDbConnection)();
    if (!isConnected) {
        logger_1.default.error('Shutting down — Database connection failed.');
        process.exit(1);
    }
    // Seed notification templates
    try {
        await (0, notifications_service_1.seedDefaultTemplates)();
        logger_1.default.info('✅ Notification templates seeded successfully');
    }
    catch (err) {
        logger_1.default.error(`❌ Failed to seed notification templates: ${err.message}`);
    }
    const HOST = '0.0.0.0';
    app.listen(Number(PORT), HOST, () => {
        const interfaces = os_1.default.networkInterfaces();
        let networkIp = 'localhost';
        for (const name of Object.keys(interfaces)) {
            for (const net of interfaces[name] || []) {
                if (net.family === 'IPv4' && !net.internal) {
                    networkIp = net.address;
                    break;
                }
            }
        }
        logger_1.default.info(`🚀 CRM Backend running in ${process.env.NODE_ENV || 'development'} mode`);
        logger_1.default.info(`Local:   http://localhost:${PORT}`);
        logger_1.default.info(`Network: http://${networkIp}:${PORT}`);
        logger_1.default.info(`Health:  http://localhost:${PORT}/health`);
    });
}
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
exports.default = app;
