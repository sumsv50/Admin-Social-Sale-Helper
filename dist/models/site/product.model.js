"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const Product = new Schema({
    createdBy: Schema.Types.ObjectId,
    name: String,
    sku: String,
    weight: Number,
    height: Number,
    width: Number,
    length: Number,
    dimensionUnit: String,
    weightUnit: String,
    stockAvailable: [{
            ecSite: String,
            quantity: Number,
        }],
    importPrice: Number,
    exportPrice: Number,
    type: String,
    description: String,
    branch: String,
    inventoryNumber: Number,
    image: String,
    images: [String],
    isAllowSell: { type: Boolean, default: true },
}, { timestamps: true, id: true });
Product.plugin(mongoose_paginate_v2_1.default);
// Model name => collection
exports.default = mongoose_1.default.model('Product', Product, 'products');
