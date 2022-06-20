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
const user_repo_1 = require("@repos/site/user.repo");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const user_service_1 = __importDefault(require("@services/site/user.service"));
const ITEM_PER_PAGE = 20;
// Constants
const router = (0, express_1.Router)();
exports.p = {
    root: '/',
    specificUser: '/:userId',
    blockUser: '/block',
    unBlockUser: '/unBlock'
};
router.get(exports.p.root, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = {};
        if (req.query.name) {
            query.name = new RegExp(String(req.query.name), 'i');
        }
        const page = Number(req.query.page) || 1;
        const users = yield user_repo_1.userRepo.findAllPagination(query, page, ITEM_PER_PAGE);
        const responeBody = [];
        for (const user of users.docs) {
            const userId = user._id;
            const connectedECSite = yield user_service_1.default.getConnectedECSite(userId);
            responeBody.push({
                userInfo: user,
                connectedECSite
            });
        }
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            users: responeBody,
            pagination: Object.assign(Object.assign({}, users), { docs: undefined })
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.get(exports.p.specificUser, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const userInfo = yield user_repo_1.userRepo.getUserInfo({ _id: userId });
        if (!userInfo) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "User not found"
            }));
        }
        const connectedECSite = yield user_service_1.default.getConnectedECSite(userId);
        res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            userInfo,
            connectedECSite
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Block user
router.post(exports.p.blockUser, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const user = yield user_repo_1.userRepo.getUserInfo({ _id: userId });
        if (!user) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "User not found"
            }));
        }
        if (user.isBlocked) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "User already has been blocked"
            }));
        }
        const result = yield user_repo_1.userRepo.updateOne({ _id: userId }, { isBlocked: true });
        if (result.modifiedCount <= 0) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {}, result));
        }
        const updatedUser = yield user_repo_1.userRepo.getUserInfo({ _id: userId });
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            user: updatedUser
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Unblock user
router.post(exports.p.unBlockUser, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const user = yield user_repo_1.userRepo.getUserInfo({ _id: userId });
        if (!user) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "User not found"
            }));
        }
        if (!user.isBlocked) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "User is not currently blocked"
            }));
        }
        const result = yield user_repo_1.userRepo.updateOne({ _id: userId }, { isBlocked: false });
        if (result.modifiedCount <= 0) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {}, result));
        }
        const updatedUser = yield user_repo_1.userRepo.getUserInfo({ _id: userId });
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            user: updatedUser
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Export default
exports.default = router;
