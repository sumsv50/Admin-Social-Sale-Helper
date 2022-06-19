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
exports.schemas = exports.validate = void 0;
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const joi_1 = __importDefault(require("joi"));
const schemas = {
    signUpSchema: joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .lowercase()
            .required(),
        password: joi_1.default.string()
            .min(6)
            .required(),
        confirm_password: joi_1.default.ref('password'),
        name: joi_1.default.string().min(3).required()
    }),
    signInSchema: joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .lowercase()
            .required(),
        password: joi_1.default.string()
            .min(6)
            .required(),
    }),
    createProduct: joi_1.default.object({
        name: joi_1.default.string()
            .required(),
        sku: joi_1.default.string(),
        weight: joi_1.default.number()
            .required(),
        height: joi_1.default.number()
            .required(),
        length: joi_1.default.number()
            .required(),
        width: joi_1.default.number()
            .required(),
        weightUnit: joi_1.default.string()
            .required(),
        dimensionUnit: joi_1.default.string()
            .required(),
        importPrice: joi_1.default.number()
            .min(1),
        exportPrice: joi_1.default.number()
            .min(1),
        type: joi_1.default.string()
            .required(),
        quantity: joi_1.default.number()
            .required(),
        description: joi_1.default.string(),
        branch: joi_1.default.string(),
        inventoryNumber: joi_1.default.number(),
        image: joi_1.default.string(),
        images: joi_1.default.array()
            .items(joi_1.default.string()),
        isAllowSell: joi_1.default.bool(),
    }),
    updateProduct: joi_1.default.object({
        name: joi_1.default.string(),
        sku: joi_1.default.string(),
        weight: joi_1.default.number(),
        weightUnit: joi_1.default.string(),
        importPrice: joi_1.default.number()
            .min(1),
        exportPrice: joi_1.default.number()
            .min(1),
        type: joi_1.default.string(),
        description: joi_1.default.string(),
        branch: joi_1.default.string(),
        inventoryNumber: joi_1.default.number(),
        images: joi_1.default.array()
            .items(joi_1.default.string()),
        isAllowSell: joi_1.default.bool(),
        height: joi_1.default.number(),
        length: joi_1.default.number(),
        width: joi_1.default.number(),
        dimensionUnit: joi_1.default.string(),
        quantity: joi_1.default.number(),
        image: joi_1.default.string(),
    }),
    createPostTemplate: joi_1.default.object({
        title: joi_1.default.string().required(),
        content: joi_1.default.string().required()
    }),
    updatePostTemplate: joi_1.default.object({
        title: joi_1.default.string(),
        content: joi_1.default.string()
    }),
    deleteManyTemplate: joi_1.default.object({
        templateIds: joi_1.default.array().items(joi_1.default.string()).required()
    }),
    createFavoriteKeyword: joi_1.default.object({
        content: joi_1.default.string().required().min(1)
    }),
    deleteManyKeyword: joi_1.default.object({
        keywordIds: joi_1.default.array().items(joi_1.default.string()).required()
    }),
};
exports.schemas = schemas;
function validate(schema) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(req.body, { allowUnknown: true });
            next();
        }
        catch (error) {
            res.json((0, responseFormat_1.default)(false, { message: error.message }));
        }
    });
}
exports.validate = validate;
