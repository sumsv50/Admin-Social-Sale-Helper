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
const https_1 = __importDefault(require("https"));
const sendoToken_repo_1 = require("@repos/sendo/sendoToken.repo");
//define constant
const hostname = 'open.sendo.vn';
class SendoAuthService {
    constructor() { }
    initialSave(userId, token, expires, keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = Object.assign({ userId,
                token,
                expires }, keys);
            return yield sendoToken_repo_1.sendoTokenRepo.saveTokenAndKeys(userId, data);
        });
    }
    saveAccessToken(usreId, tokens) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sendoToken_repo_1.sendoTokenRepo.saveSendoAccessToken(usreId, tokens);
        });
    }
    getAccessToken(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const postData = JSON.stringify(data);
            const options = {
                hostname,
                path: `/login`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return new Promise(function (resolve, reject) {
                const req = https_1.default.request(options, function (res) {
                    // cumulate data
                    let data = [];
                    res.on('data', function (chunk) {
                        data.push(chunk);
                    });
                    // resolve on end
                    res.on('end', function () {
                        try {
                            data = JSON.parse(Buffer.concat(data).toString());
                        }
                        catch (e) {
                            reject(e);
                        }
                        resolve(data);
                    });
                });
                // reject on request error
                req.on('error', function (error) {
                    reject(error);
                });
                req.write(postData);
                req.end();
            });
        });
    }
    refreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenInfo = yield sendoToken_repo_1.sendoTokenRepo.findOne({ userId });
            let data = {};
            if (tokenInfo.shopKey && tokenInfo.secretKey) {
                data.shop_key = tokenInfo.shopKey;
                data.secret_key = tokenInfo.secretKey;
            }
            else {
                return new Promise(function (resolve, reject) {
                    reject({
                        error: {
                            message: 'User has not registered sendo yet'
                        }
                    });
                });
            }
            const postData = JSON.stringify(data);
            const options = {
                hostname,
                path: `/login`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            return new Promise(function (resolve, reject) {
                const req = https_1.default.request(options, function (res) {
                    // cumulate data
                    let data = [];
                    res.on('data', function (chunk) {
                        data.push(chunk);
                    });
                    // resolve on end
                    res.on('end', function () {
                        try {
                            data = JSON.parse(Buffer.concat(data).toString());
                        }
                        catch (e) {
                            reject(e);
                        }
                        resolve(data);
                    });
                });
                // reject on request error
                req.on('error', function (error) {
                    reject(error);
                });
                req.write(postData);
                req.end();
            });
        });
    }
    getTokenByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sendoToken_repo_1.sendoTokenRepo.findOne({
                userId
            });
        });
    }
}
exports.default = SendoAuthService;
