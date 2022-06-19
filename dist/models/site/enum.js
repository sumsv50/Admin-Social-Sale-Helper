"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEcSite = exports.getDescription = exports.NOTIFICATION_STATUS = exports.NOTIFICATION_TYPE = exports.POST_STATUS = exports.CATEGORIES = exports.EC_SITE = exports.ORDER_STATE = void 0;
const ORDER_STATE = {
    QUEUING: {
        code: 1,
        description: 'Đang chờ xác nhận'
    },
    CONFIRMED: {
        code: 2,
        description: 'Đã xác nhận'
    },
    DELIVERING: {
        code: 3,
        description: 'Đang giao hàng'
    },
    ARRIVED: {
        code: 4,
        description: 'Hoàn thành'
    },
    REJECTED: {
        code: 0,
        description: 'Bị từ chối'
    },
    CANCELED: {
        code: -1,
        description: 'Bị khách hủy'
    }
};
exports.ORDER_STATE = ORDER_STATE;
const EC_SITE = {
    FACEBOOK: {
        code: 1,
        site: 'Facebook'
    },
    TIKI: {
        code: 2,
        site: 'Tiki'
    },
    SENDO: {
        code: 3,
        site: 'Sendo'
    }
};
exports.EC_SITE = EC_SITE;
const CATEGORIES = [
    'Thiết bị điện tử',
    'Áo quần',
    'Giày dép',
    'Mũ nón',
    'Phụ kiện',
    'Phụ tùng xe',
    'Đồ gia dụng',
    'Thức ăn',
    'Đồ uống',
    'Đồ dùng học tập',
    'Sách'
];
exports.CATEGORIES = CATEGORIES;
const POST_STATUS = {
    POSTED: 'posted',
    WAITING: 'waiting'
};
exports.POST_STATUS = POST_STATUS;
const NOTIFICATION_TYPE = {
    INTERESTING_POST: 'interestingPost'
};
exports.NOTIFICATION_TYPE = NOTIFICATION_TYPE;
const NOTIFICATION_STATUS = {
    READ: 'read',
    NOT_READ: 'notRead'
};
exports.NOTIFICATION_STATUS = NOTIFICATION_STATUS;
function getDescription(code) {
    for (const value of Object.values(ORDER_STATE)) {
        if (value.code === code) {
            return value.description;
        }
    }
    return 'Code not found';
}
exports.getDescription = getDescription;
function getEcSite(code) {
    for (const value of Object.values(EC_SITE)) {
        if (value.code === code) {
            return value.site;
        }
    }
    return 'Code not found';
}
exports.getEcSite = getEcSite;
