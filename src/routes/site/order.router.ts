import responseFormat from "@shared/responseFormat";
import { RequestHandler, Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import OrderService from "@services/site/order.service";
import { IOrder } from "@models/site/order.model";
import { jwtAuth } from '@middlewares/passport.middleware';
import { UserDTO } from "@dto/user.dto";
import { validate, schemas } from '@middlewares/inputValidation';
import { ORDER_STATE, EC_SITE } from '@models/site/enum';

// Define constance
const { OK } = StatusCodes;
const router = Router();
const ITEM_PER_PAGE = 12;
const orderService = new OrderService();

//Define routes


/**
 * Create order
 * 
 * /api/orders
 * 
 */
 router.post('', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        const orderData = <IOrder>req.body;
        orderData.createdBy = user.id;
  
        const order = await orderService.createOrder(orderData);
        return res.status(StatusCodes.CREATED).json( responseFormat(true, {}, {
            order
        }));
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);

/**
 * Get all orders pagination
 * 
 * /api/orders
 * 
 */
router.get('', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        const query: any = { 
          createdBy: user.id,
        };
        
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || ITEM_PER_PAGE;
  
        const orders = await orderService.getOrders(query, page, limit);
        return res.status(OK).json(responseFormat(true, {}, {
            orders: orders.docs,
            pagination: {
              ...orders,
              docs: undefined
            }
        }))
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);

/**
 * Get all orders
 * 
 * /api/orders/all
 * 
 */
 router.get('/all', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        const query: any = { 
          createdBy: user.id,
        };
  
        const orders = await orderService.getAllOrders(query);
        if (orders) {
            return res.status(OK).json(responseFormat(true, {}, orders)).end();
        }
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(true, {}, {
            message: 'No orders available'
        }))
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);

/**
 * Get order by id
 * 
 * /api/orders/{orderId}
 * 
 */
 router.get('/:orderId', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        const query: any = {   
            createdBy: user.id,
            _id: req.params.orderId,
        };

        const order = await orderService.getOrder(query);
    
        if (!order) {
            return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
                message: "Order not found"
            }));
        }

        return res.status(OK).json(responseFormat(true, {}, order));
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);

/**
 * Update Order
 * 
 * /api/orders
 * 
 */
 router.patch('/:orderId', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        const orderId = req.params.orderId;
        const orderData = <IOrder>req.body;
  
        let order = await orderService.getOrder({
          createdBy: user.id,
          _id: orderId
        })
  
        if (!order) {
          return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
            message: "Order not found"
          }));
        }
        const isUpdated = await orderService.updateOrder({ _id: orderId }, orderData);
        if (!isUpdated) res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  
        order = await orderService.getOrder({_id: orderId});
  
        return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
          id: order?._id,
          ...order,
          _id: undefined
        }));
        
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

    
}) as RequestHandler);

/**
 * Delete Order by id
 * 
 * /api/orders/{orderId}
 * 
 */
 router.delete('/:orderId', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        const user = <UserDTO>req.user;
        const query: any = {   
            createdBy: user.id,
            _id: req.params.orderId,
        };

        const order = await orderService.getOrder(query);
    
        if (!order) {
            return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
                message: "Order not found"
            }));
        }
  
        const deletedResult = await orderService.deleteOrder({_id: req.params.orderId});
  
        return res.status(StatusCodes.OK).json(responseFormat(deletedResult.deletedCount > 0));
        
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }


}) as RequestHandler);


/**
 * Get order-state enums
 * 
 * /api/orders/enums/state
 * 
 */
router.get('/enums/state', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        return res.status(OK).json(responseFormat(true, {}, ORDER_STATE));
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);

/**
 * Get order-ecSite enums
 * 
 * /api/orders/ecSite
 * 
 */
router.get('/enums/ecSite', jwtAuth(), (async (req: Request, res: Response) => {

    try {
        return res.status(OK).json(responseFormat(true, {}, EC_SITE));
    } catch(err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
    }

}) as RequestHandler);

// Export default
export default router;