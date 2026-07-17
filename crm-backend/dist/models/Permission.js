"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
exports.initPermission = initPermission;
const sequelize_1 = require("sequelize");
const crypto_1 = require("crypto");
class Permission extends sequelize_1.Model {
}
exports.Permission = Permission;
function initPermission(sequelize) {
    Permission.init({
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
        module: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        action: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'permissions',
        underscored: true,
        paranoid: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        indexes: [
            {
                unique: true,
                fields: ['module', 'action'],
                name: 'idx_permissions_module_action',
            }
        ],
        hooks: {
            beforeValidate: (permission) => {
                if (!permission.uuid) {
                    permission.uuid = (0, crypto_1.randomUUID)();
                }
            }
        }
    });
}
