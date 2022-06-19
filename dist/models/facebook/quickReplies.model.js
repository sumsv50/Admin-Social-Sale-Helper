"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const QuickReply = new Schema({
    name: String,
    pageId: String,
    text: String,
    samples: [
        {
            content_type: String,
            title: String,
            payload: String,
            image_url: String
        }
    ]
}, { timestamps: true, id: true });
// Model name => collection
exports.default = mongoose_1.default.model('QuickReply', QuickReply, 'quick_replies');
