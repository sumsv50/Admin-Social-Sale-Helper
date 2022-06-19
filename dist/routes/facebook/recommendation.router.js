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
const recommendation_service_1 = __importDefault(require("@services/facebook/recommendation.service"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
const webhookAuthentication_middleware_1 = require("@middlewares/webhookAuthentication.middleware");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const router = (0, express_1.Router)();
const { CREATED, OK } = http_status_codes_1.default;
exports.p = {
    get: '/:pageId',
    add: '/addNew',
    delete: '/',
    update: '/:id',
    getResponseMessageContent: '/getResponseMessageContent',
};
router.get(exports.p.get, passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pageId } = req.params;
        const recommendations = yield recommendation_service_1.default.getManyRecommendation(pageId);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, recommendations));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.add, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recommendation = yield recommendation_service_1.default.addRecommendation(req.body);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, recommendation));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.delete(exports.p.delete, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recommendation = yield recommendation_service_1.default.deleteRecommendation(req.body);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, recommendation));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.patch(exports.p.update, passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.user.id;
        if (((_a = req.params) === null || _a === void 0 ? void 0 : _a.id.length) === 0) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false));
            return;
        }
        req.body = Object.assign(Object.assign({}, req.body), { userId, _id: req.params.id });
        const recommendations = yield recommendation_service_1.default.updateRecommendation(req.body);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, recommendations));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.getResponseMessageContent, webhookAuthentication_middleware_1.webhookAuthentication, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseMessageContent = yield recommendation_service_1.default.getResponseMessageContent(req.body.pageId, req.body.message);
        res.status(OK).json(responseMessageContent);
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json(err);
    }
})));
exports.default = router;
