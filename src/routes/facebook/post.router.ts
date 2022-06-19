/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import io from '../../index'
import postService from '@services/facebook/post.service';
import groupService from '@services/facebook/group.service';
import { ParamMissingError } from '@shared/errors';
import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import { populateUserAccessToken, FB } from '@shared/fb';
import upload from '@shared/multer'
import { UserDTO } from '@dto/user.dto';
import responseFormat from '@shared/responseFormat';
import { userRepo } from '@repos/site/user.repo';
import { favoriteKeywordRepo } from '@repos/facebook/favoriteKeyword.repo';
import { IUser } from '@models/site/user.model';

const TIME_NEW_POST = 5*60*1000;


const router = Router();
const { CREATED, OK, UNAUTHORIZED } = StatusCodes;

export const p = {
  getAll: '/all/:groupId',
  post: '/post',
  postMultiple: '/post/multiple',
  test: '/test',
  interestedPost: '/interested-posts',
  getById: '/:fbPostId',
} as const;
/**
 * @swagger
 * components:
 *   schemas:
 *     Post: 
 *       type: object
 *       required:
 *        - id
 *       properties:
 *         id:
 *           type: string
 *           description: id of the post
 *           example: "968221704087336_979928342916672"
 *         content:
 *           type: string
 *           description: content body of the post
 *           example: Cần bán máy ảnh
 *         updated_time:
 *           type: string
 *           description: u already know
 *     PostReq:
 *       type: object
 *       required:
 *         - groupId 
 *         - content
 *       properties:
 *         groupId: 
 *           type: string
 *           description: group id
 *         content:
 *           type: string
 *           description: content body of the post
 *     PostReqList:
 *       type: object
 *       required:
 *         - groupIds 
 *         - content
 *         - images 
 *       properties:
 *         groupIds: 
 *           type: array
 *           items:
 *             type: string
 *         content:
 *           type: string
 *           description: content body of the post
 */

/**
 * @swagger
 * /api/facebook/posts/all/{groupId}:
 *   get: 
 *     summary: 
 *     responses: Returns all posts of a group
 *       200:
 *         description: Returns all posts of a group
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 * 
 */
 router.get(p.getAll, (async (req: Request, res: Response) => {
  try {
    if (!(await populateUserAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook',
      });
    }
    res.status(OK);
    const post = await postService.getAll(req.params.groupId);
    res.status(OK).json(responseFormat(true,{},post));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

/**
 * @swagger
 * /api/facebook/posts/post:
 *   post: 
 *     summary: Add a new post
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostReq'
 *     responses: 
 *       200:
 *         description: Returns post id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: 
 *                   type: string
 *                   description: post's id
 */
router.post(p.post, upload.single('image'), (async (req: Request, res: Response) => {
  try {
    if(!(await populateUserAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook'
      });
    }
    const postReq = {...req.body, file: req.file, user: <UserDTO>req.user};
  
    if (!postReq) {
      throw new ParamMissingError();
    }
    const post = await postService.post(postReq);
    res.status(OK).json(responseFormat(true,{},post));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

/**
 * @swagger
 * /api/facebook/posts/post/multiple:
 *   post: 
 *     summary: Add new posts
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:  
 *             type: object        
 *             $ref: '#/components/schemas/PostReqList'
 *     responses: 
 *       200:
 *         description: Returns posts' id
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: posts' id
 */
router.post(p.postMultiple, (async (req: Request, res: Response) => {
  try {
    if(!(await populateUserAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook'
      });
    }
    const postReqList = req.body;
    postReqList.images = req.body.images;
    postReqList.user = <UserDTO>req.user;
  
    if (!postReqList) {
      throw new ParamMissingError();
    }
  
    const post = await postService.postMultiple(postReqList);
    res.status(OK).json(responseFormat(true,{},{ post }));
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }

}) as RequestHandler);


router.post(p.test, (async (req: Request, res: Response) => {
  res.status(OK);

  const post = await postService.test();
  res.status(OK).json({ post });
}) as RequestHandler);


router.get(p.interestedPost, (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    if (!(await populateUserAccessToken(user))) {
      throw new Error('User is not connected to facebook');
    }
    const { groupId, keyword } = req.query;
    let groupIds, keywords;

    if (groupId) {
      groupIds = (<string>groupId).split(",");
    } else {
      const myGroups = await groupService.getAll();
      groupIds = myGroups.map((group: any) => group.id);
    }

    if (groupIds.length <= 0) {
      return res.status(StatusCodes.OK).json(responseFormat(true, {
        message: "You have not joined any groups!"
      }, { posts: [] }));
    }

    if (keyword) {
      keywords = (<string>keyword).split(",");
    } else {
      const myKeywords = await favoriteKeywordRepo.findAll({
        createdBy: user.id
      });
      keywords = myKeywords.map((keyword: any) => keyword.content);
    }

    if (keywords.length <= 0) {
      return res.status(StatusCodes.OK).json(responseFormat(true, {
        message: "You have not had any favorite keywords!"
      }, { posts: [] }));
    }
    var posts = await postService.getFromMultiGroup(groupIds);
    posts = postService.filterInterestedPostsWithinTime(posts, keywords);

    res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      posts
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
      message: err.message
    }));
  }
}))

/**
 * @swagger
 * /facebook/posts/{fbPostId}:
 *   get: 
 *     summary: Returns post with all fb post id, fb group id by our fbPostId
 *     responses: 
 *       200:
 *         description: Returns post with all fb post id, fb group id by our fbPostId
 *         content:
 *           application/json:
 *             
 * 
 */
 router.get(p.getById, (async (req: Request, res: Response) => {
  try {
    if (!populateUserAccessToken(<UserDTO>req.user)) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook',
      });
    }
    res.status(OK);
    const post = await postService.getById({
      createdBy: (<UserDTO>req.user).id,
      _id: req.params.fbPostId
    });
    res.status(OK).json(responseFormat(false,{},post));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

export default router;