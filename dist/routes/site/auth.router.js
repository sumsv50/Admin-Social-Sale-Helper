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
exports.p = void 0;
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication_1 = __importDefault(require("@configs/authentication"));
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const passport_middleware_1 = require("@middlewares/passport.middleware");
// Constants
const router = (0, express_1.Router)();
exports.p = {
    localSignUp: '/sign-up',
    localSignIn: '/sign-in',
    userInfo: '/user/info'
};
const encodedToken = (userId) => {
    return jsonwebtoken_1.default.sign({
        iss: "social-sale-helper",
        sub: userId,
    }, authentication_1.default.JWT_SECRET, {
        expiresIn: '30d'
    });
};
// router.post(p.localSignUp, (async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const isExisted = await userRepo.checkEmailIsExisted(email);
//     if (isExisted) {
//       res.status(StatusCodes.BAD_REQUEST).json( responseFormat(false, {
//         message: 'Email already in use!'
//       }, { email }));
//       return;
//     }
//     const newUser = await userRepo.createUser(email, password);
//     res.status(StatusCodes.CREATED).json(responseFormat(true, {}, {
//       email: newUser.email
//     }));
//   } catch(err) {
//     console.log(err);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
//   }
// })as RequestHandler);
router.post(exports.p.localSignIn, passport_middleware_1.passport.authenticate('local', { session: false }), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        const token = encodedToken(admin._id);
        res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            token,
            admin: {
                _id: admin._id,
                email: admin.email,
                username: admin.username,
                picture: admin.picture
            }
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// router.get(p.userInfo, passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
//   try {
//     const user = <UserDTO>req.user;
//     const userInfo = await adminRepo.getUserInfo({_id: user.id});
//     res.status(StatusCodes.OK).json( responseFormat(true, {}, {
//       user: {
//         id: userInfo._id,
//         ...userInfo,
//         _id: undefined
//       }
//     }));
//   } catch(err) {
//     console.log(err);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
//   }
// })as RequestHandler);
// Export default
exports.default = router;
