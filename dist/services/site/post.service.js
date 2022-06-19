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
const post_repo_1 = require("@repos/site/post.repo");
const post_model_1 = __importDefault(require("@models/site/post.model"));
//define constance
const fbPostRepo = new post_repo_1.FbPostRepo();
class PostService {
    createFbPost(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fbPostRepo.create(order);
        });
    }
    getFbPost(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fbPostRepo.findOne(query);
        });
    }
    getFbPosts(query, page, itemPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield post_model_1.default.paginate(query, {
                page: page,
                limit: itemPerPage,
                lean: true,
                select: ['-createdBy']
            });
        });
    }
    updateFbPost(query, newPost) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fbPostRepo.updateOne(query, newPost);
        });
    }
    deleteFbPost(order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fbPostRepo.deleteOne(order);
        });
    }
}
exports.default = PostService;
