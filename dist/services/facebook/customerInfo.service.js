"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const customerInfo_repo_1 = require("@repos/facebook/customerInfo.repo");
function findDetailOrCreate(threadId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let customerInfo = yield customerInfo_repo_1.customerInfoRepo.findOne({ threadId: threadId });
        if (!customerInfo) {
            customerInfo = yield customerInfo_repo_1.customerInfoRepo.create({ threadId: threadId, createdBy: userId });
        }
        return customerInfo;
    });
}
function findDetail(threadId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield customerInfo_repo_1.customerInfoRepo.findOne({ threadId: threadId });
    });
}
function updateDetail(customerInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield customerInfo_repo_1.customerInfoRepo.updateOne({ threadId: customerInfo.threadId }, customerInfo);
    });
}
exports.default = {
    findDetailOrCreate: findDetailOrCreate,
    updateDetail,
    findDetail
};
