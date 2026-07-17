"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermission = void 0;
exports.initRolePermission = initRolePermission;
const sequelize_1 = require("sequelize");
class RolePermission extends sequelize_1.Model {
}
exports.RolePermission = RolePermission;
function initRolePermission(sequelize) {
    RolePermission.init({
        role_id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            references: {
                model: 'roles',
                key: 'id',
            },
        },
        permission_id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            references: {
                model: 'permissions',
                key: 'id',
            },
        },
    }, {
        sequelize,
        tableName: 'role_permissions',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });
}
