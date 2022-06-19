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
Object.defineProperty(exports, "__esModule", { value: true });
const fb_1 = require("@shared/fb");
const ITEM_PER_PAGE = 12;
function getAll(postIds, page) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line prefer-const
        let comments = [];
        for (const postId of postIds) {
            const response = yield fb_1.FB.api(`/${postId}/comments?fields=from,message,likes,comments,attachment,created_time`, 'GET');
            for (const comment of response.data) {
                comments.push(Object.assign(Object.assign({}, comment), { postId }));
            }
        }
        // const commentsInCurrentPage = paginate(comments, ITEM_PER_PAGE, page);
        // const totalPages = Math.ceil(comments.length / ITEM_PER_PAGE);
        // const hasPrevPage = page > 1;
        // const hasNextPage = page < totalPages;
        // const prevPage = page != 1 ? page - 1 : null;
        // const nextPage = page != totalPages ? page + 1 : null;
        // const pagination = {
        //   limit: ITEM_PER_PAGE,
        //   count: commentsInCurrentPage.length,
        //   totalPages: totalPages,
        //   page: page,
        //   hasPrevPage: hasPrevPage,
        //   hasNextPage: hasNextPage,
        //   prevPage: prevPage,
        //   nextPage: nextPage,
        // };
        return { comments };
    });
}
exports.default = {
    getAll,
};
