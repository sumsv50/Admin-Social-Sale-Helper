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
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const quickReply_service_1 = __importDefault(require("@services/facebook/quickReply.service"));
const fb_1 = require("@shared/fb");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const router = (0, express_1.Router)();
const { CREATED, OK } = http_status_codes_1.default;
exports.p = {
    get: '/:pageId',
    add: '/addNew',
    delete: '/',
    update: '/:id',
    sendMessage: '/sendMessage',
};
router.get(exports.p.get, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageId } = req.params;
        const quickreplies = yield quickReply_service_1.default.getQuickReply(pageId);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, quickreplies));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.add, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quickreply = yield quickReply_service_1.default.addQuickReply(req.body);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, quickreply));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.delete(exports.p.delete, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quickreplies = yield quickReply_service_1.default.deleteQuickReply(req.body);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, quickreplies));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.patch(exports.p.update, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.params) === null || _a === void 0 ? void 0 : _a.id.length) === 0) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false));
            return;
        }
        const quickreplies = yield quickReply_service_1.default.updateQuickReply(Object.assign({ _id: req.params.id }, req.body));
        res.status(OK).json((0, responseFormat_1.default)(true, {}, quickreplies));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.sendMessage, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, fb_1.populatePageAccessToken)(req.user);
        const message = yield quickReply_service_1.default.sendMessage(req.body);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, message));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
exports.default = router;
