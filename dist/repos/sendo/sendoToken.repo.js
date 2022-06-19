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
exports.sendoTokenRepo = void 0;
const sendoToken_model_1 = __importDefault(require("@models/sendo/sendoToken.model"));
class SendoTokenRepo {
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendoToken = yield sendoToken_model_1.default.findOne(query).lean();
            return sendoToken;
        });
    }
    saveSendoAccessToken(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let sendoToken = yield sendoToken_model_1.default.findOne({ userId });
            if (sendoToken) {
                sendoToken.accessToken = data.token;
                sendoToken.accessTokenExpire = data.expires;
                return yield sendoToken.save();
            }
            sendoToken = new sendoToken_model_1.default({
                userId,
                accessToken: data.token,
                accessTokenExpire: data.expires,
            });
            return yield sendoToken.save();
        });
    }
    saveTokenAndKeys(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let sendoToken = yield sendoToken_model_1.default.findOne({ userId });
            if (sendoToken) {
                sendoToken.accessToken = data.token;
                sendoToken.accessTokenExpire = data.expires;
                sendoToken.shopName = data.shopName;
                return yield sendoToken.save();
            }
            sendoToken = new sendoToken_model_1.default({
                userId,
                accessToken: data.token,
                accessTokenExpire: data.expires,
                shopKey: data.shop_key,
                secretKey: data.secret_key,
                shopName: data.shopName
            });
            return yield sendoToken.save();
        });
    }
}
const sendoTokenRepo = new SendoTokenRepo();
exports.sendoTokenRepo = sendoTokenRepo;
