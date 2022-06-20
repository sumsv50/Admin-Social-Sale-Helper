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
exports.productRepo = void 0;
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const mongoose_1 = __importDefault(require("mongoose"));
const product_model_1 = __importDefault(require("@models/site/product.model"));
class ProductRepo {
    create(product) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.create(product);
        });
    }
    updateOne(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.updateOne(query, data);
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.findOne(query).select(['-createdBy']).lean();
        });
    }
    findAll(query, page, itemPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield product_model_1.default.paginate(query, {
                page: page,
                limit: itemPerPage,
                lean: true,
                select: ['-createdBy']
            });
            return products;
        });
    }
    deleteOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.deleteOne(query);
        });
    }
    deleteMany(userId, productIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.deleteMany({
                createdBy: userId,
                _id: {
                    $in: productIds
                }
            });
        });
    }
    count(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield product_model_1.default.countDocuments(query);
            return count;
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield product_model_1.default.find(query);
            return products;
        });
    }
    aggregate(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield product_model_1.default.aggregate(query);
            return product;
        });
    }
    calculateNumberPostsEachEC(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield product_model_1.default.aggregate([
                {
                    $match: {
                        createdBy: new mongoose_1.default.Types.ObjectId(userId)
                    }
                },
                { $unwind: '$stockAvailable' },
                {
                    $group: {
                        _id: '$createdBy',
                        sendoCount: {
                            $sum: {
                                $cond: [{ $eq: ["$stockAvailable.ecSite", "Sendo"] }, 1, 0]
                            }
                        },
                        tikiCount: {
                            $sum: {
                                $cond: [{ $eq: ["$stockAvailable.ecSite", "Tiki"] }, 1, 0]
                            }
                        },
                        facebookCount: {
                            $sum: {
                                $cond: [{ $eq: ["$stockAvailable.ecSite", "Facebook"] }, 1, 0]
                            }
                        },
                    }
                }
            ]);
            return result[0] || {};
        });
    }
}
const productRepo = new ProductRepo();
exports.productRepo = productRepo;
