/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import responseFormat from "@shared/responseFormat";
import { RequestHandler, Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import PostService from "@services/site/post.service";
import { IOrder } from "@models/site/order.model";
import { jwtAuth } from '@middlewares/passport.middleware';
import { UserDTO } from "@dto/user.dto";
import { validate, schemas } from '@middlewares/inputValidation';

// Define constance
const ITEM_PER_PAGE = 12;
const router = Router();
const postService = new PostService();
const { OK } = StatusCodes;

//Define routes


/**
 * Get posts
 * 
 * /api/posts?group_id=&product_id=&date=&from_date=&to_date=&page=&limit=
 * 
 */
 router.get('', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        let query: any = {
            createdBy: user.id
        }
        let page = 1, limit = ITEM_PER_PAGE;

        if (req.query.group_id) query.groupIds = req.query.group_id.toString();
        if (req.query.product_id) query.productId = req.query.product_id.toString();
        if (req.query.page) query.page = req.query.page.toString();
        if (req.query.limit) query.limit = req.query.limit.toString();

        if (req.query.from_date || req.query.to_date) {
            query.createdAt = {};
            if (req.query.from_date) query.createdAt.$gte = new Date(req.query.from_date.toString());
            if (req.query.to_date) query.createdAt.$lt = new Date(req.query.to_date.toString());
        }

        const posts = await postService.getFbPosts(query, page, limit);
        return res.status(StatusCodes.CREATED).json( responseFormat(true, {}, {
            posts
        }));
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);

/**
 * Get post by id
 * 
 * /api/posts/{postId}
 * 
 */
 router.get('/:postId', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        const postId = req.params.postId.toString();
        let query: any = {
            createdBy: user.id,
            _id: postId
        }

        const post = await postService.getFbPost(query);
        return res.status(StatusCodes.CREATED).json( responseFormat(true, {}, {
            post
        }));
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);


// Export default
export default router;