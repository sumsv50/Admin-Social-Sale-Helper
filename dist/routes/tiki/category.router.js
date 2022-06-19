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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_1 = require("express");
const category_service_1 = __importDefault(require("@services/tiki/category.service"));
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
// Define constance
const router = (0, express_1.Router)();
const categoryService = new category_service_1.default();
const { OK } = http_status_codes_1.default;
//Define routes
/**
 * Get all categories.
 *
 * /api/tiki/category/all
 *
 */
router.get('/all', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    const data = yield categoryService.getAllCategories(user.id);
    if (data.length >= 0) {
        res.status(OK).json((0, responseFormat_1.default)(true, {}, data)).end();
    }
    else {
        res.status(http_status_codes_1.default.NOT_FOUND).json((0, responseFormat_1.default)(false, {}, { errorMessage: 'Something went wrong!!' })).end();
    }
})));
/**
 * Get all root categories.
 *
 * /api/tiki/category/root
 *
 */
router.get('/root', ((req, res) => {
    const data = categoryService.getRootCategories();
    if (data.length >= 0) {
        res.status(OK).json((0, responseFormat_1.default)(true, {}, data));
    }
    else {
        res.statusMessage = 'No root categories found!!';
        res.status(http_status_codes_1.default.NOT_FOUND).end();
    }
}));
/**
 * Get category details.
 *
 * /api/tiki/category/{category_id}
 *
 */
router.get('/:categoryId', ((req, res) => {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    if (!req.params.categoryId) {
        res.statusMessage = 'category id is required';
        res.status(http_status_codes_1.default.BAD_REQUEST).end();
    }
    else {
        categoryService.getCategoryById(req.params.categoryId, user.id)
            .then((data) => {
            res.status(OK).json(data);
        })
            .catch((e) => {
            res.statusMessage = e;
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
        });
    }
}));
/**
 * Get child categories.
 *
 * /api/tiki/category/{category_id}/child
 *
 */
router.get('/:categoryId/child', ((req, res) => {
    if (!req.params.categoryId) {
        res.statusMessage = 'category id is required';
        res.status(http_status_codes_1.default.BAD_REQUEST).end();
    }
    else {
        const data = categoryService.getChildCategories(Number.parseInt(req.params.categoryId));
        if (data) {
            res.status(OK).json(data);
        }
        else {
            res.statusMessage = 'No child categories found!!';
            res.status(http_status_codes_1.default.NOT_IMPLEMENTED).end();
        }
    }
}));
/**
 * Get category attributes for user to input
 *
 * /api/tiki/category/{category_id}/attributes
 *
 */
router.get('/:categoryId/attributes', ((req, res) => {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    if (!req.params.categoryId) {
        res.statusMessage = 'category id is required';
        res.status(http_status_codes_1.default.BAD_REQUEST).end();
    }
    else {
        categoryService.getCategoryAttributes(Number.parseInt(req.params.categoryId), user.id)
            .then((data) => {
            res.status(OK).json(data);
        })
            .catch((e) => {
            res.statusMessage = e;
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
        });
    }
}));
/**
 * Get values for attributes with type select
 *
 * /api/tiki/category/attributes/{attributeId}/values
 *
 */
router.get('/attributes/:attributeId/values', ((req, res) => {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    if (!req.params.attributeId) {
        res.statusMessage = 'attribute id is required';
        res.status(http_status_codes_1.default.BAD_REQUEST).end();
    }
    else {
        let limit, page, keyWord;
        if (!req.query.keyWord) {
            keyWord = '';
        }
        else
            keyWord = req.query.keyWord.toString();
        if (!req.query.limit) {
            limit = '20';
        }
        else
            limit = req.query.limit.toString();
        if (!req.query.page) {
            page = '1';
        }
        else
            page = req.query.page.toString();
        categoryService.getAttributeValues(req.params.attributeId, keyWord, limit, page, user.id)
            .then((data) => {
            res.status(OK).json(data);
        })
            .catch((e) => {
            res.statusMessage = e;
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
        });
    }
}));
/**
 * Get category option labels for user to input
 *
 * /api/tiki/category/{category_id}/optionLabels
 *
 */
router.get('/:categoryId/optionLabels', ((req, res) => {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    if (!req.params.categoryId) {
        res.statusMessage = 'category id is required';
        res.status(http_status_codes_1.default.BAD_REQUEST).end();
    }
    else {
        categoryService.getCategoryOptionLabels(Number.parseInt(req.params.categoryId), user.id)
            .then((data) => {
            res.status(OK).json(data);
        })
            .catch((e) => {
            res.statusMessage = e;
            res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
        });
    }
}));
exports.default = router;
