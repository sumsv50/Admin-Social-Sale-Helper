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
exports.quickReplyRepo = void 0;
const quickReplies_model_1 = __importDefault(require("@models/facebook/quickReplies.model"));
class QuickReplyRepo {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const quickReply = yield quickReplies_model_1.default.findOne(query).lean();
            return quickReply;
        });
    }
    findMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const quickReply = yield quickReplies_model_1.default.find(query).lean();
            return quickReply;
        });
    }
    createQuickReply(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const quickReply = new quickReplies_model_1.default(entity);
            yield quickReply.save();
            return quickReply;
        });
    }
    updateQuickReply(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const quickReply = yield quickReplies_model_1.default.updateOne({ _id: entity._id }, entity);
            return quickReply;
        });
    }
    deleteQuickReply(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield quickReplies_model_1.default.deleteOne(query);
        });
    }
    findAndUpdate(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { _id: entity._id };
            const quickReply = yield quickReplies_model_1.default.findOneAndUpdate(filter, entity);
            return quickReply;
        });
    }
    deleteMany(pageId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield quickReplies_model_1.default.deleteMany({
                pageId: pageId,
                _id: {
                    $in: ids
                }
            });
        });
    }
}
const quickReplyRepo = new QuickReplyRepo();
exports.quickReplyRepo = quickReplyRepo;
