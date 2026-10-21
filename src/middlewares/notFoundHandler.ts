import type { RequestHandler } from 'express';
import { AppError } from '@/utils/appError';

export const notFoundHandler: RequestHandler = (req) => {
  throw AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`);
};
