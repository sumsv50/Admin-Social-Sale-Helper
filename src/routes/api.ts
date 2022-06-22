import { Router } from 'express';
import siteRouter from './site'
import commonRouter from './common.router'


// Export the base-router
const baseRouter = Router();

// Setup routers
// baseRouter.use('/users', userRouter);

baseRouter.use('/', siteRouter);
baseRouter.use('/common', commonRouter);

// Export default.
export default baseRouter;
