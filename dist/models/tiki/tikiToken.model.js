"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const TikiToken = new Schema({
    userId: { type: Schema.Types.ObjectId, index: true },
    accessToken: String,
    accessTokenExpire: Number,
    refreshToken: String,
}, { timestamps: true });
// Model name => collection
exports.default = mongoose_1.default.model('TikiToken', TikiToken, 'tiki_tokens');
