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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tikiProductRepo = void 0;
const product_model_1 = __importDefault(require("@models/tiki/product.model"));
const state_model_1 = __importDefault(require("@models/tiki/enums/state.model"));
class TikiProductRepo {
    findAll(page, itemPerPage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.paginate({}, {
                page: page,
                limit: itemPerPage,
                lean: true,
                select: ['-createdBy']
            });
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.findOne(query).select(['-createdBy']).lean();
        });
    }
    findByTrackId(trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.findOne({ track_id: trackId }).select(['-createdBy']).lean();
        });
    }
    saveProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            return new product_model_1.default(product).save();
        });
    }
    saveProductFromProductRequest(productRequest, resBody) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (resBody) {
                productRequest.track_id = resBody.track_id;
                productRequest.state = resBody.state;
                productRequest.state_description = (_a = state_model_1.default.find(el => el.state === resBody.state)) === null || _a === void 0 ? void 0 : _a.description;
                productRequest.createdBy = resBody.userId;
            }
            return yield this.saveProduct(productRequest);
        });
    }
    updateStatus(trackId, statusData) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return yield product_model_1.default.updateOne({ track_id: trackId }, {
                state: statusData.state,
                reason: statusData.reason,
                state_description: (_a = state_model_1.default.find(el => el.state === statusData.state)) === null || _a === void 0 ? void 0 : _a.description,
                request_id: statusData.request_id
            });
        });
    }
}
const tikiProductRepo = new TikiProductRepo();
exports.tikiProductRepo = tikiProductRepo;
