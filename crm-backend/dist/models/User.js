"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
exports.initUser = initUser;
const sequelize_1 = require("sequelize");
const crypto_1 = require("crypto");
class User extends sequelize_1.Model {
}
exports.User = User;
function initUser(sequelize) {
    User.init({
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
        first_name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        last_name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        phone: {
            type: sequelize_1.DataTypes.STRING(20),
            allowNull: true,
        },
        password_hash: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
        },
        role_id: {
            type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            references: {
                model: 'roles',
                key: 'id',
            },
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'suspended'),
            allowNull: false,
            defaultValue: 'active',
        },
        last_login_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'users',
        underscored: true,
        paranoid: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        hooks: {
            beforeValidate: (user) => {
                if (!user.uuid) {
                    user.uuid = (0, crypto_1.randomUUID)();
                }
            }
        }
    });
}
