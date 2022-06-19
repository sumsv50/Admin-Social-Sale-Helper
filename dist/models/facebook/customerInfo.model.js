"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const CustomerInfo = new Schema({
    threadId: String,
    senderId: String,
    city: String,
    district: String,
    phoneNumber: String,
    subDistrict: String,
    detailAddress: String,
    remark: String,
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    label: String,
    createdBy: Schema.Types.ObjectId,
}, { timestamps: true, id: true });
// Model name => collection
exports.default = mongoose_1.default.model('CustomerInfo', CustomerInfo, 'customer_infos');
