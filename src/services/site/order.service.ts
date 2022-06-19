import { OrderRepo } from "@repos/site/order.repo";
import { IOrder } from "@models/site/order.model";
import { ORDER_STATE } from "@models/site/enum"; 
import { getDescription, getEcSite } from "@models/site/enum";

import { productService } from "./product.service";
import customerInfoService from "@services/facebook/customerInfo.service";


//define constance
const orderRepo = new OrderRepo();

export default class OrderService {

    async createOrder(order: IOrder) {
        if (!order.state) order.state = 1;
        if (!order.ec_site) order.ec_site = 0;
        return await orderRepo.create(order);
    }

    async getOrder(query: object) {
        let order: any = await orderRepo.findOne(query);
        order.state = getDescription(order.state);
        order.ec_site = getEcSite(order.ec_site);
        order.customer = await customerInfoService.findDetail(order.thread_id);
        return order;
    }

    async getAllOrders(query: object) {
      let orders: any = await orderRepo.findAll(query);
      orders.map((order: any) => {
        order.state = getDescription(order.state);
        order.ec_site = getEcSite(order.ec_site);
        return order;
      });
      return orders;
    }

    async getOrders(query: object, page: number, itemPerPage: number) {
        let orders = await orderRepo.findAllPagination(query, page, itemPerPage);
        orders.docs.map((order: any) => {
            order.state = getDescription(order.state);
            order.ec_site = getEcSite(order.ec_site);
            return order;
        });
        return orders;
    }

    async updateOrder(query: object, newOrder: IOrder) {
        if (newOrder.state === ORDER_STATE.ARRIVED.code) {

            const order: any = await orderRepo.findOne(query);
            if (order.state === ORDER_STATE.ARRIVED.code) {
                return await orderRepo.updateOne(query, newOrder);
            }

            const isProductUpdated = await productService.decreaseProductQuantity(order);
            if (!isProductUpdated) {
                return null;
            }
        }
        return await orderRepo.updateOne(query, newOrder);
    }

    async deleteOrder(order: IOrder) {
        return await orderRepo.deleteOne(order);
    }

    async find(query: any) {
      return await orderRepo.find(query);
    }
  
    async aggregate(query: any) {
      return await orderRepo.aggregate(query);
    }
  
    async countTotalProductQuantity(userId: string,stateCode: number) {
      const orders = await orderRepo.find({
        createdBy: userId,
        state: stateCode,
      });
      // eslint-disable-next-line no-var
      var count = 0;
      orders.forEach((order: IOrder) => {
        if (order.products && order.products.length > 0) {
          order.products.forEach((product) => {
            count += product.quantity.valueOf();
          });
        }
      });
      return count;
    }
}