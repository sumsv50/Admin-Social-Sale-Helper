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
exports.p = void 0;
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const enum_1 = require("@models/site/enum");
const product_service_1 = require("@services/site/product.service");
const product_repo_1 = require("@repos/site/product.repo");
const passport_middleware_1 = require("@middlewares/passport.middleware");
const inputValidation_1 = require("@middlewares/inputValidation");
const ITEM_PER_PAGE = 12;
const router = (0, express_1.Router)();
exports.p = {
    root: '/',
    specificProduct: '/:productId',
    specificProductBySku: '/sku/:sku',
    enumCategories: '/enums/categories',
    getRelatedPosts: '/:productId/posts'
};
router.post(exports.p.root, (0, passport_middleware_1.jwtAuth)(), (0, inputValidation_1.validate)(inputValidation_1.schemas.createProduct), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const productData = req.body;
        productData.createdBy = user.id;
        const product = yield product_service_1.productService.createProduct(productData, enum_1.EC_SITE.FACEBOOK.code);
        if (!product)
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
                errorMessage: 'Mã sản phẩm đã tồn tại !!'
            }));
        return res.status(http_status_codes_1.StatusCodes.CREATED).json((0, responseFormat_1.default)(true, {}, {
            product
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// GET list product
router.get(exports.p.root, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            createdBy: user.id,
        };
        if (req.query.name) {
            query.name = new RegExp(String(req.query.name), 'i');
        }
        const page = Number(req.query.page) || 1;
        const products = yield product_repo_1.productRepo.findAll(query, page, ITEM_PER_PAGE);
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, {
            products: products.docs,
            pagination: Object.assign(Object.assign({}, products), { docs: undefined })
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// GET specific product
router.get(exports.p.specificProduct, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const productId = req.params.productId;
        const query = {
            createdBy: user.id,
            _id: productId
        };
        const product = yield product_repo_1.productRepo.findOne(query);
        if (!product) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Product not found"
            }));
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, {
            product,
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// GET specific product by sku
router.get(exports.p.specificProductBySku, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            createdBy: user.id,
            sku: req.params.sku
        };
        const product = yield product_repo_1.productRepo.findOne(query);
        if (!product) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Product not found"
            }));
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, {
            product,
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// GET related posts
router.get(exports.p.getRelatedPosts, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const productId = req.params.productId;
        const posts = yield product_service_1.productService.findRelatedPosts(user.id, productId);
        if (!posts) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "No post founded"
            }));
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, posts));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// PATCH edit product
router.patch(exports.p.specificProduct, (0, passport_middleware_1.jwtAuth)(), (0, inputValidation_1.validate)(inputValidation_1.schemas.updateProduct), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const productId = req.params.productId;
        const productData = req.body;
        const result = yield product_service_1.productService.updateProduct(user.id, productId, productData);
        if (result.failed) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {}, result));
        }
        const updatedProduct = yield product_repo_1.productRepo.findOne({ _id: productId });
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, Object.assign(Object.assign({ id: updatedProduct === null || updatedProduct === void 0 ? void 0 : updatedProduct._id }, updatedProduct), { _id: undefined })));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// DELETE product
router.delete(exports.p.specificProduct, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const productId = req.params.productId;
        const product = yield product_repo_1.productRepo.findOne({
            createdBy: user.id,
            _id: productId
        });
        if (!product) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Product not found"
            }));
        }
        const deletedResult = yield product_repo_1.productRepo.deleteOne({ _id: productId });
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(deletedResult.deletedCount > 0));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// DELETE many products
router.delete(exports.p.root, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { productIds } = req.body;
        const deletedResult = yield product_repo_1.productRepo.deleteMany(user.id, productIds);
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, {
            deletedCount: deletedResult.deletedCount
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.get(exports.p.enumCategories, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).end();
    }
    try {
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, enum_1.CATEGORIES));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Export default
exports.default = router;
