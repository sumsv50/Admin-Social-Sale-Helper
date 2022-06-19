import upload from '@shared/multer';
import StatusCodes from 'http-status-codes';
import { Request, Response, Router, RequestHandler } from 'express';
import responseFormat from '@shared/responseFormat';

const router = Router();
const { CREATED, OK, UNAUTHORIZED } = StatusCodes;

router.post('/getLinkImage', upload.array('images'), (async (
  req: Request,
  res: Response
) => {
  try {
    const paths = (<any[]>(req.files || [])).map((image: any) => image.path);
    res.status(OK).json(paths);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      responseFormat(false, {
        message: err.message,
      })
    );
  }
}) as RequestHandler);

export default router;
