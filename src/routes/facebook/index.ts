import { Router } from 'express';
import groupRouter from './group.router';
import postRouter from './post.router';
import messageRouter from './message.router';
import authRouter from './auth.router';
import quickReply from './quickReply.router'
import pageRouter from './page.router';
import recommendationRouter from './recommendation.router';
import templatePostRouter from './templatePost.router';
import customerInfoRouter from './customerInfo.router'
import commentRouter from './comment.router';
import favoriteKeywordRouter from './favoriteKeyword.router';
import { passport } from '@middlewares/passport.middleware';

// Export the base-router
const fbRouter = Router();

// Setup routers
fbRouter.use('/auth', authRouter);
fbRouter.use('/groups', passport.authenticate('jwt', { session: false }), groupRouter);
fbRouter.use('/posts', passport.authenticate('jwt', { session: false }), postRouter);
fbRouter.use('/messages', messageRouter);
fbRouter.use('/quickReplies', passport.authenticate('jwt', { session: false }), quickReply);
fbRouter.use('/pages', passport.authenticate('jwt', { session: false }), pageRouter);
fbRouter.use('/recommendations', recommendationRouter);
fbRouter.use('/templatePost', passport.authenticate('jwt', { session: false }), templatePostRouter);
fbRouter.use('/customerInfo', passport.authenticate('jwt', { session: false }), customerInfoRouter);
fbRouter.use('/comments', passport.authenticate('jwt', { session: false }), commentRouter);
fbRouter.use('/favoriteKeywords', passport.authenticate('jwt', { session: false }), favoriteKeywordRouter);


// Export default.
export default fbRouter;
