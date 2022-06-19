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
Object.defineProperty(exports, "__esModule", { value: true });
const enum_1 = require("@models/site/enum");
const user_repo_1 = require("@repos/site/user.repo");
const tikiTokens_repo_1 = require("@repos/tiki/tikiTokens.repo");
const sendoToken_repo_1 = require("@repos/sendo/sendoToken.repo");
function getConnectedECSite(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const connectedECSite = {};
        const user = yield user_repo_1.userRepo.getUserInfo({ _id: userId });
        if (user.fbAccessToken) {
            connectedECSite[enum_1.EC_SITE.FACEBOOK.site] = {
                fbAccessToken: user.fbAccessToken,
                fbAccessToken_expire: user.fbAccessToken_expire
            };
        }
        const tikiToken = yield tikiTokens_repo_1.tikiTokenRepo.findOne({ userId });
        if (tikiToken) {
            connectedECSite[enum_1.EC_SITE.TIKI.site] = tikiToken;
        }
        const sendoToken = yield sendoToken_repo_1.sendoTokenRepo.findOne({ userId });
        if (sendoToken) {
            connectedECSite[enum_1.EC_SITE.SENDO.site] = sendoToken;
        }
        return connectedECSite;
    });
}
exports.default = {
    getConnectedECSite
};
