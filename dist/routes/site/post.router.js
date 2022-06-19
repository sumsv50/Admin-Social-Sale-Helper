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
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const post_service_1 = __importDefault(require("@services/site/post.service"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
// Define constance
const ITEM_PER_PAGE = 12;
const router = (0, express_1.Router)();
const postService = new post_service_1.default();
const { OK } = http_status_codes_1.StatusCodes;
//Define routes
/**
 * Get posts
 *
 * /api/posts?group_id=&product_id=&date=&from_date=&to_date=&page=&limit=
 *
 */
router.get('', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        let query = {
            createdBy: user.id
        };
        let page = 1, limit = ITEM_PER_PAGE;
        if (req.query.group_id)
            query.groupIds = req.query.group_id.toString();
        if (req.query.product_id)
            query.productId = req.query.product_id.toString();
        if (req.query.page)
            query.page = req.query.page.toString();
        if (req.query.limit)
            query.limit = req.query.limit.toString();
        if (req.query.from_date || req.query.to_date) {
            query.createdAt = {};
            if (req.query.from_date)
                query.createdAt.$gte = new Date(req.query.from_date.toString());
            if (req.query.to_date)
                query.createdAt.$lt = new Date(req.query.to_date.toString());
        }
        const posts = yield postService.getFbPosts(query, page, limit);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json((0, responseFormat_1.default)(true, {}, {
            posts
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Get post by id
 *
 * /api/posts/{postId}
 *
 */
router.get('/:postId', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const postId = req.params.postId.toString();
        let query = {
            createdBy: user.id,
            _id: postId
        };
        const post = yield postService.getFbPost(query);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json((0, responseFormat_1.default)(true, {}, {
            post
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Export default
exports.default = router;
