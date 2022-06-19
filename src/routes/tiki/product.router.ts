import StatusCodes from 'http-status-codes';
import { Request, Response, Router, RequestHandler  } from 'express';

import { EC_SITE } from '@models/site/enum';
import { UserDTO } from '@dto/user.dto';
import responseFormat from '@shared/responseFormat';
import TikiProductService from '@services/tiki/product.service';
import { productService } from '@services/site/product.service';

// Define constance
const router = Router();
const tikiProductService = new TikiProductService();
const { OK } = StatusCodes;


//Define routes

/**
 * Send product request to tiki.
 * 
 * /api/tiki/product/request
 * 
 */
router.post('/request', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    let product = req.body.product;
    product.createdBy = user.id;

    await tikiProductService.requestOneProduct(product , user.id)
    .then(async (data: any) => {
        data.userId = user.id;
        const result = await tikiProductService.createProductFromRequest(product, data);

        if (result.track_id) {
            product = await productService.convertEcProductToSiteProduct(product, EC_SITE.TIKI.code);
            const siteProduct = await productService.createProduct(product, EC_SITE.TIKI.code);
            if (!siteProduct) res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
                errorMessage: 'Mã sản phẩm đã tồn tại !!'
            })); 
            res.status(OK).json(responseFormat(false, {}, result));
        } else {
            res.statusMessage = 'request failed';
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, result)).end();
        }
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            errorMessage: e
        })).end();
    })

}) as RequestHandler);


/**
 * Get all product requests status
 * 
 * /api/tiki/product/request?page=&limit=
 * 
 */
 router.get('/request', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    let page = '1', limit = '10';
    if (req.query.page) page = req.query.page.toString();
    if (req.query.limit) limit = req.query.limit.toString();

    tikiProductService.getAllProductRequestsStatus(user.id, page, limit)
    .then((data: any) => {
        res.status(OK).json(responseFormat(true, {}, {
            products: data.docs,
            pagination: {
                ...data,
                docs: null
            }
        }));
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            errorMessage: e
        })).end();
    })

}) as RequestHandler);


/**
 * Get a product request status
 * 
 * /api/tiki/product/request/{productId}
 * 
 */
 router.get('/request/:productId', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    let productId = req.params.productId;

    tikiProductService.getOneProductRequestStatus(productId , user.id)
    .then(async (data: any) => {
        res.status(OK).json(responseFormat(true, {}, data));
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            errorMessage: e
        })).end();
    })

}) as RequestHandler);

/**
 * Get product link
 * 
 * /api/tiki/product/{sku}/link
 * 
 */
 router.get('/:sku/link', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    let sku = req.params.sku;

    tikiProductService.getProductLink(user.id, sku)
    .then(data => {
        if (data) res.status(OK).json(responseFormat(true, {}, data)).end();
        else res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            errorMessage: 'Link chưa có sẵn, Vui lòng thử lại sau.'
        })).end();
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            errorMessage: e
        })).end();
    })

}) as RequestHandler);



/**
 * Replay product request
 * 
 * /api/tiki/product/request/:productId/replay
 * 
 */
 router.post('/request/:productId/replay', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    const productId = req.params.productId;

    if (!productId) {
        res.status(StatusCodes.BAD_REQUEST).end();
    }

    tikiProductService.replayProductRequest(productId , user.id)
    .then(async (data: any) => {
        res.status(OK).json(responseFormat(true, {}, data));
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            errorMessage: e
        })).end();
    })

}) as RequestHandler);


/**
 * Cancel a product request
 * 
 * /api/tiki/product/request/{productId}
 * 
 */
 router.delete('/request/:productId', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    const productId = req.params.productId;

    if (!productId) {
        res.status(StatusCodes.BAD_REQUEST).end();
    }

    tikiProductService.deleteProductRequest(productId , user.id)
    .then(async (data: any) => {

        if (data.track_id && data.state && data.reason) {
            res.status(OK).json(responseFormat(true, {}, data));
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
        }

    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            errorMessage: e
        })).end();
    })

}) as RequestHandler);

/**
 * Get request info by request_id
 * 
 * /api/tiki/product/request/{requestId}
 * 
 */
