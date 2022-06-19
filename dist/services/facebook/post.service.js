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
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
const fb_1 = require("@shared/fb");
const fs_1 = __importDefault(require("fs"));
const post_repo_1 = require("@repos/site/post.repo");
const functions_1 = require("@shared/functions");
const group_service_1 = __importDefault(require("./group.service"));
const enum_1 = require("@models/site/enum");
//define constant
const fbPostRepo = new post_repo_1.FbPostRepo();
function getAll(groupId) {
    return __awaiter(this, void 0, void 0, function* () {
        fb_1.FB.setAccessToken(process.env.PAGE_ACCESS_TOKEN);
        const postResponse = yield fb_1.FB.api(`/${groupId}/feed?fields=link,message,from,created_time,updated_time,attachments`, 'GET');
        for (let post of postResponse.data) {
            let media = [];
            if (post.attachments) {
                for (let attachment of post.attachments.data) {
                    if (attachment === null || attachment === void 0 ? void 0 : attachment.subattachments) {
                        for (let subAttachment of attachment.subattachments.data) {
                            media.push(subAttachment.media.image);
                        }
                    }
                    else if (attachment === null || attachment === void 0 ? void 0 : attachment.media) {
                        media.push(attachment.media.image);
                    }
                }
                post.attachments = undefined;
            }
            post.media = media;
        }
        const groupInfoResponse = yield fb_1.FB.api(`/${groupId}?fields=picture, name`, 'GET');
        return { posts: postResponse.data, groupInfo: groupInfoResponse };
    });
}
function getById(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield fbPostRepo.findOne(query);
    });
}
function post(postReq) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fb_1.FB.api(`/${postReq.groupId}/feed`, 'POST', {
            message: postReq.content,
        });
        //save to db
        let groups = [];
        groups.push(yield group_service_1.default.getById(postReq.groupId));
        yield fbPostRepo.create({
            createdBy: postReq.user.id,
            fbPostIds: response.post,
            groups: groups,
            content: postReq.content,
            images: postReq.images,
            product: postReq.productId,
        });
        return response;
    });
}
function postMultiple(postReqList) {
    return __awaiter(this, void 0, void 0, function* () {
        let postIds = [];
        let postStatus = enum_1.POST_STATUS.WAITING;
        const groupIds = postReqList.groupsId;
        const isSchedulePost = Boolean(postReqList.schedulePostTime);
        if (!isSchedulePost) {
            postIds = yield postMultiToFB(postReqList);
            postStatus = enum_1.POST_STATUS.POSTED;
        }
        if (postReqList.is_seller) {
            //save to db
            let groups = [];
            for (const groupId of groupIds) {
                groups.push(yield group_service_1.default.getById(groupId));
            }
            yield fbPostRepo.create({
                createdBy: postReqList.user.id,
                fbPostIds: postIds,
                groups: groups,
                content: postReqList.content,
                images: postReqList.images,
                product: postReqList.productId,
                status: postStatus,
                schedulePostTime: postReqList.schedulePostTime
            });
        }
        return postIds;
    });
}
function postMultiToFB(postReqList) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const postIds = [];
        const groupIds = postReqList.groupsId;
        const isHavingImages = ((_a = postReqList === null || postReqList === void 0 ? void 0 : postReqList.images) === null || _a === void 0 ? void 0 : _a.length) > 0 ? true : false;
        for (const groupId of groupIds) {
            let response;
            if (isHavingImages) {
                response = yield fb_1.FB.api(`/${groupId}/feed`, 'POST', {
                    message: postReqList.content,
                    link: postReqList.images[0],
                });
            }
            else {
                response = yield fb_1.FB.api(`/${groupId}/feed`, 'POST', {
                    message: postReqList.content,
                });
            }
            postIds.push(response.id);
        }
        return postIds;
    });
}
function getFromMultiGroup(groupIds) {
    return __awaiter(this, void 0, void 0, function* () {
        let posts = [];
        for (const groupId of groupIds) {
            try {
                const response = yield getAll(groupId);
                response.posts.forEach((post) => {
                    post.groupInfo = response.groupInfo;
                    if (post.from) {
                        const posterId = post.from.id;
                        post.from.picture = `https://graph.facebook.com/${posterId}/picture?type=large&access_token=${process.env.PAGE_ACCESS_TOKEN}`;
                    }
                });
                posts = posts.concat(response.posts);
            }
            catch (err) {
                continue;
            }
        }
        return posts;
    });
}
function filterInterestedPostsWithinTime(posts, keywords, timeRange = null) {
    let result = [];
    if (keywords.length <= 0) {
        return result;
    }
    const removedAscentKeywords = keywords.map((keyword) => (0, functions_1.removeAscent)(keyword));
    const filterRegex = new RegExp(removedAscentKeywords.join('|'), 'i');
    for (const post of posts) {
        const postTime = new Date(post.updated_time).getTime();
        if (timeRange && !(0, functions_1.isWithInRangeTime)(postTime, timeRange)) {
            continue;
        }
        if (filterRegex.test((0, functions_1.removeAscent)(post.message))) {
            result.push(post);
        }
    }
    return result;
}
function postWaitingPosts() {
    return __awaiter(this, void 0, void 0, function* () {
        const now = new Date().getTime();
        const waitingPosts = yield fbPostRepo.findManyWithoutPaginate({
            status: enum_1.POST_STATUS.WAITING,
            schedulePostTime: { $lte: now },
        });
        for (const waitingPost of waitingPosts) {
            if (!(yield (0, fb_1.populateUserAccessToken)({ id: waitingPost.createdBy }))) {
                continue;
            }
            try {
                const payload = {
                    groupsId: waitingPost.groups.map((group) => group.id),
                    content: waitingPost.content,
                    images: waitingPost.images,
                };
                const fbPostIds = yield postMultiToFB(payload);
                // Update waitingPost
                yield fbPostRepo.updateOne({ _id: waitingPost._id }, {
                    status: enum_1.POST_STATUS.POSTED,
                    fbPostIds,
                });
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fb_1.FB.api(`/968221704087336/photos`, 'POST', {
            message: 'test',
            attached_media: [
                fs_1.default.createReadStream(process.cwd() + '/src/public/images/1on2y0.jpg'),
                fs_1.default.createReadStream(process.cwd() + '/src/public/images/undefined.png'),
            ],
        });
        return response;
    });
}
function getInteractions(postIds) {
    return __awaiter(this, void 0, void 0, function* () {
        let postData = [];
        for (const postId of postIds) {
            const response = yield fb_1.FB.api(`/${postId}?fields=comments,reactions,shares`, 'GET');
            // const noOfComments = response?.comments?.data.length || 0;
            // const noOfReactions = response?.reactions?.data.length || 0;
            // const noOfShares = response?.shares?.count || 0;
            // sum += noOfComments + noOfReactions + noOfShares;
            postData.push(response);
        }
        return postData;
    });
}
function filterPostsOfOtherMember(posts, fbId) {
    var _a;
    const result = [];
    for (const post of posts) {
        if (((_a = post === null || post === void 0 ? void 0 : post.from) === null || _a === void 0 ? void 0 : _a.id) && post.from.id == fbId) {
            continue;
        }
        result.push(post);
    }
    return result;
}
exports.default = {
    getAll,
    getById,
    post,
    postMultiple,
    getFromMultiGroup,
    filterInterestedPostsWithinTime,
    postWaitingPosts,
    getInteractions,
    filterPostsOfOtherMember,
    test,
};
