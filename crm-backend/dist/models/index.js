"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLog = exports.UserSession = exports.RolePermission = exports.User = exports.Permission = exports.Role = exports.Sequelize = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
Object.defineProperty(exports, "Sequelize", { enumerable: true, get: function () { return sequelize_1.Sequelize; } });
const path_1 = __importDefault(require("path"));
const Role_1 = require("./Role");
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return Role_1.Role; } });
const Permission_1 = require("./Permission");
Object.defineProperty(exports, "Permission", { enumerable: true, get: function () { return Permission_1.Permission; } });
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const RolePermission_1 = require("./RolePermission");
Object.defineProperty(exports, "RolePermission", { enumerable: true, get: function () { return RolePermission_1.RolePermission; } });
const UserSession_1 = require("./UserSession");
Object.defineProperty(exports, "UserSession", { enumerable: true, get: function () { return UserSession_1.UserSession; } });
const AuditLog_1 = require("./AuditLog");
Object.defineProperty(exports, "AuditLog", { enumerable: true, get: function () { return AuditLog_1.AuditLog; } });
const env = process.env.NODE_ENV || 'development';
// Resolve the path to the root config/config.js
const dbConfig = require(path_1.default.resolve(__dirname, '../../config/config.js'))[env];
const sequelize = new sequelize_1.Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging ?? console.log,
    define: {
        underscored: true,
        freezeTableName: true,
    },
});
exports.sequelize = sequelize;
// Initialize all models
(0, Role_1.initRole)(sequelize);
(0, Permission_1.initPermission)(sequelize);
(0, User_1.initUser)(sequelize);
(0, RolePermission_1.initRolePermission)(sequelize);
(0, UserSession_1.initUserSession)(sequelize);
(0, AuditLog_1.initAuditLog)(sequelize);
// Define associations
// User <-> Role (One-to-Many)
Role_1.Role.hasMany(User_1.User, { foreignKey: 'role_id', as: 'users' });
User_1.User.belongsTo(Role_1.Role, { foreignKey: 'role_id', as: 'role' });
// Role <-> Permission (Many-to-Many)
Role_1.Role.belongsToMany(Permission_1.Permission, {
    through: RolePermission_1.RolePermission,
    foreignKey: 'role_id',
    otherKey: 'permission_id',
    as: 'permissions',
});
Permission_1.Permission.belongsToMany(Role_1.Role, {
    through: RolePermission_1.RolePermission,
    foreignKey: 'permission_id',
    otherKey: 'role_id',
    as: 'roles',
});
// User <-> UserSession (One-to-Many)
User_1.User.hasMany(UserSession_1.UserSession, { foreignKey: 'user_id', as: 'sessions' });
UserSession_1.UserSession.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'user' });
// User <-> AuditLog (One-to-Many)
User_1.User.hasMany(AuditLog_1.AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog_1.AuditLog.belongsTo(User_1.User, { foreignKey: 'user_id', as: 'user' });
