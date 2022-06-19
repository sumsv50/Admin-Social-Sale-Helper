import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import recommendationService from '@services/facebook/recommendation.service';
import { populatePageAccessToken } from '@shared/fb';
import { UserDTO } from '@dto/user.dto';
import { passport } from '@middlewares/passport.middleware';
import { webhookAuthentication } from '@middlewares/webhookAuthentication.middleware';
import responseFormat from '@shared/responseFormat';

const router = Router();
const { CREATED, OK } = StatusCodes;

export const p = {
  get: '/:pageId',
  add: '/addNew',
  delete: '/',
  update: '/:id',
  getResponseMessageContent: '/getResponseMessageContent',
} as const;

router.get(p.get, passport.authenticate('jwt', { session: false }), (async (
  req: Request,
  res: Response
) => {
  try {
    const { pageId } = req.params;
    const recommendations = await recommendationService.getManyRecommendation(
      pageId
    );
    res.status(OK).json(responseFormat(true,{},recommendations));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.post(p.add, (async (req: Request, res: Response) => {
  try {
    const recommendation = await recommendationService.addRecommendation(req.body);
    res.status(OK).json(responseFormat(true, {}, recommendation));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.delete(p.delete, (async (req: Request, res: Response) => {
  try {
    const recommendation = await recommendationService.deleteRecommendation(req.body);
    res.status(OK).json(responseFormat(true, {}, recommendation));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.patch(p.update, passport.authenticate('jwt', { session: false }), (async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (<UserDTO>req.user).id;
    if(req.params?.id.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false));
      return;
    }
    req.body = { ...req.body, userId, _id: req.params.id };
    const recommendations = await recommendationService.updateRecommendation(
      req.body
    );
    res.status(OK).json(responseFormat(true,{},recommendations));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.post(p.getResponseMessageContent, webhookAuthentication, (async (
  req: Request,
  res: Response
) => {
  try {
    const responseMessageContent =
      await recommendationService.getResponseMessageContent(
        req.body.pageId,
        req.body.message
      );
    res.status(OK).json(responseMessageContent);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
  }
}) as RequestHandler);

export default router;
