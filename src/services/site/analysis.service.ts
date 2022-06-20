import { productRepo } from "@repos/site/product.repo";


async function calculateNumberPostsEachEC(userId?: string) {
  if (userId) {
    const data = await productRepo.calculateNumberPostsEachEC(userId);
    return data;
  }
}

export default {
  calculateNumberPostsEachEC,
} as const;