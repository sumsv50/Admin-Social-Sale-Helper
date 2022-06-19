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
exports.FB = exports.populatePageAccessToken = exports.populateUserAccessToken = void 0;
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const fb_1 = __importDefault(require("fb"));
exports.FB = fb_1.default;
const user_repo_1 = require("@repos/site/user.repo");
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
// FB.setAccessToken(process.env.FB_ACCESS_TOKEN);
const populateUserAccessToken = (userDto) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield user_repo_1.userRepo.findOne({ _id: userDto.id }));
    if (user === null || user === void 0 ? void 0 : user.fbAccessToken) {
        yield fb_1.default.setAccessToken(user.fbAccessToken);
        return user;
    }
    fb_1.default.setAccessToken('');
    return false;
});
exports.populateUserAccessToken = populateUserAccessToken;
const populatePageAccessToken = (userDto) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield user_repo_1.userRepo.findOne({ _id: userDto.id }));
    if (user === null || user === void 0 ? void 0 : user.pageAccessToken) {
        yield fb_1.default.setAccessToken(user.pageAccessToken);
        return user;
    }
    fb_1.default.setAccessToken('');
    return false;
});
exports.populatePageAccessToken = populatePageAccessToken;
