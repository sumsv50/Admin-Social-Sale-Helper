"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const MessageRead = new Schema({
    threadId: String,
    userId: String,
    pageId: String,
    senderId: String,
    isRead: Boolean,
}, { timestamps: true, id: true });
// Model name => collection
exports.default = mongoose_1.default.model('MessageRead', MessageRead, 'message_reads');
