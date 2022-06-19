import StatusCodes from 'http-status-codes';
import { Request, Response, Router, RequestHandler } from 'express';
import { passport } from '@middlewares/passport.middleware';
import { UserDTO } from '@dto/user.dto';
import responseFormat from '@shared/responseFormat';
import SendoAuthService from '@services/sendo/auth.service';

// Constants
const router = Router();
const authService = new SendoAuthService();
const { OK } = StatusCodes;

//Define routes

/**
 * Get accesstoken from tiki save to DB.
 * 
 * /api/sendo/auth/connection
 * 
 */
router.post('/connection', passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {

  const user = <UserDTO>req.user;

  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).end();
  } 

  try {
    const resBody = await authService.getAccessToken(req.body);

    if (resBody.error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
        errorMessage: resBody.error.message
      }));
    }

    // Save token to DB
    const tokenInfo = await authService.initialSave(
      user.id,
      resBody.result.token,
      resBody.result.expires,
      req.body,
    );

    // Response
    if (tokenInfo._doc) {
        res.status(OK).json(responseFormat(true, {}, {
            tokens: {
                ...tokenInfo._doc
            }
        }));
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
            errorMessage: 'Cannot save user token'
        }));
    }
    
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

/**
 * Refresh token.
 * 
 * /api/sendo/auth/refresh
 * 
 */
router.post('/refresh', passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {

  const user = <UserDTO>req.user;

  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).end();
  } 

  try {

    const resBody: any = await authService.refreshToken(user.id);

    if (resBody.error) {
        res.status(resBody.statusCode).json(responseFormat(false, {
          errorMessage: resBody.error.message
        }));
    }

    // Save token to DB
    const tokenInfo = await authService.saveAccessToken(
        user.id,
        resBody.result
    );

    // Response
    if (tokenInfo._doc) {
        res.status(OK).json(responseFormat(true, {}, {
            tokens: {
                ...tokenInfo._doc
            }
        }));
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
            errorMessage: 'Cannot save user token'
        }));
    }
    
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);


/**
 * Check user already connected
 * 
 * /api/sendo/auth/connection
 * 
 */
 router.get('/connection', passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {

  const user = <UserDTO>req.user;

  try {
    
    const sendoToken = await authService.getTokenByUserId(user.id);

    if (sendoToken.accessToken) return res.status(StatusCodes.OK).json(responseFormat(true, {}, sendoToken));
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
      errorMessage: 'User has not connected yet'
    }));
    
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

export default router; 