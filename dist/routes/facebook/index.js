"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const group_router_1 = __importDefault(require("./group.router"));
const post_router_1 = __importDefault(require("./post.router"));
const message_router_1 = __importDefault(require("./message.router"));
const auth_router_1 = __importDefault(require("./auth.router"));
const quickReply_router_1 = __importDefault(require("./quickReply.router"));
const page_router_1 = __importDefault(require("./page.router"));
const recommendation_router_1 = __importDefault(require("./recommendation.router"));
const templatePost_router_1 = __importDefault(require("./templatePost.router"));
const customerInfo_router_1 = __importDefault(require("./customerInfo.router"));
const comment_router_1 = __importDefault(require("./comment.router"));
const favoriteKeyword_router_1 = __importDefault(require("./favoriteKeyword.router"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
// Export the base-router
const fbRouter = (0, express_1.Router)();
// Setup routers
fbRouter.use('/auth', auth_router_1.default);
fbRouter.use('/groups', passport_middleware_1.passport.authenticate('jwt', { session: false }), group_router_1.default);
fbRouter.use('/posts', passport_middleware_1.passport.authenticate('jwt', { session: false }), post_router_1.default);
fbRouter.use('/messages', message_router_1.default);
fbRouter.use('/quickReplies', passport_middleware_1.passport.authenticate('jwt', { session: false }), quickReply_router_1.default);
fbRouter.use('/pages', passport_middleware_1.passport.authenticate('jwt', { session: false }), page_router_1.default);
fbRouter.use('/recommendations', recommendation_router_1.default);
fbRouter.use('/templatePost', passport_middleware_1.passport.authenticate('jwt', { session: false }), templatePost_router_1.default);
fbRouter.use('/customerInfo', passport_middleware_1.passport.authenticate('jwt', { session: false }), customerInfo_router_1.default);
fbRouter.use('/comments', passport_middleware_1.passport.authenticate('jwt', { session: false }), comment_router_1.default);
fbRouter.use('/favoriteKeywords', passport_middleware_1.passport.authenticate('jwt', { session: false }), favoriteKeyword_router_1.default);
// Export default.
exports.default = fbRouter;
