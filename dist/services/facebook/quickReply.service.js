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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const quickReply_repo_1 = require("@repos/facebook/quickReply.repo");
const request_1 = __importDefault(require("request"));
exports.default = {
    updateQuickReply: updateQuickReply,
    getQuickReply: getQuickReply,
    sendMessage: sendMessage,
    addQuickReply: addQuickReply,
    deleteQuickReply: deleteQuickReply
};
function updateQuickReply(quickReply) {
    return __awaiter(this, void 0, void 0, function* () {
        const quickReplyRes = yield quickReply_repo_1.quickReplyRepo.updateQuickReply(quickReply);
        return quickReplyRes;
    });
}
function addQuickReply(quickReply) {
    return __awaiter(this, void 0, void 0, function* () {
        const newQuickReply = yield quickReply_repo_1.quickReplyRepo.createQuickReply(quickReply);
        return newQuickReply;
    });
}
function deleteQuickReply(quickReply) {
    return __awaiter(this, void 0, void 0, function* () {
        const deletedQuickReply = yield quickReply_repo_1.quickReplyRepo.deleteMany(quickReply.pageId, quickReply.ids);
        return deletedQuickReply;
    });
}
function getQuickReply(pageId) {
    return __awaiter(this, void 0, void 0, function* () {
        const quickReply = yield quickReply_repo_1.quickReplyRepo.findMany({ pageId: pageId });
        return quickReply;
    });
}
function sendMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const { receiverId, quickReplyId } = message;
        const quickReply = yield quickReply_repo_1.quickReplyRepo.find({ _id: quickReplyId });
        const request_body = {
            recipient: {
                id: receiverId
            },
            message: {
                text: quickReply.text,
                quick_replies: quickReply.samples.map((e) => {
                    const { _id } = e, newE = __rest(e, ["_id"]);
                    return newE;
                })
            }
        };
        return new Promise(function (resolve, reject) {
            (0, request_1.default)({
                "uri": "https://social-sales-helper-webhook.herokuapp.com/callSendAPI",
                "method": "POST",
                "json": request_body
            }, (err, res, body) => {
                if (!err) {
                    resolve(body);
                }
                else {
                    reject(err);
                }
            });
        });
    });
}
