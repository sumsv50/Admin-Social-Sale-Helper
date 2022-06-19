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
const https = require('https');
const tikiTokens_repo_1 = require("@repos/tiki/tikiTokens.repo");
class Utils {
    httpsRequestPromise(options) {
        return new Promise(function (resolve, reject) {
            const req = https.request(options, function (res) {
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
            req.end();
        });
    }
    getAccessTokenByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tikiToken = yield tikiTokens_repo_1.tikiTokenRepo.findOne({ userId });
            if (tikiToken.accessToken) {
                return tikiToken.accessToken;
            }
            else
                return '';
        });
    }
}
exports.default = Utils;
