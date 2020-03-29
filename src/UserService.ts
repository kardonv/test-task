import * as express from 'express';
import { API_VERSION } from '../config';
import { userRouter } from './routes';

const server = express();
server.use(express.json());
server.use(API_VERSION, userRouter);

export { server };
