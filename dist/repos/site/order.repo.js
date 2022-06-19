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
exports.OrderRepo = void 0;
const order_model_1 = __importDefault(require("@models/site/order.model"));
class OrderRepo {
    create(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_model_1.default.create(order);
        });
    }
    updateOne(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_model_1.default.updateOne(query, data);
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_model_1.default.findOne(query)
                .select(['-createdBy'])
                .populate('products.product')
                .lean();
        });
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_model_1.default.find(query)
                .select(['-createdBy'])
                .populate('products.product')
                .lean();
        });
    }
    findAllPagination(query, page, itemPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const Orders = yield order_model_1.default.paginate(query, {
                page: page,
                limit: itemPerPage,
                lean: true,
                select: ['-createdBy'],
                populate: 'products.product'
            });
            return Orders;
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const Orders = yield order_model_1.default.find(query);
            return Orders;
        });
    }
    aggregate(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const Orders = yield order_model_1.default.aggregate(query);
            return Orders;
        });
    }
    deleteOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_model_1.default.deleteOne(query);
        });
    }
    count(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield order_model_1.default.countDocuments(query);
            return count;
        });
    }
}
exports.OrderRepo = OrderRepo;
