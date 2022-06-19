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
exports.p = void 0;
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
const express_1 = require("express");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const postTemplate_repo_1 = require("@repos/facebook/postTemplate.repo");
const responseFormat_1 = __importDefault(require("@shared/responseFormat"));
const inputValidation_1 = require("@middlewares/inputValidation");
const product_repo_1 = require("@repos/site/product.repo");
const ITEM_PER_PAGE = 12;
// Constants
const router = (0, express_1.Router)();
exports.p = {
    root: '/',
    specificTemplate: '/:templateId',
    generatePost: '/:templateId/products/:productId'
};
// Create Template
router.post(exports.p.root, (0, inputValidation_1.validate)(inputValidation_1.schemas.createPostTemplate), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const templateData = req.body;
        templateData.createdBy = user.id;
        const postTemplate = yield postTemplate_repo_1.postTemplateRepo.create(templateData);
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            template: postTemplate
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
router.get(exports.p.root, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const query = {
            createdBy: user.id,
        };
        if (req.query.title) {
            query.title = new RegExp(String(req.query.title), 'i');
        }
        const page = Number(req.query.page) || 1;
        const templates = yield postTemplate_repo_1.postTemplateRepo.findAll(query, page, ITEM_PER_PAGE);
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            templates: templates.docs,
            pagination: Object.assign(Object.assign({}, templates), { docs: undefined })
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// GET specific product
router.get(exports.p.specificTemplate, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const templateId = req.params.templateId;
        const query = {
            createdBy: user.id,
            _id: templateId
        };
        const template = yield postTemplate_repo_1.postTemplateRepo.findOne(query);
        if (!template) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Template not found"
            }));
        }
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            template,
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// PATCH edit product
router.patch(exports.p.specificTemplate, (0, inputValidation_1.validate)(inputValidation_1.schemas.updatePostTemplate), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const templateId = req.params.templateId;
        const templateData = req.body;
        let template = yield postTemplate_repo_1.postTemplateRepo.findOne({
            createdBy: user.id,
            _id: templateId
        });
        if (!template) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Template not found"
            }));
        }
        yield postTemplate_repo_1.postTemplateRepo.updateOne({ _id: templateId }, templateData);
        template = yield postTemplate_repo_1.postTemplateRepo.findOne({ _id: templateId });
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, Object.assign({ id: template === null || template === void 0 ? void 0 : template._id }, template)));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// DELETE product
router.delete(exports.p.specificTemplate, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const templateId = req.params.templateId;
        const template = yield postTemplate_repo_1.postTemplateRepo.findOne({
            createdBy: user.id,
            _id: templateId
        });
        if (!template) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Template not found"
            }));
        }
        const deletedResult = yield postTemplate_repo_1.postTemplateRepo.deleteOne({ _id: templateId });
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(deletedResult.deletedCount > 0));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// DELETE many products
router.delete(exports.p.root, (0, inputValidation_1.validate)(inputValidation_1.schemas.deleteManyTemplate), ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { templateIds } = req.body;
        const deletedResult = yield postTemplate_repo_1.postTemplateRepo.deleteMany(user.id, templateIds);
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            deletedCount: deletedResult.deletedCount
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
// Generate post from template.
router.get(exports.p.generatePost, ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const templateId = req.params.templateId;
        const productId = req.params.productId;
        const template = yield postTemplate_repo_1.postTemplateRepo.findOne({
            createdBy: user.id,
            _id: templateId
        });
        if (!template) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Template not found"
            }));
        }
        const product = yield product_repo_1.productRepo.findOne({
            createdBy: user.id,
            _id: productId
        });
        if (!product) {
            return res.status(http_status_codes_1.default.BAD_REQUEST).json((0, responseFormat_1.default)(false, {
                message: "Product not found"
            }));
        }
        const post = generatePostFormTemplate(template.content, product);
        console.log(post);
        return res.status(http_status_codes_1.default.OK).json((0, responseFormat_1.default)(true, {}, {
            post
        }));
    }
    catch (err) {
        console.log(err);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).json((0, responseFormat_1.default)(false));
    }
})));
function generatePostFormTemplate(templateContent, product) {
    const variableRegex = /(?<=<)\w{1,}(?=>)/g;
    const matchedVariables = templateContent.match(variableRegex);
    if (matchedVariables) {
        matchedVariables.forEach(variable => {
            if (product[variable]) {
                templateContent = templateContent.replace(`<${variable}>`, product[variable]);
            }
        });
    }
    return templateContent;
}
// Export default
exports.default = router;
