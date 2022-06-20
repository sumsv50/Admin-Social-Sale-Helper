import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import { userRepo } from '@repos/site/user.repo';
import responseFormat from '@shared/responseFormat';
import analysisService from '@services/site/analysis.service';

const ITEM_PER_PAGE = 20;

// Constants
const router = Router();

export const p = {
  numberPosts: '/numberPosts',
  numberPostsOfUser: '/numberPosts/:userId'
} as const;

router.get(p.numberPostsOfUser, (async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const data = await analysisService.calculateNumberPostsEachEC(userId);
    console.log(data);

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      numberPosts: data
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.get(p.numberPosts, (async (req: Request, res: Response) => {
  try {
    const query: any = {};
    if (req.query.name) {
      query.name = new RegExp(String(req.query.name), 'i');
    }

    const page = Number(req.query.page) || 1;
    const users = await userRepo.findAllPagination(query, page, ITEM_PER_PAGE);
    const responeBody: any[] = [];

    for (const user of users.docs) {
      const userId = user._id;
      const numberPosts = await analysisService.calculateNumberPostsEachEC(userId);
      responeBody.push({
        userInfo: user,
        numberPosts: numberPosts
      })
    }

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      numberPosts: responeBody,
      pagination: {
        ...users,
        docs: undefined
      }
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

// Export default
export default router;

