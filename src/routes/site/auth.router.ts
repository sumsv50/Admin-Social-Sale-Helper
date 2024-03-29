import { Request, Response, Router, RequestHandler } from 'express';
import StatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import AuthConfig from '@configs/authentication'
import responseFormat from '@shared/responseFormat';
import { passport } from '@middlewares/passport.middleware';
import { IAdmin } from '@models/site/admin.model';

// Constants
const router = Router();

export const p = {
  localSignUp: '/sign-up',
  localSignIn: '/sign-in',
  userInfo: '/user/info'
} as const;

const encodedToken = (userId: string) => {
  return jwt.sign({
    iss: "social-sale-helper",
    sub: userId,
  }, <string>AuthConfig.JWT_SECRET, {
    expiresIn: '30d'
  })
}

router.post(p.localSignIn, passport.authenticate('local', { session: false }), (async (req: Request, res: Response) => {
  try {
    const admin = <IAdmin>req.user;
    const token = encodedToken(<string>admin._id);
    res.status(StatusCodes.OK).json( responseFormat(true, {}, {
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
        username: admin.username,
        picture: admin.picture
      }
    }));
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
})as RequestHandler);

export default router;

