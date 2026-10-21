import type { ErrorRequestHandler, Request } from 'express';
import { AppError } from '@/utils/appError';
import { logger } from '@/utils/logger';
import { sendError } from '@/utils/response';

// express.json() throws this when the body isn't valid JSON
const isJsonParseError = (error: unknown): boolean =>
  error instanceof SyntaxError && 'type' in error && error.type === 'entity.parse.failed';

const toAppError = (error: unknown): AppError => {
  if (error instanceof AppError) return error;
  if (isJsonParseError(error)) return AppError.badRequest('Request body is not valid JSON');
  return AppError.internal();
};

const logError = (req: Request, original: unknown, appError: AppError): void => {
  const where = `${req.method} ${req.originalUrl}`;

  if (appError.statusCode >= 500) {
    logger.error(`${where} failed with an unexpected error`, original);
    return;
  }

  const details = (appError.details ?? []).map((d) => `${d.field}: ${d.message}`).join('; ');
  logger.warn(`${where} ${appError.code} - ${appError.message}${details ? ` -> ${details}` : ''}`);
};

export const errorHandler: ErrorRequestHandler = (error: unknown, req, res, _next) => {
  const appError = toAppError(error);
  logError(req, error, appError);
  sendError(res, appError);
};
