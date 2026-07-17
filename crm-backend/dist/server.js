"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const models_1 = require("./models");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Standard Middlewares
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use((0, compression_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});
// Database connection & Server Startup
async function startServer() {
    const isConnected = await (0, database_1.testDbConnection)();
    if (!isConnected) {
        console.error('Shutting down server due to DB connection failure.');
        process.exit(1);
    }
    // Verify DB data
    try {
        const superAdmin = await models_1.User.findOne({
            where: { email: 'admin@crm.com' },
            include: [{ model: models_1.Role, as: 'role' }]
        });
        if (superAdmin) {
            console.log(' Database verification successful! Super Admin Found:');
            console.log(`- Name: ${superAdmin.first_name} ${superAdmin.last_name}`);
            console.log(`- Email: ${superAdmin.email}`);
            console.log(`- Role: ${superAdmin.role?.name}`);
            console.log(`- Status: ${superAdmin.status}`);
            console.log(`- Public UUID: ${superAdmin.uuid}`);
        }
        else {
            console.log('⚠️ Super Admin user not found. Ensure you ran the seeders.');
        }
    }
    catch (err) {
        console.error('Error during validation query:', err);
    }
    const HOST = '0.0.0.0';
    app.listen(Number(PORT), HOST, () => {
        const os = require('os');
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
        console.log(`CRM Backend Server running in ${process.env.NODE_ENV || 'development'} mode`);
        console.log(`Local:   http://localhost:${PORT}`);
        console.log(`Network: http://${networkIp}:${PORT}`);
    });
}
startServer();
exports.default = app;
