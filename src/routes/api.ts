import { Router } from 'express';

import sendoRouter from './sendo';
import tikiRouter from './tiki';
import fbRouter from './facebook';
import siteRouter from './site'
import commonRouter from './common.router'


// Export the base-router
const baseRouter = Router();

// Setup routers
// baseRouter.use('/users', userRouter);

baseRouter.use('/sendo', sendoRouter);
baseRouter.use('/tiki', tikiRouter);
baseRouter.use('/facebook', fbRouter);
baseRouter.use('/', siteRouter);
baseRouter.use('/common', commonRouter);

// Export default.
export default baseRouter;
