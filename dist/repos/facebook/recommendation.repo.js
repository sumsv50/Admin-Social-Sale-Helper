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
exports.recommendationRepo = void 0;
const recommendation_model_1 = __importDefault(require("@models/facebook/recommendation.model"));
class RecommendationRepo {
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const recommendation = yield recommendation_model_1.default.findOne(query).lean();
            return recommendation;
        });
    }
    findMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const recommendation = yield recommendation_model_1.default.find(query).lean();
            return recommendation;
        });
    }
    createRecommendation(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const recommendation = new recommendation_model_1.default(entity);
            yield recommendation.save();
            return recommendation;
        });
    }
    updateRecommendation(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const recommendation = yield recommendation_model_1.default.updateOne({ _id: entity._id }, entity);
            return recommendation;
        });
    }
    findAndUpdate(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { pageId: entity.pageId };
            const recommendation = yield recommendation_model_1.default.findOneAndUpdate(filter, entity, { new: true, upsert: true });
            return recommendation;
        });
    }
    deleteMany(pageId, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield recommendation_model_1.default.deleteMany({
                pageId: pageId,
                _id: {
                    $in: ids
                }
            });
        });
    }
}
const recommendationRepo = new RecommendationRepo();
exports.recommendationRepo = recommendationRepo;
