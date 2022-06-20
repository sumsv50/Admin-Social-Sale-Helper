import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import { userRepo } from '@repos/site/user.repo';
import responseFormat from '@shared/responseFormat';
import userService from '@services/site/user.service';

const ITEM_PER_PAGE = 20;

// Constants
const router = Router();

export const p = {
  root: '/',
  specificUser: '/:userId',
  blockUser: '/block',
  unBlockUser: '/unBlock'
} as const;

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
      const connectedECSite = await userService.getConnectedECSite(userId);
      responeBody.push({
        userInfo: user,
        connectedECSite
      })
    }

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      users: responeBody,
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

router.get(p.specificUser, (async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const userInfo = await userRepo.getUserInfo({ _id: userId });

    if (!userInfo) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "User not found"
      }));
    }

    const connectedECSite = await userService.getConnectedECSite(userId);
    res.status(StatusCodes.OK).json( responseFormat(true, {}, {
      userInfo,
      connectedECSite
    }));
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler);

 // Block user
 router.post(p.blockUser, (async (req: Request, res: Response) => {
  try {
    const userId = <string>req.body.userId;
    const user = await userRepo.getUserInfo({ _id: userId });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "User not found"
      }));
    }
    if (user.isBlocked) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "User already has been blocked"
      }));
    }

    const result = await userRepo.updateOne({ _id: userId} , { isBlocked: true });
    if (result.modifiedCount <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {}, result ));
    }

    const updatedUser = await userRepo.getUserInfo({ _id: userId });

    return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
      user: updatedUser
    }));
    
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler)


 // Unblock user
 router.post(p.unBlockUser, (async (req: Request, res: Response) => {
  try {
    const userId = <string>req.body.userId;
    const user = await userRepo.getUserInfo({ _id: userId });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "User not found"
      }));
    }
    if (!user.isBlocked) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "User is not currently blocked"
      }));
    }

    const result = await userRepo.updateOne({ _id: userId} , { isBlocked: false });
    if (result.modifiedCount <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {}, result ));
    }

    const updatedUser = await userRepo.getUserInfo({ _id: userId });

    return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
      user: updatedUser
    }));
    
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler)


// Export default
export default router;

