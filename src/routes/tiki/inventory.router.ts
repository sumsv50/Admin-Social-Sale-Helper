import StatusCodes from 'http-status-codes';
import { Request, Response, Router, RequestHandler  } from 'express';

import inventoryModel from '@models/tiki/enums/inventory.model';

// Define constance
const router = Router();
const { OK } = StatusCodes;


//Define routes

/**
 * Get all inventory enums
 * 
 * /api/tiki/product/request
 * 
 */
router.get('/all', (async (request:Request, response:Response) => {

    response.status(OK).json(inventoryModel);

}) as RequestHandler);


export default router; 