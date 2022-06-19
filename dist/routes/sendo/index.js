"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth.router"));
const category_router_1 = __importDefault(require("./category.router"));
const product_router_1 = __importDefault(require("./product.router"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
// Export the base-router
const sendoRouter = (0, express_1.Router)();
// Setup routers
sendoRouter.use('/auth', auth_router_1.default);
sendoRouter.use('/category', passport_middleware_1.passport.authenticate('jwt', { session: false }), category_router_1.default);
sendoRouter.use('/product', passport_middleware_1.passport.authenticate('jwt', { session: false }), product_router_1.default);
// Export default.
exports.default = sendoRouter;
