/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import mongoose from 'mongoose';
import Product from '@models/site/product.model';
import { IProduct } from '@models/site/product.model';

class ProductRepo {
  async create(product: IProduct) {
    return await Product.create(product);
  }
  async updateOne(query: IProduct, data: IProduct) {
    return await Product.updateOne(query, data);
  }

  async findOne(query: IProduct) {
    return await Product.findOne(query).select(['-createdBy']).lean();
  }
  async findAll(query: object, page: number, itemPerPage: number) {
    const products = await Product.paginate(query, {
      page: page,
      limit: itemPerPage,
      lean: true,
      select: ['-createdBy']
    });
    return products;
  }

  async deleteOne(query: IProduct) {
    return await Product.deleteOne(query);
  }

  async deleteMany(userId: string, productIds: string[]) {
    return await Product.deleteMany({
      createdBy: userId,
      _id: {
        $in: productIds
      }
    })
  }

  async count(query: any) {
    const count: number = await Product.countDocuments(query);
    return count;
  }

  async find(query: any) {
    const products = await Product.find(query);
    return products;
  }

  async aggregate(query: any) {
    const product = await Product.aggregate(query);
    return product;
  }

  async calculateNumberPostsEachEC(userId: string) {
    const result = await Product.aggregate([
      {
        $match: {
          createdBy:  new mongoose.Types.ObjectId(userId)
        }
      },
      { $unwind: '$stockAvailable' },
      {
        $group: {
          _id: '$createdBy',
          sendoCount: {
            $sum: {
              $cond: [{ $eq: ["$stockAvailable.ecSite", "Sendo"] }, 1, 0]
            }
          },
          tikiCount: {
            $sum: {
              $cond: [{ $eq: ["$stockAvailable.ecSite", "Tiki"] }, 1, 0]
            }
          },
          facebookCount: {
            $sum: {
              $cond: [{ $eq: ["$stockAvailable.ecSite", "Facebook"] }, 1, 0]
            }
          },
        }
      }
    ]);

    return result[0] || {};
  }

}

const productRepo = new ProductRepo();
export { productRepo };