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
const utils_1 = __importDefault(require("./utils"));
//define constance
const utils = new utils_1.default();
const hostname = 'api.tiki.vn';
class TikiSellerService {
    getInformation(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            return yield utils.httpsRequestPromise({
                hostname,
                path: '/integration/v2/sellers/me',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
        });
    }
    getWarehouses(limit, page, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2/sellers/me/warehouses?status=1&type=1&limit=${limit}&page=${page}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
        });
    }
}
exports.default = TikiSellerService;
