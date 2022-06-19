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
exports.userRepo = void 0;
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("@models/site/user.model"));
const SALT_ROUNDS = 10;
class UserRepo {
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_model_1.default.findOne(query).lean();
            return user;
        });
    }
    findAllPagination(query, page, itemPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield user_model_1.default.paginate(query, {
                page: page,
                limit: itemPerPage,
                lean: true,
                select: ['-password'],
            });
            return users;
        });
    }
    updateOne(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.updateOne(query, data);
        });
    }
    findOrCreate(profile) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, name, picture } = profile;
            let user = yield user_model_1.default.findOne({ fbId: id });
            if (!user) {
                user = new user_model_1.default({ fbId: id, name, picture });
                yield user.save();
            }
            else {
                // user.picture = picture;
                yield user.save();
            }
            return user;
        });
    }
    saveFBAccessToken(userId, accessToken, expire) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.updateOne({ _id: userId }, {
                $set: {
                    fbAccessToken: accessToken,
                    fbAccessToken_expire: expire,
                },
            });
        });
    }
    savePageAccessToken(userId, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.updateOne({ _id: userId }, {
                $set: {
                    pageAccessToken: accessToken
                },
            });
        });
    }
    checkEmailIsExisted(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findOne({ email });
            return Boolean(user);
        });
    }
    createUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = bcrypt_1.default.hashSync(password, SALT_ROUNDS);
            const user = yield user_model_1.default.create({
                email,
                password: hash
            });
            return user;
        });
    }
    getUserInfo(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = (yield user_model_1.default.findOne(query).select(['-password']).lean());
            return user;
        });
    }
    find(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.find(query);
        });
    }
}
const userRepo = new UserRepo();
exports.userRepo = userRepo;
