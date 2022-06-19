/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import { favoriteKeywordRepo } from '@repos/facebook/favoriteKeyword.repo';
import responseFormat from '@shared/responseFormat';
import { UserDTO } from '@dto/user.dto';
import { validate, schemas } from '@middlewares/inputValidation';
import { IFavoriteKeyword } from '@models/facebook/favoriteKeyword.modal';
// Constants
const router = Router();

export const p = {
  root: '/',
  specificKeyword: '/:keywordId'
} as const;

// Create keyword
router.post(p.root, validate(schemas.createFavoriteKeyword), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const keywordData  = <IFavoriteKeyword>req.body;
    keywordData.createdBy = user.id;

    let keyword = await favoriteKeywordRepo.findOne({
      createdBy: user.id,
      content: keywordData.content
    })

    if (!keyword) {
      keyword = await favoriteKeywordRepo.create(keywordData);
    }

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      keyword
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

// Get all
router.get(p.root, (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const query: any = {
      createdBy: user.id,
    };

    const page = Number(req.query.page) || 1;

    const keywords = await favoriteKeywordRepo.findAll(query);
    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      keywords
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

// Delete keyword
router.delete(p.specificKeyword, (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const keywordId = req.params.keywordId;

    const keyword = await favoriteKeywordRepo.findOne({
      createdBy: user.id,
      _id: keywordId
    })

    if (!keyword) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "Keyword not found"
      }));
    }

    const deletedResult = await favoriteKeywordRepo.deleteOne({_id: keywordId});

    return res.status(StatusCodes.OK).json(responseFormat(deletedResult.deletedCount > 0));
    
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler);

// DELETE many products
router.delete(p.root, validate(schemas.deleteManyKeyword), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const { keywordIds } = req.body;

    const deletedResult = await favoriteKeywordRepo.deleteMany(user.id, keywordIds);

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      deletedCount: deletedResult.deletedCount
    }));
    
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler);


// Export default
export default router;
