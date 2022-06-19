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
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const express_1 = require("express");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const group_service_1 = __importDefault(require("@services/facebook/group.service"));
const fb_1 = require("@shared/fb");
const router = (0, express_1.Router)();
const { CREATED, OK, UNAUTHORIZED } = http_status_codes_1.default;
exports.p = {
    get: '/all',
    getById: '/:groupId',
    add: '/add',
};
/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *        - id
 *        - name
 *        - privacy
 *       properties:
 *         id:
 *           type: string
 *           description: user id
 *           example: "968221704087336"
 *         name:
 *           type: string
 *           description: name of the group
 *           example: TEST API FB ĐỒ ÁN TỐT NGHIỆP
 *         privacy:
 *           type: string
 *           description: OPEN or SECRET
 *           example: OPEN
 */
/**
 * @swagger
 * /api/facebook/groups/all:
 *   get:
 *     summary: Returns all groups of a user
 *     responses:
 *       200:
 *         description: Returns all groups of a user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *
 */
router.get(exports.p.get, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(OK);
        if (!(yield (0, fb_1.populateUserAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook'
            });
        }
        const groups = yield group_service_1.default.getAll();
        res.status(OK).json((0, responseFormat_1.default)(true, {}, groups));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
/**
 * @swagger
 * /api/facebook/groups/{groupId}:
 *   get:
 *     summary: Returns a group info
 *     responses:
 *       200:
 *         description: Returns a group info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *
 */
router.get(exports.p.getById, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(OK);
        if (!(yield (0, fb_1.populateUserAccessToken)(req.user))) {
            res.status(UNAUTHORIZED);
            return res.json({
                message: 'User is not connected to facebook'
            });
        }
        const group = yield group_service_1.default.getById(req.params.groupId);
        res.status(OK).json((0, responseFormat_1.default)(true, {}, group));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
exports.default = router;
