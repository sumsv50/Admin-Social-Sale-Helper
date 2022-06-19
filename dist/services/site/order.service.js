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
const order_repo_1 = require("@repos/site/order.repo");
const enum_1 = require("@models/site/enum");
const enum_2 = require("@models/site/enum");
const product_service_1 = require("./product.service");
const customerInfo_service_1 = __importDefault(require("@services/facebook/customerInfo.service"));
//define constance
const orderRepo = new order_repo_1.OrderRepo();
class OrderService {
    createOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!order.state)
                order.state = 1;
            if (!order.ec_site)
                order.ec_site = 0;
            return yield orderRepo.create(order);
        });
    }
    getOrder(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let order = yield orderRepo.findOne(query);
            order.state = (0, enum_2.getDescription)(order.state);
            order.ec_site = (0, enum_2.getEcSite)(order.ec_site);
            order.customer = yield customerInfo_service_1.default.findDetail(order.thread_id);
            return order;
        });
    }
    getAllOrders(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let orders = yield orderRepo.findAll(query);
            orders.map((order) => {
                order.state = (0, enum_2.getDescription)(order.state);
                order.ec_site = (0, enum_2.getEcSite)(order.ec_site);
                return order;
            });
            return orders;
        });
    }
    getOrders(query, page, itemPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            let orders = yield orderRepo.findAllPagination(query, page, itemPerPage);
            orders.docs.map((order) => {
                order.state = (0, enum_2.getDescription)(order.state);
                order.ec_site = (0, enum_2.getEcSite)(order.ec_site);
                return order;
            });
            return orders;
        });
    }
    updateOrder(query, newOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (newOrder.state === enum_1.ORDER_STATE.ARRIVED.code) {
                const order = yield orderRepo.findOne(query);
                if (order.state === enum_1.ORDER_STATE.ARRIVED.code) {
                    return yield orderRepo.updateOne(query, newOrder);
                }
                const isProductUpdated = yield product_service_1.productService.decreaseProductQuantity(order);
                if (!isProductUpdated) {
                    return null;
                }
            }
            return yield orderRepo.updateOne(query, newOrder);
        });
    }
    deleteOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield orderRepo.deleteOne(order);
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield orderRepo.find(query);
        });
    }
    aggregate(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield orderRepo.aggregate(query);
        });
    }
    countTotalProductQuantity(userId, stateCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield orderRepo.find({
                createdBy: userId,
                state: stateCode,
            });
            // eslint-disable-next-line no-var
            var count = 0;
            orders.forEach((order) => {
                if (order.products && order.products.length > 0) {
                    order.products.forEach((product) => {
                        count += product.quantity.valueOf();
                    });
                }
            });
            return count;
        });
    }
}
exports.default = OrderService;
