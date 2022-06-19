"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_1 = require("express");
const seller_service_1 = __importDefault(require("@services/tiki/seller.service"));
// Define constance
const router = (0, express_1.Router)();
const sellerService = new seller_service_1.default();
const { OK } = http_status_codes_1.default;
//Define routes
/**
 * Get seller information.
 *
 * /api/tiki/seller/me
 *
 */
router.get('/me', ((req, res) => {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    sellerService.getInformation(user.id)
        .then((body) => {
        res.status(OK).json(body);
    })
        .catch((e) => {
        res.statusMessage = e;
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
    });
}));
/**
 * Get seller's warehouses information.
 *
 * /api/tiki/seller/warehouses?status=status&type=type
 *
 */
router.get('/warehouses', ((req, res) => {
    const user = req.user;
    if (!user) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).end();
    }
    let limit, page;
    if (!req.query.limit) {
        limit = '20';
    }
    else
        limit = req.query.limit.toString();
    if (!req.query.page) {
        page = '1';
    }
    else
        page = req.query.page.toString();
    sellerService.getWarehouses(limit, page, user.id)
        .then((body) => {
        res.status(OK).json(body);
    })
        .catch((e) => {
        res.statusMessage = e;
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).end();
    });
}));
exports.default = router;
