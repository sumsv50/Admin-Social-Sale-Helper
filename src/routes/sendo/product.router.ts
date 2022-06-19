import StatusCodes from 'http-status-codes';
import { UserDTO } from '@dto/user.dto';
import { Request, Response, Router, RequestHandler  } from 'express';
import { productType, productStatus, productUnit } from '@models/sendo/enums';
import { validate, schemas } from '@middlewares/inputValidation';

import { EC_SITE } from '@models/site/enum';
import responseFormat from '@shared/responseFormat';
import { sendoProductService } from '@services/sendo/product.service';
import { productService } from '@services/site/product.service';

// Define constant
const router = Router();
const { OK } = StatusCodes;


//Define routes

/**
 * create product.
 * 
 * /api/sendo/product
 * 
 */
router.post('/', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    let product = req.body;
    product.createdBy = user.id;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    sendoProductService.createProduct(user.id, product)
    .then(async (data: any) => {
        if (data.success) {
            product = await productService.convertEcProductToSiteProduct(product, EC_SITE.SENDO.code);
            const siteProduct = await productService.createProduct(product, EC_SITE.SENDO.code);
            if (!siteProduct) res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
                errorMessage: 'Mã sản phẩm đã tồn tại !!'
            })); 
            res.status(OK).json(responseFormat(true, {}, {...data}));
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, data));
        }
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            message: e
        }));;
    })
    

}) as RequestHandler);

/**
 * Search products.
 * 
 * /api/sendo/product/search
 * 
 */
router.post('/search', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    sendoProductService.getAllProducts(user.id, req.body)
    .then((data: any) => {
        if (data.success) {
            res.status(OK).json(responseFormat(true, {}, data.result));
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, data));
        }
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            message: e
        }));;
    })

}) as RequestHandler);

/**
 * get product by id.
 * 
 * /api/sendo/product/{productId}
 * 
 */
 router.get('/:productId', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    sendoProductService.getProductById(user.id, req.params.productId.toString())
    .then((data: any) => {
        if (data.success) {
            res.status(OK).json(responseFormat(true, {}, data.result));
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, data));
        }
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            message: e
        }));;
    })

}) as RequestHandler);

/**
 * get product link.
 * 
 * /api/sendo/product/{sku}/link
 * 
 */
 router.get('/:sku/link', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    const sku = req.params.sku;

    sendoProductService.getProductLink(user.id, sku)
    .then((data: any) => {
        if (data.success) {
            res.status(OK).json(responseFormat(true, {}, { link: data.result.link}));
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, data));
        }
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            message: e
        }));;
    })

}) as RequestHandler);

/**
 * Update product
 * 
 * /api/sendo/product
 * 
 */
 router.patch('', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;
    const productData = req.body;
    if (!productData || !productData.sku) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            message: 'Body must include product sku'
        }));
    }

    sendoProductService.updateProduct(user.id, req.body)
    .then((data: any) => {
        if (data.success) {
            res.status(OK).json(responseFormat(true, {}, data.result));
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, data));
        }
    })
    .catch((e) => {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            message: e
        }));;
    })

}) as RequestHandler);



/**
 * get all product type.
 * 
 * /api/sendo/product/enums/type
 * 
 */
 router.get('/enums/type', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    try {
        return res.status(OK).json(responseFormat(true, {}, productType));
    } catch(e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            message: e
        }));;
    }

}) as RequestHandler);

/**
 * get all product status.
 * 
 * /api/sendo/product/enums/status
 * 
 */
 router.get('/enums/status', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    try {
        return res.status(OK).json(responseFormat(true, {}, productStatus));
    } catch(e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            message: e
        }));;
    }

}) as RequestHandler);

/**
 * get all product unit.
 * 
 * /api/sendo/product/enums/unit
 * 
 */
 router.get('/enums/unit', (async (req: Request, res: Response) => {

    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    try {
        return res.status(OK).json(responseFormat(true, {}, productUnit));
    } catch(e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
            message: e
        }));;
    }

}) as RequestHandler);


export default router; 