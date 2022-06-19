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
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const fb_1 = require("@shared/fb");
const index_1 = __importDefault(require("../../index"));
const request_1 = __importDefault(require("request"));
const messageRead_service_1 = __importDefault(require("@services/facebook/messageRead.service"));
function getAllConversation(pageId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let response = [];
        const conversationResponse = yield fb_1.FB.api(`/${pageId}/conversations`, 'GET');
        const threads = conversationResponse.data;
        for (let thread of threads) {
            const threadDetail = yield fb_1.FB.api(`/${thread.id}?fields=participants,updated_time`, 'GET');
            const fbUserId = threadDetail.participants.data[0].id;
            let userDetail = {};
            try {
                userDetail = yield fb_1.FB.api(`/${fbUserId}/picture?type=large`, { redirect: false }, 'GET');
            }
            catch (error) {
                console.log(error.message);
            }
            threadDetail.participants.data[0] = Object.assign(threadDetail.participants.data[0], userDetail);
            const messageRead = yield messageRead_service_1.default.getMessageRead({ threadId: thread.id, userId: userId });
            threadDetail.isRead = (messageRead === null || messageRead === void 0 ? void 0 : messageRead.isRead) || false;
            response.push(threadDetail);
        }
        return response;
    });
}
function getDetail(threadId, userId) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        let response = [];
        const threadResponse = yield fb_1.FB.api(`/${threadId}?fields=participants,messages`, 'GET');
        const messages = threadResponse.messages.data;
        messageRead_service_1.default.updateMessageRead({ threadId: threadId, userId: userId, pageId: (_a = threadResponse.participants) === null || _a === void 0 ? void 0 : _a.data[1].id,
            senderId: (_b = threadResponse.participants) === null || _b === void 0 ? void 0 : _b.data[0].id, isRead: true });
        for (let message of messages) {
            const messageDetail = yield fb_1.FB.api(`/${message.id}?fields=created_time,from,to,message,attachments`, 'GET');
            response.push(messageDetail);
        }
        return response;
    });
}
function receiveEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        index_1.default.emit('get message', event);
        console.log(event);
        const messageRead = yield messageRead_service_1.default.getMessageRead({ senderId: event.senderId, pageId: event.recipientId });
        if (messageRead) {
            messageRead_service_1.default.updateMessageRead({ threadId: messageRead.threadId, userId: messageRead.userId, isRead: false });
        }
        return messageRead;
    });
}
function sendMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        const { receiverId, messageText, messageAttachment } = message;
        let request_body = {
            recipient: {
                id: receiverId
            },
            message: {}
        };
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (messageText) {
            request_body.message = {
                text: messageText
            };
        }
        if (messageAttachment) {
            request_body.message = {
                attachment: {
                    type: 'image',
                    payload: {
                        url: messageAttachment.path,
                        is_reusable: true
                    }
                }
            };
        }
        let response;
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
function turnOnGreeting(greetingText) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fb_1.FB.api('me/messenger_profile', 'POST', {
            get_started: {
                payload: 'GET_STARTED_PAYLOAD'
            },
            greeting: [{
                    locale: 'default',
                    text: greetingText
                }]
        });
        console.log(response);
        return response;
    });
}
function turnOffGreeting() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fb_1.FB.api('me/messenger_profile', 'DELETE', {
            fields: ["get_started", "greeting"]
        });
        return response;
    });
}
function getGreeting() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fb_1.FB.api('me/messenger_profile?fields=greeting,get_started', 'GET');
        let greeting;
        if (((_a = response.data) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            greeting = response.data[0].greeting[0].text;
        }
        return greeting;
    });
}
exports.default = {
    getAllConversation,
    getDetail,
    receiveEvent,
    sendMessage,
    turnOnGreeting,
    turnOffGreeting,
    getGreeting
};
