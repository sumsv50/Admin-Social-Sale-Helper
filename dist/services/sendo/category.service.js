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
const hostname = 'open.sendo.vn';
class SendoCategoryService {
    constructor() {
    }
    getRecentCategories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const options = {
                hostname,
                path: '/api/partner/category',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            return utils.httpsRequestPromise(options)
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                return data;
            }))
                .catch((e) => {
                return e;
            });
        });
    }
    getRootCategories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const options = {
                hostname,
                path: '/api/partner/category/0',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            return utils.httpsRequestPromise(options)
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                return data;
            }))
                .catch((e) => {
                return e;
            });
        });
    }
    getCategoryById(categoryId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const options = {
                hostname,
                path: '/api/partner/category/' + categoryId,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            return utils.httpsRequestPromise(options)
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                return data;
            }))
                .catch((e) => {
                return e;
            });
        });
    }
}
exports.default = SendoCategoryService;
