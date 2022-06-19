/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import { populatePageAccessToken, populateUserAccessToken } from '@shared/fb';
import { UserDTO } from '@dto/user.dto';
import pageService from '@services/facebook/page.service';
import responseFormat from '@shared/responseFormat';
const router = Router();
const { CREATED, OK, UNAUTHORIZED } = StatusCodes;

export const p = {
  get: '/all',
  getConnectedPage: '/',
  connect: '/connect',
} as const;

router.get(p.get, (async (req: Request, res: Response) => {
  try {
    if (!(await populateUserAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User did not connect to facebook',
      });
    }
    const pages = await pageService.getAll();
    res.status(OK).json(responseFormat(true,{},pages));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.get(p.getConnectedPage, (async (req: Request, res: Response) => {
  try {
    if (!(await populatePageAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User did not connect to facebook page',
      });
    }
    const page = await pageService.findDetail();
    if(!page) {
      res.status(OK).json(responseFormat(false,{},{message: 'User did not connect to this page'}));
    } 
    res.status(OK).json(responseFormat(true,{},page));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.post(p.connect, (async (req: Request, res: Response) => {
  try {
    if (!(await populateUserAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User did not connect to facebook',
      });
    }
    const user = <UserDTO>req.user;
    const response = await pageService.connectPage(user.id, req.body.pageId);
    res.status(OK).json(responseFormat(true,{},response));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
  }) as RequestHandler);

export default router;
