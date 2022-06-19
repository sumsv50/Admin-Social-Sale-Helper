import { Router } from 'express';

import authRouter from './auth.router';
import sellerRouter from './seller.router';
import categoryRouter from './category.router';
import productRouter from './product.router';
import inventoryRouter from './inventory.router';
import stateRouter from './state.router';

import { passport } from '@middlewares/passport.middleware';

// Export the base-router
const tikiRouter = Router();

// Setup routers

tikiRouter.use('/auth', authRouter);
tikiRouter.use('/seller', passport.authenticate('jwt', { session: false }), sellerRouter);
tikiRouter.use('/category', passport.authenticate('jwt', { session: false }), categoryRouter);
tikiRouter.use('/product', passport.authenticate('jwt', { session: false }), productRouter);
tikiRouter.use('/inventory', inventoryRouter);
tikiRouter.use('/state', stateRouter);

// Export default.
export default tikiRouter;
