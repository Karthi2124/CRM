"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                success: false,
                message: 'Authorization header is missing',
            });
            return;
        }
        if (!authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Invalid authorization format',
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await models_1.User.findByPk(decoded.userId, {
            include: [
                {
                    model: models_1.Role,
                    as: 'role',
                },
            ],
            attributes: {
                exclude: ['password_hash'],
            },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found',
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
        });
    }
};
exports.authenticate = authenticate;
