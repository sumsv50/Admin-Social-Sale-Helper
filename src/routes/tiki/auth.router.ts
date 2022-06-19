import StatusCodes from 'http-status-codes';
import { Request, Response, Router, RequestHandler } from 'express';
import TikiAuthService from '@services/tiki/auth.service';
import TikiSellerService from '@services/tiki/seller.service';
import { passport } from '@middlewares/passport.middleware';
import { UserDTO } from '@dto/user.dto';
import responseFormat from '@shared/responseFormat';
import { tikiTokenRepo } from '@repos/tiki/tikiTokens.repo';

// Constants
const router = Router();
const authService = new TikiAuthService();
const tikiSellerService = new TikiSellerService();
const { OK } = StatusCodes;

//Define routes

/**
 * Get accesstoken from tiki save to DB.
 * 
 * /api/tiki/auth/connection
 * 
 */
router.post('/connection', passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
  const user = <UserDTO>req.user;
  const { code } = req.body;
  try {
    const tokenObj = await authService.getAccessToken(code);
    if (!tokenObj) {
      res.status(StatusCodes.BAD_REQUEST).json(responseFormat(false, {
        errorMessage: 'invalid code'
      }));
      return;
    }

    // Save token to DB
    const expire = Date.now() + tokenObj.expiresIn * 1000;
    await tikiTokenRepo.saveTikiAccessToken(
      user.id,
      tokenObj.accessToken,
      expire,
      tokenObj.refreshToken,
    );

    const userInfo = await authService.getUserInfo(tokenObj.accessToken);

    // Response
    res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      userInToken: {
        ...userInfo
      }
    }));
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

/**
 * Refresh token.
 * 
 * /api/tiki/auth/refresh
 * 
 */
router.post('/refresh', passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {
  const user = <UserDTO>req.user;

  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).end();
  } 

  try {

    const tokenObj:any = await authService.refreshToken(user.id);
    if (!tokenObj) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {
        errorMessage: 'cannot refresh token'
      }));
      return;
    }

    // Save token to DB
    const expire = Date.now() + tokenObj.expiresIn * 1000;
    await tikiTokenRepo.saveTikiAccessToken(
      user.id,
      tokenObj.accessToken,
      expire,
      tokenObj.refreshToken,
    );

    const userInfo = await authService.getUserInfo(tokenObj.accessToken);

    // Response
    res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      userInToken: {
        ...userInfo
      }
    }));
    
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

/**
 * Check user already connected
 * 
 * /api/tiki/auth/connection
 * 
 */
 router.get('/connection', passport.authenticate('jwt', { session: false }), (async (req: Request, res: Response) => {

  const user = <UserDTO>req.user;

  try {
    
    const tikiToken = await authService.getTokenByUserId(user.id);
    const tikiSeller = await tikiSellerService.getInformation(user.id);

    if (tikiToken.accessToken) return res.status(StatusCodes.OK).json(responseFormat(true, {}, {
      ...tikiToken,
      shopName: tikiSeller.name
    }));
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false, {}, {
      errorMessage: 'User has not connected yet'
    }));
    
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

export default router; 