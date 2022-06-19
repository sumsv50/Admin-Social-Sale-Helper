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
const product_repo_1 = require("@repos/tiki/product.repo");
//define constant
const https = require('https');
const utils = new utils_1.default();
const hostname = 'api.tiki.vn';
function productToProductRequest(product) {
    let tempProduct = Object.assign({}, product);
    if (tempProduct.attributes) {
        const attributes = tempProduct.attributes;
        tempProduct.attributes = {};
        attributes.forEach((attr) => {
            tempProduct.attributes[attr.attribute_code] = attr.value;
        });
    }
    return tempProduct;
}
class TikiProductService {
    getTrackIdByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_repo_1.tikiProductRepo.findOne({ _id: productId });
            if (product) {
                return product.track_id;
            }
            return null;
        });
    }
    getRequestIdByProductId(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_repo_1.tikiProductRepo.findOne({ _id: productId });
            if (product) {
                return product.request_id;
            }
            return null;
        });
    }
    requestOneProduct(product, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const postData = JSON.stringify(productToProductRequest(product));
            const options = {
                hostname,
                path: `/integration/v2.1/requests`,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
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
    getAllProductRequestsStatus(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2/tracking`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                if (Array.isArray(data)) {
                    const products = yield product_repo_1.tikiProductRepo.findAll(Number.parseInt(page), Number.parseInt(limit));
                    products.docs.forEach((product) => __awaiter(this, void 0, void 0, function* () {
                        const statusData = data.find((el) => el.track_id === product.track_id);
                        if (statusData) {
                            yield product_repo_1.tikiProductRepo.updateStatus(product.track_id, statusData);
                        }
                    }));
                }
                return yield product_repo_1.tikiProductRepo.findAll(Number.parseInt(page), Number.parseInt(limit));
            }));
        });
    }
    getOneProductRequestStatus(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const trackId = yield this.getTrackIdByProductId(productId);
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2/tracking/${trackId}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
                .then((data) => __awaiter(this, void 0, void 0, function* () {
                if (data.state) {
                    yield product_repo_1.tikiProductRepo.updateStatus(trackId, data);
                }
                return yield product_repo_1.tikiProductRepo.findOne({ _id: productId });
            }));
        });
    }
    replayProductRequest(producId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const trackId = yield this.getTrackIdByProductId(producId);
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2/tracking/${trackId}/replay`,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
        });
    }
    getProductRequestInfoById(requestId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2/requests/${requestId}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
        });
    }
    getAllProductRequestsInfo(pagination, state, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2/requests?state=${state}&page=${pagination.page}&limit=${pagination.limit}&include=products`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
        });
    }
    deleteProductRequest(productId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            const requestId = yield this.getRequestIdByProductId(productId);
            if (!requestId)
                return new Promise((resolve, reject) => {
                    reject('Cannot delete this product request yet!');
                });
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2/requests/${requestId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
        });
    }
    getAllProducts(userId, name, active, category_id, page, limit, created_from_date, updated_from_date, created_to_date, updated_to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = yield utils.getAccessTokenByUserId(userId);
            return utils.httpsRequestPromise({
                hostname,
                path: `/integration/v2.1/products?name=${name}&active=${active}&category_id=${category_id}&page=${page}&limit=${limit}
                &created_from_date=${created_from_date}&updated_from_date=${updated_from_date}
                &created_to_date=${created_to_date}&updated_to_date=${updated_to_date}&include=inventory`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            });
        });
    }
    createProductFromRequest(productRequest, resBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (resBody.track_id && resBody.state) {
                return yield product_repo_1.tikiProductRepo.saveProductFromProductRequest(productRequest, resBody);
            }
            return resBody;
        });
    }
    getProductLink(userId, sku) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_repo_1.tikiProductRepo.findOne({
                createdBy: userId,
                sku
            });
            if (!product)
                return false;
            return {
                link: product.request_id ? `https://sellercenter.tiki.vn/new/#/products/update/request/${product.request_id}?source_screen=request_list` : null,
                id: product._id
            };
        });
    }
}
exports.default = TikiProductService;
