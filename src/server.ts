/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import dbConnect from './configs/mongoose'

import apiRouter from './routes/api';
import logger from 'jet-logger';
import { CustomError } from '@shared/errors';

// Constants
const app = express();

/***********************************************************************************
 *                                  Middlewares
 **********************************************************************************/

// Common middlewares
const corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token'],
};
app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}


/***********************************************************************************
 *                                  Configs
 **********************************************************************************/

// Database connection
dbConnect();

// API doc
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Social Sale Helper Server API",
            version: "1.0.0",
            description: "Social Sale Helper API Swagger Documentation"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./src/routes/*.ts"]
}

const specs = swaggerJsDoc(options);

app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(specs));

/***********************************************************************************
 *                         API routes and error handling
 **********************************************************************************/

// Add api router
app.use('/api', apiRouter);

// Error handling
app.use(
  (err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status =
      err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST;
    return res.status(status).json({
      error: err.message,
    });
  }
);

// Export here and start in a diff file (for testing).
export default app;
