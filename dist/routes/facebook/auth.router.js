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
const user_repo_1 = require("@repos/site/user.repo");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("@shared/errors");
const auth_service_1 = __importDefault(require("@services/site/auth.service"));
const authentication_1 = __importDefault(require("@configs/authentication"));
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
// Constants
const router = (0, express_1.Router)();
exports.p = {
    fbOauth: '/',
    fbConnection: '/connection',
};
const encodedToken = (userId) => {
    return jsonwebtoken_1.default.sign({
        iss: "social-sale-helper",
        sub: userId,
    }, authentication_1.default.JWT_SECRET, {
        expiresIn: '30d'
    });
};
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: user id
 *           example: "968221704087336"
 *         email:
 *           type: string
 *           description: email of user.
 *           example: user_1@gmail.com
 *         picture:
 *            type: string
 *            description: picture of account
 *            example: https://picture.com
 *     Token:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Access token
 */
/**
 * @swagger
 * /api/auth/facebook:
 *   post:
 *     summary: Oauth Facebook
 *     tags: ["Auth"]
 *     requestBody: {
 *      content: {
 *        "application/json":
 *         {
 *           schema:
 *           {
 *            $ref: '#/components/schemas/Token'
 *           }
 *         }
 *
 *      }
 *     }
 *     responses:
 *       200:
 *         description: Signup/login successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 *
 */
router.post(exports.p.fbOauth, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken } = req.body;
        // Fetch data
        const userInfo = yield auth_service_1.default.getUserFBInfo(accessToken);
        const longTimeToken = yield auth_service_1.default.getLongTimeToken(accessToken);
        if (!userInfo) {
            throw new errors_1.InvalidTokenError();
        }
        userInfo.picture = `https://graph.facebook.com/${userInfo.id}/picture?access_token=${longTimeToken.access_token}&type=large`;
        const user = yield user_repo_1.userRepo.findOrCreate(userInfo);
        const token = encodedToken(user._id);
        // if(user.fbAccessToken) {
        const expire = Date.now() + (longTimeToken.expires_in || 1) * 1000;
        yield user_repo_1.userRepo.saveFBAccessToken(user._id, longTimeToken.access_token, expire);
        // }
        res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                picture: user.picture
            }
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {
            message: err.message
        }));
    }
})));
router.post(exports.p.fbConnection, passport_middleware_1.passport.authenticate('jwt', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { accessToken } = req.body;
    // Fetch data
    const userInfo = yield auth_service_1.default.getUserFBInfo(accessToken);
    const longTimeToken = yield auth_service_1.default.getLongTimeToken(accessToken);
    if (!userInfo || !longTimeToken) {
        throw new errors_1.InvalidTokenError();
    }
    // Save token to DB
    const expire = Date.now() + longTimeToken.expires_in * 1000;
    yield user_repo_1.userRepo.saveFBAccessToken(user.id, longTimeToken.access_token, expire);
    // Response
    res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
        userInToken: {
            fbId: userInfo.id,
            name: userInfo.name,
            picture: userInfo.picture
        }
    }));
})));
// Export default
exports.default = router;
