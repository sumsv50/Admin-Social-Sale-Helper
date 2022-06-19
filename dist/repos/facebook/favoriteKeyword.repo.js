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
exports.favoriteKeywordRepo = exports.FavoriteKeywordRepo = void 0;
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const favoriteKeyword_modal_1 = __importDefault(require("@models/facebook/favoriteKeyword.modal"));
class FavoriteKeywordRepo {
    create(keyword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield favoriteKeyword_modal_1.default.create(keyword);
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyword = yield favoriteKeyword_modal_1.default.findOne(query).lean();
            return keyword;
        });
    }
    findAll(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const keywords = yield favoriteKeyword_modal_1.default.find(query).lean();
            return keywords;
        });
    }
    deleteOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield favoriteKeyword_modal_1.default.deleteOne(query);
        });
    }
    deleteMany(userId, keywordIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield favoriteKeyword_modal_1.default.deleteMany({
                createdBy: userId,
                _id: {
                    $in: keywordIds
                }
            });
        });
    }
}
exports.FavoriteKeywordRepo = FavoriteKeywordRepo;
const favoriteKeywordRepo = new FavoriteKeywordRepo();
exports.favoriteKeywordRepo = favoriteKeywordRepo;
