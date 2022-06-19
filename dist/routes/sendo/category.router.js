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
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const category_service_1 = __importDefault(require("@services/sendo/category.service"));
// Define constance
const router = (0, express_1.Router)();
const categoryService = new category_service_1.default();
const { OK } = http_status_codes_1.default;
//Define routes
/**
 * Get recent categories.
 *
 * /api/tiki/category/recent
 *
 */
router.get('/recent', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    const data = yield categoryService.getRecentCategories(user.id);
    if (data.success) {
        res.status(OK).json((0, responseFormat_1.default)(true, {}, data.result));
    }
    else {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, data));
    }
})));
/**
 * Get all root categories.
 *
 * /api/sendo/category/root
 *
 */
router.get('/root', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    const data = yield categoryService.getRootCategories(user.id);
    if (data.success) {
        res.status(OK).json((0, responseFormat_1.default)(true, {}, data.result));
    }
    else {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, data));
    }
})));
/**
 * Get category by id.
 *
 * /api/tiki/category/{categoryId}
 *
 */
router.get('/:categoryId', ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const categoryId = req.params.categoryId;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    if (!categoryId) {
        res.statusMessage = 'category id is required';
        res.status(http_status_codes_1.default.BAD_REQUEST).end();
    }
    const data = yield categoryService.getCategoryById(categoryId, user.id);
    if (data.success) {
        res.status(OK).json((0, responseFormat_1.default)(true, {}, data.result));
    }
    else {
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {}, data));
    }
})));
exports.default = router;
