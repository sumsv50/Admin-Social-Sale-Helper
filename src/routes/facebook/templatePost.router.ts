/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import { postTemplateRepo } from '@repos/facebook/postTemplate.repo';

import responseFormat from '@shared/responseFormat';
import { UserDTO } from '@dto/user.dto';
import { validate, schemas } from '@middlewares/inputValidation';
import { IPostTemplate } from '@models/facebook/postTemplate.model';
import { productRepo } from '@repos/site/product.repo';
import { IProduct } from '@models/site/product.model';
const ITEM_PER_PAGE = 12;
// Constants
const router = Router();

export const p = {
  root: '/',
  specificTemplate: '/:templateId',
  generatePost: '/:templateId/products/:productId'
} as const;

// Create Template
router.post(p.root, validate(schemas.createPostTemplate), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const templateData  = <IPostTemplate>req.body;
    templateData.createdBy = user.id;

    const postTemplate = await postTemplateRepo.create(templateData);

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      template: postTemplate
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

router.get(p.root, (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const query: any = {
      createdBy: user.id,
    };
    if (req.query.title) {
      query.title = new RegExp(String(req.query.title), 'i');
    }

    const page = Number(req.query.page) || 1;

    const templates = await postTemplateRepo.findAll(query, page, ITEM_PER_PAGE);
    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      templates: templates.docs,
      pagination: {
        ...templates,
        docs: undefined
      }
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

// GET specific product
router.get(p.specificTemplate, (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const templateId = req.params.templateId;
    
    const query: any = { 
      createdBy: user.id,
      _id: templateId
    };

    const template = await postTemplateRepo.findOne(query);

    if (!template) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "Template not found"
      }));
    }
    
    return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
      template,
    }));
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler)

// PATCH edit product
router.patch(p.specificTemplate, validate(schemas.updatePostTemplate), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const templateId = req.params.templateId;
    const templateData = <IPostTemplate>req.body;

    let template = await postTemplateRepo.findOne({
      createdBy: user.id,
      _id: templateId
    })

    if (!template) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "Template not found"
      }));
    }
    await postTemplateRepo.updateOne({ _id: templateId }, templateData);

    template = await postTemplateRepo.findOne({_id: templateId});

    return res.status(StatusCodes.OK).json( responseFormat(true, {}, {
      id: template?._id,
      ...template,
    }));
    
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler)

// DELETE product
router.delete(p.specificTemplate, (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const templateId = req.params.templateId;

    const template = await postTemplateRepo.findOne({
      createdBy: user.id,
      _id: templateId
    })

    if (!template) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "Template not found"
      }));
    }

    const deletedResult = await postTemplateRepo.deleteOne({_id: templateId});

    return res.status(StatusCodes.OK).json(responseFormat(deletedResult.deletedCount > 0));
    
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler)

// DELETE many products
router.delete(p.root, validate(schemas.deleteManyTemplate), (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const { templateIds } = req.body;

    const deletedResult = await postTemplateRepo.deleteMany(user.id, templateIds);

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      deletedCount: deletedResult.deletedCount
    }));
    
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler);

// Generate post from template.
router.get(p.generatePost, (async (req: Request, res: Response) => {
  try {
    const user = <UserDTO>req.user;
    const templateId = req.params.templateId;
    const productId = req.params.productId;

    const template = await postTemplateRepo.findOne({
      createdBy: user.id,
      _id: templateId
    })

    if (!template) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "Template not found"
      }));
    }

    const product = await productRepo.findOne({
      createdBy: user.id,
      _id: productId
    })

    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        message: "Product not found"
      }));
    }

    const post = generatePostFormTemplate(<string>template.content, product);
    console.log(post);

    return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      post
    }));
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler);

function generatePostFormTemplate(templateContent: string, product: any) {
  const variableRegex = /(?<=<)\w{1,}(?=>)/g
  const matchedVariables = <string[]>templateContent.match(variableRegex);

  if (matchedVariables) {
    matchedVariables.forEach(variable => {
      if (product[variable]) {
        templateContent = templateContent.replace(`<${variable}>`, product[variable]);
      }
    });
  
  }  

  return templateContent
}


// Export default
export default router;
