"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const sendo_1 = __importDefault(require("./sendo"));
const tiki_1 = __importDefault(require("./tiki"));
const facebook_1 = __importDefault(require("./facebook"));
const site_1 = __importDefault(require("./site"));
const common_router_1 = __importDefault(require("./common.router"));
// Export the base-router
const baseRouter = (0, express_1.Router)();
// Setup routers
// baseRouter.use('/users', userRouter);
baseRouter.use('/sendo', sendo_1.default);
baseRouter.use('/tiki', tiki_1.default);
baseRouter.use('/facebook', facebook_1.default);
baseRouter.use('/', site_1.default);
baseRouter.use('/common', common_router_1.default);
// Export default.
exports.default = baseRouter;
