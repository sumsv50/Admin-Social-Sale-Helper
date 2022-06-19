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
const passport_middleware_1 = require("@middlewares/passport.middleware");
const report_service_1 = __importDefault(require("@services/site/report.service"));
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const express_1 = require("express");
const http_status_codes_1 = require("http-status-codes");
const fb_1 = require("@shared/fb");
// Define constance
const { OK, UNAUTHORIZED } = http_status_codes_1.StatusCodes;
const router = (0, express_1.Router)();
exports.p = {
    reportSales: '/reportSales',
    reportPost: '/reportPost',
};
const reportService = new report_service_1.default();
router.post(exports.p.reportSales, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const reportRequest = req.body;
        const reportData = yield reportService.getSalesReport(user.id, reportRequest);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, reportData));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.post(exports.p.reportPost, (0, passport_middleware_1.jwtAuth)(), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!(yield (0, fb_1.populateUserAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook'
            });
        }
        const user = req.user;
        const reportRequest = req.body;
        const reportData = yield reportService.getPostReport(user.id, reportRequest);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, reportData));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Export default
exports.default = router;
