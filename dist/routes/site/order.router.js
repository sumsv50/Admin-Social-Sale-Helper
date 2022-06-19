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
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const order_service_1 = __importDefault(require("@services/site/order.service"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
const enum_1 = require("@models/site/enum");
// Define constance
const { OK } = http_status_codes_1.StatusCodes;
const router = (0, express_1.Router)();
const ITEM_PER_PAGE = 12;
const orderService = new order_service_1.default();
//Define routes
/**
 * Create order
 *
 * /api/orders
 *
 */
router.post('', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const orderData = req.body;
        orderData.createdBy = user.id;
        const order = yield orderService.createOrder(orderData);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json((0, responseFormat_1.default)(true, {}, {
            order
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Get all orders pagination
 *
 * /api/orders
 *
 */
router.get('', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            createdBy: user.id,
        };
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || ITEM_PER_PAGE;
        const orders = yield orderService.getOrders(query, page, limit);
        return res.status(OK).json((0, responseFormat_1.default)(true, {}, {
            orders: orders.docs,
            pagination: Object.assign(Object.assign({}, orders), { docs: undefined })
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Get all orders
 *
 * /api/orders/all
 *
 */
router.get('/all', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            createdBy: user.id,
        };
        const orders = yield orderService.getAllOrders(query);
        if (orders) {
            return res.status(OK).json((0, responseFormat_1.default)(true, {}, orders)).end();
        }
        return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(true, {}, {
            message: 'No orders available'
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Get order by id
 *
 * /api/orders/{orderId}
 *
 */
router.get('/:orderId', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            createdBy: user.id,
            _id: req.params.orderId,
        };
        const order = yield orderService.getOrder(query);
        if (!order) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Order not found"
            }));
        }
        return res.status(OK).json((0, responseFormat_1.default)(true, {}, order));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Update Order
 *
 * /api/orders
 *
 */
router.patch('/:orderId', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const orderId = req.params.orderId;
        const orderData = req.body;
        let order = yield orderService.getOrder({
            createdBy: user.id,
            _id: orderId
        });
        if (!order) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Order not found"
            }));
        }
        const isUpdated = yield orderService.updateOrder({ _id: orderId }, orderData);
        if (!isUpdated)
            res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
        order = yield orderService.getOrder({ _id: orderId });
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, Object.assign(Object.assign({ id: order === null || order === void 0 ? void 0 : order._id }, order), { _id: undefined })));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Delete Order by id
 *
 * /api/orders/{orderId}
 *
 */
router.delete('/:orderId', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            createdBy: user.id,
            _id: req.params.orderId,
        };
        const order = yield orderService.getOrder(query);
        if (!order) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Order not found"
            }));
        }
        const deletedResult = yield orderService.deleteOrder({ _id: req.params.orderId });
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(deletedResult.deletedCount > 0));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Get order-state enums
 *
 * /api/orders/enums/state
 *
 */
router.get('/enums/state', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(OK).json((0, responseFormat_1.default)(true, {}, enum_1.ORDER_STATE));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Get order-ecSite enums
 *
 * /api/orders/ecSite
 *
 */
router.get('/enums/ecSite', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(OK).json((0, responseFormat_1.default)(true, {}, enum_1.EC_SITE));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Export default
exports.default = router;
