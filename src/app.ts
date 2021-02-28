import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import createConection from './db';
import { AppError } from './errors/AppError';
import { router } from './routes';

createConection();
const app = express();

app.use(express.json());
app.use(router);

app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).send({ message: err.message });
  }
  return response.status(500).json({
    status: 'Error',
    message: `Internal server error ${err.message}`
  });
});

export { app };