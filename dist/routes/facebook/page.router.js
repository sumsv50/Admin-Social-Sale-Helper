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
const fb_1 = require("@shared/fb");
const page_service_1 = __importDefault(require("@services/facebook/page.service"));
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const router = (0, express_1.Router)();
const { CREATED, OK, UNAUTHORIZED } = http_status_codes_1.default;
exports.p = {
    get: '/all',
    getConnectedPage: '/',
    connect: '/connect',
};
router.get(exports.p.get, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populateUserAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User did not connect to facebook',
            });
        }
        const pages = yield page_service_1.default.getAll();
        res.status(OK).json((0, responseFormat_1.default)(true, {}, pages));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.get(exports.p.getConnectedPage, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populatePageAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User did not connect to facebook page',
            });
        }
        const page = yield page_service_1.default.findDetail();
        if (!page) {
            res.status(OK).json((0, responseFormat_1.default)(false, {}, { message: 'User did not connect to this page' }));
        }
        res.status(OK).json((0, responseFormat_1.default)(true, {}, page));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.connect, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populateUserAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User did not connect to facebook',
            });
        }
        const user = req.user;
        const response = yield page_service_1.default.connectPage(user.id, req.body.pageId);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, response));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
exports.default = router;
