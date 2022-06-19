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
const enum_1 = require("@models/site/enum");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const product_service_1 = __importDefault(require("@services/tiki/product.service"));
const product_service_2 = require("@services/site/product.service");
// Define constance
const router = (0, express_1.Router)();
const tikiProductService = new product_service_1.default();
const { OK } = http_status_codes_1.default;
//Define routes
/**
 * Send product request to tiki.
 *
 * /api/tiki/product/request
 *
 */
router.post('/request', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let product = req.body.product;
    product.createdBy = user.id;
    yield tikiProductService.requestOneProduct(product, user.id)
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        data.userId = user.id;
        const result = yield tikiProductService.createProductFromRequest(product, data);
        if (result.track_id) {
            product = yield product_service_2.productService.convertEcProductToSiteProduct(product, enum_1.EC_SITE.TIKI.code);
            const siteProduct = yield product_service_2.productService.createProduct(product, enum_1.EC_SITE.TIKI.code);
            if (!siteProduct)
                res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
                    errorMessage: 'Mã sản phẩm đã tồn tại !!'
                }));
            res.status(OK).json((0, responseFormat_1.default)(false, {}, result));
        }
        else {
            res.statusMessage = 'request failed';
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, result)).end();
        }
    }))
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            errorMessage: e
        })).end();
    });
})));
/**
 * Get all product requests status
 *
 * /api/tiki/product/request?page=&limit=
 *
 */
router.get('/request', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let page = '1', limit = '10';
    if (req.query.page)
        page = req.query.page.toString();
    if (req.query.limit)
        limit = req.query.limit.toString();
    tikiProductService.getAllProductRequestsStatus(user.id, page, limit)
        .then((data) => {
        res.status(OK).json((0, responseFormat_1.default)(true, {}, {
            products: data.docs,
            pagination: Object.assign(Object.assign({}, data), { docs: null })
        }));
    })
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            errorMessage: e
        })).end();
    });
})));
/**
 * Get a product request status
 *
 * /api/tiki/product/request/{productId}
 *
 */
router.get('/request/:productId', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let productId = req.params.productId;
    tikiProductService.getOneProductRequestStatus(productId, user.id)
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(OK).json((0, responseFormat_1.default)(true, {}, data));
    }))
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            errorMessage: e
        })).end();
    });
})));
/**
 * Get product link
 *
 * /api/tiki/product/{sku}/link
 *
 */
router.get('/:sku/link', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    let sku = req.params.sku;
    tikiProductService.getProductLink(user.id, sku)
        .then(data => {
        if (data)
            res.status(OK).json((0, responseFormat_1.default)(true, {}, data)).end();
        else
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
                errorMessage: 'Link chưa có sẵn, Vui lòng thử lại sau.'
            })).end();
    })
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            errorMessage: e
        })).end();
    });
})));
/**
 * Replay product request
 *
 * /api/tiki/product/request/:productId/replay
 *
 */
router.post('/request/:productId/replay', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const productId = req.params.productId;
    if (!productId) {
        res.status(http_status_codes_1.default.BAD_REQUEST).end();
    }
    tikiProductService.replayProductRequest(productId, user.id)
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(OK).json((0, responseFormat_1.default)(true, {}, data));
    }))
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            errorMessage: e
        })).end();
    });
})));
/**
 * Cancel a product request
 *
 * /api/tiki/product/request/{productId}
 *
 */
router.delete('/request/:productId', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const productId = req.params.productId;
    if (!productId) {
        res.status(http_status_codes_1.default.BAD_REQUEST).end();
    }
    tikiProductService.deleteProductRequest(productId, user.id)
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data.track_id && data.state && data.reason) {
            res.status(OK).json((0, responseFormat_1.default)(true, {}, data));
        }
        else {
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
        }
    }))
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            errorMessage: e
        })).end();
    });
})));
/**
 * Get request info by request_id
 *
 * /api/tiki/product/request/{requestId}
 *
 */
