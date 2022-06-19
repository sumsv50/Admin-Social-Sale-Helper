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
const message_service_1 = __importDefault(require("@services/facebook/message.service"));
const multer_1 = __importDefault(require("@shared/multer"));
const fb_1 = require("@shared/fb");
const passport_middleware_1 = require("@middlewares/passport.middleware");
const webhookAuthentication_middleware_1 = require("@middlewares/webhookAuthentication.middleware");
const messageRead_service_1 = __importDefault(require("@services/facebook/messageRead.service"));
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const router = (0, express_1.Router)();
const { OK, UNAUTHORIZED } = http_status_codes_1.default;
exports.p = {
    get: '/allConversations/:pageId',
    getDetail: '/detail/:threadId',
    receiveEvent: '/event',
    sendMessage: '/sendMessage',
    turnOnGreeting: '/turnOnGreeting',
    turnOffGreeting: '/turnOffGreeting',
    markThreadAsRead: '/markThreadAsRead',
    getGreeting: '/getGreeting',
};
router.get(exports.p.get, passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!(yield (0, fb_1.populatePageAccessToken)(user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook page'
            });
        }
        const conversations = yield message_service_1.default.getAllConversation(req.params.pageId, user.id);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, conversations));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.get(exports.p.getDetail, passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(OK);
        const user = req.user;
        if (!(yield (0, fb_1.populatePageAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook page'
            });
        }
        const messages = yield message_service_1.default.getDetail(req.params.threadId, user.id);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, messages));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.turnOnGreeting, passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populatePageAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook page'
            });
        }
        const { greetingText } = req.body;
        const response = yield message_service_1.default.turnOnGreeting(greetingText);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, response));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.get(exports.p.turnOffGreeting, passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populatePageAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook page'
            });
        }
        const response = yield message_service_1.default.turnOffGreeting();
        res.status(OK).json((0, responseFormat_1.default)(true, {}, response));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.get(exports.p.getGreeting, passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populatePageAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook page'
            });
        }
        const greeting = yield message_service_1.default.getGreeting();
        if (greeting) {
            res.status(OK).json((0, responseFormat_1.default)(true, {}, { greeting, isOn: true }));
        }
        else {
            res.status(OK).json((0, responseFormat_1.default)(true, {}, { isOn: false }));
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.receiveEvent, webhookAuthentication_middleware_1.webhookAuthentication, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield message_service_1.default.receiveEvent(req.body);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, { message: 'OK' }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.sendMessage, [passport_middleware_1.passport.authenticate('jwt', { session: false }), multer_1.default.single('messageAttachment')], ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populatePageAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook page'
            });
        }
        res.status(OK);
        const msgReq = Object.assign(Object.assign({}, req.body), { messageAttachment: req.file });
        yield message_service_1.default.sendMessage(msgReq);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, { message: 'OK' }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.markThreadAsRead, passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(OK);
        const user = req.user;
        if (req.body.threadId) {
            const messageReadRes = yield messageRead_service_1.default.updateMessageRead({ threadId: req.body.threadId, userId: user.id, isRead: true });
            res.status(OK).json((0, responseFormat_1.default)(true, {}, messageReadRes));
        }
        else {
            return res.status(200).json((0, responseFormat_1.default)(true, {}, { message: 'ThreadId is required' }));
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
exports.default = router;
