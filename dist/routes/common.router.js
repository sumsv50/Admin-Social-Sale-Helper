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
const multer_1 = __importDefault(require("@shared/multer"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_1 = require("express");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const router = (0, express_1.Router)();
const { CREATED, OK, UNAUTHORIZED } = http_status_codes_1.default;
router.post('/getLinkImage', multer_1.default.array('images'), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paths = (req.files || []).map((image) => image.path);
        res.status(OK).json(paths);
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false, {
            message: err.message,
        }));
    }
})));
exports.default = router;
