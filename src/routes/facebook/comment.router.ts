/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import commentService from '@services/facebook/comment.service';
import { populateUserAccessToken } from '@shared/fb';
import { UserDTO } from '@dto/user.dto';
import responseFormat from '@shared/responseFormat';

const router = Router();
const { CREATED, OK, UNAUTHORIZED } = StatusCodes;

export const p = {
  get: '/',
} as const;

router.post(p.get, (async (req: Request, res: Response) => {
  try {
    if (!(await populateUserAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User did not connect to facebook',
      });
    }
    const { postIds, page } = req.body;
    const comments = await commentService.getAll(postIds, page);
    res.status(OK).json(responseFormat(true, {}, comments));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

export default router;
