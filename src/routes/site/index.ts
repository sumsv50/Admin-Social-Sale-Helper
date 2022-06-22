import { Router } from 'express';
import authRouter from './auth.router';
import userRouter from './user.router';
import analysisRouter from './analysis.router';
import { jwtAuth } from '@middlewares/passport.middleware';

// Export the base-router
const siteRouter = Router();

// Setup routers
siteRouter.use('/auth', authRouter);
siteRouter.use('/users', jwtAuth(), userRouter);
siteRouter.use('/analysis', jwtAuth(), analysisRouter);

// Export default.
export default siteRouter;
