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
exports.pageRepo = void 0;
const page_model_1 = __importDefault(require("@models/facebook/page.model"));
class PageRepo {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield page_model_1.default.findOne(query).lean();
            return page;
        });
    }
    createPage(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = new page_model_1.default(entity);
            yield page.save();
            return page;
        });
    }
    updatePage(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield page_model_1.default.updateOne({ _id: entity._id }, entity);
            return page;
        });
    }
    findAndUpdate(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { pageId: entity.pageId };
            const page = yield page_model_1.default.findOneAndUpdate(filter, entity, { new: true, upsert: true });
            return page;
        });
    }
}
const pageRepo = new PageRepo();
exports.pageRepo = pageRepo;
