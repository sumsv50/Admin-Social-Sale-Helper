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
const recommendation_repo_1 = require("@repos/facebook/recommendation.repo");
exports.default = {
    updateRecommendation: updateRecommendation,
    getRecommendation: getRecommendation,
    getResponseMessageContent: getResponseMessageContent,
    addRecommendation: addRecommendation,
    deleteRecommendation: deleteRecommendation,
    getManyRecommendation: getManyRecommendation
};
function updateRecommendation(recommendation) {
    return __awaiter(this, void 0, void 0, function* () {
        const recommendationRes = yield recommendation_repo_1.recommendationRepo.updateRecommendation(recommendation);
        return recommendationRes;
    });
}
function getRecommendation(pageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const recommendation = yield recommendation_repo_1.recommendationRepo.find({ pageId: pageId });
        return recommendation;
    });
}
function getManyRecommendation(pageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const recommendations = yield recommendation_repo_1.recommendationRepo.findMany({ pageId: pageId });
        return recommendations;
    });
}
function addRecommendation(recommendation) {
    return __awaiter(this, void 0, void 0, function* () {
        const newRecommendation = yield recommendation_repo_1.recommendationRepo.createRecommendation(recommendation);
        return newRecommendation;
    });
}
function deleteRecommendation(recommendation) {
    return __awaiter(this, void 0, void 0, function* () {
        const deletedRecommendation = yield recommendation_repo_1.recommendationRepo.deleteMany(recommendation.pageId, recommendation.ids);
        return deletedRecommendation;
    });
}
function getResponseMessageContent(pageId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        const recommendations = yield getManyRecommendation(pageId);
        let responseMessageContent = null;
        for (const recommendation of recommendations) {
            if (recommendation) {
                recommendation.mappings.forEach((element) => {
                    //if message contains any element of keys
                    const isContainsKey = element.keys.some((key) => message.includes(key));
                    if (isContainsKey && element.active) {
                        responseMessageContent = element.responseContent;
                        return responseMessageContent;
                    }
                });
            }
        }
        return responseMessageContent;
    });
}
