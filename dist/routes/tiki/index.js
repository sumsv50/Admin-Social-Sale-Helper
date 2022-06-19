"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_router_1 = __importDefault(require("./auth.router"));
const seller_router_1 = __importDefault(require("./seller.router"));
const category_router_1 = __importDefault(require("./category.router"));
const product_router_1 = __importDefault(require("./product.router"));
const inventory_router_1 = __importDefault(require("./inventory.router"));
const state_router_1 = __importDefault(require("./state.router"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
// Export the base-router
const tikiRouter = (0, express_1.Router)();
// Setup routers
tikiRouter.use('/auth', auth_router_1.default);
tikiRouter.use('/seller', passport_middleware_1.passport.authenticate('jwt', { session: false }), seller_router_1.default);
tikiRouter.use('/category', passport_middleware_1.passport.authenticate('jwt', { session: false }), category_router_1.default);
tikiRouter.use('/product', passport_middleware_1.passport.authenticate('jwt', { session: false }), product_router_1.default);
tikiRouter.use('/inventory', inventory_router_1.default);
tikiRouter.use('/state', state_router_1.default);
// Export default.
exports.default = tikiRouter;
