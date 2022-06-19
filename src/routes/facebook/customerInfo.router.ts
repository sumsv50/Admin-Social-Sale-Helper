/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';

import responseFormat from '@shared/responseFormat';
import { UserDTO } from '@dto/user.dto';
import customerInfoService from '@services/facebook/customerInfo.service';
import { ICustomerInfo } from '@models/facebook/customerInfo.model';
const ITEM_PER_PAGE = 12;
// Constants
const router = Router();

export const p = {
  get: '/:threadId',
  update: '/:threadId'
} as const;

// GET specific
router.get(p.get, (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const threadId = req.params.threadId;

    const customerInfo = await customerInfoService.findDetailOrCreate(threadId,user.id);
    
    return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
        customerInfo,
    }));
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler)

// PATCH edit product
router.patch(p.update, (async (req: Request, res: Response) => {
  try {
    const threadId = req.params.threadId;
    const customerInfoData = <ICustomerInfo>req.body;

    const customerInfo = await customerInfoService.findDetail(threadId);

    if(!customerInfo) {
        return res.status(StatusCodes.OK).json(responseFormat(false, {
            message: "Customer Information not found"
          }));
    }

    customerInfoService.updateDetail({threadId:threadId, ...customerInfoData});

    return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
        threadId: threadId,
        ...customerInfoData,
    }));
    
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler)



// Export default
export default router;
