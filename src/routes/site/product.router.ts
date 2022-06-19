import responseFormat from "@shared/responseFormat";
import { RequestHandler, Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { EC_SITE, CATEGORIES } from "@models/site/enum";
import { productService } from "@services/site/product.service";
import { productRepo } from '@repos/site/product.repo';
import { IProduct } from "@models/site/product.model";
import { jwtAuth } from '@middlewares/passport.middleware';
import { UserDTO } from "@dto/user.dto";
import { validate, schemas } from '@middlewares/inputValidation';

const ITEM_PER_PAGE = 12;

const router = Router();

export const p = {
    root: '/',
    specificProduct: '/:productId',
    specificProductBySku: '/sku/:sku',
    enumCategories: '/enums/categories',
    getRelatedPosts: '/:productId/posts'
  } as const;

router.post(p.root, jwtAuth(), validate(schemas.createProduct), (async (req: Request, res: Response) => {
    try {
      const user = <UserDTO>req.user;
      const productData = <IProduct>req.body;
      productData.createdBy = user.id;

      const product = await productService.createProduct(productData, EC_SITE.FACEBOOK.code);
      if (!product) res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
        errorMessage: 'Mã sản phẩm đã tồn tại !!'
      }));

      return res.status(StatusCodes.CREATED).json( responseFormat(true, {}, {
        product
      }));
    } catch(err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }
  })as RequestHandler)

  // GET list product
  router.get(p.root, jwtAuth(), (async (req: Request, res: Response) => {
    try {
      const user = <UserDTO>req.user;
      const query: any = { 
        createdBy: user.id,
      };
      if (req.query.name) {
        query.name = new RegExp(String(req.query.name),'i');
      }
      
      const page = Number(req.query.page) || 1;

      const products = await productRepo.findAll(query, page, ITEM_PER_PAGE);
      return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
        products: products.docs,
        pagination: {
          ...products,
          docs: undefined
        }
      }));
    } catch(err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }
  })as RequestHandler)

   // GET specific product
   router.get(p.specificProduct, jwtAuth(), (async (req: Request, res: Response) => {
    try {
      const user = <UserDTO>req.user;
      const productId = req.params.productId;
      
      const query: any = { 
        createdBy: user.id,
        _id: productId
      };

      const product = await productRepo.findOne(query);

      if (!product) {
        return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
          message: "Product not found"
        }));
      }
      
      return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
        product,
      }));
    } catch(err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }
  })as RequestHandler)

  // GET specific product by sku
  router.get(p.specificProductBySku, jwtAuth(), (async (req: Request, res: Response) => {
    try {
      const user = <UserDTO>req.user;
  
      const query: any = { 
        createdBy: user.id,
        sku: req.params.sku
      };

      const product = await productRepo.findOne(query);

      if (!product) {
        return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
          message: "Product not found"
        }));
      }
      
      return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
        product,
      }));
    } catch(err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }
  })as RequestHandler);

  // GET related posts
  router.get(p.getRelatedPosts, jwtAuth(), (async (req: Request, res: Response) => {
    try {
      const user = <UserDTO>req.user;
      const productId = req.params.productId;

      const posts = await productService.findRelatedPosts(user.id, productId);

      if (!posts) {
        return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
          message: "No post founded"
        }));
      }
      
      return res.status(StatusCodes.OK).json( responseFormat(true, {}, posts));
    } catch(err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }
  })as RequestHandler);

  // PATCH edit product
  router.patch(p.specificProduct, jwtAuth(), validate(schemas.updateProduct), (async (req: Request, res: Response) => {
    try {
      const user = <UserDTO>req.user;
      const productId = req.params.productId;
      const productData = <IProduct>req.body;

      const result = await productService.updateProduct(user.id, productId , productData);
      if (result.failed) {
        return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {}, result ));
      }

      const updatedProduct = await productRepo.findOne({_id: productId});

      return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
        id: updatedProduct?._id,
        ...updatedProduct,
        _id: undefined
      }));
      
    } catch(err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }
  })as RequestHandler)

  // DELETE product
  router.delete(p.specificProduct, jwtAuth(), (async (req: Request, res: Response) => {
    try {
      const user = <UserDTO>req.user;
      const productId = req.params.productId;

      const product = await productRepo.findOne({
        createdBy: user.id,
        _id: productId
      })

      if (!product) {
        return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
          message: "Product not found"
        }));
      }

      const deletedResult = await productRepo.deleteOne({_id: productId});

      return res.status(StatusCodes.OK).json(responseFormat(deletedResult.deletedCount > 0));
      
    } catch(err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }
  })as RequestHandler)

  // DELETE many products
  router.delete(p.root, jwtAuth(), (async (req: Request, res: Response) => {
    try {
      const user = <UserDTO>req.user;
      const { productIds } = req.body;

      const deletedResult = await productRepo.deleteMany(user.id, productIds);

      return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
        deletedCount: deletedResult.deletedCount
      }));
      
    } catch(err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }
  })as RequestHandler)

  router.get(p.enumCategories, jwtAuth(), (async (req: Request, res: Response) => {
    const user = <UserDTO>req.user;

    if (!user) {
        res.status(StatusCodes.UNAUTHORIZED).end();
    }

    try {
      return res.status(StatusCodes.OK).json(responseFormat(true, {}, CATEGORIES));
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }
  })as RequestHandler)

// Export default
export default router;