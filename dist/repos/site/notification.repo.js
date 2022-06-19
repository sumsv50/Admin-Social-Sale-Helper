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
exports.notificationRepo = void 0;
const notification_1 = __importDefault(require("@models/site/notification"));
class NotificationRepo {
    create(orders) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_1.default.create(orders);
        });
    }
    findAllPagination(query, page, itemPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = yield notification_1.default.paginate(query, {
                page: page,
                limit: itemPerPage,
                lean: true,
                sort: '-createdAt'
            });
            return notifications;
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield notification_1.default.findOne(query);
            return notification;
        });
    }
    updateOne(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_1.default.updateOne(query, data);
        });
    }
    updateMany(query, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notification_1.default.updateMany(query, data);
        });
    }
}
const notificationRepo = new NotificationRepo();
exports.notificationRepo = notificationRepo;
