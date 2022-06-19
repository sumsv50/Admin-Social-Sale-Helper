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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_1 = require("express");
const auth_service_1 = __importDefault(require("@services/tiki/auth.service"));
const seller_service_1 = __importDefault(require("@services/tiki/seller.service"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const tikiTokens_repo_1 = require("@repos/tiki/tikiTokens.repo");
// Constants
const router = (0, express_1.Router)();
const authService = new auth_service_1.default();
const tikiSellerService = new seller_service_1.default();
const { OK } = http_status_codes_1.default;
//Define routes
/**
 * Get accesstoken from tiki save to DB.
 *
 * /api/tiki/auth/connection
 *
 */
router.post('/connection', passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { code } = req.body;
    try {
        const tokenObj = yield authService.getAccessToken(code);
        if (!tokenObj) {
            res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                errorMessage: 'invalid code'
            }));
            return;
        }
        // Save token to DB
        const expire = Date.now() + tokenObj.expiresIn * 1000;
        yield tikiTokens_repo_1.tikiTokenRepo.saveTikiAccessToken(user.id, tokenObj.accessToken, expire, tokenObj.refreshToken);
        const userInfo = yield authService.getUserInfo(tokenObj.accessToken);
        // Response
        res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            userInToken: Object.assign({}, userInfo)
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Refresh token.
 *
 * /api/tiki/auth/refresh
 *
 */
router.post('/refresh', passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    try {
        const tokenObj = yield authService.refreshToken(user.id);
        if (!tokenObj) {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {
                errorMessage: 'cannot refresh token'
            }));
            return;
        }
        // Save token to DB
        const expire = Date.now() + tokenObj.expiresIn * 1000;
        yield tikiTokens_repo_1.tikiTokenRepo.saveTikiAccessToken(user.id, tokenObj.accessToken, expire, tokenObj.refreshToken);
        const userInfo = yield authService.getUserInfo(tokenObj.accessToken);
        // Response
        res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            userInToken: Object.assign({}, userInfo)
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Check user already connected
 *
 * /api/tiki/auth/connection
 *
 */
router.get('/connection', passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const tikiToken = yield authService.getTokenByUserId(user.id);
        const tikiSeller = yield tikiSellerService.getInformation(user.id);
        if (tikiToken.accessToken)
            return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, Object.assign(Object.assign({}, tikiToken), { shopName: tikiSeller.name })));
        return res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            errorMessage: 'User has not connected yet'
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
exports.default = router;
