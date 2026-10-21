import type { ErrorRequestHandler } from 'express';
import { AppError } from '@/utils/appError';
import { sendError } from '@/utils/response';

// express.json() throws this when the body isn't valid JSON
const isJsonParseError = (error: unknown): boolean =>
  error instanceof SyntaxError && 'type' in error && error.type === 'entity.parse.failed';

const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  if (isJsonParseError(error)) return AppError.badRequest('Request body is not valid JSON');

  console.error('Unhandled error:', error);
  return AppError.internal();
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  sendError(res, toAppError(error));
};
