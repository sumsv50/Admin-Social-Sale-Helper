"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth.router"));
const product_router_1 = __importDefault(require("./product.router"));
const order_router_1 = __importDefault(require("./order.router"));
const templateComment_router_1 = __importDefault(require("./templateComment.router"));
const post_router_1 = __importDefault(require("./post.router"));
const report_router_1 = __importDefault(require("./report.router"));
const notification_router_1 = __importDefault(require("./notification.router"));
const user_router_1 = __importDefault(require("./user.router"));
// Export the base-router
const siteRouter = (0, express_1.Router)();
// Setup routers
siteRouter.use('/auth', auth_router_1.default);
siteRouter.use('/users', user_router_1.default);
siteRouter.use('/products', product_router_1.default);
siteRouter.use('/orders', order_router_1.default);
siteRouter.use('/templateComments', templateComment_router_1.default);
siteRouter.use('/posts', post_router_1.default);
siteRouter.use('/report', report_router_1.default);
siteRouter.use('/notifications', notification_router_1.default);
// Export default.
exports.default = siteRouter;
