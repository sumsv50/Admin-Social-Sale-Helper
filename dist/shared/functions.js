"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWithInRangeTime = exports.paginate = exports.removeAscent = exports.getRandomInt = exports.pErr = void 0;
const jet_logger_1 = __importDefault(require("jet-logger"));
/**
 * Print an error object if it's truthy. Useful for testing.
 *
 * @param err
 */
function pErr(err) {
    if (!!err) {
        jet_logger_1.default.err(err);
    }
}
exports.pErr = pErr;
/**
 * Get a random number between 1 and 1,000,000,000,000
 *
 * @returns
 */
function getRandomInt() {
    return Math.floor(Math.random() * 1000000000000);
}
exports.getRandomInt = getRandomInt;
function removeAscent(str) {
    let temp = str;
    if (temp === null || temp === undefined)
        return temp;
    temp = temp.toLowerCase();
    temp = temp.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    temp = temp.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    temp = temp.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    temp = temp.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    temp = temp.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    temp = temp.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    temp = temp.replace(/đ/g, "d");
    return temp;
}
exports.removeAscent = removeAscent;
function paginate(array, page_size, page_number) {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}
exports.paginate = paginate;
function isWithInRangeTime(timeStamp, second) {
    const now = new Date().getTime();
    if (timeStamp + second < now) {
        return false;
    }
    return true;
}
exports.isWithInRangeTime = isWithInRangeTime;
