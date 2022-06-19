"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const Order = new Schema({
    products: [{
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: Number,
        }],
    customer_fb_id: String,
    customer_id: String,
    thread_id: String,
    customer_name: String,
    delivery_date: Date,
    product_total: String,
    delivery_total: Number,
    discount: Number,
    total_payment: Number,
    note: String,
    state: Number,
    ec_site: Number,
    createdBy: Schema.Types.ObjectId
}, { timestamps: true, id: true });
Order.plugin(mongoose_paginate_v2_1.default);
// Model name => collection
exports.default = mongoose_1.default.model('Order', Order, 'orders');
