import responseFormat from "@shared/responseFormat";
import { RequestHandler, Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import notificationService from "@services/site/notification.service";
import { jwtAuth } from '@middlewares/passport.middleware';
import { UserDTO } from "@dto/user.dto";
import { notificationRepo } from "@repos/site/notification.repo";

const ITEM_PER_PAGE = 8;

const router = Router();

export const p = {
  root: '/',
  markRead: '/markRead',
  markReadAll: '/markReadAll'
} as const;


// GET list notification
router.get(p.root, jwtAuth(), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const page = Number(req.query.page) || 1;
    const status = <string>req.query.status;

    const notifications = await notificationService.getNotification(user.id, status, page, ITEM_PER_PAGE);
    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      notifications: notifications.docs,
      pagination: {
        ...notifications,
        docs: undefined
      }
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler)



// POST mark read notification
router.post(p.markRead, jwtAuth(), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const notificationId = req.body.notificationId;

    const query: any = {
      userId: user.id,
      _id: notificationId
    };

    let notification = await notificationRepo.findOne(query);

    if (!notification) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "Notification not found"
      }));
    }

    const result = await notificationRepo.updateOne({ _id: notificationId }, { isRead: true });
    if (result.modifiedCount <= 0) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {}, result));
    }

    notification = await notificationRepo.findOne(query);

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      notification,
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler)

// POST mark read all notification
router.post(p.markReadAll, jwtAuth(), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;

    const query: any = {
      userId: user.id,
      isRead: { "$ne": true }
    };

    const result = await notificationRepo.updateMany(query, { isRead: true });

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      modifiedCount: result.modifiedCount
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler)


export default router;