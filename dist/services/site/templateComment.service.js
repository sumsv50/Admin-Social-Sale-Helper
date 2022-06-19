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
Object.defineProperty(exports, "__esModule", { value: true });
const templateComment_repo_1 = require("@repos/site/templateComment.repo");
//define constance
const templateCommentRepo = new templateComment_repo_1.TemplateCommentRepo();
class TemplateCommentService {
    createComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield templateCommentRepo.create(comment);
        });
    }
    getComment(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield templateCommentRepo.findOne(query);
        });
    }
    getAllComments(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield templateCommentRepo.findAll(query);
        });
    }
    updateComment(query, newComment) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield templateCommentRepo.updateOne(query, newComment);
        });
    }
    deleteComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield templateCommentRepo.deleteOne(comment);
        });
    }
}
exports.default = TemplateCommentService;
