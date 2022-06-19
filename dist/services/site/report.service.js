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
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-unsafe-optional-chaining */
const enum_1 = require("@models/site/enum");
const post_repo_1 = require("@repos/site/post.repo");
const product_repo_1 = require("@repos/site/product.repo");
const post_service_1 = __importDefault(require("@services/facebook/post.service"));
const order_service_1 = __importDefault(require("./order.service"));
const orderService = new order_service_1.default();
const fbPostRepo = new post_repo_1.FbPostRepo();
class ReportService {
    getSalesReport(userId, reportRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const outOfStocks = yield product_repo_1.productRepo.count({
                createdBy: userId,
                stockAvailable: {
                    $elemMatch: {
                        quantity: {
                            $gt: 0,
                        },
                    },
                },
            });
            const allStocks = yield product_repo_1.productRepo.count({ createdBy: userId });
            const inventories = yield product_repo_1.productRepo.count({
                createdBy: userId,
                stockAvailable: {
                    $not: {
                        $elemMatch: {
                            quantity: {
                                $gt: 0,
                            },
                        },
                    },
                },
            });
            const deliveries = yield orderService.countTotalProductQuantity(userId, enum_1.ORDER_STATE.ARRIVED.code);
            const outOfStockProducts = yield product_repo_1.productRepo.find({
                createdBy: userId,
                stockAvailable: {
                    $elemMatch: {
                        quantity: {
                            $gt: 0,
                        },
                    },
                },
            });
            const productsInStock = yield product_repo_1.productRepo.find({
                createdBy: userId,
                stockAvailable: {
                    $not: {
                        $elemMatch: {
                            quantity: {
                                $gt: 0,
                            },
                        },
                    },
                },
            });
            const chartData = yield this.getChartData(userId, reportRequest);
            const salesReport = {
                outOfStocks,
                allStocks,
                inventories,
                deliveries,
                chartData,
                outOfStockProducts,
                productsInStock,
            };
            return salesReport;
        });
    }
    getChartData(userId, reportRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (reportRequest.type === 'ARRIVED') {
                return yield this.getChartDataByArrived(userId, reportRequest);
            }
            else if (reportRequest.type === 'INVENTORY') {
                return yield this.getChartDataByInventory(userId, reportRequest);
            }
        });
    }
    getChartDataByArrived(userId, reportRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (reportRequest.month === undefined && reportRequest.year === undefined) {
                return [];
            }
            if (reportRequest.month === undefined && reportRequest.year !== undefined) {
                const data = yield orderService.aggregate([
                    {
                        $match: {
                            createdBy: userId,
                            delivery_date: {
                                $gte: new Date(reportRequest.year, 0, 1),
                                $lt: new Date(reportRequest.year, 11, 31),
                            },
                            state: enum_1.ORDER_STATE.ARRIVED.code,
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$delivery_date' },
                                month: { $month: '$delivery_date' },
                            },
                            arrivedProducts: { $sum: { $sum: '$products.quantity' } },
                        },
                    },
                ]);
                return data;
            }
            if (reportRequest.month !== undefined && reportRequest.year !== undefined) {
                const data = yield orderService.aggregate([
                    {
                        $match: {
                            createdBy: userId,
                            delivery_date: {
                                $gte: new Date(reportRequest.year, reportRequest.month - 1, 1),
                                $lt: new Date(reportRequest.year, reportRequest.month - 1, 31),
                            },
                            state: 4,
                        },
                    },
                    {
                        $group: {
                            _id: {
                                $dateToString: { format: '%Y-%m-%d', date: '$delivery_date' },
                            },
                            arrivedProducts: { $sum: { $sum: '$products.quantity' } },
                        },
                    },
                ]);
                return data;
            }
        });
    }
    getChartDataByInventory(userId, reportRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            if (reportRequest.month === undefined && reportRequest.year === undefined) {
                const data = yield product_repo_1.productRepo.aggregate([
                    {
                        $match: {
                            createdBy: userId,
                            delivery_date: {
                                $gte: new Date(reportRequest.year, 0, 1),
                                $lt: new Date(reportRequest.year, 11, 31),
                            },
                            state: enum_1.ORDER_STATE.ARRIVED.code,
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: { $year: '$delivery_date' },
                                month: { $month: '$delivery_date' },
                            },
                            arrivedProducts: { $sum: { $sum: '$products.quantity' } },
                        },
                    },
                ]);
                return data;
            }
            if (reportRequest.month === undefined && reportRequest.year !== undefined) {
                const data = yield orderService.find({});
            }
        });
    }
    getPostReport(userId, reportRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const publishedPosts = yield fbPostRepo.count({
                createdBy: userId,
                status: 'posted',
            });
            let interactions;
            let chartData;
            if (reportRequest.month === undefined && reportRequest.year !== undefined) {
                const data = yield this.getChartPostReportByMonthAndYear(userId, reportRequest);
                interactions = (data === null || data === void 0 ? void 0 : data.interactions) || 0;
                chartData = (data === null || data === void 0 ? void 0 : data.chartData) || [];
            }
            else if (reportRequest.month !== undefined && reportRequest.year !== undefined) {
                const data = yield this.getChartPostReportByMonth(userId, reportRequest);
                interactions = (data === null || data === void 0 ? void 0 : data.interactions) || 0;
                chartData = (data === null || data === void 0 ? void 0 : data.chartData) || [];
            }
            const postReport = {
                publishedPosts,
                interactions,
                chartData,
            };
            return postReport;
        });
    }
    getChartPostReportByMonthAndYear(userId, reportRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield fbPostRepo.aggregate([
                {
                    $match: {
                        createdBy: userId,
                        updatedAt: {
                            $gte: new Date(reportRequest.year, 0, 1),
                            $lte: new Date(reportRequest.year, 11, 31),
                        },
                        status: 'posted',
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$updatedAt' },
                            month: { $month: '$updatedAt' },
                        },
                        // results: {$push: {fbPostIds:'$$ROOT.fbPostIds', date: '$$ROOT.updatedAt'}},
                        results: { $push: '$$ROOT' },
                    },
                },
            ]);
            const interactionsAndChartData = yield this.getInteractionAndChartData(posts);
            return interactionsAndChartData;
        });
    }
    getChartPostReportByMonth(userId, reportRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield fbPostRepo.aggregate([
                {
                    $match: {
                        createdBy: userId,
                        updatedAt: {
                            $gte: new Date(reportRequest.year, reportRequest.month - 1, 1),
                            $lte: new Date(reportRequest.year, reportRequest.month - 1, 31),
                        },
                        status: 'posted',
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
                        },
                        results: { $push: '$$ROOT' },
                    },
                },
            ]);
            const interactionsAndChartData = yield this.getInteractionAndChartData(posts);
            return interactionsAndChartData;
        });
    }
    getInteractionAndChartData(posts) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let interactions = 0;
            let chartData = [];
            for (const post of posts) {
                let noOfInteractionsInEachRecord = 0;
                let noOfPosts = 0;
                for (const postInMonth of post.results) {
                    const postData = yield post_service_1.default.getInteractions(postInMonth.fbPostIds);
                    noOfPosts += postInMonth.fbPostIds.length;
                    for (const interaction of postData) {
                        const noOfComments = ((_a = interaction === null || interaction === void 0 ? void 0 : interaction.comments) === null || _a === void 0 ? void 0 : _a.data.length) || 0;
                        const noOfReactions = ((_b = interaction === null || interaction === void 0 ? void 0 : interaction.reactions) === null || _b === void 0 ? void 0 : _b.data.length) || 0;
                        const noOfShares = ((_c = interaction === null || interaction === void 0 ? void 0 : interaction.shares) === null || _c === void 0 ? void 0 : _c.count) || 0;
                        noOfInteractionsInEachRecord +=
                            noOfComments + noOfReactions + noOfShares;
                    }
                }
                post.noOfPosts = noOfPosts;
                post.results = undefined;
                post.interactions = noOfInteractionsInEachRecord;
                interactions += noOfInteractionsInEachRecord;
                chartData.push(post);
            }
            return { interactions, chartData };
        });
    }
}
exports.default = ReportService;
