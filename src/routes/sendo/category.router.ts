import StatusCodes from 'http-status-codes';
import { UserDTO } from '@dto/user.dto';
import { Request, Response, Router, RequestHandler  } from 'express';

import responseFormat from '@shared/responseFormat';
import SendoCategoryService from '@services/sendo/category.service';

// Define constance
const router = Router();
const categoryService = new SendoCategoryService();
const { OK } = StatusCodes;


//Define routes

/**
 * Get recent categories.
 * 
 * /api/tiki/category/recent
 * 
 */
router.get('/recent', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    const data = await categoryService.getRecentCategories(user.id);

    if (data.success) {
        res.status(OK).json(responseFormat(true, {}, data.result));
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, data));
    }

}) as RequestHandler);

/**
 * Get all root categories.
 * 
 * /api/sendo/category/root
 * 
 */
router.get('/root', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    const data = await categoryService.getRootCategories(user.id);

    if (data.success) {
        res.status(OK).json(responseFormat(true, {}, data.result));
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, data));
    }

}) as RequestHandler);

/**
 * Get category by id.
 * 
 * /api/tiki/category/{categoryId}
 * 
 */
router.get('/:categoryId', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    const categoryId = req.params.categoryId;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    if (!categoryId) {
        res.statusMessage = 'category id is required';
        res.status(StatusCodes.BAD_REQUEST).end();
    }

    const data = await categoryService.getCategoryById(categoryId, user.id);

    if (data.success) {
        res.status(OK).json(responseFormat(true, {}, data.result));
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, data));
    }
 
}) as RequestHandler);

export default router; 