//  router.get('/request/:requestId', (async (req: Request, res: Response) => {

//     const user = <UserDTO>req.user;
//     const requestId = req.params.requestId;

//     if (!user) {
//         res.status(StatusCodes.UNAUTHORIZED).end();
//     } 

//     if (!requestId) {
//         res.status(StatusCodes.BAD_REQUEST).end();
//     }

//     productService.getProductRequestInfoById(requestId , user.id)
//     .then(async (data: any) => {
//         res.status(OK).json(data);
//     })
//     .catch((e) => {
//         res.statusMessage = e;
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//     })

// }) as RequestHandler);

/**
 * Get all request info
 * 
 * /api/tiki/product/request
 * 
 */
//  router.get('/request', (async (req: Request, res: Response) => {

//     const user = <UserDTO>req.user;
//     let pagination = {
//         page: '1',
//         limit: '20',
//     },
//     state = '';

//     if (!user) {
//         res.status(StatusCodes.UNAUTHORIZED).end();
//     } 

//     if (req.query.page) {
//         pagination.page = req.query.page.toString();
//     }

//     if (req.query.limit) {
//         pagination.limit = req.query.limit.toString();
//     }

//     if (req.query.state) {
//         state = req.query.state.toString();
//     }

//     productService.getAllProductRequestsInfo(pagination, state , user.id)
//     .then(async (data: any) => {
//         res.status(OK).json(data);
//     })
//     .catch((e) => {
//         res.statusMessage = e;
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//     })

// }) as RequestHandler);


/**
 * Get all products approved
 * 
 * /api/tiki/product?name=&active=&category_id=&page=&limit=&created_from_date=&created_to_date=&updated_from_date=&updated_to_date=&
 * 
 */
 router.get('/', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    const name = req.query.name ? req.query.name : '';
    const active = req.query.active ? req.query.active : '';
    const category_id = req.query.category_id ? req.query.category_id : '';
    const page = req.query.page ? req.query.page : '';
    const limit = req.query.limit ? req.query.limit : '';
    const created_from_date = req.query.created_from_date ? req.query.created_from_date : '';
    const updated_from_date = req.query.updated_from_date ? req.query.updated_from_date : '';
    const created_to_date = req.query.created_to_date ? req.query.created_to_date : '';
    const updated_to_date = req.query.updated_to_date ? req.query.updated_to_date : '';

    tikiProductService.getAllProducts(user.id, 
        name.toString(), 
        active.toString(), 
        category_id.toString(), 
        page.toString(), 
        limit.toString(), 
        created_from_date.toString(), 
        updated_from_date.toString(), 
        created_to_date.toString(),
        updated_to_date.toString())
    .then(async (data: any) => {
        res.status(OK).json(responseFormat(true, {}, data));
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            errorMessage: e
        })).end();
    })

}) as RequestHandler);

/**
 * Update variant
 * 
 * /api/tiki/product/updateSku
 * 
 */
//  router.post('/updateSku', (async (req: Request, res: Response) => {

//     const user = <UserDTO>req.user;
//     let tikiVariant = new TikiVariant();

//     if (!user) {
//         res.status(StatusCodes.UNAUTHORIZED).end();
//     } 

//     tikiVariant = req.body.variant;
//     if (!tikiVariant) {
//         res.status(StatusCodes.UNPROCESSABLE_ENTITY).end();
//     }

//     productService.updateSku(tikiVariant , user.id)
//     .then(async (data: any) => {

//         if (data.track_id && data.state && data.reason) {
//             tikiProductRepo.updateProductSku(tikiVariant);
//             res.status(OK).json(data);
//         } else {
//             res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//         }

//     })
//     .catch((e) => {
//         res.statusMessage = e;
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//     })

// }) as RequestHandler);

/**
 * Test api
 * 
 * /api/product/test
 * 
 */
 router.get('/test', (async (req: Request, res: Response) => {

    const productId = req.body.productId;
    const userId = req.body.userId;

    tikiProductService.getTrackIdByProductId(productId)
    .then(async (data: any) => {

        res.status(OK).json(responseFormat(true, {}, data));

    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            errorMessage: e
        })).end();
    })

}) as RequestHandler);

export default router; 