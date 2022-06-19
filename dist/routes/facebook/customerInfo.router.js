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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.p = void 0;
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const customerInfo_service_1 = __importDefault(require("@services/facebook/customerInfo.service"));
const ITEM_PER_PAGE = 12;
// Constants
const router = (0, express_1.Router)();
exports.p = {
    get: '/:threadId',
    update: '/:threadId'
};
// GET specific
router.get(exports.p.get, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const threadId = req.params.threadId;
        const customerInfo = yield customerInfo_service_1.default.findDetailOrCreate(threadId, user.id);
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            customerInfo,
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// PATCH edit product
router.patch(exports.p.update, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const threadId = req.params.threadId;
        const customerInfoData = req.body;
        const customerInfo = yield customerInfo_service_1.default.findDetail(threadId);
        if (!customerInfo) {
            return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(false, {
                message: "Customer Information not found"
            }));
        }
        customerInfo_service_1.default.updateDetail(Object.assign({ threadId: threadId }, customerInfoData));
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, Object.assign({ threadId: threadId }, customerInfoData)));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Export default
exports.default = router;
