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
exports.p = void 0;
const post_service_1 = __importDefault(require("@services/facebook/post.service"));
const group_service_1 = __importDefault(require("@services/facebook/group.service"));
const errors_1 = require("@shared/errors");
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const fb_1 = require("@shared/fb");
const multer_1 = __importDefault(require("@shared/multer"));
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const favoriteKeyword_repo_1 = require("@repos/facebook/favoriteKeyword.repo");
const TIME_NEW_POST = 5 * 60 * 1000;
const router = (0, express_1.Router)();
const { CREATED, OK, UNAUTHORIZED } = http_status_codes_1.default;
exports.p = {
    getAll: '/all/:groupId',
    post: '/post',
    postMultiple: '/post/multiple',
    test: '/test',
    interestedPost: '/interested-posts',
    getById: '/:fbPostId',
};
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *        - id
 *       properties:
 *         id:
 *           type: string
 *           description: id of the post
 *           example: "968221704087336_979928342916672"
 *         content:
 *           type: string
 *           description: content body of the post
 *           example: Cần bán máy ảnh
 *         updated_time:
 *           type: string
 *           description: u already know
 *     PostReq:
 *       type: object
 *       required:
 *         - groupId
 *         - content
 *       properties:
 *         groupId:
 *           type: string
 *           description: group id
 *         content:
 *           type: string
 *           description: content body of the post
 *     PostReqList:
 *       type: object
 *       required:
 *         - groupIds
 *         - content
 *         - images
 *       properties:
 *         groupIds:
 *           type: array
 *           items:
 *             type: string
 *         content:
 *           type: string
 *           description: content body of the post
 */
/**
 * @swagger
 * /api/facebook/posts/all/{groupId}:
 *   get:
 *     summary:
 *     responses: Returns all posts of a group
 *       200:
 *         description: Returns all posts of a group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *
 */
router.get(exports.p.getAll, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populateUserAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook',
            });
        }
        res.status(OK);
        const post = yield post_service_1.default.getAll(req.params.groupId);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, post));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * @swagger
 * /api/facebook/posts/post:
 *   post:
 *     summary: Add a new post
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostReq'
 *     responses:
 *       200:
 *         description: Returns post id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: post's id
 */
router.post(exports.p.post, multer_1.default.single('image'), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populateUserAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook'
            });
        }
        const postReq = Object.assign(Object.assign({}, req.body), { file: req.file, user: req.user });
        if (!postReq) {
            throw new errors_1.ParamMissingError();
        }
        const post = yield post_service_1.default.post(postReq);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, post));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * @swagger
 * /api/facebook/posts/post/multiple:
 *   post:
 *     summary: Add new posts
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/PostReqList'
 *     responses:
 *       200:
 *         description: Returns posts' id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: posts' id
 */
router.post(exports.p.postMultiple, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populateUserAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook'
            });
        }
        const postReqList = req.body;
        postReqList.images = req.body.images;
        postReqList.user = req.user;
        if (!postReqList) {
            throw new errors_1.ParamMissingError();
        }
        const post = yield post_service_1.default.postMultiple(postReqList);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, { post }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.test, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(OK);
    const post = yield post_service_1.default.test();
    res.status(OK).json({ post });
})));
router.get(exports.p.interestedPost, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!(yield (0, fb_1.populateUserAccessToken)(user))) {
            throw new Error('User is not connected to facebook');
        }
        const { groupId, keyword } = req.query;
        let groupIds, keywords;
        if (groupId) {
            groupIds = groupId.split(",");
        }
        else {
            const myGroups = yield group_service_1.default.getAll();
            groupIds = myGroups.map((group) => group.id);
        }
        if (groupIds.length <= 0) {
            return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {
                message: "You have not joined any groups!"
            }, { posts: [] }));
        }
        if (keyword) {
            keywords = keyword.split(",");
        }
        else {
            const myKeywords = yield favoriteKeyword_repo_1.favoriteKeywordRepo.findAll({
                createdBy: user.id
            });
            keywords = myKeywords.map((keyword) => keyword.content);
        }
        if (keywords.length <= 0) {
            return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {
                message: "You have not had any favorite keywords!"
            }, { posts: [] }));
        }
        var posts = yield post_service_1.default.getFromMultiGroup(groupIds);
        posts = post_service_1.default.filterInterestedPostsWithinTime(posts, keywords);
        res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            posts
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {
            message: err.message
        }));
    }
})));
/**
 * @swagger
 * /facebook/posts/{fbPostId}:
 *   get:
 *     summary: Returns post with all fb post id, fb group id by our fbPostId
 *     responses:
 *       200:
 *         description: Returns post with all fb post id, fb group id by our fbPostId
 *         content:
 *           application/json:
 *
 *
 */
router.get(exports.p.getById, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(0, fb_1.populateUserAccessToken)(req.user)) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook',
            });
        }
        res.status(OK);
        const post = yield post_service_1.default.getById({
            createdBy: req.user.id,
            _id: req.params.fbPostId
        });
        res.status(OK).json((0, responseFormat_1.default)(false, {}, post));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
exports.default = router;
