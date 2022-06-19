import { Router } from 'express';
import authRouter from './auth.router';
import productRouter from './product.router';
import orderRouter from './order.router';
import templateCommentRouter from './templateComment.router';
import postRouter from './post.router';
import reportRouter from './report.router';
import notificationRouter from './notification.router';
import userRouter from './user.router';

// Export the base-router
const siteRouter = Router();

// Setup routers
siteRouter.use('/auth', authRouter);
siteRouter.use('/users', userRouter);
siteRouter.use('/products', productRouter);
siteRouter.use('/orders', orderRouter);
siteRouter.use('/templateComments', templateCommentRouter);
siteRouter.use('/posts', postRouter);
siteRouter.use('/report', reportRouter);
siteRouter.use('/notifications', notificationRouter);


// Export default.
export default siteRouter;
