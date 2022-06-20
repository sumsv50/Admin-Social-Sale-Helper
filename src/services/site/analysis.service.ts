import { OrderRepo } from "@repos/site/order.repo";
import { productRepo } from "@repos/site/product.repo";


async function calculateNumberPostsEachEC(userId: string) {
  const data = await productRepo.calculateNumberPostsEachEC(userId);
  return data;
}

async function calculateNumberProduct(userId: string) {
  const numberProducts = await productRepo.count({ createdBy: userId});
  return numberProducts;
}

async function calculateNumberOrder(userId: string) {
  const orderRepo = new OrderRepo();
  const numberOrders = await orderRepo.count({ createdBy: userId });
  return numberOrders;
}

export default {
  calculateNumberPostsEachEC,
  calculateNumberProduct,
  calculateNumberOrder
} as const;