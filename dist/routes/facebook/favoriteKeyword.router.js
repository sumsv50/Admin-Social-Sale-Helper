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
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const favoriteKeyword_repo_1 = require("@repos/facebook/favoriteKeyword.repo");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const inputValidation_1 = require("@middlewares/inputValidation");
// Constants
const router = (0, express_1.Router)();
exports.p = {
    root: '/',
    specificKeyword: '/:keywordId'
};
// Create keyword
router.post(exports.p.root, (0, inputValidation_1.validate)(inputValidation_1.schemas.createFavoriteKeyword), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const keywordData = req.body;
        keywordData.createdBy = user.id;
        let keyword = yield favoriteKeyword_repo_1.favoriteKeywordRepo.findOne({
            createdBy: user.id,
            content: keywordData.content
        });
        if (!keyword) {
            keyword = yield favoriteKeyword_repo_1.favoriteKeywordRepo.create(keywordData);
        }
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            keyword
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Get all
router.get(exports.p.root, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            createdBy: user.id,
        };
        const page = Number(req.query.page) || 1;
        const keywords = yield favoriteKeyword_repo_1.favoriteKeywordRepo.findAll(query);
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            keywords
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Delete keyword
router.delete(exports.p.specificKeyword, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const keywordId = req.params.keywordId;
        const keyword = yield favoriteKeyword_repo_1.favoriteKeywordRepo.findOne({
            createdBy: user.id,
            _id: keywordId
        });
        if (!keyword) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Keyword not found"
            }));
        }
        const deletedResult = yield favoriteKeyword_repo_1.favoriteKeywordRepo.deleteOne({ _id: keywordId });
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(deletedResult.deletedCount > 0));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// DELETE many products
router.delete(exports.p.root, (0, inputValidation_1.validate)(inputValidation_1.schemas.deleteManyKeyword), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { keywordIds } = req.body;
        const deletedResult = yield favoriteKeyword_repo_1.favoriteKeywordRepo.deleteMany(user.id, keywordIds);
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            deletedCount: deletedResult.deletedCount
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Export default
exports.default = router;
