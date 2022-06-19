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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_1 = require("express");
const enums_1 = require("@models/sendo/enums");
const enum_1 = require("@models/site/enum");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const product_service_1 = require("@services/sendo/product.service");
const product_service_2 = require("@services/site/product.service");
// Define constant
const router = (0, express_1.Router)();
const { OK } = http_status_codes_1.default;
//Define routes
/**
 * create product.
 *
 * /api/sendo/product
 *
 */
router.post('/', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let product = req.body;
    product.createdBy = user.id;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    product_service_1.sendoProductService.createProduct(user.id, product)
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.success) {
            product = yield product_service_2.productService.convertEcProductToSiteProduct(product, enum_1.EC_SITE.SENDO.code);
            const siteProduct = yield product_service_2.productService.createProduct(product, enum_1.EC_SITE.SENDO.code);
            if (!siteProduct)
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
                    errorMessage: 'Mã sản phẩm đã tồn tại !!'
                }));
            res.status(OK).json((0, responseFormat_1.default)(true, {}, Object.assign({}, data)));
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, data));
        }
    }))
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            message: e
        }));
        ;
    });
})));
/**
 * Search products.
 *
 * /api/sendo/product/search
 *
 */
router.post('/search', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    product_service_1.sendoProductService.getAllProducts(user.id, req.body)
        .then((data) => {
        if (data.success) {
            res.status(OK).json((0, responseFormat_1.default)(true, {}, data.result));
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, data));
        }
    })
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            message: e
        }));
        ;
    });
})));
/**
 * get product by id.
 *
 * /api/sendo/product/{productId}
 *
 */
router.get('/:productId', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    product_service_1.sendoProductService.getProductById(user.id, req.params.productId.toString())
        .then((data) => {
        if (data.success) {
            res.status(OK).json((0, responseFormat_1.default)(true, {}, data.result));
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, data));
        }
    })
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            message: e
        }));
        ;
    });
})));
/**
 * get product link.
 *
 * /api/sendo/product/{sku}/link
 *
 */
router.get('/:sku/link', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const sku = req.params.sku;
    product_service_1.sendoProductService.getProductLink(user.id, sku)
        .then((data) => {
        if (data.success) {
            res.status(OK).json((0, responseFormat_1.default)(true, {}, { link: data.result.link }));
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, data));
        }
    })
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            message: e
        }));
        ;
    });
})));
/**
 * Update product
 *
 * /api/sendo/product
 *
 */
router.patch('', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const productData = req.body;
    if (!productData || !productData.sku) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            message: 'Body must include product sku'
        }));
    }
    product_service_1.sendoProductService.updateProduct(user.id, req.body)
        .then((data) => {
        if (data.success) {
            res.status(OK).json((0, responseFormat_1.default)(true, {}, data.result));
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, data));
        }
    })
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            message: e
        }));
        ;
    });
})));
/**
 * get all product type.
 *
 * /api/sendo/product/enums/type
 *
 */
router.get('/enums/type', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    try {
        return res.status(OK).json((0, responseFormat_1.default)(true, {}, enums_1.productType));
    }
    catch (e) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            message: e
        }));
        ;
    }
})));
/**
 * get all product status.
 *
 * /api/sendo/product/enums/status
 *
 */
router.get('/enums/status', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    try {
        return res.status(OK).json((0, responseFormat_1.default)(true, {}, enums_1.productStatus));
    }
    catch (e) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            message: e
        }));
        ;
    }
})));
/**
 * get all product unit.
 *
 * /api/sendo/product/enums/unit
 *
 */
router.get('/enums/unit', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    try {
        return res.status(OK).json((0, responseFormat_1.default)(true, {}, enums_1.productUnit));
    }
    catch (e) {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            message: e
        }));
        ;
    }
})));
exports.default = router;
