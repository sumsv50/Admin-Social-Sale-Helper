"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function responseFormat(ok, meta, data) {
    return {
        meta: Object.assign({ ok }, meta),
        data
    };
}
exports.default = responseFormat;
