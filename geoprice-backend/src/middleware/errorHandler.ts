import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { errorResponse } from '../utils/responseFormatter.js';


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error with stack trace and context
  logger.error('Error occurred', err, {
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
  });

  // Handle operational errors (AppError instances)
  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message));
    return;
  }

  // Handle unexpected errors
  res.status(500).json(errorResponse('Internal server error'));
};
