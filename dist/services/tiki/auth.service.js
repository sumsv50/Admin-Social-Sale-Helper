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
const form_data_1 = __importDefault(require("form-data"));
const https_1 = __importDefault(require("https"));
const authentication_1 = __importDefault(require("@configs/authentication"));
const utils_1 = __importDefault(require("./utils"));
const tikiTokens_repo_1 = require("@repos/tiki/tikiTokens.repo");
const utils = new utils_1.default();
class TikiAuthService {
    constructor() { }
    getAccessToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const formData = new form_data_1.default();
                formData.append('grant_type', 'authorization_code');
                formData.append('code', code);
                formData.append('redirect_uri', authentication_1.default.TIKI_REDIRECT_URI);
                formData.append('client_id', authentication_1.default.TIKI_CLIENT_ID);
                formData.append('client_secret', authentication_1.default.TIKI_CLIENT_SECRET);
                formData.submit('https://api.tiki.vn/sc/oauth2/token', (err, res) => {
                    var body = '';
                    if (err) {
                        reject(err);
                    }
                    res.on('data', function (chunk) {
                        body += chunk;
                    });
                    res.on('end', function () {
                        const bodyJson = JSON.parse(body);
                        if (bodyJson.status_code === 400) {
                            console.log(bodyJson);
                            resolve(null);
                        }
                        resolve({
                            accessToken: bodyJson.access_token,
                            expiresIn: bodyJson.expires_in,
                            refreshToken: bodyJson.refresh_token,
                        });
                    });
                });
            });
        });
    }
    getUserInfo(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                https_1.default.get({
                    host: 'api.tiki.vn',
                    path: '/integration/v2/sellers/me',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                }, (res) => {
                    var body = '';
                    res.on('data', function (chunk) {
                        body += chunk;
                    });
                    res.on('end', function () {
                        const userData = JSON.parse(body);
                        resolve(userData);
                    });
                });
            });
        });
    }
    refreshToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tikiToken = yield utils.getAccessTokenByUserId(userId);
            return new Promise((resolve, reject) => {
                if (!tikiToken)
                    reject();
                const formData = new form_data_1.default();
                formData.append('grant_type', 'refresh_token');
                formData.append('refresh_token', tikiToken.refreshToken);
                formData.append('client_id', authentication_1.default.TIKI_CLIENT_ID);
                formData.append('client_secret', authentication_1.default.TIKI_CLIENT_SECRET);
                formData.submit('https://api.tiki.vn/sc/oauth2/token', (err, res) => {
                    var body = '';
                    if (err) {
                        reject(err);
                    }
                    res.on('data', function (chunk) {
                        body += chunk;
                    });
                    res.on('end', function () {
                        const bodyJson = JSON.parse(body);
                        if (bodyJson.status_code === 400) {
                            console.log(bodyJson);
                            resolve(null);
                        }
                        resolve({
                            accessToken: bodyJson.access_token,
                            expiresIn: bodyJson.expires_in,
                            refreshToken: bodyJson.refresh_token,
                        });
                    });
                });
            });
        });
    }
    getTokenByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tikiTokens_repo_1.tikiTokenRepo.findOne({
                userId
            });
        });
    }
}
exports.default = TikiAuthService;
