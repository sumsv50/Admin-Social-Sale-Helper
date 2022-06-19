import { Router } from 'express';
import authRouter from './auth.router';
import categoryRouter from './category.router';
import productRouter from './product.router';


import { passport } from '@middlewares/passport.middleware';

// Export the base-router
const sendoRouter = Router();

// Setup routers
sendoRouter.use('/auth', authRouter);
sendoRouter.use('/category', passport.authenticate('jwt', { session: false }), categoryRouter);
sendoRouter.use('/product', passport.authenticate('jwt', { session: false }), productRouter);


// Export default.
export default sendoRouter;
