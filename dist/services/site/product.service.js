"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const product_repo_1 = require("@repos/site/product.repo");
const enum_1 = require("@models/site/enum");
const product_service_1 = require("@services/sendo/product.service");
const post_repo_1 = require("@repos/site/post.repo");
const fbPostRepo = new post_repo_1.FbPostRepo();
class ProductService {
    convertEcProductToSiteProduct(product, ecSite) {
        return __awaiter(this, void 0, void 0, function* () {
            product.dimensionUnit = 'cm';
            if (ecSite === enum_1.EC_SITE.TIKI.code) {
                product.meta_data = {
                    is_auto_turn_on: product.isAllowSell
                };
                product.weightUnit = 'kg';
                product.exportPrice = product.market_price;
                product.quantity = product.variants.reduce((accumulator, variant) => {
                    return accumulator + variant.warehouse_stocks.reduce((accu, stock) => accu + stock.qtyAvailable, 0);
                }, 0);
            }
            else if (ecSite === enum_1.EC_SITE.SENDO.code) {
                product.stock_availability = product.isAllowSell;
                product.weightUnit = 'gam';
                product.exportPrice = product.price;
                product.image = product.avatar.picture_url;
                product.images = product.pictures.map((pic) => pic.picture_url);
                product.quantity = product.stock_quantity;
            }
            return yield product;
        });
    }
    createProduct(product, ecSite) {
        return __awaiter(this, void 0, void 0, function* () {
            let currProduct = yield product_repo_1.productRepo.findOne({
                createdBy: product.createdBy,
                sku: product.sku
            });
            if (currProduct) {
                if (currProduct.stockAvailable) {
                    if (currProduct.stockAvailable.find((e) => e.ecSite === ecSite)) {
                        return null;
                    }
                    currProduct.stockAvailable.push({
                        ecSite: (0, enum_1.getEcSite)(ecSite),
                        quantity: product.quantity
                    });
                    return yield product_repo_1.productRepo.updateOne({ _id: currProduct._id }, currProduct);
                }
            }
            else {
                product.stockAvailable = new Array();
                product.stockAvailable.push({
                    ecSite: (0, enum_1.getEcSite)(ecSite),
                    quantity: product.quantity
                });
                return yield product_repo_1.productRepo.create(product);
            }
        });
    }
    updateProduct(userId, productId, productData) {
        return __awaiter(this, void 0, void 0, function* () {
            let product = yield product_repo_1.productRepo.findOne({ _id: productId });
            let isSendoConnected = false;
            if (productData.stockAvailable) {
                isSendoConnected = (productData.stockAvailable.find((stock) => stock.ecSite === enum_1.EC_SITE.SENDO.site));
            }
            if (product) {
                if (isSendoConnected) {
                    const isSendoUpdated = yield product_service_1.sendoProductService.updateProduct(userId, productData);
                    if (!isSendoUpdated.success)
                        return Object.assign({ failed: true, message: 'Cannot update product in Sendo' }, isSendoUpdated);
                }
                return yield product_repo_1.productRepo.updateOne({ _id: productId }, productData);
            }
            return {
                failed: true,
                message: 'Product not found'
            };
        });
    }
    decreaseProductQuantity(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = order.products;
            try {
                products.forEach((product) => __awaiter(this, void 0, void 0, function* () {
                    let currProduct = yield product_repo_1.productRepo.findOne({
                        _id: product.product._id
                    });
                    currProduct.stockAvailable.find((stock) => stock.ecSite === (0, enum_1.getEcSite)(order.ec_site)).quantity -= product.quantity;
                    yield product_repo_1.productRepo.updateOne({
                        _id: currProduct._id,
                    }, { stockAvailable: currProduct.stockAvailable });
                }));
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
    findRelatedPosts(userId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield fbPostRepo.find({
                createdBy: userId,
                product: productId,
            });
        });
    }
}
const productService = new ProductService();
exports.productService = productService;
