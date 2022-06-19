"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const FavoriteKeyword = new Schema({
    createdBy: Schema.Types.ObjectId,
    content: String,
}, { timestamps: true, id: true });
// Model name => collection
exports.default = mongoose_1.default.model('FavoriteKeyword', FavoriteKeyword, 'favorite_keywords');
