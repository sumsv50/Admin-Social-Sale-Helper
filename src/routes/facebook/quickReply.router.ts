import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import quickReplyService from '@services/facebook/quickReply.service';
import { populatePageAccessToken } from '@shared/fb';
import { UserDTO } from '@dto/user.dto';
import responseFormat from '@shared/responseFormat';

const router = Router();
const { CREATED, OK } = StatusCodes;

export const p = {
  get: '/:pageId',
  add: '/addNew',
  delete: '/',
  update: '/:id',
  sendMessage: '/sendMessage',
} as const;

router.get(p.get, (async (req: Request, res: Response) => {
  try {
    const { pageId } = req.params;
    const quickreplies = await quickReplyService.getQuickReply(pageId);
    res.status(OK).json(responseFormat(true, {}, quickreplies));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.post(p.add, (async (req: Request, res: Response) => {
  try {
    const quickreply = await quickReplyService.addQuickReply(req.body);
    res.status(OK).json(responseFormat(true, {}, quickreply));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.delete(p.delete, (async (req: Request, res: Response) => {
  try {
    const quickreplies = await quickReplyService.deleteQuickReply(req.body);
    res.status(OK).json(responseFormat(true, {}, quickreplies));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.patch(p.update, (async (req: Request, res: Response) => {
  try {
    if(req.params?.id.length === 0) {
      res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false));
      return;
    }
    const quickreplies = await quickReplyService.updateQuickReply({_id: req.params.id,...req.body});
    res.status(OK).json(responseFormat(true, {}, quickreplies));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.post(p.sendMessage, (async (req: Request, res: Response) => {
  try {
    populatePageAccessToken(<UserDTO>req.user);
    const message = await quickReplyService.sendMessage(req.body);
    res.status(OK).json(responseFormat(true,{},<any>message));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

export default router;
