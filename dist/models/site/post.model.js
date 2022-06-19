"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const FbPost = new Schema({
    createdBy: Schema.Types.ObjectId,
    fbPostIds: [String],
    groups: [{
            id: String,
            name: String,
            privacy: String
        }],
    content: String,
    images: [String],
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    status: String,
    schedulePostTime: Number
}, { timestamps: true, id: true });
FbPost.plugin(mongoose_paginate_v2_1.default);
// Model name => collection
exports.default = mongoose_1.default.model('FbPost', FbPost, 'fb_posts');
