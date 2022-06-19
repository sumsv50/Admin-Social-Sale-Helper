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
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
const fb_1 = require("@shared/fb");
const user_repo_1 = require("@repos/site/user.repo");
function getAll() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fb_1.FB.api('/me/accounts?fields=name,id,picture,about,link', 'GET');
        return response.data;
    });
}
function connectPage(userId, pageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fb_1.FB.api(`${pageId}?fields=access_token`, 'GET');
        user_repo_1.userRepo.savePageAccessToken(userId, response.access_token);
        return response;
    });
}
function findDetail() {
    return __awaiter(this, void 0, void 0, function* () {
        const pageInfo = yield fb_1.FB.api('/me?fields=picture,name,about,link', 'GET');
        return pageInfo;
    });
}
function checkIfPageIsAccessible(pageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fb_1.FB.api(`me`, 'GET');
        if (response.id === pageId) {
            return true;
        }
        return false;
    });
}
exports.default = {
    getAll,
    connectPage,
    findDetail,
    checkIfPageIsAccessible
};
