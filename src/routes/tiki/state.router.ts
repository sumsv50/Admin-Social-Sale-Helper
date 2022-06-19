import StatusCodes from 'http-status-codes';
import { Request, Response, Router, RequestHandler  } from 'express';

import stateModel from '@models/tiki/enums/state.model';

// Define constance
const router = Router();
const { OK } = StatusCodes;


//Define routes

/**
 * Get all state enums
 * 
 * /api/tiki/product/request
 * 
 */
router.get('/all', (async (request:Request, response:Response) => {

    response.status(OK).json(stateModel);

}) as RequestHandler);


export default router; 