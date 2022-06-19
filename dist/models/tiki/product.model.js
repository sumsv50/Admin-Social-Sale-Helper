"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const TikiProduct = new Schema({
    category_id: Number,
    category_name: String,
    name: String,
    sku: String,
    description: String,
    market_price: Number,
    attributes: Array,
    image: String,
    images: Array,
    option_attributes: Array,
    variants: Array,
    certificate_files: Array,
    track_id: String,
    request_id: String,
    state: String,
    state_description: String,
    reason: String,
    createdBy: Schema.Types.ObjectId,
}, { timestamps: true, id: true });
// Model name => collection
TikiProduct.plugin(mongoose_paginate_v2_1.default);
// Model name => collection
exports.default = mongoose_1.default.model('TikiProduct', TikiProduct, 'tiki_products');
