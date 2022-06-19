"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const PostTemplate = new Schema({
    createdBy: Schema.Types.ObjectId,
    title: String,
    content: String,
}, { timestamps: true, id: true });
PostTemplate.plugin(mongoose_paginate_v2_1.default);
// Model name => collection
exports.default = mongoose_1.default.model('PostTemplate', PostTemplate, 'post_templates');
