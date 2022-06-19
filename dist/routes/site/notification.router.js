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
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const notification_service_1 = __importDefault(require("@services/site/notification.service"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
const notification_repo_1 = require("@repos/site/notification.repo");
const ITEM_PER_PAGE = 8;
const router = (0, express_1.Router)();
exports.p = {
    root: '/',
    markRead: '/markRead',
    markReadAll: '/markReadAll'
};
// GET list notification
router.get(exports.p.root, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const page = Number(req.query.page) || 1;
        const status = req.query.status;
        const notifications = yield notification_service_1.default.getNotification(user.id, status, page, ITEM_PER_PAGE);
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, {
            notifications: notifications.docs,
            pagination: Object.assign(Object.assign({}, notifications), { docs: undefined })
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// POST mark read notification
router.post(exports.p.markRead, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const notificationId = req.body.notificationId;
        const query = {
            userId: user.id,
            _id: notificationId
        };
        let notification = yield notification_repo_1.notificationRepo.findOne(query);
        if (!notification) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Notification not found"
            }));
        }
        const result = yield notification_repo_1.notificationRepo.updateOne({ _id: notificationId }, { isRead: true });
        if (result.modifiedCount <= 0) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {}, result));
        }
        notification = yield notification_repo_1.notificationRepo.findOne(query);
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, {
            notification,
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// POST mark read all notification
router.post(exports.p.markReadAll, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            userId: user.id,
            isRead: { "$ne": true }
        };
        const result = yield notification_repo_1.notificationRepo.updateMany(query, { isRead: true });
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, {
            modifiedCount: result.modifiedCount
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
exports.default = router;
