import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import { userRepo } from '@repos/site/user.repo';
import responseFormat from '@shared/responseFormat';
import analysisService from '@services/site/analysis.service';

const ITEM_PER_PAGE = 20;

// Constants
const router = Router();

export const p = {
  root: '/',
  specificUser: '/:userId'
} as const;

router.get(p.specificUser, (async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const data = await analysisService.calculateNumberPostsEachEC(userId);

    const numberProducts = await analysisService.calculateNumberProduct(userId);
    const numberOrders = await analysisService.calculateNumberOrder(userId);

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      numberPosts: data,
      numberProducts,
      numberOrders
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.get(p.root, (async (req: Request, res: Response) => {
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
      const numberProducts = await analysisService.calculateNumberProduct(userId);
      const numberOrders = await analysisService.calculateNumberOrder(userId);
      responeBody.push({
        userInfo: user,
        numberPosts,
        numberProducts,
        numberOrders
      })
    }

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      analysis: responeBody,
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

