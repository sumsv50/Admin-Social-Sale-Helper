"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const TemplateComment = new Schema({
    createdBy: Schema.Types.ObjectId,
    comment: String,
    title: String,
    image: String,
}, { timestamps: true, id: true });
TemplateComment.plugin(mongoose_paginate_v2_1.default);
// Model name => collection
exports.default = mongoose_1.default.model('TemplateComment', TemplateComment, 'template-comments');
