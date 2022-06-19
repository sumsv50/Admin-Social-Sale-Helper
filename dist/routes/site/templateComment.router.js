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
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const templateComment_service_1 = __importDefault(require("@services/site/templateComment.service"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
// Define constance
const ITEM_PER_PAGE = 12;
const router = (0, express_1.Router)();
const templateCommentService = new templateComment_service_1.default();
const { OK } = http_status_codes_1.StatusCodes;
//Define routes
/**
 * Create template comment
 *
 * /api/templateComments
 *
 */
router.post('', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const commentData = req.body;
        commentData.createdBy = user.id;
        const comment = yield templateCommentService.createComment(commentData);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json((0, responseFormat_1.default)(true, {}, {
            comment
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Get all template comments (by user id)
 *
 * /api/templateComments
 *
 */
router.get('', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            createdBy: user.id,
        };
        const comments = yield templateCommentService.getAllComments(query);
        return res.status(OK).json((0, responseFormat_1.default)(true, {}, comments));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Get templateComment by id
 *
 * /api/templateComments/{templateCommnentId}
 *
 */
router.get('/:templateCommnentId', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            createdBy: user.id,
            _id: req.params.templateCommnentId,
        };
        const comment = yield templateCommentService.getComment(query);
        if (!comment) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Comment not found"
            }));
        }
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Update template comment
 *
 * /api/templateComments/{templateCommnentId}
 *
 */
router.patch('/:templateCommnentId', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const templateCommnentId = req.params.templateCommnentId;
        const commentData = req.body;
        let comment = yield templateCommentService.getComment({
            createdBy: user.id,
            _id: templateCommnentId
        });
        if (!comment) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Template comment not found"
            }));
        }
        yield templateCommentService.updateComment({ _id: templateCommnentId }, commentData);
        comment = yield templateCommentService.getComment({ _id: templateCommnentId });
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(true, {}, Object.assign(Object.assign({ id: comment === null || comment === void 0 ? void 0 : comment._id }, comment), { _id: undefined })));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * Delete Template comment by id
 *
 * /api/templateComments/{templateCommnentId}
 *
 */
router.delete('/:templateCommnentId', (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const templateCommentId = req.params.templateCommnentId;
        const query = {
            _id: templateCommentId,
        };
        const comment = yield templateCommentService.getComment(query);
        if (!comment) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Template comment not found"
            }));
        }
        const deletedResult = yield templateCommentService.deleteComment({ _id: templateCommentId });
        return res.status(http_status_codes_1.StatusCodes.OK).json((0, responseFormat_1.default)(deletedResult.deletedCount > 0));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Export default
exports.default = router;
