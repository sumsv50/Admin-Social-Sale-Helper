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
const fb_1 = require("@shared/fb");
const authentication_1 = __importDefault(require("@configs/authentication"));
function getUserFBInfo(fbAccessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = yield fb_1.FB.api('me', { fields: ['id', 'name'], access_token: fbAccessToken });
        const picture = `https://graph.facebook.com/${profile.id}/picture?access_token=${fbAccessToken}&type=large`;
        return Object.assign(Object.assign({}, profile), { picture, fbAccessToken });
    });
}
function getLongTimeToken(accessToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const longTimeToken = yield fb_1.FB.api('oauth/access_token', {
            client_id: authentication_1.default.FB_CLIENT_ID,
            client_secret: authentication_1.default.FB_CLIENT_SECRET,
            grant_type: 'fb_exchange_token',
            fb_exchange_token: accessToken
        });
        return longTimeToken;
    });
}
exports.default = {
    getUserFBInfo,
    getLongTimeToken
};
