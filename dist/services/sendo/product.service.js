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
exports.sendoProductService = void 0;
const utils_1 = __importDefault(require("./utils"));
//define constant
const utils = new utils_1.default();
const https = require('https');
const hostname = 'open.sendo.vn';
class SendoProductService {
    constructor() {
    }
    getProductIdBySku(userId, sku) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const options = {
                hostname,
                path: '/api/partner/product?sku=' + sku,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            return utils.httpsRequestPromise(options)
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                return data.result.id;
            }))
                .catch((e) => {
                return e;
            });
        });
    }
    getProductById(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const options = {
                hostname,
                path: '/api/partner/product?id=' + productId,
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
    createProduct(userId, product) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const postData = JSON.stringify(product);
            const options = {
                hostname,
                path: `/api/partner/product`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            };
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
                req.write(postData);
                req.end();
            });
        });
    }
    getAllProducts(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const postData = JSON.stringify(data);
            const options = {
                hostname,
                path: `/api/partner/product/search`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            };
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
                req.write(postData);
                req.end();
            });
        });
    }
    updateProduct(userId, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            let productData = {};
            if (data.stockAvailable && data.stockAvailable.length > 0) {
                productData.stock_quantity = (_a = data.stockAvailable.find((stock) => stock.ecSite === 'Sendo')) === null || _a === void 0 ? void 0 : _a.quantity;
            }
            productData.id = yield this.getProductIdBySku(userId, data.sku);
            productData.sku = data.sku;
            productData.name = data.name;
            productData.price = data.exportPrice;
            productData.stock_availability = data.isAllowSell;
            productData.field_mask = ['sku', 'name', 'stock_availability', 'quantity', 'price'];
            const postData = JSON.stringify([productData]);
            const options = {
                hostname,
                path: `/api/partner/product/update-by-field-mask`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            };
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
                req.write(postData);
                req.end();
            });
        });
    }
    getProductLink(userId, sku) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const option = {
                hostname,
                path: '/api/partner/product?sku=' + sku,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            };
            return utils.httpsRequestPromise(option)
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                return data;
            }))
                .catch((e) => {
                return e;
            });
        });
    }
}
const sendoProductService = new SendoProductService();
exports.sendoProductService = sendoProductService;
