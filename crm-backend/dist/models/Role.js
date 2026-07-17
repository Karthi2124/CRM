"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
exports.initRole = initRole;
const sequelize_1 = require("sequelize");
const crypto_1 = require("crypto");
class Role extends sequelize_1.Model {
}
exports.Role = Role;
function initRole(sequelize) {
    Role.init({
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
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'roles',
        underscored: true,
        paranoid: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        hooks: {
            beforeValidate: (role) => {
                if (!role.uuid) {
                    role.uuid = (0, crypto_1.randomUUID)();
                }
            }
        }
    });
}
