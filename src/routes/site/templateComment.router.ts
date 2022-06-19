import responseFormat from "@shared/responseFormat";
import { RequestHandler, Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import TemplateCommentService from "@services/site/templateComment.service";
import { ITemplateComment } from "@models/site/templateComment.model";
import { jwtAuth } from '@middlewares/passport.middleware';
import { UserDTO } from "@dto/user.dto";
import { validate, schemas } from '@middlewares/inputValidation';

// Define constance
const ITEM_PER_PAGE = 12;
const router = Router();
const templateCommentService = new TemplateCommentService();
const { OK } = StatusCodes;


//Define routes

/**
 * Create template comment
 * 
 * /api/templateComments
 * 
 */
 router.post('', jwtAuth(), (async (req: Request, res: Response) => {

  try {
    const user = <UserDTO>req.user;
    const commentData = <ITemplateComment>req.body;
    commentData.createdBy = user.id;

    const comment = await templateCommentService.createComment(commentData);
    return res.status(StatusCodes.CREATED).json( responseFormat(true, {}, {
        comment
    }));
  } catch(err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }

}) as RequestHandler);

/**
 * Get all template comments (by user id)
 * 
 * /api/templateComments
 * 
 */
router.get('', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        const query: any = {   
            createdBy: user.id,
        };
        const comments = await templateCommentService.getAllComments(query);
        return res.status(OK).json(responseFormat(true, {}, comments));
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);

/**
 * Get templateComment by id
 * 
 * /api/templateComments/{templateCommnentId}
 * 
 */
 router.get('/:templateCommnentId', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        const query: any = {   
            createdBy: user.id,
            _id: req.params.templateCommnentId,
        };

        const comment = await templateCommentService.getComment(query);
    
        if (!comment) {
        return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
            message: "Comment not found"
        }));
        }
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);


/**
 * Update template comment
 * 
 * /api/templateComments/{templateCommnentId}
 * 
 */
 router.patch('/:templateCommnentId', jwtAuth(), (async (req: Request, res: Response) => {

  try {
    const user = <UserDTO>req.user;
    const templateCommnentId = req.params.templateCommnentId;
    const commentData = <ITemplateComment>req.body;

    let comment = await templateCommentService.getComment({
      createdBy: user.id,
      _id: templateCommnentId
    })

    if (!comment) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "Template comment not found"
      }));
    }
    await templateCommentService.updateComment({ _id: templateCommnentId }, commentData);

    comment = await templateCommentService.getComment({_id: templateCommnentId});

    return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
      id: comment?._id,
      ...comment,
      _id: undefined
    }));
    
  } catch(err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }

    
}) as RequestHandler);

/**
 * Delete Template comment by id
 * 
 * /api/templateComments/{templateCommnentId}
 * 
 */
 router.delete('/:templateCommnentId', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        const templateCommentId = req.params.templateCommnentId
        const query: any = {  
            _id: templateCommentId,
        };

        const comment = await templateCommentService.getComment(query);
    
        if (!comment) {
          return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
              message: "Template comment not found"
          }));
        }
  
        const deletedResult = await templateCommentService.deleteComment({_id: templateCommentId});
  
        return res.status(StatusCodes.OK).json(responseFormat(deletedResult.deletedCount > 0));
        
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }


}) as RequestHandler);

// Export default
export default router;