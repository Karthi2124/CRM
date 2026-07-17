"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = void 0;
exports.initAuditLog = initAuditLog;
const sequelize_1 = require("sequelize");
const crypto_1 = require("crypto");
class AuditLog extends sequelize_1.Model {
}
exports.AuditLog = AuditLog;
function initAuditLog(sequelize) {
    AuditLog.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        uuid: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        module: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        action: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        entity_type: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        entity_id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        old_values: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        new_values: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
        },
        ip_address: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'audit_logs',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false, // Audit logs are immutable, no updated_at
        hooks: {
            beforeValidate: (log) => {
                if (!log.uuid) {
                    log.uuid = (0, crypto_1.randomUUID)();
                }
            }
        }
    });
}
