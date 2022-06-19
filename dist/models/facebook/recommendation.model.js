"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const Recommendation = new Schema({
    name: String,
    pageId: String,
    mappings: [
        {
            keys: [String],
            responseContent: String,
            active: Boolean
        }
    ]
}, { timestamps: true, id: true });
// Model name => collection
exports.default = mongoose_1.default.model('Recommendation', Recommendation, 'recommendations');
