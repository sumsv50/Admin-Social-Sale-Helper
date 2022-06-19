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
const passport_middleware_1 = require("@middlewares/passport.middleware");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const auth_service_1 = __importDefault(require("@services/sendo/auth.service"));
// Constants
const router = (0, express_1.Router)();
const authService = new auth_service_1.default();
const { OK } = http_status_codes_1.default;
//Define routes
/**
 * Get accesstoken from tiki save to DB.
 *
 * /api/sendo/auth/connection
 *
 */
router.post('/connection', passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    try {
        const resBody = yield authService.getAccessToken(req.body);
        if (resBody.error) {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {
                errorMessage: resBody.error.message
            }));
        }
        // Save token to DB
        const tokenInfo = yield authService.initialSave(user.id, resBody.result.token, resBody.result.expires, req.body);
        // Response
        if (tokenInfo._doc) {
            res.status(OK).json((0, responseFormat_1.default)(true, {}, {
                tokens: Object.assign({}, tokenInfo._doc)
            }));
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {
                errorMessage: 'Cannot save user token'
            }));
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Refresh token.
 *
 * /api/sendo/auth/refresh
 *
 */
router.post('/refresh', passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    try {
        const resBody = yield authService.refreshToken(user.id);
        if (resBody.error) {
            res.status(resBody.statusCode).json((0, responseFormat_1.default)(false, {
                errorMessage: resBody.error.message
            }));
        }
        // Save token to DB
        const tokenInfo = yield authService.saveAccessToken(user.id, resBody.result);
        // Response
        if (tokenInfo._doc) {
            res.status(OK).json((0, responseFormat_1.default)(true, {}, {
                tokens: Object.assign({}, tokenInfo._doc)
            }));
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {
                errorMessage: 'Cannot save user token'
            }));
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Check user already connected
 *
 * /api/sendo/auth/connection
 *
 */
router.get('/connection', passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    try {
        const sendoToken = yield authService.getTokenByUserId(user.id);
        if (sendoToken.accessToken)
            return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, sendoToken));
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
