"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDbConnection = testDbConnection;
const models_1 = require("../models");
async function testDbConnection() {
    try {
        await models_1.sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        return true;
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        return false;
    }
}