//  router.get('/request/:requestId', (async (req: Request, res: Response) => {
//     const user = <UserDTO>req.user;
//     const requestId = req.params.requestId;
//     if (!user) {
//         res.status(StatusCodes.UNAUTHORIZED).end();
//     } 
//     if (!requestId) {
//         res.status(StatusCodes.BAD_REQUEST).end();
//     }
//     productService.getProductRequestInfoById(requestId , user.id)
//     .then(async (data: any) => {
//         res.status(OK).json(data);
//     })
//     .catch((e) => {
//         res.statusMessage = e;
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//     })
// }) as RequestHandler);
/**
 * Get all request info
 *
 * /api/tiki/product/request
 *
 */
//  router.get('/request', (async (req: Request, res: Response) => {
//     const user = <UserDTO>req.user;
//     let pagination = {
//         page: '1',
//         limit: '20',
//     },
//     state = '';
//     if (!user) {
//         res.status(StatusCodes.UNAUTHORIZED).end();
//     } 
//     if (req.query.page) {
//         pagination.page = req.query.page.toString();
//     }
//     if (req.query.limit) {
//         pagination.limit = req.query.limit.toString();
//     }
//     if (req.query.state) {
//         state = req.query.state.toString();
//     }
//     productService.getAllProductRequestsInfo(pagination, state , user.id)
//     .then(async (data: any) => {
//         res.status(OK).json(data);
//     })
//     .catch((e) => {
//         res.statusMessage = e;
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//     })
// }) as RequestHandler);
/**
 * Get all products approved
 *
 * /api/tiki/product?name=&active=&category_id=&page=&limit=&created_from_date=&created_to_date=&updated_from_date=&updated_to_date=&
 *
 */
router.get('/', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const name = req.query.name ? req.query.name : '';
    const active = req.query.active ? req.query.active : '';
    const category_id = req.query.category_id ? req.query.category_id : '';
    const page = req.query.page ? req.query.page : '';
    const limit = req.query.limit ? req.query.limit : '';
    const created_from_date = req.query.created_from_date ? req.query.created_from_date : '';
    const updated_from_date = req.query.updated_from_date ? req.query.updated_from_date : '';
    const created_to_date = req.query.created_to_date ? req.query.created_to_date : '';
    const updated_to_date = req.query.updated_to_date ? req.query.updated_to_date : '';
    tikiProductService.getAllProducts(user.id, name.toString(), active.toString(), category_id.toString(), page.toString(), limit.toString(), created_from_date.toString(), updated_from_date.toString(), created_to_date.toString(), updated_to_date.toString())
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(OK).json((0, responseFormat_1.default)(true, {}, data));
    }))
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            errorMessage: e
        })).end();
    });
})));
/**
 * Update variant
 *
 * /api/tiki/product/updateSku
 *
 */
//  router.post('/updateSku', (async (req: Request, res: Response) => {
//     const user = <UserDTO>req.user;
//     let tikiVariant = new TikiVariant();
//     if (!user) {
//         res.status(StatusCodes.UNAUTHORIZED).end();
//     } 
//     tikiVariant = req.body.variant;
//     if (!tikiVariant) {
//         res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
//     }
//     productService.updateSku(tikiVariant , user.id)
//     .then(async (data: any) => {
//         if (data.track_id && data.state && data.reason) {
//             tikiProductRepo.updateProductSku(tikiVariant);
//             res.status(OK).json(data);
//         } else {
//             res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//         }
//     })
//     .catch((e) => {
//         res.statusMessage = e;
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//     })
// }) as RequestHandler);
/**
 * Test api
 *
 * /api/product/test
 *
 */
router.get('/test', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.body.productId;
    const userId = req.body.userId;
    tikiProductService.getTrackIdByProductId(productId)
        .then((data) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(OK).json((0, responseFormat_1.default)(true, {}, data));
    }))
        .catch((e) => {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, {
            errorMessage: e
        })).end();
    });
})));
exports.default = router;
