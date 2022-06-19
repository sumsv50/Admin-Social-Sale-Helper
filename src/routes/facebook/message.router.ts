/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import messageService from '@services/facebook/message.service';
import upload from '@shared/multer'
import { UserDTO } from '@dto/user.dto';
import { populatePageAccessToken } from '@shared/fb';
import { passport } from '@middlewares/passport.middleware';
import {webhookAuthentication} from '@middlewares/webhookAuthentication.middleware';
import messageReadService from '@services/facebook/messageRead.service';
import responseFormat from '@shared/responseFormat';

const router = Router();
const { OK, UNAUTHORIZED } = StatusCodes;

export const p = {
  get: '/allConversations/:pageId',
  getDetail: '/detail/:threadId',
  receiveEvent: '/event',
  sendMessage: '/sendMessage',
  turnOnGreeting : '/turnOnGreeting',
  turnOffGreeting : '/turnOffGreeting',
  markThreadAsRead: '/markThreadAsRead',
  getGreeting: '/getGreeting',
} as const;

router.get(p.get, passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    if(!(await populatePageAccessToken(user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook page'
      });
    }
    const conversations = await messageService.getAllConversation(req.params.pageId, user.id);
    res.status(OK).json(responseFormat(true,{},conversations));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.get(p.getDetail, passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
  try {
    res.status(OK);
    const user = <UserDTO>req.user;
    if(!(await populatePageAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook page'
      });
    }

    const messages = await messageService.getDetail(req.params.threadId,user.id);
    res.status(OK).json(responseFormat(true,{},messages));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
  

}) as RequestHandler);

router.post(p.turnOnGreeting, passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
  try {
    if(!(await populatePageAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook page'
      });
    }
    const {greetingText} = req.body;
    const response = await messageService.turnOnGreeting(greetingText as string);
    res.status(OK).json(responseFormat(true,{},response));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.get(p.turnOffGreeting, passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
  try {
    if(!(await populatePageAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook page'
      });
    }
    const response = await messageService.turnOffGreeting();
    res.status(OK).json(responseFormat(true,{},response));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.get(p.getGreeting, passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
  try {
    if(!(await populatePageAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook page'
      });
    }
    const greeting = await messageService.getGreeting();
    if(greeting) {
      res.status(OK).json(responseFormat(true,{},{greeting, isOn: true}));
    }else {
      res.status(OK).json(responseFormat(true,{},{isOn: false}));
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.post(p.receiveEvent, webhookAuthentication, (async (req: Request, res: Response) => {
  try {
    await messageService.receiveEvent(req.body);
    res.status(OK).json(responseFormat(true,{},{message: 'OK'}));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.post(p.sendMessage, 
  [passport.authenticate('jwt', { session: false }),upload.single('messageAttachment')], (async (req: Request, res: Response) => {
    try {
      if(!(await populatePageAccessToken(<UserDTO>req.user))) {
        res.status(UNAUTHORIZED);
        return res.json({
          message: 'User is not connected to facebook page'
        });
      }
      res.status(OK);
      const msgReq = {...req.body, messageAttachment: req.file};
      await messageService.sendMessage(msgReq);
      res.status(OK).json(responseFormat(true,{},{message: 'OK'}));
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }
}) as RequestHandler);

router.post(p.markThreadAsRead, passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
  try {
    res.status(OK);
    const user = <UserDTO>req.user;
    if(req.body.threadId) {
      const messageReadRes = await messageReadService.updateMessageRead({threadId: req.body.threadId, userId: user.id, isRead:true});
      res.status(OK).json(responseFormat(true,{},messageReadRes));
    }
    else {
      return res.status(200).json(responseFormat(true,{},{message: 'ThreadId is required'}));
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
  
}) as RequestHandler);



export default router;
