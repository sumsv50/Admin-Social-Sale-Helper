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
exports.jwtAuth = exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const passport_jwt_2 = require("passport-jwt");
const authentication_1 = __importDefault(require("@configs/authentication"));
const admin_repo_1 = require("@repos/site/admin.repo");
const opts = {
    jwtFromRequest: passport_jwt_2.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: authentication_1.default.JWT_SECRET
};
passport_1.default.use(new passport_jwt_1.Strategy(opts, function (jwt_payload, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const admin = yield admin_repo_1.adminRepo.findOne({ _id: jwt_payload.sub });
            if (admin) {
                if (admin.isBlocked) {
                    return done('Your account is banned!', false);
                }
                return done(null, { _id: admin._id });
            }
            done(null, false);
        }
        catch (err) {
            done(err, false);
        }
    });
}));
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: 'username',
}, function (username, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const admin = yield admin_repo_1.adminRepo.checkCredential(username, password);
            if (admin) {
                if (admin.isBlocked) {
                    return done('Your account is banned!', false);
                }
                return done(null, {
                    _id: admin._id,
                    username: admin.username,
                    picture: admin.picture,
                    email: admin.email
                });
            }
            return done(null, false);
        }
        catch (err) {
            console.log(err);
            return done(err, false);
        }
    });
}));
function jwtAuth() {
    return passport_1.default.authenticate('jwt', { session: false });
}
exports.jwtAuth = jwtAuth;
