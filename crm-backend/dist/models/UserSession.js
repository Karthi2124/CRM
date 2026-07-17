"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSession = void 0;
exports.initUserSession = initUserSession;
const sequelize_1 = require("sequelize");
const crypto_1 = require("crypto");
class UserSession extends sequelize_1.Model {
}
exports.UserSession = UserSession;
function initUserSession(sequelize) {
    UserSession.init({
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
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        jwt_token: {
            type: sequelize_1.DataTypes.STRING(1024),
            allowNull: false,
        },
        refresh_token: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        ip_address: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
        },
        user_agent: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        login_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.DataTypes.NOW,
        },
        expires_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        logout_at: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'user_sessions',
        underscored: true,
        paranoid: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        hooks: {
            beforeValidate: (session) => {
                if (!session.uuid) {
                    session.uuid = (0, crypto_1.randomUUID)();
                }
            }
        }
    });
}
