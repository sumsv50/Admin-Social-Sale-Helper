"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const Admin = new Schema({
    email: String,
    username: String,
    password: String,
    isBlocked: { type: Boolean, default: false },
    picture: String,
}, { timestamps: true, id: true });
// Model name => collection
exports.default = mongoose_1.default.model('Admin', Admin, 'admins');
