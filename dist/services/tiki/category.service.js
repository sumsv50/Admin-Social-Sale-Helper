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
class TikiCategoryService {
    constructor() {
        this.categories = [];
    }
    getAllCategories(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            return utils.httpsRequestPromise({
                hostname,
                path: '/integration/v2/categories',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
                .then((body) => {
                this.categories = body.data;
                return this.categories;
            })
                .catch((e) => {
                return e;
            });
        });
    }
    getRootCategories() {
        return this.categories.filter((category) => category.parent_id == 2);
    }
    getChildCategories(parentId) {
        const category = this.categories.find((category) => category.id == parentId);
        if (!category)
            return null;
        else if (category.is_primary)
            return null;
        return this.categories.filter((category) => category.parent_id == parentId);
    }
    getCategoryById(categoryId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2/categories/${categoryId}?includeParents=true`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
        });
    }
    getCategoryAttributes(categoryId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2/categories/${categoryId}/attributes`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
        });
    }
    getAttributeValues(attributeId, keyWord, limit, page, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            let path = `/integration/v2/attributes/${attributeId}/values?limit=${limit}&page=${page}`;
            if (keyWord)
                path += `&q=${keyWord}`;
            return utils.httpsRequestPromise({
                hostname,
                path,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
        });
    }
    getCategoryOptionLabels(categoryId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2/categories/${categoryId}/optionLabels`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
                .then((res) => {
                res.data = res.data.map((el) => ({
                    option_label: el.option_label.toLowerCase()
                }));
                return Array.from(new Set(res.data));
            });
        });
    }
}
exports.default = TikiCategoryService;
