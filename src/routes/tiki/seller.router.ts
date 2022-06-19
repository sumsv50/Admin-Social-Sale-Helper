import StatusCodes from 'http-status-codes';
import { Request, Response, Router, RequestHandler  } from 'express';

import { UserDTO } from '@dto/user.dto';
import TikiSellerService from '@services/tiki/seller.service';

// Define constance
const router = Router();
const sellerService = new TikiSellerService();
const { OK } = StatusCodes;

//Define routes

/**
 * Get seller information.
 * 
 * /api/tiki/seller/me
 * 
 */
router.get('/me', ((req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    } 

    sellerService.getInformation(user.id)
    .then((body) => {
        res.status(OK).json(body);
    })
    .catch((e) => {
        res.statusMessage = e;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    })
 
}) as RequestHandler);

/**
 * Get seller's warehouses information.
 * 
 * /api/tiki/seller/warehouses?status=status&type=type
 * 
 */
router.get('/warehouses', ((req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    } 

    let limit, page : String;

    if (!req.query.limit) {
        limit = '20';
    } else limit = req.query.limit.toString();

    if (!req.query.page) {
        page = '1';
    } else page = req.query.page.toString();

    sellerService.getWarehouses(limit, page, user.id)
    .then((body) => {
        res.status(OK).json(body);
    })
    .catch((e) => {
        res.statusMessage = e;
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    })
 
}) as RequestHandler);

export default router; 