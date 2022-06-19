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
exports.postTemplateRepo = void 0;
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const postTemplate_model_1 = __importDefault(require("@models/facebook/postTemplate.model"));
class PostTemplateRepo {
    create(template) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postTemplate_model_1.default.create(template);
        });
    }
    findAll(query, page, itemPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const templates = yield postTemplate_model_1.default.paginate(query, {
                page: page,
                limit: itemPerPage,
                lean: true,
                select: ['-createdBy']
            });
            return templates;
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postTemplate_model_1.default.findOne(query).select(['-createdBy']).lean();
        });
    }
    updateOne(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postTemplate_model_1.default.updateOne(query, data);
        });
    }
    deleteOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postTemplate_model_1.default.deleteOne(query);
        });
    }
    deleteMany(userId, templateIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield postTemplate_model_1.default.deleteMany({
                createdBy: userId,
                _id: {
                    $in: templateIds
                }
            });
        });
    }
}
const postTemplateRepo = new PostTemplateRepo();
exports.postTemplateRepo = postTemplateRepo;
