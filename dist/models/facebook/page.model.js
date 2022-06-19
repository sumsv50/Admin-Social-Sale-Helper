"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const Page = new Schema({
    _id: String,
    pageId: String,
    senderId: String,
    quickReplies: [
        { type: Schema.Types.ObjectId, ref: 'QuickReply' }
    ],
    autoReplies: [
        { type: Schema.Types.ObjectId, ref: 'AutoReply' }
    ],
}, { timestamps: true, id: true });
// Model name => collection
exports.default = mongoose_1.default.model('Page', Page, 'pages');
