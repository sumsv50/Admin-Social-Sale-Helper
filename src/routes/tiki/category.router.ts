import StatusCodes from 'http-status-codes';
import { UserDTO } from '@dto/user.dto';
import { Request, Response, Router, RequestHandler  } from 'express';

import TikiCategoryService from '@services/tiki/category.service';
import responseFormat from '@shared/responseFormat';

// Define constance
const router = Router();
const categoryService = new TikiCategoryService();
const { OK } = StatusCodes;


//Define routes

/**
 * Get all categories.
 * 
 * /api/tiki/category/all
 * 
 */
router.get('/all', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    const data = await categoryService.getAllCategories(user.id);

    if (data.length >= 0) {
        res.status(OK).json(responseFormat(true, {}, data)).end();
    } else {
        res.status(StatusCodes.NOT_FOUND).json(responseFormat(false, {}, {errorMessage: 'Something went wrong!!'})).end();
    }

}) as RequestHandler);

/**
 * Get all root categories.
 * 
 * /api/tiki/category/root
 * 
 */
router.get('/root', ((req: Request, res: Response) => {

    const data = categoryService.getRootCategories();

    if (data.length >= 0) {
        res.status(OK).json(responseFormat(true, {}, data));
    } else {
        res.statusMessage = 'No root categories found!!';
        res.status(StatusCodes.NOT_FOUND).end();
    }

}) as RequestHandler);

/**
 * Get category details.
 * 
 * /api/tiki/category/{category_id}
 * 
 */
router.get('/:categoryId', ((req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    if (!req.params.categoryId) {
        res.statusMessage = 'category id is required';
        res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        categoryService.getCategoryById(req.params.categoryId, user.id)
        .then((data) => {
            res.status(OK).json(data);
        })
        .catch((e) => {
            res.statusMessage = e;
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
        })
    }
 
}) as RequestHandler);

/**
 * Get child categories.
 * 
 * /api/tiki/category/{category_id}/child
 * 
 */
router.get('/:categoryId/child', ((req: Request, res: Response) => {

    if (!req.params.categoryId) {
        res.statusMessage = 'category id is required';
        res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        const data = categoryService.getChildCategories(Number.parseInt(req.params.categoryId));
        if (data) {
            res.status(OK).json(data);
        } else {
            res.statusMessage = 'No child categories found!!';
            res.status(StatusCodes.NOT_IMPLEMENTED).end();
        }
    }

}) as RequestHandler);


/**
 * Get category attributes for user to input
 * 
 * /api/tiki/category/{category_id}/attributes
 * 
 */
router.get('/:categoryId/attributes', ((req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    if (!req.params.categoryId) {
        res.statusMessage = 'category id is required';
        res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        categoryService.getCategoryAttributes(Number.parseInt(req.params.categoryId), user.id)
        .then((data) => {
            res.status(OK).json(data);
        })
        .catch((e) => {
            res.statusMessage = e;
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
        })
    }
 
}) as RequestHandler);


/**
 * Get values for attributes with type select 
 * 
 * /api/tiki/category/attributes/{attributeId}/values
 * 
 */
router.get('/attributes/:attributeId/values', ((req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    if (!req.params.attributeId) {
        res.statusMessage = 'attribute id is required';
        res.status(StatusCodes.BAD_REQUEST).end();
    } else {

        let limit, page, keyWord : String;

        if (!req.query.keyWord) {
            keyWord = '';
        } else keyWord = req.query.keyWord.toString();

        if (!req.query.limit) {
            limit = '20';
        } else limit = req.query.limit.toString();

        if (!req.query.page) {
            page = '1';
        } else page = req.query.page.toString();

        categoryService.getAttributeValues(req.params.attributeId, keyWord, limit, page, user.id)
        .then((data) => {
            res.status(OK).json(data);
        })
        .catch((e) => {
            res.statusMessage = e;
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
        })
    }
 
}) as RequestHandler);


/**
 * Get category option labels for user to input
 * 
 * /api/tiki/category/{category_id}/optionLabels
 * 
 */
 router.get('/:categoryId/optionLabels', ((req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    if (!req.params.categoryId) {
        res.statusMessage = 'category id is required';
        res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        categoryService.getCategoryOptionLabels(Number.parseInt(req.params.categoryId), user.id)
        .then((data) => {
            res.status(OK).json(data);
        })
        .catch((e) => {
            res.statusMessage = e;
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
        })
    }
 
}) as RequestHandler);

export default router; 